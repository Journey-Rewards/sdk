# Migrating from @journeyrewards/sdk 1.x

Version 1 was an SDK for the retired Journey Hive orchestration API. Version 2 replaces that product surface with current Journey hospitality and member APIs. This is an intentional major-version change; it is not a drop-in endpoint update.

| Version 1 | Version 2 |
| --- | --- |
| `JourneyHiveClient` | `JourneyClient` for hospitality partner APIs |
| `jh_` keys | Scoped Core `jny_` keys or approved WorkOS partner JWT |
| Hive/Replit API host | `https://api-prd.cf.journey.com` or the approved sandbox |
| Hive agent-orchestration methods | Generated Core partner operation methods |
| No member/API identity boundary | Separate `JourneyMemberClient` and `JourneyMcpClient` |

1. Request new API access from [alliance@journey.com](mailto:alliance@journey.com?subject=Journey%20API%20access%20request).
2. Replace old imports and map your integration to the current [Core API documentation](https://docs.journey.com).
3. Keep keys server-side. Use the credential issued for the specific surface; credentials are not interchangeable.
4. Persist a stable idempotency key for every partner mutation. The SDK performs no automatic retries.
5. Test against your scoped sandbox organization, including error and retry handling, before changing production configuration.

Publishing v2 updates npm's `latest` distribution tag. It does not overwrite or unpublish immutable v1 tarballs. Consumers pinned to v1 must explicitly migrate.
