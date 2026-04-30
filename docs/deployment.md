# Deployment

## Recommended split

- Vercel: Next.js app, frontend, and Next.js API routes
- Render: Socket.io realtime server from `realtime-server/index.ts`
- MongoDB: MongoDB Atlas

## Vercel

1. Import the GitHub repository into Vercel.
2. Framework preset: Next.js.
3. Install command: `npm install`
4. Build command: `npm run build`
5. Add environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL`
   - `NEXT_PUBLIC_APP_URL`
   - `NEXT_PUBLIC_SOCKET_URL`
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY`
   - `RESEND_API_KEY`
   - `EMAIL_FROM`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
6. After the first deploy, run `npx prisma db push` and `npm run db:seed` against production once.

## Render realtime backend

1. Create a new Web Service on Render from the same GitHub repository.
2. Root directory: project root.
3. Build command: `npm install`
4. Start command: `npm run realtime:start`
5. Add environment variables:
   - `NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app`
   - `PORT=10000`
6. After deploy, copy the Render service URL and set it as `NEXT_PUBLIC_SOCKET_URL` in Vercel.

The included `render.yaml` can also be used for Render Blueprint deploys.

## MongoDB

- MongoDB Atlas works well for this setup.
- Set the same `DATABASE_URL` in Vercel and your local `.env`.
- For schema sync, use `npx prisma db push`.

## Firebase Auth

- Create a Firebase project and enable Authentication with Google as a sign-in provider.
- Add your Vercel production domain to Firebase Authentication authorized domains.
- Copy the web app config values into the `NEXT_PUBLIC_FIREBASE_*` variables.
- Create a Firebase service account key and add `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` to Vercel.
- Keep admin users on `/admin/login`; Firebase Google sign-in is for learner accounts only.

## OpenAI

- Set `OPENAI_API_KEY`.
- Optionally set `OPENAI_MODEL` to your preferred Responses API model.

## Email

- Set `RESEND_API_KEY` and `EMAIL_FROM`.
- Trigger `sendLessonReminder` from a cron job or workflow runner.

## Important note

This codebase keeps the authenticated app APIs in Next.js route handlers, so those APIs deploy with Vercel alongside the frontend. Render is used here for the realtime speaking server, not as a full replacement for the Next.js backend runtime.
