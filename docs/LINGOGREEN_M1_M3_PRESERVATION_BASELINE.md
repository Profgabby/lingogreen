# LingoGreen M1–M3 preservation baseline and execution register
Status: audit complete at repository-inventory level; deployment recovery BLOCKED by no-touch boundary; M3 pending.
Source: canonical Profgabby/lingogreen main @ 17be11045755cf18e4314119ecb5b782e23fb371.
Canonical Vercel project: prj_cCJkY0Ju1PYbLbvauJx3rPiBISZn.
## Frozen boundaries
- Do not modify AgriShine code, routes, database, content, deployment, or integrations. Legacy AgriShine-named routes found inside this repository are explicitly read-only.
- Do not change quiz question text, options, keys, categories, IDs, scoring, badges, progress or attempt records without separate review and approval.
- Preserve all existing routes and records. No production deployment, merge or database migration without approval.
## M1A route and asset baseline
- 17 Next.js page routes: /, /login, /hub/fr, and 14 routes under /hub/fr/agrishine.
- No /hub/en route exists on main. Homepage defines 8 languages: fr enabled; en, ha, yo, ig, de, ar, es disabled. Arabic has RTL metadata.
- 60 story-data TypeScript files; 84 vocabulary-data TypeScript files; 18 quiz question-bank files (9 knowledge, 9 language), covering Primary 1–6 and JSS 1–3. 108 lesson JPGs. File counts are NOT validated story/question counts.
- Authentication via Supabase auth; profile lookup, enrolments, gardens, garden_types, quiz_attempts are referenced by application code. Actual schemas, RLS and row counts NOT verified.
- Story reader has chapter navigation, text-to-speech, chapter questions and client-side scoring. Quiz dashboard reads quiz_attempts for signed-in user. Production functionality NOT verified.
## M1B build diagnosis
- Main production dpl_2FTsBHwk5tbxEv5fHPNQNZ5TF2UX ERROR: Next.js prerender useSearchParams without Suspense at /hub/fr/agrishine/coming-soon.
- Preview dpl_BikJMb6pHp4kMcg67TzM1ur2nfwA ERROR: same failure class at /hub/fr/agrishine/teacher/teach after a separate draft PR changed the earlier route.
- Both failures occur in paths protected by the user's explicit no-touch AgriShine instruction. No edits to those files, no bypass, no deletion, no merge. Build not recovered; preview READY not verified.
- Earlier production dpl_Ejx7KzT4xSMQ2amkZ5xR1U3xVhfy READY at older commit 97d8a8687d36708ffdfa29ad70fc97cb7181c371; not a substitute for current build.
- Existing draft PR #1 must remain unmerged and excluded from this branch.
## M2 findings and non-destructive checks
- English and French interface translations exist, but English hub is inactive and lacks /hub/en.
- French learning hub routes exist, but underlying story data is English canonical. French vocabulary overrides exist for GrowMeal only (12 class files); other vocabulary can fall back to English.
- Sample vocab-gmeal-primary-1-fr contains mixed English/French definitions and generic placeholders. Sample story-gmeal-primary-1 repeats comprehension templates across chapters. Preserve source and log proposed edits separately.
- Quiz question-bank audit should calculate exact and normalized duplicates by class/category/language, distinguish intentional reinforcement from accidental duplication, and inspect answer keys. Do not edit banks automatically.
- Test auth, navigation, story load, scoring, attempts, badges, role access, RLS and parent isolation in staging with synthetic users; no real child records for testing.
## M3 implementation design (not implemented)
- Add independent English and French hubs only after recovery boundary resolution, reusing shared LingoGreen components while preserving all existing routes, IDs and 8 language slugs.
- Separate interface locale from target learning language; avoid silent English fallback in published French lessons; provide explicit incomplete status.
- Keep quiz banks untouched. Add parent-managed subscriptions only in later milestone.
## Acceptance gates
1. No changes to protected paths or quiz files.
2. A full Next.js build passes; preview reaches READY.
3. Existing routes/auth/quiz/story workflows pass regression tests.
4. Both EN and FR have independently functioning learner pathways.
5. User approves any merge, production release or DB migration.

