# v2.6 – small public-facing refinements

Baseline: v2.5. No DB migration or new npm dependency. Preserve all existing deployment fixes and secrets.

## Font activation (required to display the real fonts)
The old CSS contained only commented-out @font-face declarations. This release imports `src/styles/fonts.local.css`, which is intentionally empty until fonts are provisioned. The supplied TIPOGRAFÍAS ZIP has web WOFF2 files for Bearwood and Woster Sans and an OTF for Aciella. Woster Sans lacks inverted Spanish punctuation, which falls back to system-ui. Body text remains system-ui as specified in the design standard. Aciella is available for approved decorative use, not forced onto body text.

After confirming web embedding/deployment rights with the owner/designer, run from the repository root with the original ZIP supplied by the owner:

```
python3 scripts/install-brand-fonts.py "/path/to/TIPOGRAFIAS.zip" --licensed
```

Use the actual ZIP filename. The script copies only the necessary three binaries to `public/brand/fonts/` and activates the CSS. No fonts are bundled in this handover. Ensure the build environment has the generated CSS and assets; the current gitignore excludes the font directory. If the license permits a private repo deployment, explicitly add the approved files there, otherwise provision them securely before `next build`. Do not publish font binaries in a public repository without permission. Verify `document.fonts.check('16px "SFC Bearwood"')` and `document.fonts.check('16px "SFC Woster Sans"')` after loading, and verify the Network panel and computed/rendered fonts. Check heading wrapping at mobile widths in all three languages.

## Autoplay
Native autoplay, muted, playsInline, loop, preload=auto and a client-side play attempt with readiness/visibility retries until first playback. Both MP4 assets are already H.264/yuv420p without audio. Manual pause is respected; reduced-motion visitors are paused on hydration and can play manually. Browser or OS restrictions (Safari site preference, low power mode) cannot be overridden; existing play button remains available. Test iPhone and Mac Safari with autoplay allowed/blocked, Chrome, and reduced-motion, and verify byte-range delivery. No video recompression or asset replacement.

## Concierge
Natural concise prompt in all three languages; a narrow server-side prefix filter removes canned acknowledgements from model follow-up text only, not from user details. Original transparent brand stickers are used selectively in the header (shaka or board/surfer depending on context) and review (wave). No forced emoji in every message. Existing policies, privacy, review and handoff remain. Test live English/Spanish/French conversations for direct, short questions without repetitive openers.

## Homepage
Three inline Learn More links replace the three individual experience enquiry buttons; one full-width Book your experience now! button under Surf Lessons opens the general assistant (index 0), so all three experiences remain selectable. The rental card action is unchanged. Clothing caption is Sea Mist (#CDD7DC) with dark slate (#56656E), white on hover/focus; the upper artwork is unchanged.

Run npm ci, npm test, npm run typecheck, npm run build and test a protected preview before merging. Verify phone/tablet/desktop layouts, real Safari autoplay, and live OpenAI behaviour. No change to database or API credentials.
