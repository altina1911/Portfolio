# Portfolio CMS

A server-rendered portfolio CMS starter built with Next.js, TypeScript, Tailwind CSS, and Node.js route handlers. It is ready to deploy on Vercel.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

Routes:

- `/` is the public server-rendered portfolio.
- `/dashboard` is the CMS dashboard shell.
- `/api/profile` exposes profile content with `GET` and `PUT`.
- `/api/projects` exposes project content with `GET` and `POST`.
- `/api/projects/[id]` exposes single-project `GET`, `PUT`, and `DELETE`.

The storage layer uses Supabase in production when environment variables are present, with an in-memory fallback for local development.

## Supabase Setup

1. Open the Supabase SQL Editor for your project.
2. Run the SQL in `supabase/schema.sql`.
3. Add these environment variables locally and in Vercel:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://oqoydxxihnkvruksskzc.supabase.co
SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

For a private CMS, prefer `SUPABASE_SERVICE_ROLE_KEY` instead of a publishable key and protect the dashboard with authentication. This starter accepts `SUPABASE_PUBLISHABLE_KEY` for simple deployments.

## Learn More

To learn more about the framework and deployment:

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Deployment](https://vercel.com/docs)

## Deploy To Vercel

1. Push this repository to a Git provider.
2. Import the repository in Vercel.
3. If Vercel points at the parent folder, keep the root-level `vercel.json`; it delegates the build to `portfolio-cms`.
4. Add `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in Vercel Project Settings > Environment Variables.
5. Deploy.

Vercel will run `npm install` and `npm run build` automatically.
