# EverHero

EverHero is a Korean-language demo product for managing DC retirement pension operations. It is designed around the day-to-day workflow of a retirement pension administrator at a mid-sized company, with an emphasis on spotting risk quickly, understanding why a portfolio needs attention, and preparing for internal reporting or employee guidance.

## Product scope

Current pages:

- `/` dashboard
- `/employees` employee management
- `/employees/[id]` employee detail
- `/diagnosis` individual and company diagnosis
- `/compliance` compliance demo
- `/simulation` retirement simulator

Current implementation focus:

- operating dashboard for company-wide visibility
- employee prioritization and filtering
- rule-based diagnosis with explainable outputs
- retirement scenario simulation
- Supabase-backed employee data with mock-data fallback

## Tech stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Supabase JavaScript SDK

## Data flow

The app reads data through `lib/data.ts`.

Priority:

1. Supabase data when environment variables are configured and queries succeed
2. Local mock data as fallback

This allows the app to run both before and after database connection.

## Supabase setup

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-key
```

Then run the SQL files in this order from Supabase SQL Editor:

1. `supabase/schema.sql`
2. `supabase/seed.sql`

If mock data changes, regenerate the seed file with:

```bash
npm run db:seed:generate
```

## Local development

```bash
npm install
npm run dev
```

## Build stability note

To avoid conflicts between local development and production builds:

- `next dev` uses `.next`
- local `build` / `start` use `.next-build`
- Vercel uses the default `.next` output during deployment

This behavior is handled by `scripts/run-build.mjs`.

## Documentation note

Project-specific working notes may also exist outside the repository. Do not commit secrets such as database passwords, secret keys, or service-role credentials into this repository.
