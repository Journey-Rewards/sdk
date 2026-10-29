#!/usr/bin/env node
import { parseArgs } from 'node:util';
import { readFileSync } from 'node:fs';
import { JourneyClient, JourneyMemberClient, JourneyMcpClient, operations } from './index.mjs';

const help = `Journey SDK v2 — Core API and MCP CLI

journey partner list
journey partner call OPERATION --input request.json [--idempotency-key KEY --confirm]
journey member list
journey member call OPERATION [--input request.json]
journey mcp list
journey mcp call TOOL [--input arguments.json]

Use --input - to read JSON from stdin. Partner/member input: {path, query, body}.
Partner writes require --confirm and a stable --idempotency-key. No automatic retries.
Partner auth: JOURNEY_API_KEY or JOURNEY_PARTNER_TOKEN (exactly one).
Member auth: JOURNEY_MEMBER_TOKEN (Clerk JWT). MCP auth: optional JOURNEY_MCP_TOKEN.
Core defaults to production; --staging selects the partner sandbox.
JOURNEY_API_URL can explicitly override the Core origin. Credentials are never CLI flags.
Access: https://www.journey.com/developers — alliance@journey.com.
Output can include private data; direct it to a secure destination. Exit 0 success, 1 failure.\n`;

try {
  const { values, positionals } = parseArgs({ allowPositionals: true, options: {
    help: { type: 'boolean', short: 'h' }, version: { type: 'boolean' }, input: { type: 'string' },
    'idempotency-key': { type: 'string' }, confirm: { type: 'boolean' }, staging: { type: 'boolean' },
  } });
  if (values.version) console.log('2.0.0');
  else if (values.help || !positionals.length) console.log(help);
  else {
    const [surface, command, id, ...extra] = positionals;
    if (extra.length || !['partner','member','mcp'].includes(surface) || !['list','call'].includes(command) || (command==='call'&&!id) || (command==='list'&&id)) throw new Error('Invalid command. Use --help.');
    if (command === 'list' && surface !== 'mcp') {
      console.log(JSON.stringify(Object.entries(operations).filter(([,op])=>op.surface===surface).map(([operationId,op])=>({operationId,...op})),null,2));
    } else {
      const input = values.input ? JSON.parse(readFileSync(values.input === '-' ? 0 : values.input,'utf8')) : {};
      if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Input must be a JSON object.');
      const baseUrl = process.env.JOURNEY_API_URL || (values.staging ? 'https://api-stg.cf.journey.com' : undefined);
      let result;
      if (surface === 'mcp') {
        if(values.staging || values.confirm || values['idempotency-key']) throw new Error('MCP is read-only and uses its own endpoint; Core write flags do not apply.');
        const client=new JourneyMcpClient({accessToken:process.env.JOURNEY_MCP_TOKEN});
        result=command==='list'?await client.listTools():await client.callTool(id,input);
      } else {
        const op=operations[id];
        if(!op || op.surface!==surface) throw new Error('Unknown operation for this surface.');
        if(op.method!=='GET'&&!values.confirm) throw new Error('This operation changes data. Review the request and pass --confirm to execute.');
        const client=surface==='partner'?new JourneyClient({apiKey:process.env.JOURNEY_API_KEY,accessToken:process.env.JOURNEY_PARTNER_TOKEN,baseUrl}):new JourneyMemberClient({accessToken:process.env.JOURNEY_MEMBER_TOKEN,baseUrl});
        result=await client.request(id,{...input,...(values['idempotency-key']?{idempotencyKey:values['idempotency-key']}:{})});
      }
      console.log(JSON.stringify(result ?? null,null,2));
    }
  }
} catch(error) {
  console.error(JSON.stringify({error:error.message,status:error.status,code:error.code,retryAfter:error.retryAfter}));
  process.exitCode=1;
}
