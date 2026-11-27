# v1.8 — Blue-led visual refinement

Baseline: uploaded `peninsula-surf-v1.7-fd79ca7.zip` (fd79ca7b20ff9e7f129a3616b1c6a4cb8c3345b3).

This is a small design-only update, not an assistant, database, authentication, navigation, content or layout redesign. Keep the current circular hero submark, hidden semantic headline, existing video and watermark timing. Preserve all media and PWA icons. The package version and lockfile are intentionally unchanged; v1.8 identifies the visual handover.

## Palette

Restore Ocean Slate #6E7C84, Sea Mist #CDD7DC, Olive #929277, Cream #F4F0E9, Earth Brown #675346 and Sand #F8E9BE. Accessible derived slate ink #4D5B64 and action #56656E are UI shades, not replacements for the official colours. Cream/action text contrast 5.31:1; ink/mist 4.79:1; cream/brown 6.37:1. Official slate/cream is 3.79:1, so reserve that pair for large text or decorative marks. The header is action slate, with a stronger translucent ink background on scroll to improve small-label contrast. Logo artwork is unmodified; hover no longer recolours it.

## Section treatments

- Home: cream services, mist community, original slate contour founder with solid cream copy panel, cream gallery, ink location, cream shop with slate board and brown clothing caption, existing cream FAQ, cream/slate patterned closing band.
- Beginner: mist hero, cream content, cream/mist related-link band, cream FAQ, solid slate closing band.
- Coaching: ink hero with cream button, cream body, mist related band, cream FAQ, slate patterned closing band.
- Rental: mist hero, cream body, slate related band, cream FAQ, solid mist closing band.
- Boards: ink hero with mist-patterned board illustration, mist sale feature, ink rental feature, mist closing band.
- Clothing: cream/slate patterned hero with cream copy panel and solid slate art panel, cream/mist collection feature, brown action buttons, solid slate closing band.

Original supplied WebPs used without editing; all four match the uploaded files byte-for-byte. Patterns cover their sections without repeating vertically. Original unused SVGs and olive pattern are retained as archive assets but are not used in the public design. No content changes. Existing FAQ backgrounds stay cream to avoid restructuring sections. Admin and public assistant remain unpatterned. Calendar events retain differentiated functional colours. Shared buttons retain geometry and adopt slate/mist/reverse and restrained brown shop accents. No full stylesheet refactor: existing layout rules are retained; palette and targeted surface rules are documented in brand.css/globals.css.

## Integration

Merge `Peninsula_v18_Update.patch` into the current repository against fd79ca7, preserving any subsequent changes made by the deployment agent. Only Site.tsx, brand.css, globals.css, AGENTS.md and this document change. No database migration, new credential, dependency or package-lock change.

Run `npm ci`, `npm test`, `npm run typecheck`, `npm run build` and deploy a protected preview. Review all six pages in EN/ES/FR on phone/tablet/desktop; verify headers, CTA hover/focus, pattern loading, text contrast, PWA, admin and enquiry assistant controls. The original hero video and watermark must be unchanged. Do not enable indexing or alter existing integration configuration as part of this visual update.

## Verification performed

All seven existing automated test suites passed using Node 22 and installed global TypeScript. Chromium visual checks rendered all 54 combinations (6 pages × 3 languages × widths 390/768/1440) without horizontal overflow, broken image elements or substitute SVG backgrounds. The visual harness uses transpiled Site.tsx and a local React 16 renderer, actual media embedded as data URLs, static video poster and a stubbed enquiry component; this is not a Next.js production build or live integration test. Full-page captures use production catalogue/community content (no fictional reviews or product mockups). Production build not verified: npm ci --offline failed because undici-types was not cached. Local HTTP browsing was blocked; embedded browser preview used instead. Review real device/assistant/admin and video playback on the deployed preview.
