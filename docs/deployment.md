# Deployment & Infrastructure Guide

## 1. Cloud Architecture Overview

The AI Resume Builder is architected for zero-maintenance serverless & containerized cloud deployment:

- **Frontend Client (`apps/web`)**: Hosted on **Vercel** (Vite SPA with fast global CDN & client-side routing).
- **Backend API (`apps/api`)**: Hosted on **Render** (Node.js web service running Express, DOCX generation, and Gemini AI).
- **Database**: **Neon Serverless PostgreSQL** (SSL connection over connection pooling).

---

## 2. Step 1: Database Setup on Neon (PostgreSQL)

1. Sign up at [neon.tech](https://neon.tech) and create a new project (e.g. `ai-resume-builder`).
2. Copy your pooled connection string:
   ```text
   postgresql://[user]:[password]@[endpoint-id].us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
3. To switch Prisma to PostgreSQL for production deployment:
   In `apps/api/prisma/schema.prisma`, update the datasource provider to:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
4. Run migrations/push and seed on your database:
   ```bash
   npx prisma db push --schema=apps/api/prisma/schema.prisma
   npx tsx apps/api/prisma/seed.ts
   ```

---

## 3. Step 2: Backend API Deployment on Render

1. Create a new **Web Service** on [render.com](https://render.com) connected to your GitHub repository.
2. Configure the service settings:
   - **Environment**: `Node`
   - **Root Directory**: Leave blank (monorepo root) or specify `apps/api`
   - **Build Command**: `npm install --include=dev && npm run build --workspace=@ai-resume/core && npm run build --workspace=@ai-resume/api`
   - **Start Command**: `npm run start --workspace=@ai-resume/api`
   - **Auto-Deploy**: `Yes` (on push to `main`)
3. Add Environment Variables on Render:
   | Variable | Value / Description |
   | :--- | :--- |
   | `NODE_ENV` | `production` |
   | `HOST` | `0.0.0.0` |
   | `PORT` | `10000` *(Render sets this automatically)* |
   | `DATABASE_URL` | `postgresql://...` *(Your Neon connection string)* |
   | `FRONTEND_URL` | `https://your-resume-app.vercel.app` |
   | `JWT_SECRET` | *Random 64-char string for signing admin tokens* |
   | `GEMINI_API_KEY` | *Your Google AI Studio API key* |
   | `ADMIN_DEFAULT_EMAIL` | `admin@resumebuilder.local` |
   | `ADMIN_DEFAULT_PASSWORD`| *Strong production password for super admin* |
   | `UPLOAD_DIR` | `./uploads` |

---

## 4. Step 3: Frontend Deployment on Vercel

1. Import your GitHub repository in [vercel.com](https://vercel.com).
2. Configure Project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `apps/web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
3. Add Environment Variables on Vercel:
   | Variable | Value |
   | :--- | :--- |
   | `VITE_API_URL` | `https://your-backend-api.onrender.com` |

---

## 5. Local Development Commands

```bash
# Install dependencies across all workspaces
npm install

# Run database setup locally (SQLite fallback)
npm run db:push
npm run db:seed

# Start both API and Web concurrently
npm run dev:all
```

