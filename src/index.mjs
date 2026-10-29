import { operations, provenance } from './operations.mjs';
export { operations, provenance };

export class JourneyError extends Error {
  constructor(message, { status = 0, code, details, retryAfter, requestId, payload, cause } = {}) {
    super(message, { cause });
    this.name = 'JourneyError';
    Object.assign(this, { status, code, details, retryAfter, requestId, payload });
  }
}

function baseUrl(value) {
  const url = new URL(value);
  if (url.username || url.password || url.search || url.hash || (url.protocol !== 'https:' && !(url.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)))) {
    throw new TypeError('Use HTTPS or loopback HTTP, without credentials, query or fragment in the URL.');
  }
  return url;
}

function credential(value, name) {
  if (typeof value !== 'string' || !value.trim() || /[\r\n]/.test(value)) throw new TypeError(`${name} must be a nonempty credential.`);
  return value;
}

async function send(url, options, timeoutMs) {
  let response;
  try {
    response = await fetch(url, { ...options, redirect: 'error', signal: AbortSignal.timeout(timeoutMs) });
  } catch (cause) {
    throw new JourneyError('Journey request failed before a response was received. The outcome may be unknown; no automatic retry was attempted.', { code: 'transport_error', cause });
  }
  let text;
  try { text = await response.text(); }
  catch (cause) { throw new JourneyError('Journey response was interrupted. The outcome may be unknown; no automatic retry was attempted.', { status: response.status, code: 'transport_error', cause }); }
  let payload;
  try { payload = text ? JSON.parse(text) : undefined; }
  catch { throw new JourneyError('Journey returned a non-JSON response.', { status: response.status, code: 'invalid_response', retryAfter: response.headers.get('retry-after') }); }
  if (!response.ok) {
    const error = payload?.error && typeof payload.error === 'object' ? payload.error : payload;
    throw new JourneyError(typeof error?.message === 'string' ? error.message : `Journey HTTP ${response.status}`, {
      status: response.status, code: error?.code ?? response.status, details: error?.details ?? error?.errors,
      retryAfter: response.headers.get('retry-after'), requestId: response.headers.get('x-request-id'), payload,
    });
  }
  return payload;
}

class RestClient {
  constructor(surface, headers, { baseUrl: origin = 'https://api-prd.cf.journey.com', timeoutMs = 30_000 } = {}) {
    const url = baseUrl(origin);
    if (url.pathname !== '/') throw new TypeError('Core baseUrl is an origin without /v1; operation paths include the version.');
    validateTimeout(timeoutMs);
    Object.assign(this, { surface, baseUrl: url.origin, headers, timeoutMs });
    for (const [id, operation] of Object.entries(operations)) {
      if (operation.surface !== surface) continue;
      const [resource, action] = id.split('_');
      const name = resource.replace(/Partner$/, '');
      this[name] ??= {};
      this[name][action] = (input = {}) => this.request(id, input);
    }
  }

