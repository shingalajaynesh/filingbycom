# CA Frontend

React + Vite frontend for the CA website, with Supabase ready for BaaS integration.

## Setup

1. Add your Supabase project values to `.env`:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

2. Import the shared client from `src/lib/supabaseClient.js` in the feature that needs database access.

## Scripts

- `npm run dev` starts the local dev server.
- `npm run build` creates a production build.
- `npm run lint` runs ESLint.
