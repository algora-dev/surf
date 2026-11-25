# Península Surf School — website v0.9

Initial Next.js App Router / React / TypeScript website, using the supplied brand asset pack and legacy site's photographs and video. No price tables, checkout, booking backend, tracking, fake inventory or invented reviews. The WhatsApp conversation is an enquiry, not a confirmed booking.

## Run locally

Install Node 20.9+ (Node 22 LTS recommended). From this folder:

```sh
npm install
npm run dev
```

Open http://localhost:3000 (redirects to /en). Before deployment run:

```sh
npm run typecheck
npm run build
npm start
```

Dependency installation and Next.js build could not be run in the authoring environment because npm registry DNS/network access was unavailable. The standalone HTML preview was transpiled from the same Site component and content modules, tested in Chromium using an embedded React runtime, and is separate from the production dependency versions. It uses hash navigation instead of the Next.js URL routes. The preview includes its own image and video data, so no server is required. It is not a production bundle.

## GitHub and Vercel

1. Extract the ZIP, open this directory in your editor, install dependencies and run the checks above.
2. Create a GitHub repository and commit the project including the generated package-lock.json; do not commit node_modules or .next. Example: `git init`, `git add .`, `git commit -m "Initial Peninsula website"`, `git branch -M main`, `git remote add origin <repository-url>`, `git push -u origin main`.
3. Import the repository into Vercel, select Next.js and use its standard build settings. Set NEXT_PUBLIC_SITE_URL to the final https origin to enable canonical and hreflang metadata. Leave it unset until you know the origin. Verify all nine locale/page combinations on the preview deployment.

## Content and design

- `src/lib/content.ts`: all English, Spanish and French copy, translated WhatsApp messages, route mapping and business contacts. Confirm the phone, email, Instagram handles, establishment year and biography with Cristian. Phone links use the original site number and never automatically send messages.
- `src/lib/catalogue.ts`: empty typed product and verified review collections. Add confirmed entries and translate all three languages. Catalogues currently show enquiry panels, not invented inventory. The Reviews section follows Surf with us; only the standalone preview shows clearly marked empty story slots until real stories are supplied. Production displays the Instagram link, not dummy reviews.
- `src/components/Site.tsx`: reusable site sections, navigation, hero, gallery, catalogue and WhatsApp helper. The standalone HTML renders the same sections.
- `src/styles/brand.css`: official palette and font tokens; `globals.css`: responsive layout and interactions.
- `public/brand`: supplied brand artwork; `public/media`: WebP-optimised legacy photos and the existing 5.4 MB video. Original visual credits/watermarks are retained. Confirm permission to publish media. Only one video was supplied; a second can be integrated when provided.
- `BRAND-ASSETS.md` and `asset-manifest.json`: asset provenance and original names.

Routes: /en, /en/surfboards, /en/clothing; /es, /es/tablas, /es/ropa; /fr, /fr/planches, /fr/vetements. The locale switcher preserves the page type. Default is English. Each page has a native language attribute and page-specific metadata.

## Fonts and launch checklist

This version uses fallback Georgia and system sans-serif for text, and the original logo artwork. Font binaries are intentionally not included. If the school has appropriate webfont licensing, copy the original SFC Bearwood WOFF2, SFC Woster Sans WOFF2, and Aciella Script Italic OTF into `public/brand/fonts` on your own machine, using the filenames in `brand.css`. Enable the commented @font-face declarations, review Spanish/French glyph coverage and font layout, and decide how to deliver the licensed fonts to Vercel. The fonts folder is gitignored by default; only adjust that if the licence permits your intended repository/deployment use.

Before public launch: approve the translations, confirm WhatsApp details and instructor/service content, confirm teaching locations, get actual product listings and reviews, confirm media rights and the establishment year, add reviewed localized privacy/terms pages (not ported from the old website because they need updating), install and test licensed fonts, provide final videos and check page metadata, contrast, keyboard navigation, performance, and real-device video playback. No live website has been deployed.

Version 0.3: logo-only hero with one translated line, reduced homepage copy, rounded 10px UI and photos, 1200px content width, retained patterned founder and closing CTA.

Version 0.4: Ocean Slate header, 50% background opacity on scroll, 25% larger header logo and primary navigation; updated hero text in EN/ES/FR. Header heights unchanged.

Version 0.5: slate-led text and buttons (exact Ocean Slate for larger titles, darker slate ink/action variants for contrast), Sea Mist hover, and an Instagram story reviews section directly after the services.

