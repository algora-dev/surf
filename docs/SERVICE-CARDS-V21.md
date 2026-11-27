# Península v2.1 — service navigation and lesson photos

Baseline: v2.0. Merge into the live repository preserving deployment-specific changes. No database migration, new dependencies, API configuration or admin changes.

- Homepage: four service cards; images and headings link to localized beginner, coaching, guided and rental pages. First three enquiry buttons keep their service-specific enquiry index. Rental button links directly to the rental landing page. Desktop four columns, tablet two, mobile one. The shop board tile promotes sales and links to the catalogue sale anchor; the catalogue still supports rental.
- Guided trips: previous guided card lacked a dedicated page. Added localized routes `/en/guided-surf-trips`, `/es/excursiones-surf`, `/fr/sorties-surf-guidees`; metadata, hreflang, sitemap and service structured data follow existing logic. No published guarantees, rates or fixed itinerary. Total 21 public pages.
- Beginner carousel: original instruction photo first; seven newly supplied photos plus other two homepage gallery photos = ten unique frames. 5.5 s interval, 550 ms opacity transition, stable 4:3 frame; landscape cover, portrait contain. Manual arrows wrap and pause autoplay; play resumes. Reduced-motion preference disables automatic advance initially; hidden document pauses timer. Controls and alt text localized. New images optimized, max 1600px, no retouching. Confirm publication permission for all supplied photographs, particularly those depicting children.

## Acceptance
Run `npm ci`, `npm test`, `npm run typecheck`, `npm run build`. Verify four cards and matching clickable photo/title routes across languages; rental CTA and sales anchor; all 10 images; slide advance, wrap, pause and reduced motion; no frame shifts; hero/header/assistant behavior unchanged. Rendering harness is not a production Next.js build.
