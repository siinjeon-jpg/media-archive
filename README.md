# Aftertaste Archive

A personal media tracking app built with Next.js, React, Tailwind CSS, and Supabase.

## Included

- Personal taste archive homepage with a card-based editorial layout
- Archive page with search and filters for category, status, tag, and minimum rating
- Dashboard with counts, top tags, country breakdown, and monthly stats
- Wishlist page powered by a dedicated `is_wishlist` boolean
- Detail pages for each entry
- Add, edit, and delete flows via Next.js Server Actions
- Supabase auth with email magic links
- Supabase SQL migration and seed script
- Seeded sample fallback when Supabase is not configured or the database is empty

## Stack

- Next.js App Router
- React
- Tailwind CSS
- Supabase auth and database
- TypeScript

## Local setup

1. Install Node.js 18.17+.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Fill in:
   - `NEXT_PUBLIC_SITE_URL`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Create a Supabase project.
6. Run the SQL in [supabase/migrations/20260407_create_media_entries.sql](/Users/haoni/Documents/media-archive/supabase/migrations/20260407_create_media_entries.sql).
7. Sign in once so your Supabase project has a user.
8. Run the SQL in [supabase/seed.sql](/Users/haoni/Documents/media-archive/supabase/seed.sql) to load sample entries into the first auth user.
9. Start the app with `npm run dev`.

## `.env.local`

Create `.env.local` in the project root with:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Data model

Each entry stores:

- title
- category
- status
- rating
- one-line review
- detailed memo
- genres/tags
- country
- watched/read date
- wishlist boolean

## Notes

- The app falls back to seeded sample data when Supabase env vars are missing or the user is not signed in.
- If a signed-in user has an empty database, the UI still shows polished sample entries until the first real item is added.
- Write actions are intentionally disabled in demo mode.
- Sample entries shown from the starter archive are read-only; create your own first entry to switch to live records.
