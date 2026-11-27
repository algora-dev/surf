# v1.9 homepage refinements
Baseline: v1.8, based on fd79ca7. Preserve deployed fixes when merging.
- Service cards reserve equal action rows on desktop/tablet; mobile uses natural stacked layout.
- Three clearly marked Instagram story placeholders are shown on the live homepage, automatically replaced by approved records in src/lib/catalogue.ts. No fabricated reviews. Add permission-cleared stories and localized alt text there.
- Community and footer Instagram links point to the school; founder link remains personal.
- Location heading and copy cover Las Terrenas, Playa Bonita, Cosón and the Samaná Peninsula in EN/ES/FR.
No new dependencies or migrations. Existing seven unit suites passed. Standalone component rendering checked all three homepage languages at 390, 768 and 1440 px, including button alignment, image loading and link destinations. Full Next.js build and live integrations not verified here; run npm ci, npm test, npm run typecheck, npm run build before deployment.
