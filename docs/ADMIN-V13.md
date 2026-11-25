# Península v1.3 — bilingual admin and testing reset

This release extends v1.2, preserving the public website and concierge. No new database migration is required. Read ADMIN-ASSISTANT-V12.md, CONCIERGE-V11.md and .env.example for full configuration.

## Admin
- English / Español switch on login and all three tabs. Preference is stored on that browser. Spanish remains the initial default in the Next.js application. Calendar dates, UI controls, assistant replies/proposal labels and dictation language follow the selection. Existing customer messages and owner-entered notes stay in their original language, not machine-translated. Switching languages starts a new private assistant conversation and discards the unsaved proposal; saved data remains unchanged.
- English assistant example: `Add a lesson tomorrow from 09:00 to 11:00 for 4 people`. Confirm by typing `Confirm` or pressing Confirm change. Spanish continues to accept `Confirmar`. Live model language is passed to the private endpoint; the transcription request uses the selected language. Demo parser is limited to simple date/time commands; no AI connection.
- In demo mode, Settings > Factory reset (empty) clears fictional blocks, enquiries, recurring hours and current open assistant/editor state. The blank state persists in local browser storage. Login and language preference are retained. Restore sample data repopulates examples. Both require confirmation.
- These reset actions are client-only and never available on the real database admin screen. Demo mode remains disabled for Vercel production/indexable deployments. Do not expose real customer data to a demo.
- For integration testing using actual Supabase, use a dedicated disposable staging project (or a prelaunch Península-only project containing ONLY test records). The reset procedure below is agent-only; never automate it against production or QuoteCore+.

## Test database cleanup (not an app route)
After testing and before accepting real enquiries: disable incoming traffic; verify the exact dedicated Península project ref, verify all records are fictional, export any needed test data, and run this explicit transaction in the Supabase SQL editor. Stop if there are real customer records. It deletes application test data, not users, schema, functions, grants or keys. Rate counters are deliberately left intact so abuse limits cannot be bypassed.

```sql
begin;
 delete from public.admin_proposals;
 delete from public.enquiries;
 delete from public.calendar_blocks;
 delete from public.operating_hours;
commit;
```
Then set working hours and verify zero enquiries/events. Keep production cleanup individual and deliberate; there is no public or live factory-reset API.

## Public concierge (unchanged from v1.2)
The main `Site.tsx` booking CTAs open `Enquiry.tsx` on the hydrated Next.js app. Static HTML previews use direct WhatsApp links instead. Public `/api/concierge` calls OpenAI structured extraction, then application rules ask missing questions and query only owner-approved group availability. It requires the dedicated Supabase credentials, migrations and OpenAI key. `/api/concierge/submit` validates the approved message and saves it to the inbox, then returns current reply status and the exact WhatsApp text. User presses Send in WhatsApp; we cannot confirm delivery. Non-WhatsApp customers must give email or international phone. Manual form and direct WhatsApp alternatives remain available. Full assistant is not active in credential-free demo mode.

## Acceptance tests
- Run npm test, npm run typecheck, npm run build (Node 22), commit generated lockfile. Unit tests include bilingual demo instructions, translated proposals, empty reset and restore.
- On protected preview, test English/Spanish switch from login and each tab, create/confirm/discard/delete a fictional event, reset, reload, restore examples, change settings and verify no real DB write. Test phone/tablet/laptop widths.
- Configure live Supabase/OpenAI in protected staging, disable demo, verify owner-only auth, both languages, microphone recording and typed confirmation. Confirm stale/replayed proposals do not mutate the schedule twice. Test actual public EN/ES/FR flow from each service, no-WhatsApp contact, exact-message approval, group eligibility, inbox persistence and WhatsApp handoff. Test missing credentials, rate limits and fallback form. Never claim a WhatsApp message was sent solely because a link was opened.
- Unit tests and source transpilation checks passed here. Full production build and live integrations not verified; browser navigation was blocked in this environment, so v1.3 standalone preview has syntax checks only.
