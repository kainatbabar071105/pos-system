# Modern Inventory Management & POS System

A production-quality Point of Sale (POS) and Inventory Management SaaS platform built with the MERN/Prisma stack.

## Architecture & Tech Stack

**Frontend:**
- React 18 & Vite
- TypeScript
- Tailwind CSS (Linear/Stripe-inspired UI)
- Zustand (State Management)
- React Router v6

**Backend:**
- Node.js & Express.js
- TypeScript
- Prisma ORM (MongoDB Provider)
- JSON Web Tokens (JWT) & bcryptjs

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas URI)

### Backend Setup
1. `cd backend`
2. `npm install`
3. Ensure your MongoDB instance is running, and configure `.env` (copy from `.env.example` if it existed, default uses `mongodb://localhost:27017/pos_db`).
4. Run `npm run db:push` to sync the Prisma schema.
5. Run `npm run seed` to generate demo data and admin users.
6. Run `npm run dev` to start the API server on port 5000.

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev` to start Vite on port 5173.

### Deployment Checklist

For the backend deployment, configure these environment variables:

- `DATABASE_URL`: a reachable MongoDB Atlas connection string. The database user must have read/write access.
- `JWT_SECRET`: a long, randomly generated production secret.
- `FRONTEND_URL`: the deployed frontend URL, for example `https://your-frontend.vercel.app`.
- `BLOB_READ_WRITE_TOKEN`: the Vercel Blob read/write token used for product images.
- `NODE_ENV=production`

For the frontend deployment, configure:

- `VITE_API_URL`: the deployed backend API URL including `/api`, for example `https://your-backend.vercel.app/api`.

Run `npm run db:push` and `npm run seed:native` against the production database before signing in. Product image uploads use Vercel Blob when `BLOB_READ_WRITE_TOKEN` is configured; local development continues to use the `uploads` directory.

### Demo Credentials
- Admin: `admin@pos.io` / `admin123`
- Cashier: `cashier@pos.io` / `cashier123`

## Features

- Full POS checkout system with dynamic cart calculation
- Stock management and low-stock alerts
- Customer and supplier CRM
- Expense tracking and profit reporting
- Dark mode, fully responsive layout
