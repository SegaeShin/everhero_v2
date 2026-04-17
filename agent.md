# agent.md

## Project definition

EverHero is a DC retirement pension management platform demo. The primary target user is a retirement pension operator at a company of roughly 500 employees. The product should help that user understand company-wide status, identify which employees need attention first, review explainable diagnosis results, and prepare reporting or consultation support materials.

## Implemented routes

- `/` dashboard
- `/employees` employee management
- `/employees/[id]` employee detail
- `/diagnosis` diagnosis
- `/compliance` compliance demo
- `/simulation` retirement simulator

## Product direction

- keep the interface product-like and operational, not like an internal prototype
- prioritize practical workflows over decorative complexity
- show why a score or risk flag was produced, not only the result
- design for Korean-language pension operations and reporting contexts

## UX priorities

1. Let the operator grasp company-wide status quickly.
2. Help them find the employees that need follow-up first.
3. Make the reason for concern easy to understand and explain.
4. Support internal reporting and employee-facing guidance.

## Data principles

- app data access should go through `lib/data.ts`
- Supabase is the primary source when configured
- mock data remains as a fallback for development and demos
- avoid wiring UI components directly to `lib/mock-data.ts` unless there is a clear reason

## Supabase-related files

- `lib/supabase.ts`
- `lib/data.ts`
- `supabase/schema.sql`
- `supabase/seed.sql`
- `scripts/generate-supabase-seed.mjs`

## Development rules

- prefer readable implementation over premature abstraction
- preserve TypeScript safety
- keep UI copy in Korean where it is user-facing
- avoid overstating unimplemented AI capabilities
- treat the service as an operations tool first, not an investment advisory tool

## Build and deployment notes

- local dev output: `.next`
- local build output: `.next-build`
- Vercel deployment uses the default `.next`

Keep the current build separation intact to avoid repeating the previous Next.js output collision issue.

## Documentation rule

Keep repository documentation aligned with the actual implemented state. Remove outdated planning labels from docs when the UI no longer uses them, and never commit secrets into repository-tracked files.
