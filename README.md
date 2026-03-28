# Power as you go - Hackathon Submission

A fintech-style web app for prepaid electricity management. Power as you go helps SMEs and individuals monitor meter credit, automate top-ups, and keep receipts organized in one reliable dashboard.

## Why this matters

Unplanned outages and manual top-ups are costly. This product makes prepaid electricity predictable with smart thresholds, fast payments, and a clean audit trail.

## Key features

- Secure sign-in, registration, and email verification flows
- Meter dashboard with credit status and health indicators
- Manual top-ups with OTP flow support
- Auto top-up settings (card auth + top-up amount)
- Transaction history and receipts
- Admin/QA tools for meter validation and IoT credit updates

## Backend Github Link

```
https://github.com/Oluwaseyi-vibex/mechanics-backend

```

## Screens

- Landing
- Login
- Register
- Dashboard
- Meters and Meter detail
- Payments and Top-ups
- Settings
- Admin/QA

## Tech stack

- React + Vite
- Tailwind CSS
- React Router
- React Query
- Zustand

## Getting started

```bash
npm install
npm run dev
```

## Environment

No frontend API environment variable is required.
Local development proxies `/api/*` requests to `http://localhost:5000/api/*`.
Netlify production should set `BACKEND_BASE_URL` to the backend origin, for example `https://your-backend.example.com/api`.

## API endpoints used (frontend)

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/me`
- `GET /api/meters`
- `GET /api/meters/:meterNumber`
- `PATCH /api/meters/:meterNumber/config`
- `POST /api/meters/validate`
- `POST /api/meters/validate/ikedc`
- `POST /api/payments/purchase`
- `POST /api/payments/otp`
- `GET /api/payments`
- `POST /api/payments/auth-data`
- `POST /api/payments/topup-amount`
- `POST /api/iot/credit-update`

## Project structure

```
src/
  pages/        # Screens
  components/   # Shared UI components
  lib/          # API + helpers
  store/        # Zustand stores
```

## Demo flow

1. Register an account
2. Verify email
3. Link and validate a meter
4. Set auto top-up auth data and amount
5. Trigger a manual top-up or IoT credit update
6. Confirm transaction history

## License

MIT
