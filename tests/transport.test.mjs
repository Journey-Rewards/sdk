import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { JourneyClient, JourneyMemberClient, JourneyMcpClient, JourneyError, operations } from '../src/index.mjs';

const exec = promisify(execFile);
const root = fileURLToPath(new URL('..', import.meta.url));
let server, baseUrl;
const seen = [], claims = new Map();
before(async () => {
  server = createServer(async (req, res) => {
    let text = ''; for await (const chunk of req) text += chunk;
    const body = text ? JSON.parse(text) : null;
    seen.push({ method: req.method, url: req.url, headers: req.headers, body });
    const url = new URL(req.url, 'http://localhost');
    const answer = (status, value, headers = {}) => { res.writeHead(status, { 'Content-Type': 'application/json', ...headers }); res.end(JSON.stringify(value)); };
    const mode = url.searchParams.get('organizationId');
    if (mode === 'redirect') return answer(307, {}, { Location: baseUrl + '/credential-leak' });
    if (mode === 'slow') return setTimeout(() => answer(200, {}), 200);
    if (mode === 'broken') { res.writeHead(200, { 'Content-Type': 'application/json' }); res.write('{'); return setTimeout(() => res.destroy(), 5); }
    if (mode === 'invalid') { res.writeHead(502); return res.end('<html>Gateway failure</html>'); }
    if (mode === '429' || mode === '503') return answer(Number(mode), {type:'TooManyRequestsException', code:Number(mode), message:'Try later', errors:[{field:'request'}]}, {'Retry-After':'17','X-Request-Id':'req_fixture'});
    if (url.pathname === '/api/mcp') {
      if (body.params?.name === 'fail') return answer(200, {jsonrpc:'2.0',id:body.id,result:{isError:true,structuredContent:{error:{code:'MEMBER_AUTH_REQUIRED',message:'Connect a member account'}}}});
      if (body.params?.name === 'rpc-fail') return answer(200, {jsonrpc:'2.0',id:body.id,error:{code:-32601,message:'Method not found'}});
      if (body.params?.name === 'wrong-id') return answer(200, {jsonrpc:'2.0',id:body.id+1,result:{}});
      return answer(200, {jsonrpc:'2.0',id:body.id,result:{tools:[],received:body.params}});
    }
    if (req.method !== 'GET') {
      const key = req.headers['idempotency-key'];
      const prior = claims.get(key);
      if (prior && prior.text !== text) return answer(409, {code:409,message:'Key reused with another payload'});
      if (prior) return answer(201, prior.result, {'X-Idempotent-Replay':'true'});
      const result = {id:'draft_fixture', body}; claims.set(key, {text, result});
      return answer(201, result);
    }
    return answer(200, {url:req.url,authorization:req.headers.authorization,key:req.headers['x-api-key']});
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});
after(async () => { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); });

test('partner credentials are isolated from member credentials and paths are versioned', async () => {
  const partner = new JourneyClient({apiKey:'jny_test',baseUrl});
  assert.deepEqual(await partner.loyaltyPrograms.list(), {url:'/v1/partner/loyalty/programs',key:'jny_test'});
  const workos = new JourneyClient({accessToken:'workos_test',baseUrl});
  assert.equal((await workos.loyaltyPrograms.list()).authorization,'Bearer workos_test');
  const member = new JourneyMemberClient({accessToken:'clerk_test',baseUrl});
  assert.equal((await member.memberProfile.get({query:{fields:['additionalInfo']}})).url,'/v1/members/me/profile?fields=additionalInfo');
  await assert.rejects(member.request('loyaltyProgramsPartner_list'), /Unknown member/);
  await assert.rejects(partner.request('memberProfile_get'), /Unknown partner/);
  assert.throws(()=>new JourneyClient({apiKey:'jh_old'}),/not compatible/);
  assert.throws(()=>new JourneyClient({apiKey:'jny_test',accessToken:'workos_test'}),/exactly one/);
  assert.throws(()=>new JourneyClient({apiKey:'jny_bad\nvalue'}),/credential/);
});

test('path traversal and undeclared parameters are rejected before the network', async () => {
  const client = new JourneyClient({apiKey:'jny_test',baseUrl});
  const start = seen.length;
  for (const externalId of ['..','x/y','%2f','x\\y','x\n']) await assert.rejects(client.loyaltyPrograms.get({path:{externalId}}),/Invalid path/);
  await assert.rejects(client.loyaltyPrograms.list({query:{token:'secret'}}),/Unknown query/);
  await assert.rejects(client.members.listMembers({query:{limit:Infinity}}),/Invalid query/);
  await assert.rejects(client.loyaltyPrograms.list({query:true}),/objects/);
  await assert.rejects(client.loyaltyPrograms.get({path:{externalId:'ok',extra:'bad'}}),/Unknown path/);
  assert.equal(seen.length,start);
  assert.equal((await client.loyaltyPrograms.get({path:{externalId:'café & spa'}})).url,'/v1/partner/loyalty/programs/caf%C3%A9%20%26%20spa');
  assert.throws(()=>new JourneyClient({apiKey:'jny_test',baseUrl:'http://example.com'}),/HTTPS/);
  assert.throws(()=>new JourneyClient({apiKey:'jny_test',baseUrl:baseUrl+'/v1'}),/origin/);
});

test('writes require a caller-owned key, replay identically, and expose conflicts', async () => {
  const client = new JourneyClient({apiKey:'jny_test',baseUrl});
  const body = {name:'Fixture program'};
  const start = seen.length;
  await assert.rejects(client.loyaltyPrograms.create({body}),/Idempotency-Key/);
  await assert.rejects(client.loyaltyPrograms.create({body,idempotencyKey:'bad key'}),/Idempotency-Key/);
  await assert.rejects(client.loyaltyPrograms.create({idempotencyKey:'empty-body'}),/requires a request body/);
  assert.equal(seen.length,start);
  const input = {body,idempotencyKey:'test-js-draft'};
  assert.deepEqual(await client.loyaltyPrograms.create(input),await client.loyaltyPrograms.create(input));
  await assert.rejects(client.loyaltyPrograms.create({...input,body:{name:'Changed'}}),e=>e instanceof JourneyError && e.status===409);
  assert.equal(seen.length,start+3);
});

test('HTTP errors preserve actionable metadata without automatic retries', async () => {
  const client = new JourneyClient({apiKey:'jny_test',baseUrl});
  for(const status of [429,503]) {
    const start=seen.length;
    await assert.rejects(client.loyaltyPrograms.list({query:{organizationId:String(status)}}),e=>e.status===status&&e.code===status&&e.retryAfter==='17'&&e.requestId==='req_fixture'&&e.details[0].field==='request');
    assert.equal(seen.length,start+1);
  }
  await assert.rejects(client.loyaltyPrograms.list({query:{organizationId:'invalid'}}),e=>e.status===502&&e.code==='invalid_response');
  await assert.rejects(client.loyaltyPrograms.list({query:{organizationId:'broken'}}),e=>e.code==='transport_error');
});

test('redirects cannot forward credentials and timeouts are explicit', async () => {
  const client = new JourneyClient({apiKey:'jny_test',baseUrl,timeoutMs:30});
  await assert.rejects(client.loyaltyPrograms.list({query:{organizationId:'redirect'}}),e=>e.code==='transport_error');
  assert.ok(!seen.some(r=>r.url==='/credential-leak'));
  const start=seen.length;
  await assert.rejects(client.loyaltyPrograms.list({query:{organizationId:'slow'}}),e=>e.code==='transport_error');
  assert.equal(seen.length,start+1);
  assert.throws(()=>new JourneyMcpClient({timeoutMs:Infinity}),/timeoutMs/);
});

test('MCP keeps OAuth separate, sends API version, checks RPC and tool errors', async () => {
  const client=new JourneyMcpClient({endpoint:baseUrl+'/api/mcp',accessToken:'mcp_test'});
  assert.deepEqual((await client.listTools()).tools,[]);
  assert.equal(seen.at(-1).headers.authorization,'Bearer mcp_test');
  assert.equal(seen.at(-1).headers['journey-api-version'],'1');
  await assert.rejects(client.callTool('fail'),e=>e.code==='MEMBER_AUTH_REQUIRED');
  await assert.rejects(client.callTool('rpc-fail'),e=>e.code===-32601);
  await assert.rejects(client.callTool('wrong-id'),e=>e.code==='invalid_response');
});

test('CLI lists without credentials, prints version, and requires explicit writes', async () => {
  const env={...process.env,JOURNEY_API_URL:baseUrl,JOURNEY_API_KEY:'jny_cli',JOURNEY_PARTNER_TOKEN:''};
  assert.equal((await exec(process.execPath,['src/cli.mjs','--version'],{cwd:root,env})).stdout.trim(),'2.0.1');
  assert.equal(JSON.parse((await exec(process.execPath,['src/cli.mjs','member','list'],{cwd:root,env})).stdout).length,5);
  const start=seen.length;
  await assert.rejects(exec(process.execPath,['src/cli.mjs','partner','call','loyaltyProgramsPartner_create'],{cwd:root,env}),e=>e.stderr.includes('--confirm')&&!e.stderr.includes('jny_cli'));
  await assert.rejects(exec(process.execPath,['src/cli.mjs','partner','call','loyaltyProgramsPartner_create','--confirm'],{cwd:root,env}),e=>e.stderr.includes('--idempotency-key'));
  assert.equal(seen.length,start);
  assert.equal(JSON.parse((await exec(process.execPath,['src/cli.mjs','partner','call','loyaltyProgramsPartner_list'],{cwd:root,env})).stdout).key,'jny_cli');
});

test('Python transport runs the same authentication, replay, error and MCP fixtures', async () => {
  const start = seen.length;
  const {stdout}=await exec(process.env.PYTHON || 'python3',['tests/python_transport.py',baseUrl],{cwd:root,env:{...process.env,PYTHONPATH:root+'python'}});
  assert.match(stdout,/Python transport fixtures passed/);
  assert.ok(seen.length > start);
  for (const request of seen.slice(start)) {
    assert.equal(request.headers['user-agent'], 'JourneySDK-Python/2.0.1 (+https://github.com/Journey-Rewards/sdk)');
  }
  assert.ok(!seen.some(r=>r.url==='/credential-leak'));
});

test('all exported operations stay within the reviewed surfaces', () => {
  assert.equal(Object.keys(operations).length,111);
  for(const op of Object.values(operations)) {
    assert.ok(op.path.startsWith(op.surface==='partner'?'/v1/partner/':'/v1/members/me/'));
    if(op.surface==='member') assert.equal(op.method,'GET');
  }
});


test('unsupported streamed uploads never make a misleading JSON request', async () => {
  const client = new JourneyClient({apiKey:'jny_test',baseUrl});
  for (const id of ['pagesPartner_uploadFeaturedImage','themeKitsPartner_uploadFont','themeKitsPartner_uploadImage']) {
    assert.equal(operations[id], undefined);
    await assert.rejects(client.request(id,{idempotencyKey:'upload'}), /Unknown partner operation/);
  }
});