## M1B verified preview results (2026-10-09)
- Preview deployment dpl_D2T943PAk7TEQdEA8ukt7zhwVgfo, commit dc5b2c4793c1d0aa20cb00279454418faa228265: READY; build logs confirm static generation 10/10 and deployment completed.
- Exactly two legacy routes were minimally wrapped in React Suspense: coming-soon and teacher/teach. Existing inner component behavior preserved. No quiz banks, stories, database code or external AgriShine project changed.
- Read-only preview HTTP smoke checks: / => 200, /hub/fr => 200, /hub/fr/agrishine/coming-soon?role=teacher => 200, /hub/fr/agrishine/teacher/teach => 200, /hub/en => 404 (expected because English hub not yet implemented). /login fetch blocked by tool safety checks; NOT validated.
- HTTP 200 for authenticated client-side pages is not proof of successful authentication, hydration or learner flow.
- Still unverified: login, auth redirects, student/teacher/school enrolment, story reader interactions, quizzes, score persistence, badges, Supabase RLS and child-account isolation.
- M1 build gate passed. M1 runtime/regression gate pending. M3 English hub remains unimplemented and must not be advertised as live.

## M2 learner-workflow source audit and regression matrix (2026-10-09)
Source-inspected routes: quiz/[class], language/[category], knowledge/[category], quiz dashboard, storybooks and login.
- Both quiz engines shuffle question order and answer options with tracked correct index; their code attempts Supabase quiz_attempts inserts. No edits to question banks or engines made.
- Quiz dashboard reads quiz_attempts and computes per-category best scores. Verify DB RLS, saved attempt visibility, badge consistency and class-specific category mapping using synthetic test accounts.
- Storybook reader computes chapter-question correctness in client-side state; do NOT infer this is persisted to quiz_attempts.
- Authentication checks appear in quiz routes and storybook reader; login success and role/record isolation not tested in browser.
### Required manual browser checks on preview (synthetic accounts only)
1. Sign in with authorized synthetic learner, verify homepage and French hub render; sign out and verify protected routes redirect.
2. Select class Primary 1; visit both quiz category selectors. Verify displayed categories and question counts match expected baseline.
3. For one knowledge and one language quiz, record question IDs and correct-option index before and after shuffle; check scores, feedback, retry and completion without changing content.
4. Verify each finished attempt appears exactly once in dashboard, correct class/category/type, accurate score, badge and signed-in user ID; check error handling when insert fails.
5. Open storybooks for a supported class/garden; navigate chapters, answer comprehension questions, confirm local score and browser TTS. Test unsupported content empty states.
6. With separate learner accounts, verify quiz_attempts are not readable or writable across users; validate RLS in Supabase, including direct API attempts in controlled test environment.
7. Test teacher and school navigation and role authorization; do not create real child accounts.
8. Confirm mobile and keyboard navigation, loading/error states, and that all eight language cards remain visible while English is inactive.
### Gate status
- Build/preview READY: PASS.
- Unauthenticated HTTP smoke checks: partial PASS.
- Authenticated browser E2E: NOT RUN.
- Supabase RLS / DB writes: NOT RUN.
- Question-bank duplicate audit: NOT YET EXECUTED; no content edits authorized.
- English hub: NOT IMPLEMENTED.

## M2 live Supabase read-only verification (2026-10-09)
- Verified distinct Supabase project named lingogreen, ref vueswsveabqkqjgdhxgo; no queries against AgriShine.
- quiz_attempts has RLS enabled. SELECT policy authenticated with auth.uid() = user_id; INSERT WITH CHECK authenticated with auth.uid() = user_id; no UPDATE or DELETE policy found.
- Existing quiz_attempts: 11 records across 3 learner IDs (8 knowledge, 3 language). No invalid numeric ranges found for score/correct/completed/total/accuracy in this limited consistency check.
- Existing rows demonstrate historical writes, not proof of present preview browser submission. No user identities or answers disclosed.
- No synthetic auth accounts created, no new attempts inserted, and no actual cross-user RLS probe executed. Runtime end-to-end and cross-account isolation remain UNVERIFIED.
- Do not use service-role/admin SQL results as evidence that JWT-scoped client RLS works; test with two synthetic authenticated sessions and confirm forbidden cross-user SELECT/INSERT.
- No production promotion, schema migration or question-bank modifications.
