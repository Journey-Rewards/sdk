// Generated from the pinned public contract. Run npm run generate.
export const operations = {
  "loyaltyArrivalsPartner_list": {
    "surface": "partner",
    "method": "GET",
    "path": "/v1/partner/arrivals",
    "query": [
      "organizationId",
      "propertyId",
      "propertyIds"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:arrivals:read"
      ]
    ],
    "summary": "List pending arrival tasks"
  },
  "loyaltyArrivalsPartner_acknowledge": {
    "surface": "partner",
    "method": "POST",
    "path": "/v1/partner/arrivals/{taskId}/ack",
    "query": [
      "organizationId"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:arrivals:write"
      ]
    ],
    "summary": "Acknowledge an arrival task"
  },
  "codePoolsPartner_listPools": {
    "surface": "partner",
    "method": "GET",
    "path": "/v1/partner/code-pools",
    "query": [
      "organizationId"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "offers:codes:read"
      ]
    ],
    "summary": "List code pools"
  },
  "codePoolsPartner_getPool": {
    "surface": "partner",
    "method": "GET",
    "path": "/v1/partner/code-pools/{poolRef}",
    "query": [
      "limit",
      "status"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "offers:codes:read"
      ]
    ],
    "summary": "Get a code pool"
  },
  "codePoolsPartner_addCodes": {
    "surface": "partner",
    "method": "POST",
    "path": "/v1/partner/code-pools/{poolRef}/codes",
    "query": [],
    "requiredQuery": [],
    "hasBody": true,
    "bodyRequired": true,
    "scopes": [
      [
        "offers:codes:write"
      ]
    ],
    "summary": "Add codes to a pool"
  },
  "codePoolsPartner_revokeCode": {
    "surface": "partner",
    "method": "DELETE",
    "path": "/v1/partner/code-pools/{poolRef}/codes/{code}",
    "query": [],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "offers:codes:write"
      ]
    ],
    "summary": "Revoke a code"
  },
  "customDomainsPartner_list": {
    "surface": "partner",
    "method": "GET",
    "path": "/v1/partner/custom-domains",
    "query": [
      "limit",
      "offset"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:custom-domains:read"
      ]
    ],
    "summary": "List custom domains"
  },
  "customDomainsPartner_create": {
    "surface": "partner",
    "method": "POST",
    "path": "/v1/partner/custom-domains",
    "query": [],
    "requiredQuery": [],
    "hasBody": true,
    "bodyRequired": true,
    "scopes": [
      [
        "partner:custom-domains:manage"
      ]
    ],
    "summary": "Connect a custom domain"
  },
  "customDomainsPartner_disconnect": {
    "surface": "partner",
    "method": "DELETE",
    "path": "/v1/partner/custom-domains/{externalId}",
    "query": [],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:custom-domains:manage"
      ]
    ],
    "summary": "Disconnect a custom domain"
  },
  "customDomainsPartner_get": {
    "surface": "partner",
    "method": "GET",
    "path": "/v1/partner/custom-domains/{externalId}",
    "query": [],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:custom-domains:read"
      ]
    ],
    "summary": "Get a custom domain"
  },
  "customDomainsPartner_mintSession": {
    "surface": "partner",
    "method": "POST",
    "path": "/v1/partner/custom-domains/{externalId}/entri-session",
    "query": [],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:custom-domains:manage"
      ]
    ],
    "summary": "Mint an Entri DNS session"
  },
  "customDomainsPartner_recheck": {
    "surface": "partner",
    "method": "POST",
    "path": "/v1/partner/custom-domains/{externalId}/recheck",
    "query": [],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:custom-domains:manage"
      ]
    ],
    "summary": "Recheck DNS for a custom domain"
  },
  "customDomainsPartner_retry": {
    "surface": "partner",
    "method": "POST",
    "path": "/v1/partner/custom-domains/{externalId}/retry",
    "query": [],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:custom-domains:manage"
      ]
    ],
    "summary": "Retry provisioning a custom domain"
  },
  "customDomainsPartner_listEligible": {
    "surface": "partner",
    "method": "GET",
    "path": "/v1/partner/custom-domains/eligible",
    "query": [
      "ownerEntityExternalId",
      "ownerEntityType"
    ],
    "requiredQuery": [
      "ownerEntityType"
    ],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:custom-domains:read"
      ]
    ],
    "summary": "List domains eligible to connect"
  },
  "fulfillmentsPartner_listFulfillments": {
    "surface": "partner",
    "method": "GET",
    "path": "/v1/partner/fulfillments",
    "query": [
      "limit",
      "offset",
      "organizationId",
      "propertyId",
      "status"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:fulfillments:read"
      ]
    ],
    "summary": "List fulfillments"
  },
  "fulfillmentsPartner_getFulfillment": {
    "surface": "partner",
    "method": "GET",
    "path": "/v1/partner/fulfillments/{fulfillmentId}",
    "query": [],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:fulfillments:read"
      ]
    ],
    "summary": "Get a fulfillment"
  },
  "fulfillmentsPartner_approveFulfillment": {
    "surface": "partner",
    "method": "POST",
    "path": "/v1/partner/fulfillments/{fulfillmentId}/approve",
    "query": [],
    "requiredQuery": [],
    "hasBody": true,
    "bodyRequired": true,
    "scopes": [
      [
        "partner:fulfillments:write"
      ]
    ],
    "summary": "Approve a fulfillment"
  },
  "fulfillmentsPartner_markFulfilled": {
    "surface": "partner",
    "method": "POST",
    "path": "/v1/partner/fulfillments/{fulfillmentId}/fulfill",
    "query": [],
    "requiredQuery": [],
    "hasBody": true,
    "bodyRequired": true,
    "scopes": [
      [
        "partner:fulfillments:write"
      ]
    ],
    "summary": "Mark a fulfillment as fulfilled"
  },
  "fulfillmentsPartner_rejectFulfillment": {
    "surface": "partner",
    "method": "POST",
    "path": "/v1/partner/fulfillments/{fulfillmentId}/reject",
    "query": [],
    "requiredQuery": [],
    "hasBody": true,
    "bodyRequired": true,
    "scopes": [
      [
        "partner:fulfillments:write"
      ]
    ],
    "summary": "Reject a fulfillment"
  },
  "fulfillmentsPartner_autocompleteOfferNames": {
    "surface": "partner",
    "method": "GET",
    "path": "/v1/partner/fulfillments/autocomplete/offers",
    "query": [
      "limit",
      "organizationId",
      "q"
    ],
    "requiredQuery": [
      "q"
    ],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:fulfillments:read"
      ]
    ],
    "summary": "Autocomplete offer names"
  },
  "fulfillmentsPartner_getPendingApprovals": {
    "surface": "partner",
    "method": "GET",
    "path": "/v1/partner/fulfillments/pending",
    "query": [
      "organizationId",
      "propertyId"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:fulfillments:read"
      ]
    ],
    "summary": "List fulfillments awaiting approval"
  },
  "fulfillmentsPartner_getRecentActivity": {
    "surface": "partner",
    "method": "GET",
    "path": "/v1/partner/fulfillments/recent",
    "query": [
      "limit",
      "organizationId",
      "propertyId"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:fulfillments:read"
      ]
    ],
    "summary": "List recent fulfillment activity"
  },
  "fulfillmentsPartner_searchFulfillments": {
    "surface": "partner",
    "method": "GET",
    "path": "/v1/partner/fulfillments/search",
    "query": [
      "claimedAfter",
      "claimedBefore",
      "expiresAfter",
      "expiresBefore",
      "fulfilledAfter",
      "fulfilledBefore",
      "limit",
      "offset",
      "organizationId",
      "propertyId",
      "q",
      "redemptionType",
      "status"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:fulfillments:read"
      ]
    ],
    "summary": "Search fulfillments"
  },
  "fulfillmentsPartner_verifyByCode": {
    "surface": "partner",
    "method": "POST",
    "path": "/v1/partner/fulfillments/verify",
    "query": [],
    "requiredQuery": [],
    "hasBody": true,
    "bodyRequired": true,
    "scopes": [
      [
        "partner:fulfillments:read"
      ]
    ],
    "summary": "Verify a fulfillment code"
  },
  "guestsPartner_list": {
    "surface": "partner",
    "method": "GET",
    "path": "/v1/partner/guests",
    "query": [
      "bookingStatus",
      "checkInFrom",
      "checkInTo",
      "limit",
      "memberLinked",
      "offset",
      "organizationId",
      "propertyId",
      "q"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:guests:read"
      ]
    ],
    "summary": "List guests"
  },
  "loyaltyProgramsPartner_list": {
    "surface": "partner",
    "method": "GET",
    "path": "/v1/partner/loyalty/programs",
    "query": [
      "organizationId"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:loyalty:programs:read"
      ]
    ],
    "summary": "List loyalty programs"
  },
  "loyaltyProgramsPartner_create": {
    "surface": "partner",
    "method": "POST",
    "path": "/v1/partner/loyalty/programs",
    "query": [],
    "requiredQuery": [],
    "hasBody": true,
    "bodyRequired": true,
    "scopes": [
      [
        "partner:loyalty:programs:write"
      ]
    ],
    "summary": "Create a loyalty program"
  },
  "loyaltyProgramsPartner_get": {
    "surface": "partner",
    "method": "GET",
    "path": "/v1/partner/loyalty/programs/{externalId}",
    "query": [
      "organizationId"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:loyalty:programs:read"
      ]
    ],
    "summary": "Get a loyalty program"
  },
  "loyaltyProgramsPartner_update": {
    "surface": "partner",
    "method": "PATCH",
    "path": "/v1/partner/loyalty/programs/{externalId}",
    "query": [
      "organizationId"
    ],
    "requiredQuery": [],
    "hasBody": true,
    "bodyRequired": true,
    "scopes": [
      [
        "partner:loyalty:programs:write"
      ]
    ],
    "summary": "Update a loyalty program"
  },
  "loyaltyProgramsPartner_activate": {
    "surface": "partner",
    "method": "POST",
    "path": "/v1/partner/loyalty/programs/{externalId}/activate",
    "query": [
      "organizationId"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:loyalty:programs:write"
      ]
    ],
    "summary": "Activate a loyalty program"
  },
  "loyaltyProgramsPartner_archive": {
    "surface": "partner",
    "method": "POST",
    "path": "/v1/partner/loyalty/programs/{externalId}/archive",
    "query": [
      "organizationId"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:loyalty:programs:write"
      ]
    ],
    "summary": "Archive a loyalty program"
  },
  "loyaltyProgramsPartner_getBenefitsMatrix": {
    "surface": "partner",
    "method": "GET",
    "path": "/v1/partner/loyalty/programs/{externalId}/benefits-matrix",
    "query": [
      "organizationId"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:loyalty:benefits:read"
      ]
    ],
    "summary": "Get the benefits matrix"
  },
  "loyaltyProgramsPartner_clearEarnMultiplier": {
    "surface": "partner",
    "method": "DELETE",
    "path": "/v1/partner/loyalty/programs/{externalId}/earn-multiplier",
    "query": [
      "organizationId"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:loyalty:programs:write"
      ]
    ],
    "summary": "Clear the program earn multiplier"
  },
  "loyaltyProgramsPartner_getEarnMultiplier": {
    "surface": "partner",
    "method": "GET",
    "path": "/v1/partner/loyalty/programs/{externalId}/earn-multiplier",
    "query": [
      "organizationId"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:loyalty:programs:read"
      ]
    ],
    "summary": "Get the program earn multiplier"
  },
  "loyaltyProgramsPartner_setEarnMultiplier": {
    "surface": "partner",
    "method": "PUT",
    "path": "/v1/partner/loyalty/programs/{externalId}/earn-multiplier",
    "query": [
      "organizationId"
    ],
    "requiredQuery": [],
    "hasBody": true,
    "bodyRequired": true,
    "scopes": [
      [
        "partner:loyalty:programs:write"
      ]
    ],
    "summary": "Set the program earn multiplier"
  },
  "loyaltyProgramsPartner_clearExcludedRateCodes": {
    "surface": "partner",
    "method": "DELETE",
    "path": "/v1/partner/loyalty/programs/{externalId}/excluded-rate-codes",
    "query": [
      "organizationId"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:loyalty:programs:write"
      ]
    ],
    "summary": "Clear excluded rate codes"
  },
  "loyaltyProgramsPartner_getExcludedRateCodes": {
    "surface": "partner",
    "method": "GET",
    "path": "/v1/partner/loyalty/programs/{externalId}/excluded-rate-codes",
    "query": [
      "organizationId"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:loyalty:programs:read"
      ]
    ],
    "summary": "Get excluded rate codes"
  },
  "loyaltyProgramsPartner_replaceExcludedRateCodes": {
    "surface": "partner",
    "method": "PUT",
    "path": "/v1/partner/loyalty/programs/{externalId}/excluded-rate-codes",
    "query": [
      "organizationId"
    ],
    "requiredQuery": [],
    "hasBody": true,
    "bodyRequired": true,
    "scopes": [
      [
        "partner:loyalty:programs:write"
      ]
    ],
    "summary": "Replace excluded rate codes"
  },
  "loyaltyProgramsPartner_getJoinPage": {
    "surface": "partner",
    "method": "GET",
    "path": "/v1/partner/loyalty/programs/{externalId}/join-page",
    "query": [
      "organizationId",
      "state"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:loyalty:programs:read"
      ]
    ],
    "summary": "Get the join page"
  },
  "loyaltyProgramsPartner_upsertJoinPage": {
    "surface": "partner",
    "method": "PUT",
    "path": "/v1/partner/loyalty/programs/{externalId}/join-page",
    "query": [],
    "requiredQuery": [],
    "hasBody": true,
    "bodyRequired": true,
    "scopes": [
      [
        "partner:loyalty:programs:write"
      ]
    ],
    "summary": "Create or replace the join page"
  },
  "loyaltyBenefitsPartner_list": {
    "surface": "partner",
    "method": "GET",
    "path": "/v1/partner/loyalty/programs/{programExternalId}/benefits",
    "query": [
      "organizationId"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:loyalty:benefits:read"
      ]
    ],
    "summary": "List benefits"
  },
  "loyaltyBenefitsPartner_create": {
    "surface": "partner",
    "method": "POST",
    "path": "/v1/partner/loyalty/programs/{programExternalId}/benefits",
    "query": [],
    "requiredQuery": [],
    "hasBody": true,
    "bodyRequired": true,
    "scopes": [
      [
        "partner:loyalty:benefits:write"
      ]
    ],
    "summary": "Create a benefit"
  },
  "loyaltyBenefitsPartner_get": {
    "surface": "partner",
    "method": "GET",
    "path": "/v1/partner/loyalty/programs/{programExternalId}/benefits/{externalId}",
    "query": [
      "organizationId"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:loyalty:benefits:read"
      ]
    ],
    "summary": "Get a benefit"
  },
  "loyaltyBenefitsPartner_update": {
    "surface": "partner",
    "method": "PATCH",
    "path": "/v1/partner/loyalty/programs/{programExternalId}/benefits/{externalId}",
    "query": [
      "organizationId"
    ],
    "requiredQuery": [],
    "hasBody": true,
    "bodyRequired": true,
    "scopes": [
      [
        "partner:loyalty:benefits:write"
      ]
    ],
    "summary": "Update a benefit"
  },
  "loyaltyBenefitsPartner_archive": {
    "surface": "partner",
    "method": "POST",
    "path": "/v1/partner/loyalty/programs/{programExternalId}/benefits/{externalId}/archive",
    "query": [
      "organizationId"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:loyalty:benefits:write"
      ]
    ],
    "summary": "Archive a benefit"
  },
  "loyaltyBenefitsPartner_getAudience": {
    "surface": "partner",
    "method": "GET",
    "path": "/v1/partner/loyalty/programs/{programExternalId}/benefits/{externalId}/audience",
    "query": [
      "organizationId"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:loyalty:benefits:read"
      ]
    ],
    "summary": "Get the benefit audience"
  },
  "loyaltyBenefitsPartner_exportAudience": {
    "surface": "partner",
    "method": "GET",
    "path": "/v1/partner/loyalty/programs/{programExternalId}/benefits/{externalId}/audience/export",
    "query": [
      "format",
      "organizationId"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:loyalty:benefits:read"
      ]
    ],
    "summary": "Export the benefit audience"
  },
  "loyaltyBenefitsPartner_getEligibility": {
    "surface": "partner",
    "method": "GET",
    "path": "/v1/partner/loyalty/programs/{programExternalId}/benefits/{externalId}/eligibility",
    "query": [
      "organizationId"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:loyalty:benefits:read"
      ]
    ],
    "summary": "Get benefit eligibility"
  },
  "loyaltyBenefitsPartner_setEligibility": {
    "surface": "partner",
    "method": "PUT",
    "path": "/v1/partner/loyalty/programs/{programExternalId}/benefits/{externalId}/eligibility",
    "query": [
      "organizationId"
    ],
    "requiredQuery": [],
    "hasBody": true,
    "bodyRequired": true,
    "scopes": [
      [
        "partner:loyalty:benefits:write"
      ]
    ],
    "summary": "Set benefit eligibility"
  },
  "loyaltyBenefitsPartner_publish": {
    "surface": "partner",
    "method": "POST",
    "path": "/v1/partner/loyalty/programs/{programExternalId}/benefits/{externalId}/publish",
    "query": [
      "organizationId"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:loyalty:benefits:write"
      ]
    ],
    "summary": "Publish a benefit"
  },
  "loyaltyTiersPartner_list": {
    "surface": "partner",
    "method": "GET",
    "path": "/v1/partner/loyalty/programs/{programExternalId}/tiers",
    "query": [
      "organizationId"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:loyalty:programs:read"
      ]
    ],
    "summary": "List tiers"
  },
  "loyaltyTiersPartner_create": {
    "surface": "partner",
    "method": "POST",
    "path": "/v1/partner/loyalty/programs/{programExternalId}/tiers",
    "query": [],
    "requiredQuery": [],
    "hasBody": true,
    "bodyRequired": true,
    "scopes": [
      [
        "partner:loyalty:programs:write"
      ]
    ],
    "summary": "Create a tier"
  },
  "loyaltyTiersPartner_remove": {
    "surface": "partner",
    "method": "DELETE",
    "path": "/v1/partner/loyalty/programs/{programExternalId}/tiers/{tierExternalId}",
    "query": [
      "organizationId"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:loyalty:programs:write"
      ]
    ],
    "summary": "Delete a tier"
  },
  "loyaltyTiersPartner_get": {
    "surface": "partner",
    "method": "GET",
    "path": "/v1/partner/loyalty/programs/{programExternalId}/tiers/{tierExternalId}",
    "query": [
      "organizationId"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:loyalty:programs:read"
      ]
    ],
    "summary": "Get a tier"
  },
  "loyaltyTiersPartner_update": {
    "surface": "partner",
    "method": "PATCH",
    "path": "/v1/partner/loyalty/programs/{programExternalId}/tiers/{tierExternalId}",
    "query": [
      "organizationId"
    ],
    "requiredQuery": [],
    "hasBody": true,
    "bodyRequired": true,
    "scopes": [
      [
        "partner:loyalty:programs:write"
      ]
    ],
    "summary": "Update a tier"
  },
  "loyaltyTiersPartner_clearEarnMultiplier": {
    "surface": "partner",
    "method": "DELETE",
    "path": "/v1/partner/loyalty/programs/{programExternalId}/tiers/{tierExternalId}/earn-multiplier",
    "query": [
      "organizationId"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:loyalty:benefits:write"
      ]
    ],
    "summary": "Clear a tier earn multiplier"
  },
  "loyaltyTiersPartner_setEarnMultiplier": {
    "surface": "partner",
    "method": "PUT",
    "path": "/v1/partner/loyalty/programs/{programExternalId}/tiers/{tierExternalId}/earn-multiplier",
    "query": [
      "organizationId"
    ],
    "requiredQuery": [],
    "hasBody": true,
    "bodyRequired": true,
    "scopes": [
      [
        "partner:loyalty:benefits:write"
      ]
    ],
    "summary": "Set a tier earn multiplier"
  },
  "loyaltyTiersPartner_listEntitlements": {
    "surface": "partner",
    "method": "GET",
    "path": "/v1/partner/loyalty/programs/{programExternalId}/tiers/{tierExternalId}/entitlements",
    "query": [
      "organizationId"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:loyalty:benefits:read"
      ]
    ],
    "summary": "List tier entitlements"
  },
  "loyaltyTiersPartner_unbindEntitlement": {
    "surface": "partner",
    "method": "DELETE",
    "path": "/v1/partner/loyalty/programs/{programExternalId}/tiers/{tierExternalId}/entitlements/{benefitExternalId}",
    "query": [
      "organizationId"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:loyalty:benefits:write"
      ]
    ],
    "summary": "Unbind a benefit from a tier"
  },
  "loyaltyTiersPartner_bindEntitlement": {
    "surface": "partner",
    "method": "PUT",
    "path": "/v1/partner/loyalty/programs/{programExternalId}/tiers/{tierExternalId}/entitlements/{benefitExternalId}",
    "query": [
      "organizationId"
    ],
    "requiredQuery": [],
    "hasBody": true,
    "bodyRequired": true,
    "scopes": [
      [
        "partner:loyalty:benefits:write"
      ]
    ],
    "summary": "Bind a benefit to a tier"
  },
  "loyaltyTiersPartner_listGrants": {
    "surface": "partner",
    "method": "GET",
    "path": "/v1/partner/loyalty/programs/{programExternalId}/tiers/{tierExternalId}/grants",
    "query": [
      "memberExternalId",
      "organizationId"
    ],
    "requiredQuery": [
      "memberExternalId"
    ],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:loyalty:programs:read"
      ]
    ],
    "summary": "List manual tier grants"
  },
  "loyaltyTiersPartner_grantTier": {
    "surface": "partner",
    "method": "POST",
    "path": "/v1/partner/loyalty/programs/{programExternalId}/tiers/{tierExternalId}/grants",
    "query": [],
    "requiredQuery": [],
    "hasBody": true,
    "bodyRequired": true,
    "scopes": [
      [
        "partner:loyalty:programs:write"
      ]
    ],
    "summary": "Grant a tier to a member"
  },
  "loyaltyTiersPartner_revokeGrant": {
    "surface": "partner",
    "method": "DELETE",
    "path": "/v1/partner/loyalty/programs/{programExternalId}/tiers/{tierExternalId}/grants/{grantExternalId}",
    "query": [
      "organizationId"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:loyalty:programs:write"
      ]
    ],
    "summary": "Revoke a manual tier grant"
  },
  "loyaltyTiersPartner_clearMemberRate": {
    "surface": "partner",
    "method": "DELETE",
    "path": "/v1/partner/loyalty/programs/{programExternalId}/tiers/{tierExternalId}/member-rate",
    "query": [
      "organizationId"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:loyalty:benefits:write"
      ]
    ],
    "summary": "Clear a tier member rate code"
  },
  "loyaltyTiersPartner_setMemberRate": {
    "surface": "partner",
    "method": "PUT",
    "path": "/v1/partner/loyalty/programs/{programExternalId}/tiers/{tierExternalId}/member-rate",
    "query": [
      "organizationId"
    ],
    "requiredQuery": [],
    "hasBody": true,
    "bodyRequired": true,
    "scopes": [
      [
        "partner:loyalty:benefits:write"
      ]
    ],
    "summary": "Set a tier member rate code"
  },
  "loyaltyTiersPartner_reorder": {
    "surface": "partner",
    "method": "PUT",
    "path": "/v1/partner/loyalty/programs/{programExternalId}/tiers/order",
    "query": [
      "organizationId"
    ],
    "requiredQuery": [],
    "hasBody": true,
    "bodyRequired": true,
    "scopes": [
      [
        "partner:loyalty:programs:write"
      ]
    ],
    "summary": "Reorder the tier ladder"
  },
  "loyaltyRuleAttributesPartner_list": {
    "surface": "partner",
    "method": "GET",
    "path": "/v1/partner/loyalty/rule-attributes",
    "query": [],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:loyalty:benefits:read"
      ]
    ],
    "summary": "List rule attributes"
  },
  "membersPartner_listMembers": {
    "surface": "partner",
    "method": "GET",
    "path": "/v1/partner/members",
    "query": [
      "limit",
      "offset",
      "organizationId",
      "q"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:guests:read"
      ]
    ],
    "summary": "List loyalty members"
  },
  "membersPartner_getMember": {
    "surface": "partner",
    "method": "GET",
    "path": "/v1/partner/members/{externalId}",
    "query": [
      "organizationId"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:guests:read"
      ]
    ],
    "summary": "Get a member"
  },
  "pagesPartner_list": {
    "surface": "partner",
    "method": "GET",
    "path": "/v1/partner/pages",
    "query": [
      "limit",
      "offset",
      "organizationId",
      "ownerEntityExternalId",
      "ownerEntityType",
      "pageType"
    ],
    "requiredQuery": [
      "limit",
      "offset"
    ],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:pages:read"
      ]
    ],
    "summary": "List pages"
  },
  "pagesPartner_get": {
    "surface": "partner",
    "method": "GET",
    "path": "/v1/partner/pages/{pageGroupId}",
    "query": [
      "organizationId",
      "state"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:pages:read"
      ]
    ],
    "summary": "Get a page"
  },
  "pagesPartner_update": {
    "surface": "partner",
    "method": "PATCH",
    "path": "/v1/partner/pages/{pageGroupId}",
    "query": [
      "organizationId",
      "state"
    ],
    "requiredQuery": [],
    "hasBody": true,
    "bodyRequired": true,
    "scopes": [
      [
        "partner:pages:manage"
      ]
    ],
    "summary": "Update a page"
  },
  "pagesPartner_assignCustomDomain": {
    "surface": "partner",
    "method": "PUT",
    "path": "/v1/partner/pages/{pageGroupId}/custom-domain",
    "query": [
      "organizationId",
      "state"
    ],
    "requiredQuery": [],
    "hasBody": true,
    "bodyRequired": true,
    "scopes": [
      [
        "partner:pages:manage"
      ]
    ],
    "summary": "Assign or clear the page’s custom domain"
  },
  "pagesPartner_discardDraft": {
    "surface": "partner",
    "method": "POST",
    "path": "/v1/partner/pages/{pageGroupId}/discard-draft",
    "query": [
      "organizationId"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:pages:manage"
      ]
    ],
    "summary": "Discard a page draft"
  },
  "pagesPartner_startEditing": {
    "surface": "partner",
    "method": "POST",
    "path": "/v1/partner/pages/{pageGroupId}/edit",
    "query": [
      "organizationId",
      "state"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:pages:manage"
      ]
    ],
    "summary": "Start editing a page"
  },
  "pagesPartner_listEligibleDomains": {
    "surface": "partner",
    "method": "GET",
    "path": "/v1/partner/pages/{pageGroupId}/eligible-domains",
    "query": [
      "organizationId",
      "state"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:pages:read"
      ]
    ],
    "summary": "List domains the page may use"
  },
  "pagesPartner_listMemberGatePrograms": {
    "surface": "partner",
    "method": "GET",
    "path": "/v1/partner/pages/{pageGroupId}/member-gate-programs",
    "query": [
      "organizationId",
      "state"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:pages:read"
      ]
    ],
    "summary": "List programs usable as a member gate"
  },
  "pagesPartner_getPreview": {
    "surface": "partner",
    "method": "GET",
    "path": "/v1/partner/pages/{pageGroupId}/preview",
    "query": [
      "organizationId",
      "state"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:pages:read"
      ]
    ],
    "summary": "Get a page preview payload"
  },
  "pagesPartner_publish": {
    "surface": "partner",
    "method": "POST",
    "path": "/v1/partner/pages/{pageGroupId}/publish",
    "query": [
      "organizationId",
      "state"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:pages:manage"
      ]
    ],
    "summary": "Publish a page draft"
  },
  "pagesPartner_getSeo": {
    "surface": "partner",
    "method": "GET",
    "path": "/v1/partner/pages/{pageGroupId}/seo",
    "query": [
      "organizationId",
      "state"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:pages:read"
      ]
    ],
    "summary": "Get page SEO metadata"
  },
  "pagesPartner_replaceSeo": {
    "surface": "partner",
    "method": "PUT",
    "path": "/v1/partner/pages/{pageGroupId}/seo",
    "query": [
      "organizationId",
      "state"
    ],
    "requiredQuery": [],
    "hasBody": true,
    "bodyRequired": true,
    "scopes": [
      [
        "partner:pages:manage"
      ]
    ],
    "summary": "Replace page SEO metadata"
  },
  "pagesPartner_getTheme": {
    "surface": "partner",
    "method": "GET",
    "path": "/v1/partner/pages/{pageGroupId}/theme",
    "query": [
      "organizationId",
      "state"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:pages:read"
      ]
    ],
    "summary": "Get the page theme"
  },
  "pagesPartner_patchTheme": {
    "surface": "partner",
    "method": "PATCH",
    "path": "/v1/partner/pages/{pageGroupId}/theme",
    "query": [
      "organizationId",
      "state"
    ],
    "requiredQuery": [],
    "hasBody": true,
    "bodyRequired": true,
    "scopes": [
      [
        "partner:pages:manage"
      ]
    ],
    "summary": "Update the page theme"
  },
  "pagesPartner_unpublish": {
    "surface": "partner",
    "method": "POST",
    "path": "/v1/partner/pages/{pageGroupId}/unpublish",
    "query": [
      "organizationId",
      "state"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:pages:manage"
      ]
    ],
    "summary": "Unpublish a page"
  },
  "pointMultipliersPartner_getConfig": {
    "surface": "partner",
    "method": "GET",
    "path": "/v1/partner/point-multipliers",
    "query": [
      "organizationId"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner-details:read"
      ]
    ],
    "summary": "Get point multiplier configuration"
  },
  "reservationsPartner_list": {
    "surface": "partner",
    "method": "GET",
    "path": "/v1/partner/reservations",
    "query": [
      "bookingStatus",
      "checkInFrom",
      "checkInTo",
      "cursor",
      "limit",
      "memberLinked",
      "offset",
      "organizationId",
      "propertyId",
      "propertyIds",
      "q"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:reservations:read"
      ]
    ],
    "summary": "List reservations"
  },
  "reservationsPartner_get": {
    "surface": "partner",
    "method": "GET",
    "path": "/v1/partner/reservations/{reservationId}",
    "query": [
      "organizationId"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:reservations:read"
      ]
    ],
    "summary": "Get a reservation"
  },
  "scopePartner_getScope": {
    "surface": "partner",
    "method": "GET",
    "path": "/v1/partner/scope",
    "query": [
      "organizationId"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [],
    "summary": "Get the scope of the current credential"
  },
  "themeKitsPartner_list": {
    "surface": "partner",
    "method": "GET",
    "path": "/v1/partner/theme-kits",
    "query": [
      "limit",
      "offset",
      "organizationId"
    ],
    "requiredQuery": [
      "limit",
      "offset"
    ],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:theme-kits:read"
      ]
    ],
    "summary": "List theme kits"
  },
  "themeKitsPartner_remove": {
    "surface": "partner",
    "method": "DELETE",
    "path": "/v1/partner/theme-kits/{entityType}/{entityExternalId}",
    "query": [
      "expectedVersion",
      "organizationId"
    ],
    "requiredQuery": [
      "expectedVersion"
    ],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:theme-kits:manage"
      ]
    ],
    "summary": "Delete an entity’s theme kit"
  },
  "themeKitsPartner_get": {
    "surface": "partner",
    "method": "GET",
    "path": "/v1/partner/theme-kits/{entityType}/{entityExternalId}",
    "query": [
      "organizationId"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:theme-kits:read"
      ]
    ],
    "summary": "Get an entity’s theme kit"
  },
  "themeKitsPartner_put": {
    "surface": "partner",
    "method": "PUT",
    "path": "/v1/partner/theme-kits/{entityType}/{entityExternalId}",
    "query": [
      "organizationId"
    ],
    "requiredQuery": [],
    "hasBody": true,
    "bodyRequired": true,
    "scopes": [
      [
        "partner:theme-kits:manage"
      ]
    ],
    "summary": "Create or replace an entity’s theme kit"
  },
  "themeKitsPartner_deleteFont": {
    "surface": "partner",
    "method": "DELETE",
    "path": "/v1/partner/theme-kits/{entityType}/{entityExternalId}/fonts/{fontId}",
    "query": [
      "organizationId"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:theme-kits:manage"
      ]
    ],
    "summary": "Delete a font from a theme kit"
  },
  "accessPartner_getUserScope": {
    "surface": "partner",
    "method": "GET",
    "path": "/v1/partner/users/{workosUserId}/scope",
    "query": [
      "organizationId"
    ],
    "requiredQuery": [
      "organizationId"
    ],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:access:read"
      ]
    ],
    "summary": "Get a user’s reach"
  },
  "accessPartner_setUserScope": {
    "surface": "partner",
    "method": "PUT",
    "path": "/v1/partner/users/{workosUserId}/scope",
    "query": [
      "organizationId"
    ],
    "requiredQuery": [
      "organizationId"
    ],
    "hasBody": true,
    "bodyRequired": true,
    "scopes": [
      [
        "partner:access:write"
      ]
    ],
    "summary": "Set a user’s reach"
  },
  "venuesPartner_clear": {
    "surface": "partner",
    "method": "DELETE",
    "path": "/v1/partner/venues/{venueExternalId}/booking-rate-code",
    "query": [
      "organizationId"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:loyalty:programs:write"
      ]
    ],
    "summary": "Clear a venue’s default booking rate code"
  },
  "venuesPartner_get": {
    "surface": "partner",
    "method": "GET",
    "path": "/v1/partner/venues/{venueExternalId}/booking-rate-code",
    "query": [
      "organizationId"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:loyalty:programs:read"
      ]
    ],
    "summary": "Get a venue’s default booking rate code"
  },
  "venuesPartner_set": {
    "surface": "partner",
    "method": "PUT",
    "path": "/v1/partner/venues/{venueExternalId}/booking-rate-code",
    "query": [],
    "requiredQuery": [],
    "hasBody": true,
    "bodyRequired": true,
    "scopes": [
      [
        "partner:loyalty:programs:write"
      ]
    ],
    "summary": "Set a venue’s default booking rate code"
  },
  "guestInvitesPartner_listByVguestProfile": {
    "surface": "partner",
    "method": "GET",
    "path": "/v1/partner/vguests/guest-invites",
    "query": [
      "vguestProfileId"
    ],
    "requiredQuery": [
      "vguestProfileId"
    ],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:guests:read"
      ],
      [
        "partner:guests:pii:read"
      ]
    ],
    "summary": "List invites for a verified-guest profile"
  },
  "guestInvitesPartner_sendInvite": {
    "surface": "partner",
    "method": "POST",
    "path": "/v1/partner/vguests/guest-invites",
    "query": [],
    "requiredQuery": [],
    "hasBody": true,
    "bodyRequired": true,
    "scopes": [
      [
        "partner:guests:read"
      ],
      [
        "partner:guests:pii:read"
      ]
    ],
    "summary": "Send a guest invite"
  },
  "guestInvitesPartner_cancelInvite": {
    "surface": "partner",
    "method": "DELETE",
    "path": "/v1/partner/vguests/guest-invites/{inviteId}",
    "query": [],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:guests:read"
      ],
      [
        "partner:guests:pii:read"
      ]
    ],
    "summary": "Cancel a guest invite"
  },
  "guestInvitesPartner_listAll": {
    "surface": "partner",
    "method": "GET",
    "path": "/v1/partner/vguests/guest-invites/all",
    "query": [
      "brandIds",
      "venueIds"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:guests:read"
      ],
      [
        "partner:guests:pii:read"
      ]
    ],
    "summary": "List invites across your reach"
  },
  "windfallPartner_getByGuestHash": {
    "surface": "partner",
    "method": "GET",
    "path": "/v1/partner/windfall/guests/{hashedPmsGuestId}",
    "query": [],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:guests:read"
      ],
      [
        "partner:guests:pii:read"
      ]
    ],
    "summary": "Get Windfall data for a guest"
  },
  "windfallPartner_getByMemberId": {
    "surface": "partner",
    "method": "GET",
    "path": "/v1/partner/windfall/members/{memberId}",
    "query": [],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:guests:read"
      ],
      [
        "partner:guests:pii:read"
      ]
    ],
    "summary": "Get Windfall data for a member"
  },
  "windfallPartner_getByReservationId": {
    "surface": "partner",
    "method": "GET",
    "path": "/v1/partner/windfall/reservations/{reservationId}",
    "query": [
      "organizationId"
    ],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:guests:read"
      ],
      [
        "partner:guests:pii:read"
      ]
    ],
    "summary": "Get Windfall data for a reservation"
  },
  "windfallPartner_getStats": {
    "surface": "partner",
    "method": "GET",
    "path": "/v1/partner/windfall/stats",
    "query": [],
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [
      [
        "partner:guests:read"
      ],
      [
        "partner:guests:pii:read"
      ]
    ],
    "summary": "Get Windfall coverage stats"
  },
  "memberProfile_get": {
    "path": "/v1/members/me/profile",
    "query": [
      "fields"
    ],
    "surface": "member",
    "method": "GET",
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [],
    "summary": "memberProfile_get"
  },
  "memberMembership_get": {
    "path": "/v1/members/me/membership",
    "query": [],
    "surface": "member",
    "method": "GET",
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [],
    "summary": "memberMembership_get"
  },
  "memberConsents_get": {
    "path": "/v1/members/me/marketing-consents",
    "query": [],
    "surface": "member",
    "method": "GET",
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [],
    "summary": "memberConsents_get"
  },
  "memberWallet_get": {
    "path": "/v1/members/me/wallet",
    "query": [],
    "surface": "member",
    "method": "GET",
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [],
    "summary": "memberWallet_get"
  },
  "memberWallet_balance": {
    "path": "/v1/members/me/wallet/balance",
    "query": [],
    "surface": "member",
    "method": "GET",
    "requiredQuery": [],
    "hasBody": false,
    "bodyRequired": false,
    "scopes": [],
    "summary": "memberWallet_balance"
  }
};
export const provenance = {
  "contractVersion": "1",
  "sdkVersion": "2.0.2",
  "partnerOpenApiSource": "Journey-Rewards/api#1268@20b5c59035c13a62deca0953f3a4602a2cd70646",
  "partnerOpenApiStatus": "Export proposal remains open; this is the existing public documentation snapshot, not an export from main.",
  "routeVerification": "All 110 documented routes matched Core main controller declarations, including 109 authenticated partner operations. The public invite mutation is excluded from this SDK.",
  "coreCommit": "a424e368a7e2849e17772a27c868ac79b4cbcd4e",
  "documentation": "https://docs.journey.com",
  "responseTyping": "Only response shapes present in the OpenAPI snapshot are typed. Undocumented success responses remain unknown; no fields are invented.",
  "connectedVerification": "Local contract and transport fixtures do not establish connected account, tenancy, write or payment success.",
  "normalizations": [
    {
      "change": "Correct pages/theme-kits list limit and offset from Object to integer, retaining existing bounds/defaults.",
      "source": "Core main a424e368: ListPartnerPagesRequest and ListPartnerThemeKitsRequest use @IsInt and @Type(() => Number)."
    },
    {
      "change": "Express the Unicode Cc control-character exclusion as equivalent U+0000-U+001F and U+007F-U+009F ranges for JSON Schema validator portability.",
      "source": "AddPoolCodesRequest codes pattern; no validation policy change."
    },
    {
      "change": "Document three multipart bodies omitted by the export and mark these operations outside the JSON-only SDK.",
      "source": "Core main a424e368: PagesPartnerController.uploadFeaturedImage, ThemeKitsPartnerController.uploadFont/uploadImage and their multipart utilities. Current replay digest consumes request.body before streamed file parsing."
    }
  ],
  "sdkCoverage": "106 authenticated JSON/no-body partner operations and five member reads. Three multipart upload routes remain documented but excluded from SDK v2."
};
