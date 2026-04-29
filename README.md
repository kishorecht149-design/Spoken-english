# Verbalyx

Production-ready spoken English learning platform built with Next.js App Router, Prisma, JWT auth, OpenAI integration, MongoDB, and an admin panel.

## Stack

- Next.js 15 + TypeScript + Tailwind CSS + Framer Motion
- MongoDB + Prisma ORM
- JWT cookie-based authentication with admin/student RBAC
- OpenAI API for speaking evaluation and tutor conversation
- Socket.io realtime practice gateway for live coaching events
- Resend email reminders

## Local setup

1. Copy `.env.example` to `.env`.
2. Install dependencies with `npm install`.
3. Run Prisma:
   - `npm run db:generate`
   - `npm run db:push`
   - `npm run db:seed`
4. Start the app with `npm run dev`.
5. Start the realtime gateway in a second terminal with `npm run realtime:dev`.

## Demo accounts

- Admin: `admin@verbalyx.dev` / `Admin@12345`
- Student: `student@verbalyx.dev` / `Student@12345`

## Project structure

- `app/`: App Router pages and API route handlers
- `components/`: shared UI, marketing, student, admin, and practice components
- `lib/`: auth, database, services, validation, utilities
- `prisma/`: schema and seed script
- `realtime-server/`: Railway-friendly Socket.io gateway
- `docs/`: architecture and deployment notes

## Shipping notes

- Deploy the Next.js app to Vercel.
- Deploy MongoDB on MongoDB Atlas.
- Deploy `realtime-server` to Render for persistent websocket support.
- Store secrets in platform environment settings, not in source control.

## Deployment quick start

- Vercel deploys the main app from this repository.
- Render deploys the realtime websocket service using `npm run realtime:start`.
- `render.yaml` and `vercel.json` are included in the repo to streamline setup.
