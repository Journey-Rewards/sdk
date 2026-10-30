# Security

Use SDK version 2.0.2 or newer. Versions 2.0.0–2.0.1 stored credentials in enumerable JavaScript properties and Python instance dictionaries, which could expose them if an application serialized the client. Version 2.0.2 keeps them out of normal object inspection and serialization, rejects Python client pickling, redacts exact configured credential values in returned error diagnostics, and avoids echoing malformed CLI input.

## Credential handling

- Keep partner keys and WorkOS tokens on trusted servers. Load credentials from a secret manager or protected environment; never put them in browser bundles, source control, URLs, CLI arguments, or logs.
- Use a scoped, expiring partner `jny_` key or WorkOS JWT; member REST uses Clerk JWTs, and private MCP tools use Journey OAuth. These credentials are not interchangeable. Never give an SDK a Clerk or WorkOS management secret.
- Treat `baseUrl`, `endpoint`, `JOURNEY_API_URL`, and your execution environment as trusted configuration. An explicitly configured destination receives the credential. HTTPS is enforced except for loopback HTTP, and redirects are rejected.
- Do not log full API results or error payloads: they can contain personal data. Exact-value credential redaction does not remove every form of sensitive information. Python introspection, debuggers, memory dumps, or malicious code in the same process can still access in-memory secrets.

## Authorization is enforced by the service

Installing the SDK does not grant access. Core validates credentials, permissions, organization membership/mapping and resource scope. WorkOS token issuance alone does not authorize a new partner account; its Core reach must be provisioned. Member reads require a provisioned Core member in the same environment as the Clerk token. Public MCP discovery and advertised member rates are intentionally available without an account; account balances, profile and trips are private.

Session revocation and JWT expiration are distinct. Core verifies Clerk JWTs locally; an already-issued short-lived token may remain usable until expiration. The observed test token lifetime was 60 seconds. WorkOS membership lookups can be cached for up to 60 seconds. Applications must not promise instantaneous revocation without an additional server-side check.

No automatic write retries are performed. An idempotency key reduces duplicate execution but does not make every uncertain result safe to retry; reconcile ambiguous outcomes.

## Reporting

Report suspected vulnerabilities privately to [alliance@journey.com](mailto:alliance@journey.com?subject=Journey%20SDK%20security%20report). Include affected versions and a minimal reproduction with synthetic data. Do not include real keys, tokens or customer records in public issues.
