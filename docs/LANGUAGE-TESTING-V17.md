# Península v1.7 — Spanish-first admin, public language choice and test diagnostics

Baseline: v1.6 development package (not a fresh export of the live repository). Merge against your deployed branch and preserve deployment fixes, environment variables and Supabase data. This release introduces no new dependencies or schema migrations. If upgrading directly from v1.5 or earlier, apply the outstanding migrations in the earlier handovers, including upgrade-v16.sql.

## Customer assistant
The EN / ES / FR segmented control appears at the top of the concierge modal and initially follows the public page language. Selecting a different language changes the interface, quick replies, future API prompts, approved FAQ responses and final message labels. Canonical dates, quantities, skill levels, group preference and existing notes are preserved. Known preset times and durations translate when switching; previously written free text and chat bubbles remain in their original language. The assistant explicitly understands all three languages, but replies in the selected one. Changing language does not submit, approve, restart or discard an enquiry. It is disabled while an API request is active or after a successful saved enquiry. Existing fallback and direct mode still work independently.

## Admin in Spanish
Spanish remains the initial/default admin language. English is an optional per-device testing preference. Everyday wording such as “Agregar a mi agenda”, “Cupos libres”, “Agendar reserva”, “Guardar en agenda” and “Habla o escribe” replaces more formal terminology. Private model instructions request concise, natural Dominican-friendly Spanish and recognise local expressions. Existing manual approval and authentication controls remain. The install hint follows the admin language. English remains available for every existing workflow; original customer messages and notes are not translated.

## PWA icon
The selected glossy blue rendering is used with presentation margins removed and Sea Mist (#CDD7DC) outside the rounded tile. Shading and logo tones are derived from the approved artwork and are not exact flat palette swatches. Assets: 192 and 512 px standard PNG, 180 px Apple touch icon, and separate 512 px maskable PNG. No private data caching added. Existing installations may retain an old icon until removed and re-added. The PWA remains online-only; native push notifications remain future work (v1.6 email alerts/reminders retained).

## Assistant diagnostic logs
Use a separate access-protected Vercel **preview** and test-only data/database or clearly segregated fictional records. Set server-only environment variables on that preview (redeploy to apply):

```env
SITE_INDEXABLE=false
PENINSULA_ASSISTANT_LOGGING=metadata
PENINSULA_SYNTHETIC_TEST_DATA=false
```

`metadata`: structured JSON in Vercel function logs (filter `peninsula-assistant`). Includes public language, conversation/reference IDs, turn count, model usage, intent, FAQ, readiness, missing fields, group offer, submission channel/status, email acceptance, private operation/proposal ID, validation result, revision/confirmation, transcription byte/character counts and status/errors. IDs link events; metadata does not include transcript text or contact fields. No custom logging database.

For detailed synthetic conversations only:

```env
PENINSULA_ASSISTANT_LOGGING=synthetic
PENINSULA_SYNTHETIC_TEST_DATA=true
```

This enables conversation inputs, model extracted fields, draft, final reply, private instructions, proposal data, transcription text and approved draft/extra message for debugging. These fields can contain whatever a tester types, so **never use real customers, private appointments, real notes or contact information in synthetic mode**. The flag is an operator assertion, not an automatic anonymizer. Use a protected preview; the code cannot verify your hosting access-protection settings. No raw recordings, request headers, secrets, API keys, email or phone fields are logged intentionally. The log system captures server-side diagnostics, not all browser actions, and cannot capture a WhatsApp send or actual email delivery beyond provider acceptance. Disable logging after tests and delete/export test logs per your retention policy. Diagnostics are forcibly off on indexable sites and Vercel production, regardless of flags. Normal production errors in the existing infrastructure remain unchanged. Configure provider budget and privacy settings separately.

## Acceptance tests
- Open public chat on EN, ES and FR pages; verify initial language. Switch mid-conversation after giving dates, group size and experience. Verify preserved fields and future responses in selected language. Test switch during review, language-specific confirmation, custom email message, and direct contact bypass. Confirm no automatic send on switching.
- Test public surf questions, pricing, advanced coaching and group suggestions in all three languages with real OpenAI. Confirm correct response tone and no invented facts. Test direct mode and OpenAI/database failure.
- Admin starts in Spanish on a clean device. Test add/modify/delete, note, calendar approval, spoken Spanish, `sí`, `dale`, `de una`, and conditional responses; English should still work. Confirm no write before approval. Test PWA installation on iPhone and Android and safe-area spacing. Verify private data is not cached.
- Enable metadata; check no transcript content. Enable synthetic only on protected preview with fictional data; confirm traces. Set off and verify no new trace records. Verify forced-off on production/indexable configuration.
- Run npm ci, npm test, npm run typecheck, npm run build. Unit and mocked API tests passed locally with global TypeScript; syntax check passed across 45 source files. Real API, full Next build and device/browser testing remain outstanding because project dependencies are unavailable in this environment. Do not deploy to production without those checks.
