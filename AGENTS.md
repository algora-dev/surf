# Península Surf School — agent handover (v0.9)

## Goal
Deploy the approved multilingual Next.js App Router website to GitHub and Vercel, initially as a preview. Preserve the design and copy from v0.8 plus the v0.9 hero watermark effect. No redesign is requested.

## Preflight
- Use Node.js 22 LTS (see package.json for the minimum supported version). Extract the archive so package.json is at the repository root.
- Run `npm install`, `npm run typecheck`, `npm run build`. Resolve any actual build or dependency issues before pushing; do not assume the HTML preview is proof of a Next.js production build. Review security advisories and use supported patched dependency versions. Commit the generated `package-lock.json`.
- Run `npm start` and check the root redirect, all nine routes, native language attributes, the language switcher preserving page type, mobile menu, section anchors, WhatsApp links, FAQs, and media loading.
- Hero: verify that the logo and supporting text are at 100% opacity for 1 second, ease to 50% over 800ms, and stay there. The original video is in `public/media/hero.mp4`, muted and looping. Reduced-motion visitors retain fully opaque hero content. Test on mobile Safari and Chrome as well as desktop.
- No environment secrets or database required. `NEXT_PUBLIC_SITE_URL` is optional; set it to the confirmed final HTTPS origin, not the placeholder in `.env.example`, when ready for canonical/hreflang tags.

## Repository and deployment
1. Create or select the owner's GitHub repository. Do not overwrite an existing repo or change DNS without authorization.
2. Commit the verified source, media, configuration, and lockfile. Do not commit `node_modules`, `.next`, local `.env` files, or unlicensed font files. See `.gitignore`.
3. Push the main branch or agreed preview branch. Import into Vercel, choose the Next.js framework preset, root directory `.`, Node.js 22, and standard install/build settings. Leave output directory on the framework default. Do not use the standalone HTML as the deployment target.
4. Deploy to a protected preview when available; verify nine URLs and share the preview link for owner approval. Do not connect the public domain until approved.

## Routes
- English: `/en`, `/en/surfboards`, `/en/clothing`
- Spanish: `/es`, `/es/tablas`, `/es/ropa`
- French: `/fr`, `/fr/planches`, `/fr/vetements`

## Content to preserve / outstanding approvals
- Base: Playa Bonita, Las Terrenas; lessons may take place elsewhere in Samaná depending on group size, level and conditions.
- No published prices or checkout; enquiries go to Cristian via WhatsApp. Confirm phone, email and social links in `src/lib/content.ts` before public launch.
- Real reviews and inventory go in `src/lib/catalogue.ts`; keep demo items and review placeholders out of production. Obtain permission for Instagram screenshots and media; verify the conflicting establishment year. Review translations and legal/privacy requirements.
- Brand colours, patterns, spacing and rounded corners: `src/styles/brand.css` and `src/styles/globals.css`. See `BRAND-ASSETS.md` and `asset-manifest.json`. Official font files remain excluded pending webfont licensing; fallback typefaces are active. See README for installation guidance if licensed.
- The supplied video and site imagery are bundled. A second video is not included because it was not supplied.

## Verification status
Source was updated from the approved v0.8 archive. Full npm dependency install, TypeScript check and Next.js production build still require verification on a network-enabled machine. The hero effect is a shared CSS rule with no new dependencies.
