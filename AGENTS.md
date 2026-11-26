## Current release: v1.5
Read `docs/ASSISTANT-PWA-V15.md` first. Integrate against the live v1.4 baseline, preserve deploy fixes and credentials, and run npm ci/test/typecheck/build. Never enable owner quick login on a public production or unprotected preview. No new database migration.

# Península Surf School — v1.0 handover

This package supersedes v0.9 as a development candidate. Preserve the approved v0.9 design, brand assets, video and hero fade. The new scope is availability-aware enquiry form, owner-only calendar/inbox, and dedicated SEO pages for beginner lessons and board rental in EN/ES/FR. Read docs/BOOKING-SETUP.md first, then README.md and BRAND-ASSETS.md (older baseline instructions). Do not overwrite changes already made in the GitHub repository without reviewing its diff. Use a feature branch. Run `npm install`, `npm run typecheck`, `npm run test:booking`, `npm run build`, and commit lockfile after successful verification. Provision Supabase and owner login using the setup guide; test in protected Vercel preview. Do not deploy untested auth/database or turn on indexing. WhatsApp direct links and web responses work independently of a future WhatsApp API; no native automated WhatsApp replies, real bookings, notifications (unless optional Resend configured), or AI are live. Do not claim otherwise. Do not publish unconfirmed stock, fake reviews, prices, or outdated legal text. Confirm phone, branding/font licenses and privacy requirements. Return preview URL and actual test results.

## v1.1 requirements (latest)
Read docs/CONCIERGE-V11.md before deployment. Keep Península in a dedicated Supabase project. Run the base schema and v1.1 migration, never use QuoteCore+ credentials. The website concierge is an enquiry qualification assistant, not a booking engine; only owner may confirm. Do not remove the manual fallback or claim WhatsApp was sent. Validate the approved exact-message handoff, privacy, API usage limits, authentication refresh, RLS and booking RPCs before live data. Preserve design, all 15 localized routes, and preview noindex. Test with actual model credentials and mobile devices. This supersedes old v1.0 instructions.

## v1.2 update — highest-priority handover
Read `docs/ADMIN-ASSISTANT-V12.md` first; it supersedes older admin deployment steps. Use a protected preview with `PENINSULA_DEMO_MODE=true`, `SITE_INDEXABLE=false` and no credentials for initial owner testing. When connecting the dedicated Supabase project, apply `schema.sql`, `upgrade-v11.sql`, `upgrade-v12.sql` (only missing migrations, in order). Turn demo off before live integration; never bypass authentication on a real database. Configure server-side OpenAI and transcription model keys; no secrets in source. Test owner-only proposal/confirm, replay/stale and overlap protection, voice, auth, grants, and real device workflow. Preserve all approved public pages, design, translations, SEO, media and customer enquiry system. Run `npm test`, `npm run typecheck`, `npm run build` and commit package lock before Vercel. Return protected preview URL and explicit test results; no final launch or index until owner approval.

## v1.3 update
Read `docs/ADMIN-V13.md` before deployment. English and Spanish admin, private assistant language and safe browser-only factory reset are added. No new migrations. For live integration test cleanup follow the dedicated test-project procedure; do not run reset on production or QuoteCore+.

## v1.4 update
Read `docs/ENQUIRY-MODE-V14.md` first. Merge the focused update with current v1.3 deployment work; do not overwrite credentials, the generated lockfile or agent fixes. Apply only the new additive `supabase/upgrade-v14.sql` if earlier migrations already exist. Keep the public contact route functional without OpenAI or Supabase; enforce the setting server-side and preserve customer details on failures. Do not gate the private calendar assistant. Run the complete acceptance checklist, tests, typecheck and production build before release.

## v1.6 handover
Read `docs/EXPERIENCE-V16.md`. Preserve live deployment fixes. Apply `supabase/upgrade-v16.sql` to the dedicated project before deploying v1.6; no destructive resets. Email and cron require separate actual integration tests. Native PWA push is a separate next phase, not shipped here. No fabricated inventory, reviews, safety guarantees, or best-school claims.

## v1.7 integration
Read `docs/LANGUAGE-TESTING-V17.md`. Preserve v1.6 functionality and existing deployment fixes. Never enable synthetic transcript logs with real data. Protect preview access and keep production diagnostics off. Verify live multilingual chat, Spanish admin, PWA icons and build before merge.
