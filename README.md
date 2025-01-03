# Booking Project

A project for scheduling appointments. Users can select a date, time slot, and provide their name and email to book an appointment.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [Environment Variables](#environment-variables)
- [Mocking API Requests](#mocking-api-requests)
- [Husky & lint-staged](#husky--lint-staged)
- [Testing](#testing)

---

## Getting Started

1. **Clone the repository**:

```bash
git clone https://github.com/your-username/booking.git
cd booking-project
```

OBS: I use `pnpm` as the package manager in this project. If you don't have it installed, you can use `npm` or `yarn` instead.

2. **Install dependencies**:

```bash
pnpm install or npm install
```

3. **Start the development server**:

```bash
pnpm run dev or npm run dev
```

The site is now running at `http://localhost:5173`!

> **Important**: Make sure to have the API server running as well. A simple mock server is created for testing purposes. Check the `.env.local` file for the API base URL. This file is kept out of `.gitignore` for demonstration purposes.

> **Note**: Create a `.env` file based on the `.env.example` file and adjust the API base URL if needed.

---

## Project Structure

```
booking-project/
├─ public/
│  └─ # Public assets
├─ src/
│  ├─ components/
│  │  ├─ ScheduleCalendar/
│  │  │  └─ ScheduleCalendar.tsx
│  │  ├─ ScheduleInfo/
│  │  │  └─ ScheduleInfo.tsx
│  │  ├─ TimeSlotSelector/
│  │  │  └─ TimeSlotSelector.tsx
│  │  └─ UserForm/
│  │     └─ UserForm.tsx
│  ├─ scheduler/
│  │  ├─ Scheduler.tsx
│  │  ├─ hooks/
│  │  │  ├─ useTimeSlots.ts
│  │  │  └─ useRemoveSlotMutation.ts
│  │  └─ utils/
│  │     └─ handleDateFromURL.ts
│  ├─ mocks/
│  │  ├─ data.json
│  │  ├─ handlers.ts
│  │  └─ server.ts
│  ├─ services/
│  │  └─ api.ts
│  ├─ styles/
│  │  └─ # Tailwind configuration, etc.
│  ├─ App.tsx
│  ├─ main.tsx
│  └─ # Other files (types, etc.)
├─ .husky/
│  ├─ pre-commit
│  └─ pre-push
├─ .gitignore
├─ package.json
├─ tsconfig.json
├─ vite.config.ts
└─ README.md
```

## Key Files

- `src/scheduler/Scheduler.tsx`
  Main component that orchestrates the scheduling process. It composes the calendar, time slot selector, and user form components.

- `useTimeSlots.ts / useRemoveSlotMutation.ts`
  React Query hooks for fetching and mutating time slots.

- `api.ts`  
  Contains the `fetchAvailableTimes` function using the native fetch API.

- `mocks/handlers.ts`
  MSW handlers that intercept fetch calls and return mock data during development/testing.

---

## Scripts

All scripts are defined in package.json under "scripts".

- `pnpm run dev`: Start the development server (Vite) at http://localhost:5173/.
- `pnpm run build`: Build the production bundle via Vite and TypeScript.
- `pnpm run preview`: Serve the built files locally to preview the production build.
- `pnpm run lint`: Runs the Biome/ESLint checks (and auto-fixes, if configured).
- `pnpm run test`: Runs the Vitest test suite in watch mode by default.
- `pnpm run test:ci`: Runs the tests once (non-watch), suitable for CI or Husky hooks.

---

## Environment Variables

This project uses the native `import.meta.env` object to access environment variables. These variables are defined in the `.env` file at the root of the project.

- **VITE_API_BASE_URL**: The base URL for the API server. Defaults to `http://localhost:3000`.

Variables must be prefixed with `VITE_` to be accessible in client code.

- **.env.local** or **.env**: Defaults for local development.

Example in .env.development:

```env
VITE_API_BASE_URL=http://mymock.com
```

In the code:

```ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
```

---

## Mocking API Requests

We use MSW (Mock Service Worker) to intercept calls to the API:

1. `mocks/handlers.ts` defines how to respond to fetch requests.
2. `mocks/server.ts` initializes the mock server for Node (in tests) or the Service Worker for the browser.

Usage During Development

Inside `main.tsx` you can do:

```ts
if (process.env.NODE_ENV === "development") {
  const { worker } = await import("@/mocks/browser");
  worker.start();
}
```

This intercepts requests and serves mock data instead of hitting a real backend.

---

## Husky & lint-staged

We use Husky to run Git hooks:

- **pre-commit**  
  Typically runs `pnpm run lint` or `npx lint-staged`, so any auto-fixes happen before the commit is finalized.

- **pre-push**  
  Typically runs `pnpm run test:ci`, ensuring the tests pass before pushing.

Example `.husky/pre-commit`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

pnpm run lint
```

Example `.husky/pre-push`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

pnpm run test:ci
```

---

## Testing

We use Vitest and Testing Library for both unit and integration tests:

- **Unit tests**: For individual hooks or utilities (e.g., `handleDateFromURL`).
- **Integration tests**: For components like `Scheduler` that fetch data, manipulate state, etc. We rely on MSW to mock the network layer.

### Commands

- `pnpm run test`: Starts tests in watch mode.
- `pnpm run test:ci`: Runs tests once, then exits (for CI or pre-push hooks).

### Time Zone Consistency

If you notice times shifting due to local time zones, set a fixed timezone like UTC in your test environment. For example:

```bash
process.env.TZ = "UTC";
```

---
