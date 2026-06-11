# CA Frontend

React + Vite frontend for the CA website, with Clerk handling authentication and the backend syncing user records into MongoDB.

## Setup

1. Add your Clerk and backend values to `.env`:

```env
VITE_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
VITE_BACKEND_URL=http://localhost:3000
```

2. Clerk handles sign-in and sign-up in the UI, while authenticated requests sync to the backend `/register` endpoint to persist user profiles in MongoDB.

## Scripts

- `npm run dev` starts the local dev server.
- `npm run build` creates a production build.
- `npm run lint` runs ESLint.
