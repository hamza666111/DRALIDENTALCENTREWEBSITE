# Clinic admin workspace

The admin panel is a separate Cloudflare Worker. Its pages, assets, and `/api/*` routes all run through the Worker first. The Worker rejects requests unless it can verify a Cloudflare Access JWT with the expected issuer, application audience, and an explicitly allowed admin email. There is no application password or password database to maintain. Use an identity provider with MFA or a passkey for your Cloudflare Access sign-in.

## What is implemented

- Responsive overview with enquiry counts and recent requests.
- Enquiry inbox with contact details, request details, and follow-up status.
- Private video draft creation and deletion.
- D1 schema in `migrations/0001_admin.sql`.
- Same-origin checks for changes, bounded JSON request bodies, parameterized SQL, no-store responses, and restrictive response headers.

The public forms still use their existing configured endpoint or WhatsApp handoff. The public video page still uses `src/config/videos.ts`. Connecting those public flows and adding R2 upload/publishing are later steps. Admin video drafts cannot appear publicly yet.

## Cloudflare setup

1. Enable Cloudflare Zero Trust and configure sign-in with MFA or a passkey. Create a D1 database named `dadc-admin` using the dashboard or `npx wrangler d1 create dadc-admin`.
2. Copy `wrangler.admin.jsonc.example` to `wrangler.admin.jsonc`. Replace the D1 database ID, team domain, and allowed admin email. The checked-in example contains no credentials. The real config is ignored by Git until account-specific values are ready to commit.
3. Run `npx wrangler d1 migrations apply dadc-admin --remote --config wrangler.admin.jsonc` to create the tables. Run `npm run admin:types` whenever you change bindings or configuration.
4. Run `npm run admin:deploy`. Until Access is configured, the Worker returns 403 for every route, including static assets.
5. In **Workers & Pages → dadc-admin → Access**, choose **Protect this Worker behind Access**, select **all traffic** (production and previews), and allow only the exact staff email addresses needed. Require MFA through the chosen identity provider. Copy the **Application Audience (AUD) Tag** from the resulting Access application into `ACCESS_AUD` in `wrangler.admin.jsonc`, then redeploy.
6. Verify one allowed account can open the `workers.dev` admin URL, an unapproved account is denied, and direct `/api/me` and asset URLs cannot be accessed without a session.

Do not use an email-domain-wide allow rule for the admin Worker. Do not put passwords, API tokens, patient data, or R2 credentials in `VITE_*` variables, the repository, or browser storage.

## Local checks

```sh
npm run typecheck
npm run admin:build
npx wrangler deploy --dry-run --config wrangler.admin.jsonc
```

`npm run admin:dev` previews the visual interface, but real data requests require a deployed Worker protected by Cloudflare Access. The Worker fails closed locally without a valid Access token.