  async request(operationId, { path = {}, query = {}, body, idempotencyKey } = {}) {
    const operation = operations[operationId];
    if (!operation || operation.surface !== this.surface) throw new TypeError(`Unknown ${this.surface} operation: ${operationId}`);
    if (!path || typeof path !== 'object' || Array.isArray(path) || !query || typeof query !== 'object' || Array.isArray(query)) throw new TypeError('path and query must be objects.');
    const expected = [...operation.path.matchAll(/\{([^}]+)\}/g)].map(match => match[1]);
    if (Object.keys(path).some(key => !expected.includes(key))) throw new TypeError('Unknown path parameter.');
    const pathname = operation.path.replace(/\{([^}]+)\}/g, (_, name) => {
      const value = path[name];
      if ((typeof value !== 'string' && typeof value !== 'number') || !String(value) || /[/\\%\x00-\x1f]/.test(String(value)) || ['.', '..'].includes(String(value))) throw new TypeError(`Invalid path parameter: ${name}`);
      return encodeURIComponent(String(value));
    });
    const url = new URL(pathname, this.baseUrl);
    for (const [name, value] of Object.entries(query)) {
      if (!operation.query.includes(name)) throw new TypeError(`Unknown query parameter: ${name}`);
      for (const item of Array.isArray(value) ? value : [value]) {
        if (item === undefined || item === null) continue;
        if (!['string', 'number', 'boolean'].includes(typeof item) || (typeof item === 'number' && !Number.isFinite(item))) throw new TypeError(`Invalid query parameter: ${name}`);
        url.searchParams.append(name, String(item));
      }
    }
    for (const name of operation.requiredQuery) if (!url.searchParams.has(name)) throw new TypeError(`Required query parameter: ${name}`);
    const headers = { Accept: 'application/json', ...this.headers };
    const write = !['GET', 'HEAD'].includes(operation.method);
    if (write) {
      if (typeof idempotencyKey !== 'string' || !/^[\x21-\x7e]{1,255}$/.test(idempotencyKey)) throw new TypeError('Partner writes require an explicit Idempotency-Key (1–255 visible ASCII characters). Reuse it only for the same operation and payload.');
      headers['Idempotency-Key'] = idempotencyKey;
    } else if (body !== undefined || idempotencyKey !== undefined) throw new TypeError('Read operations do not accept a body or idempotency key.');
    if (operation.bodyRequired && body === undefined) throw new TypeError('This operation requires a request body.');
    if (!operation.hasBody && body !== undefined) throw new TypeError('This operation does not accept a request body.');
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    return send(url, { method: operation.method, headers, ...(body !== undefined ? { body: JSON.stringify(body) } : {}) }, this.timeoutMs);
  }
}

export class JourneyClient extends RestClient {
  constructor({ apiKey, accessToken, ...options } = {}) {
    if (Boolean(apiKey) === Boolean(accessToken)) throw new TypeError('Provide exactly one partner apiKey or WorkOS accessToken.');
    if (apiKey && !apiKey.startsWith('jny_')) throw new TypeError('Partner keys begin with jny_; Hive jh_ keys are not compatible.');
    super('partner', apiKey ? { 'X-API-Key': credential(apiKey, 'apiKey') } : { Authorization: `Bearer ${credential(accessToken, 'accessToken')}` }, options);
  }
}
export { JourneyClient as JourneyPartnerClient };

export class JourneyMemberClient extends RestClient {
  constructor({ accessToken, ...options } = {}) {
    super('member', { Authorization: `Bearer ${credential(accessToken, 'member Clerk accessToken')}` }, options);
  }
}

export class JourneyMcpClient {
  constructor({ endpoint = 'https://www.journey.com/api/mcp', accessToken, timeoutMs = 30_000 } = {}) {
    validateTimeout(timeoutMs);
    Object.assign(this, { endpoint: baseUrl(endpoint).href, accessToken: accessToken ? credential(accessToken, 'MCP OAuth accessToken') : undefined, timeoutMs, nextId: 0 });
  }
  async request(method, params = {}) {
    const id = ++this.nextId;
    const payload = await send(this.endpoint, { method: 'POST', headers: {
      'Content-Type': 'application/json', Accept: 'application/json, text/event-stream', 'Journey-API-Version': '1',
      ...(this.accessToken ? { Authorization: `Bearer ${this.accessToken}` } : {}),
    }, body: JSON.stringify({ jsonrpc: '2.0', id, method, params }) }, this.timeoutMs);
    if (payload?.jsonrpc !== '2.0' || payload.id !== id) throw new JourneyError('Invalid JSON-RPC response.', { code: 'invalid_response', payload });
    if (payload.error) throw new JourneyError(payload.error.message, { code: payload.error.code, payload });
    if (payload.result?.isError) {
      const error = payload.result.structuredContent?.error;
      throw new JourneyError(error?.message ?? 'Journey tool failed.', { code: error?.code ?? 'tool_error', payload });
    }
    return payload.result;
  }
  listTools() { return this.request('tools/list'); }
  callTool(name, args = {}) { return this.request('tools/call', { name, arguments: args }); }
}

function validateTimeout(value) {
  if (!Number.isSafeInteger(value) || value <= 0 || value > 2_147_483_647) throw new TypeError('timeoutMs must be a positive integer of at most 2147483647.');
}