To add stories: save permission-cleared 9:16 screenshots or exported images as WebP/JPEG in `public/media/reviews/`. Add records to `reviews` in `src/lib/catalogue.ts` with a unique id, contributor display name (with permission), image path, translated alt text including readable review content, optional translated caption, and optional durable source URL. Do not use expiring story URLs as image sources or invent ratings. Retain the original wording and obtain permission before publishing names/photos.

Version 0.6: original olive wave pattern for the founder, full-width earth brown location band with cream text, and Spanish-first offline preview with functional language links. Production routes remain /en, /es, /fr.

## v0.7
All three locales include the updated services, Samaná location FAQ and cost FAQ with WhatsApp contact. Shop pages are structured into purchase, rental and clothing catalogues; add confirmed translated records in `src/lib/catalogue.ts` (optional details and availability fields). The offline previews display original brand-kit mockups labelled as concepts, not actual inventory. The production React pages omit the mockups and unconfirmed items, showing enquiry sections until actual products are added. Before publication, verify all details, inventory, font licensing and the Next.js production build.

## v0.8 review and deployment gate
Playa Bonita, Las Terrenas is the confirmed base; other Samaná surf spots depend on group size, level and conditions. FAQ, location band, footer and metadata updated in EN/ES/FR. Shop copy and footer actions polished; empty reviews show a community link until permission-cleared stories arrive. Preview-only merchandise concepts and stock are not published in production. Original hero.mp4 verified byte-identical to legacy Video.mp4 (18.74 s, 1280×720, 5,369,978 bytes). The hero video includes an audio track but is muted by the site. Keep it in public/media; no separate video hosting required initially.

Before GitHub/Vercel: run npm install, npm run typecheck and npm run build, commit package-lock.json, use Node 22, confirm contact details, verify media and font licences, review legal/privacy pages and install official fonts only if licensed. Check preview deployment on an actual iPhone and Android, and verify WhatsApp links. Never publish demo inventory or reviews.

## v0.9 final handover

The homepage logo and supporting text remain fully opaque for the first second, then fade together to 50% opacity over 800ms. They remain at 50% opacity for the rest of the page view, rather than fading on each video loop. The video, overlay and controls retain their existing appearance. This CSS-only effect is shared by all three languages; users with reduced-motion preferences retain the full-opacity logo and text. No layout or content changes from the approved v0.8 pages.

For the deployment agent: see AGENTS.md for the exact preflight and GitHub/Vercel steps. This archive contains source and runtime media, not a compiled Next.js output. Generate the package lock on a network-enabled machine and commit it after verification. The font binaries are not included and no real catalogue inventory or reviews have been supplied. Do not deploy publicly until the outstanding checks are approved.

## v1.0 update

This is the new enquiry / SEO development candidate. The previous v0.9 instructions below describe the approved visual baseline; the authoritative deployment and database instructions are now in [docs/BOOKING-SETUP.md](docs/BOOKING-SETUP.md) and [AGENTS.md](AGENTS.md). Do not enable public indexing or enquiries until the agent verifies production build, authentication, database, privacy and workflow.

## v1.1 handover (supersedes v1.0 enquiry/admin setup)
Read `docs/CONCIERGE-V11.md` first. Dedicated Supabase only; run `supabase/schema.sql` followed by `supabase/upgrade-v11.sql` before configuring the preview. The new conversational assistant requires server-side OpenAI credentials; fallback form and direct WhatsApp remain. Use `npm test` (Node 22) for booking and concierge rule tests. `npm run typecheck` and `npm run build` must pass on the deployment agent's machine. Preserve the approved public design. No direct WhatsApp sending, no customer booking promises, and no shared QuoteCore+ database. The new README section and CONCIERGE-V11 take precedence over earlier v1.0 instructions.

## v1.2 owner calendar assistant (current release)

Start with `docs/ADMIN-ASSISTANT-V12.md` (authoritative new demo, deployment, guardrails and acceptance tests). `/admin` supports a credential-free, explicitly enabled local/protected-preview demo with fictional browser-local data. Set `PENINSULA_DEMO_MODE=true` and `SITE_INDEXABLE=false`, then click Entrar (demo). Production requires real owner authentication. For live mode apply `supabase/upgrade-v12.sql` after the v1.1 migration. The owner assistant accepts typed and recorded Spanish instructions, transcribes to editable text and prepares a single validated change for explicit human confirmation; it cannot write without a server-held proposal and authenticated confirmation. Public website design, SEO pages and enquiry workflow remain v1.1. Do not deploy live or index until integration tests pass.
