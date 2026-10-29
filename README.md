# Journey SDK

Official JavaScript/TypeScript and Python clients, plus the `journey` CLI, for hospitality businesses building with Journey.

**v2 replaces the retired Hive SDK.** It connects to Journey Core's versioned partner APIs, selected member reads, and the Journey MCP server. Existing `JourneyHiveClient` integrations and `jh_` keys must migrate; see [MIGRATION.md](https://github.com/Journey-Rewards/sdk/blob/main/MIGRATION.md). MIT licensed, with no runtime dependencies.

## Get access

[Request API access from alliance@journey.com](mailto:alliance@journey.com?subject=Journey%20API%20access%20request). Include your hospitality business, website, integration use case, and desired sandbox access. Credentials and scopes are issued for your organization. Installing this package does not grant API access.

[Developer tools](https://www.journey.com/developers) · [API documentation](https://docs.journey.com) · [Journey Alliance](https://www.journey.com/alliance)

## Install

Node.js 22 or newer:

```sh
npm install @journeyrewards/sdk@^2
```

Python 3.10 or newer:

```sh
python -m pip install journeyrewards-sdk
```

For an unpublished checkout, use `npm pack` and install the resulting tarball, or `python -m pip install .`. Registry availability is verified as part of the [release process](https://github.com/Journey-Rewards/sdk/blob/main/RELEASING.md); a source checkout is not evidence of a published version.

## Hospitality partner APIs

Keep partner credentials on your server. The package supports 106 authenticated operations from the documented `/v1/partner/` surface: loyalty programs and benefits, members, properties, reservations, integrations, and other scoped partner resources. Use the operation inventory for exact coverage. The featured-image, theme-font, and theme-image multipart uploads are excluded from v2; their streamed file bytes are not covered by the current Core idempotency digest. Use the upload API documentation separately and reconcile uncertain uploads before retrying.

```ts
import { JourneyClient, JourneyError } from '@journeyrewards/sdk';

const journey = new JourneyClient({
  apiKey: process.env.JOURNEY_API_KEY!, // jny_…; sent as X-API-Key
  // baseUrl: 'https://api-stg.cf.journey.com', // sandbox
});

const programs = await journey.loyaltyPrograms.list();
const program = await journey.loyaltyPrograms.get({path: {externalId: 'your-program-id'}});
```

Alternatively, pass `accessToken` for an approved WorkOS partner JWT. Exactly one partner credential is accepted. Organization and resource authorization remain enforced by Core; query parameters do not grant cross-organization access.

```python
import os
from journey_rewards import JourneyClient

journey = JourneyClient(api_key=os.environ['JOURNEY_API_KEY'])
programs = journey.request('loyaltyProgramsPartner_list')
program = journey.request('loyaltyProgramsPartner_get', path={'externalId': 'your-program-id'})
```

JavaScript exposes typed resource methods and `request(operationId, input)`. Python uses the same stable operation IDs with keyword arguments. Request types come from the pinned OpenAPI contract. Undocumented success shapes remain `unknown` in TypeScript / `Any` in Python; validate these responses in your application before using their fields.

## Deliberate writes and idempotency

Every partner mutation requires an explicit `idempotencyKey` / `idempotency_key` in this SDK, transmitted as `Idempotency-Key`. Generate a key once per intended operation and persist it with your job. Retry only the same operation and payload using that key.

```ts
// Only after the operator has approved this program change:
await journey.loyaltyPrograms.update({
  path: {externalId: 'your-program-id'},
  body: {name: 'Your Hotel Rewards'},
  idempotencyKey: 'program-rename-job-2026-001',
});
```

Core partner idempotency is scoped to the authenticated tenant or API-key identity and route. Identical completed requests replay; an in-flight request or changed payload returns HTTP 409. Successful results are retained for 28 days. Failed requests are not cached, and stale in-flight claims can be reclaimed after five minutes. If a write succeeds but recording its result fails, a later retry can execute again: reconcile an uncertain operation before retrying. After retention expires, a key can also execute again. Keys must be 1–255 visible ASCII characters in this SDK. No automatic retry is performed for timeouts, network failures, rate limits, or server errors.

```ts
try {
  await journey.loyaltyPrograms.list();
} catch (error) {
  if (error instanceof JourneyError) {
    // Handle status, code, retryAfter, requestId and details deliberately.
    // Do not log error.payload if it might contain personal data.
  }
}
```

Python raises `JourneyError` with `status`, `code`, `retry_after`, `request_id`, `details`, and `payload`. Both clients reject redirects so credentials are not forwarded to another endpoint. HTTPS is required except for loopback development fixtures.

## CLI

```sh
npx --package @journeyrewards/sdk@^2 journey --help
npx --package @journeyrewards/sdk@^2 journey partner list
npx --package @journeyrewards/sdk@^2 journey partner call loyaltyProgramsPartner_list --staging
```

Supply credentials through your environment or secret manager, never CLI flags:

| Surface | Environment credential | Identity |
| --- | --- | --- |
| `partner` | `JOURNEY_API_KEY` **or** `JOURNEY_PARTNER_TOKEN` | Scoped `jny_` key or WorkOS partner JWT |
| `member` | `JOURNEY_MEMBER_TOKEN` | Clerk member JWT |
| `mcp` | `JOURNEY_MCP_TOKEN` (optional for public tools) | Journey member OAuth access token |

`--input request.json` or `--input -` accepts `{ "path": {}, "query": {}, "body": {} }` for REST, or the tool arguments object for MCP. Omit fields a request doesn't use. A write needs **both** `--confirm` and `--idempotency-key`. Reads do not. The default Core origin is production; `--staging` selects `https://api-stg.cf.journey.com`. `JOURNEY_API_URL` explicitly overrides the Core origin. The MCP endpoint is separate. Commands return JSON, exit 0 on success, and exit 1 on failure; output may contain private account data.

## Member reads

```ts
import { JourneyMemberClient } from '@journeyrewards/sdk';
const member = new JourneyMemberClient({accessToken: clerkMemberJwt});
const profile = await member.memberProfile.get();
const balance = await member.memberWallet.balance();
```

The member client exposes profile, membership, marketing consent, wallet, and wallet balance reads. A partner key or MCP OAuth token is not a substitute for a Clerk JWT. The SDK deliberately does not expose member financial writes or presume that all member mutations support header-based idempotency.

## AI agents and MCP

```ts
import { JourneyMcpClient } from '@journeyrewards/sdk';
const mcp = new JourneyMcpClient();
const tools = await mcp.listTools();
const result = await mcp.callTool('get_alliance');
```

```python
from journey_rewards import JourneyMcpClient
tools = JourneyMcpClient().list_tools()
```

Public discovery needs no account. Member tools require the separate Journey OAuth connection. Tool names and required arguments come from `tools/list`; consult the live manifest before calling. The client sends `Journey-API-Version: 1`. This lightweight client targets Journey's JSON-response MCP transport; it is not a general-purpose SSE MCP client or OAuth authorization UI. Complete OAuth through Journey's published flow, then supply the resulting access token.

The full browser site remains available for travel browsing and booking. Displayed member rates require complimentary Journey membership to book, and live availability, cancellation terms, and total price must be confirmed for the chosen stay. MCP does not execute payments or bookings.

## Contract and verification

`contracts/provenance.json` records the exact Core commit and OpenAPI export source. All SDK route declarations were checked against current Core source; the public invitation mutation is excluded. The OpenAPI export proposal is still open, so this SDK does not describe its snapshot as an export from `main`.

Run `npm run generate`, `npm test`, and `npm run test:types`. Tests exercise actual loopback HTTP transport in JavaScript, Python, and the CLI, including isolation, idempotency, conflicts, timeouts, redirects, and typed errors. These fixtures do not establish connected account, tenant, booking, or payment success. A scoped sandbox smoke test is required before using a new integration operationally.

SDK releases use semantic versioning. REST v1 paths and the MCP v1 header are separate from SDK major version 2. Breaking SDK changes require a new major release. API retirement notices and migration instructions will be published in the documentation before an announced retirement; no fixed notice-period SLA is offered by this package.
