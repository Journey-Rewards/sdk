import { JourneyClient, JourneyMemberClient } from '@journeyrewards/sdk';
const partner = new JourneyClient({apiKey:'jny_test'});
partner.loyaltyPrograms.list();
partner.loyaltyPrograms.get({path:{externalId:'program'}});
partner.loyaltyPrograms.activate({path:{externalId:'program'},idempotencyKey:'activation'});
// @ts-expect-error a path ID is required
partner.loyaltyPrograms.get();
// @ts-expect-error a caller-owned idempotency key is required for writes
partner.loyaltyPrograms.activate({path:{externalId:'program'}});
// @ts-expect-error credentials cannot be mixed
new JourneyClient({apiKey:'jny_test',accessToken:'workos_test'});
// @ts-expect-error member operations are isolated
partner.request('memberProfile_get');
const member = new JourneyMemberClient({accessToken:'clerk_test'});
member.memberWallet.balance();
// @ts-expect-error partner operations are isolated
member.request('loyaltyProgramsPartner_list');
