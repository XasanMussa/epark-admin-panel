# ePark Admin Panel

A modern, responsive React + TypeScript admin panel for managing users, bookings, payments, and analytics for the ePark system.

## Features

- Secure admin authentication
- Dashboard with key metrics
- User management (CRUD, status)
- Booking/reservation management
- Payment and transaction monitoring
- Notifications overview
- Responsive, clean UI (Material-UI)
- Role-based access control

## Tech Stack

- React + TypeScript
- Vite
- Material-UI (MUI)
- React Router
- React Query
- Axios

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Set up environment variables:**
   - Copy `.env.example` to `.env` and fill in your API endpoints and keys.
3. **Run the app:**
   ```bash
   npm run dev
   ```

## Project Structure

- `src/`
  - `components/` — Reusable UI components
  - `pages/` — Route-based pages (Dashboard, Users, Bookings, etc.)
  - `api/` — API utilities
  - `hooks/` — Custom React hooks
  - `contexts/` — Auth and global state
  - `theme/` — MUI theme customization

## Environment Variables

See `.env.example` for required variables (API endpoints, etc).

## License

MIT
