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
