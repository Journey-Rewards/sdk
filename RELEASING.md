# Release @journeyrewards/sdk and journeyrewards-sdk

The public source repository is `Journey-Rewards/sdk`. Both distributions use MIT and the same release version. The Python project is `journeyrewards-sdk`; its import is `journey_rewards`.

## One-time publisher setup

1. Sign in to the npm account with publish access to **@journeyrewards/sdk** (existing maintainer: `journeyrewardsjohn`). Configure a GitHub trusted publisher: owner `Journey-Rewards`, repository `sdk`, workflow `release.yml`, environment `npm`. Enable direct `npm publish` for this publisher.
2. Create and verify the PyPI maintainer account and enable two-factor authentication. Add a **pending publisher** for `journeyrewards-sdk`: GitHub owner `Journey-Rewards`, repository `sdk`, workflow `release.yml`, environment `pypi`.
3. Configure the GitHub `npm` and `pypi` environments for protected release approval. The workflow runs only from `main` and only by manual dispatch. Do not put registry passwords or persistent publish tokens in this repository.

Sources: [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/), [new PyPI project with a trusted publisher](https://docs.pypi.org/trusted-publishers/creating-a-project-through-oidc/).

## Verify and publish

1. Review source and `contracts/provenance.json`; refresh contracts only from an approved upstream export. Run `npm run generate` and review the generated diff. Compare route declarations against Core when updating operations.
2. Run `npm test` and `npm run test:types`; build and install the npm tarball and Python wheel in clean environments. Confirm the archives contain no credentials or internal artifacts. Perform a scoped sandbox read test when credentials are available; separately approve and verify any sandbox writes.
3. Set matching versions in `package.json`, `pyproject.toml`, Python `__version__`, CLI output, and provenance. Keep the migration guide current.
4. Run `.github/workflows/release.yml` from `main`, choose the registry, and enter the expected version. The workflow verifies that version, reruns tests and package builds, and publishes via OIDC with provenance/attestations. Partial publication is recoverable by selecting only the unfinished registry.
5. Verify the public npm and PyPI metadata and install both public versions. Only then describe the release as available and update the website's release status.

If login, 2FA, or trusted-publisher configuration is missing, keep the validated artifacts and report the exact setup step. Do not report an attempted publication as a released package.
