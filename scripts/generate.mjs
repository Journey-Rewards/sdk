import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = file => JSON.parse(readFileSync(resolve(root, file), 'utf8'));
const spec = read('contracts/partner.openapi.json');
const provenance = read('contracts/provenance.json');
const members = read('contracts/member-reads.json');
const operations = {}, inputs = {}, outputs = {};
const schemas = spec.components.schemas;
function type(s = {}) {
  if (s.$ref) return `Schemas[${JSON.stringify(s.$ref.split('/').pop())}]`;
  let value;
  if (s.enum) value = s.enum.map(JSON.stringify).join(' | ');
  else if (s.oneOf || s.anyOf) value = `(${(s.oneOf || s.anyOf).map(type).join(' | ')})`;
  else if (s.allOf) value = `(${s.allOf.map(type).join(' & ')})`;
  else if (s.type === 'array') value = `Array<${type(s.items)}>`;
  else if (s.type === 'object' || s.properties) {
    const fields = Object.entries(s.properties || {}).map(([name, prop]) => `${JSON.stringify(name)}${s.required?.includes(name) ? '' : '?'}: ${type(prop)}`);
    if (s.additionalProperties) fields.push(`[key: string]: unknown`);
    value = fields.length ? `{ ${fields.join('; ')} }` : 'Record<string, unknown>';
  } else value = { string: 'string', number: 'number', integer: 'number', boolean: 'boolean', null: 'null' }[s.type] || 'unknown';
  return s.nullable ? `${value} | null` : value;
}
for (const [path, item] of Object.entries(spec.paths)) {
  if (!path.startsWith('/v1/partner/')) continue;
  for (const [method, op] of Object.entries(item)) {
    if (!['get', 'post', 'patch', 'put', 'delete'].includes(method)) continue;
    const params = [...(item.parameters || []), ...(op.parameters || [])];
    const body = op.requestBody?.content?.['application/json']?.schema;
    const query = params.filter(p => p.in === 'query');
    operations[op.operationId] = { surface: 'partner', method: method.toUpperCase(), path,
      query: query.map(p => p.name), requiredQuery: query.filter(p => p.required).map(p => p.name),
      hasBody: Boolean(op.requestBody), bodyRequired: Boolean(op.requestBody?.required),
      scopes: op['x-required-scopes'] || [], summary: op.summary || op.operationId };
    const fields = [];
    for (const location of ['path', 'query']) {
      const ps = params.filter(p => p.in === location);
      if (ps.length) fields.push(`${location}${ps.some(p => p.required) ? '' : '?'}: { ${ps.map(p => `${JSON.stringify(p.name)}${p.required ? '' : '?'}: ${type(p.schema)}`).join('; ')} }`);
    }
    if (op.requestBody) fields.push(`body${op.requestBody.required ? '' : '?'}: ${type(body)}`);
    if (method !== 'get') fields.push('idempotencyKey: string');
    inputs[op.operationId] = `{ ${fields.join('; ')} }`;
    const responses = Object.entries(op.responses || {}).filter(([code]) => /^2\d\d$/.test(code)).map(([code, r]) => code === '204' ? 'undefined' : type(r.content?.['application/json']?.schema));
    outputs[op.operationId] = [...new Set(responses)].join(' | ') || 'unknown';
  }
}
for (const [id, entry] of Object.entries(members)) {
  operations[id] = { ...entry, surface: 'member', method: 'GET', requiredQuery: [], hasBody: false, bodyRequired: false, scopes: [], summary: id };
  inputs[id] = entry.query.length ? '{ query?: { fields?: Array<"additionalInfo"> } }' : '{}';
  outputs[id] = 'unknown';
}
const verifyIndex = process.argv.indexOf('--verify-core');
if (verifyIndex >= 0) {
  const routes = JSON.parse(readFileSync(process.argv[verifyIndex + 1], 'utf8'));
  const normalize = path => path.replace(/\{[^}]+\}/g, '{}');
  const missing = Object.entries(operations).filter(([,op]) => !routes.some(r => r.method.toUpperCase() === op.method && normalize(r.path) === normalize(op.path)));
  if (missing.length) throw new Error(`Missing Core routes: ${missing.map(([id]) => id).join(', ')}`);
}
writeFileSync(resolve(root, 'src/operations.mjs'), `// Generated from the pinned public contract. Run npm run generate.\nexport const operations = ${JSON.stringify(operations, null, 2)};\nexport const provenance = ${JSON.stringify(provenance, null, 2)};\n`);
writeFileSync(resolve(root, 'python/journey_rewards/operations.json'), JSON.stringify(operations, null, 2)+'\n');
let declarations = `// Generated request/response types. Missing upstream success schemas remain unknown.\nexport interface Schemas {\n${Object.entries(schemas).map(([k,v])=>`${JSON.stringify(k)}: ${type(v)}`).join(';\n')}\n}\n`;
declarations += `export interface Inputs {\n${Object.entries(inputs).map(([k,v])=>`${JSON.stringify(k)}: ${v}`).join(';\n')}\n}\nexport interface Outputs {\n${Object.entries(outputs).map(([k,v])=>`${JSON.stringify(k)}: ${v}`).join(';\n')}\n}\n`;
declarations += `export type OperationArgs<K extends keyof Inputs> = {} extends Inputs[K] ? [input?: Inputs[K]] : [input: Inputs[K]];\nexport interface ClientOptions { baseUrl?: string; timeoutMs?: number }\nexport interface JourneyErrorOptions { status?: number; code?: string | number; details?: unknown; retryAfter?: string | null; requestId?: string | null; payload?: unknown; cause?: unknown }\nexport class JourneyError extends Error { constructor(message: string, options?: JourneyErrorOptions); status: number; code?: string | number; details?: unknown; retryAfter?: string | null; requestId?: string | null; payload?: unknown; }\n`;
for (const [surface, cls] of [['partner','JourneyClient'],['member','JourneyMemberClient']]) {
  const ids = Object.keys(operations).filter(id=>operations[id].surface===surface);
  const groups = {};
  for (const id of ids) { const [resource,action]=id.split('_'); const name=resource.replace(/Partner$/,''); (groups[name]??=[]).push(`${action}: (...args: OperationArgs<${JSON.stringify(id)}>) => Promise<Outputs[${JSON.stringify(id)}]>`); }
  declarations += `export type ${surface}Operation = ${ids.map(JSON.stringify).join(' | ')};\nexport class ${cls} {\nconstructor(options: ClientOptions & ${surface==='partner'?'({apiKey: string; accessToken?: never} | {accessToken: string; apiKey?: never})':'{accessToken: string}'});\nrequest<K extends ${surface}Operation>(operationId: K, ...args: OperationArgs<K>): Promise<Outputs[K]>;\n${Object.entries(groups).map(([k,v])=>`${k}: {${v.join('; ')}}`).join(';\n')}\n}\n`;
}
declarations += `export { JourneyClient as JourneyPartnerClient };\nexport class JourneyMcpClient { constructor(options?: { endpoint?: string; accessToken?: string; timeoutMs?: number }); request(method: string, params?: Record<string, unknown>): Promise<unknown>; listTools(): Promise<unknown>; callTool(name: string, args?: Record<string, unknown>): Promise<unknown>; }\nexport const operations: Record<keyof Inputs, {surface: string; method: string; path: string; query: string[]; requiredQuery: string[]; scopes: string[][]; summary: string; hasBody: boolean; bodyRequired: boolean}>;\nexport const provenance: Record<string, string>;\n`;
writeFileSync(resolve(root,'src/index.d.ts'),declarations);
console.log(`Generated ${Object.keys(operations).length} operations (${Object.keys(members).length} member reads), ${Object.keys(schemas).length} upstream schemas.`);
