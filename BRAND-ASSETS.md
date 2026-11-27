# Península Surf School | Website assets

Companion to `Peninsula_Website_Design_Standard.pdf` (kept separately). Prepared from the supplied ENTREGA FINAL.zip. This is an asset library, not a complete React application.

## Use in a React / TypeScript project

- Copy `public/brand/` into the project’s `public/brand/` directory. Reference assets by `/brand/logos/simplified-slate.png`, for example.
- Copy `src/styles/brand.css` into the project’s styles directory (for Next.js, use your chosen `app` or `src` structure), then import it once in the root layout or entry point.
- `asset-manifest.json` maps each exported graphic to its exact archive source and dimensions.
- Logos: five formats, slate and reverse cream. All transparent PNGs cropped to original artwork bounds; add clear space in CSS. Do not recolour or distort. The source exports' pixel colours differ slightly from the brand-sheet hex values; artwork colours are preserved and CSS uses the brand-sheet values.
- Patterns: five WebP colourways, sized for web; seamless repetition has not been verified. Use as full panels or test before tiling.
- Illustrations: surfboard, shaka, wave and palm. Badges 02 and 03 only. Do not use badges 06/07 or other inconsistent dates until the owner confirms EST. 2026 vs 2013.
- Favicon: square cream background with the original slate icon. No text or year added.

## Fonts — owner-supplied installation required

No font binaries are included. The original archive already contains the files below. Confirm web embedding rights with the owner/designer before deploying or adding to GitHub; no licence document was found in the supplied archive. After confirmation, run `python3 scripts/install-brand-fonts.py /path/to/original-fonts.zip --licensed` to install and activate the fonts. See `docs/REFINEMENTS-V26.md`.

| Source in original ZIP | Target filename |
| --- | --- |
| TIPOGRAFÍAS/SFC Bearwood/Web-PS/SFC Bearwood.woff2 | sfc-bearwood.woff2 |
| TIPOGRAFÍAS/SFC Woster Sans/Web-PS/SFC Woster Sans.woff2 | sfc-woster-sans.woff2 |
| TIPOGRAFÍAS/Aciella Script Italic.otf | aciella-script-italic.otf |

Use fallback fonts until then. Test Spanish punctuation, especially ¿ and ¡ in Woster Sans. Use body text in system-ui.

## Media and launch

No genuine lesson photos or videos have been supplied in the brand ZIP; it contains mockups. Do not present mockups as the real school. Add owner-approved photography, video posters and compressed videos separately. Keep raw video masters outside Git; use a media host or object storage when appropriate. Confirm permission to publish any identifiable people in photos/videos. Confirm business WhatsApp number, lesson types, prices, location, and language(s). Use a WhatsApp inquiry link with a prefilled message; the owner confirms the booking. No booking backend or actual contact credentials included.

Keep the full original archive offline as the source/master library.
