# Architecture

## Runtime split

- `Next.js app`: frontend, route handlers, SSR, SEO pages, admin interface
- `MongoDB + Prisma`: source of truth for users, courses, lessons, progress, certificates
- `Socket.io gateway`: realtime speaking room events and coaching prompts
- `OpenAI service layer`: speaking evaluation, grammar feedback, tutor conversations

## Security model

- JWT stored in `httpOnly` cookie
- middleware route protection for student/admin areas
- RBAC checks in API handlers
- basic in-memory rate limiting on AI and auth routes
- minimum word-count validation to reduce trivial speaking-test abuse

## Growth model

- move in-memory rate limit to Redis/Upstash before scale
- move file uploads to S3/Supabase Storage/Cloudinary
- move reminder jobs and referral payouts to background workers
- add audit tables for admin moderation and AI override history
