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

## v1.8 — visual refinement, baseline fd79ca7
Read `docs/VISUAL-REFINEMENT-V18.md`. The official palette in `src/styles/brand.css` is immutable unless the owner explicitly approves a brand change. Blue-led does not mean blue-only: use original Ocean Slate and Sea Mist, warm cream, and restrained Earth Brown accents. The four supplied contour WebPs are the only public patterns approved for this release; do not substitute synthetic SVGs, recolour logo artwork, or tile patterns over body copy. Preserve the approved hero artwork (see v2.0 below), watermark timing, layouts, typography, all multilingual content, assistant/admin features and deployment fixes. Scope this update to styling and decorative page classes. No dependency or database changes. Run the existing tests, typecheck, build and review the deployed preview before merge.

## v2.0 approved visual refinements
- Header is permanently opaque --slate-action (#56656E), without shadows or backdrop blur.
- Public primary actions use the same token; on dark blue surfaces use cream reverse actions. Hover is Sea Mist with dark slate text.
- Homepage lesson card uses the same instruction.webp image as the beginner landing page. Hero uses the original primary-cream logo; preserve watermark animation.

## v2.1 approved service navigation and lesson photography
Four homepage cards: beginner lessons, private coaching, guided trips and rentals. Keep image and heading links localized, the first three enquiry actions, and the rental action linked to the rental page. The lower board tile is for sales and links to #sale; preserve the existing catalogue and rental links elsewhere. The beginner carousel shares the homepage instruction image first and includes all seven supplied new photos and all three existing homepage gallery images (ten total). Preserve fixed frame sizing, manual arrows, pause/play and reduced-motion support. Use only permission-cleared photos in production, especially those showing children. Preserve v2.0 palette, header and hero. No database or dependency changes.

## v2.2: owner-approved service rules
- Normal surf lessons and coaching last two hours unless Cristian agrees to a different arrangement. Do not present alternative lengths as standard lesson products or ask duration unnecessarily.
- Rental minimum is one hour. Hourly, half-day, full-day and longer-term rentals (by agreement); normal pickup Playa Bonita. New high-quality soft tops, hard tops, longboards and shortboards, subject to availability.
- Sales cover various brands, specialising in Milano surfboards. Contact Cristian for current stock and custom orders; photos are examples, not live inventory. No AI-generated prices or booking guarantees.
- Central multilingual policy copy lives in `src/lib/concierge.ts` (`servicePolicy`) and is used by page FAQs and assistant knowledge. Preserve consistency when editing.
- Both image galleries share `LessonCarousel`, 3575 ms autoplay, original photo proportions, blurred image backdrop, accessible round controls and reduced-motion support. No cream/white side bars. Keep horizontal spacing between related CTAs.

## v2.3 — concise beginner page
Keep the beginner landing page to its existing hero/carousel, three short information blocks (first lesson, private/shared options, and location), and the existing closing enquiry CTA. Do not reintroduce the lengthy FAQ or related-services strip here. Retain the homepage FAQ, knowledge base, localized routes and metadata; refer detailed questions to the concierge or Cristian. Standard lessons remain two hours unless arranged otherwise. No database or dependency changes.

## v2.4 media rules
Preserve the owner-approved three-photo guided trip carousel and shared gallery controls. Use the new optimized hero MP4 files and poster; do not commit the raw MOV or reintroduce the old video. Keep the existing hero logo and fade. See docs/MEDIA-V24.md.

## v2.6 refinements
- Public concierge should ask useful questions directly, without repeated Great/Nice/Perfect openers. Use the supplied original stickers sparingly; preserve review and handoff guardrails.
- Hero video requests muted inline autoplay; never override user/browser autoplay or reduced-motion preferences.
- Public service cards have one shared booking CTA under Surf Lessons (general assistant), three inline Learn More links and the unchanged rental button.
- Font setup: follow docs/REFINEMENTS-V26.md; use only owner-supplied web-licensed assets, not substitutes. Keep font binaries out of unlicensed/public handovers.
