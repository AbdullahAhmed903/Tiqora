<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Agent Guidelines for Tiqora

This document defines architecture, conventions, and operational rules for AI agents developing on **Tiqora** (Events, Football Matches & Sports Booking Platform).

---

## 1. Core Principles & Stack Rules

- **Project Name & Branding**: **Tiqora**. Official logo is in `/public/Tiqora logo.png` (aliased as `/public/logo.png`).
- **Framework**: Next.js 16+ using the **App Router** (`src/app`).
- **React Server Components (RSC)**:
  - By default, all pages and components in `src/app` are React Server Components unless client state/interactivity (`useState`, `useEffect`, event listeners) is needed.
  - Interactive components must start with `"use client";`.
  - Keep server components responsible for data fetching, auth verification, and initial markup.
- **Proxy Convention (replaces deprecated middleware)**:
  - The `middleware.ts` file convention is deprecated in Next.js 16. Tiqora uses `src/proxy.ts` exporting `async function proxy(request: NextRequest)`.
- **Database & Migration Policy**:
  - **CRITICAL**: Do NOT generate local SQL migration files in this repository. Database schemas and tables are managed directly in Supabase Console.
  - Use `src/lib/supabase/server.ts` to access Supabase in Server Components, Route Handlers, and Server Actions.
  - Use `src/lib/supabase/client.ts` to access Supabase in Client Components.
- **Supabase Credentials**:
  - Tiqora uses **Publishable Key** (`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`) on the client/SSR and **Secret Key** (`SUPABASE_SECRET_KEY`) for secure server-side operations.
  - Auth sessions are automatically refreshed in `src/proxy.ts` via `updateSession()`.
  - Always read authenticated user info on the server using `supabase.auth.getUser()`.
- **Validation**:
  - Use **Zod** (`zod`) for all data validation across forms, route handlers, and server actions.
- **Payment Processing**:
  - Payment sessions use Stripe (`stripe`, `@stripe/stripe-js`) via `src/lib/stripe.ts`.
- **UI Notifications**:
  - Use **Sonner** (`toast.success()`, `toast.error()`, `toast.info()`) for notifications.
  - The `<Toaster />` component is mounted globally in `src/app/layout.tsx`.
- **Transactional Emails**:
  - Use **Resend** (`src/lib/resend.ts`) for sending transactional notifications and booking confirmations.
- **Icons**:
  - Use **Lucide React** (`lucide-react`) icons exclusively for a unified design.

---

## 2. Directory Structure & Conventions

- `public/`: Brand assets including `Tiqora logo.png` and `logo.png`.
- `src/app/`: Next.js App Router pages, layouts, and route handlers.
- `src/proxy.ts`: Next.js 16 Proxy handler (session refreshing).
- `src/components/ui/`: Primitive design tokens (Button, Badge, Toaster).
- `src/components/layout/`: Global layout components (Navbar, Footer).
- `src/lib/supabase/`: Supabase client definitions (`client.ts`, `server.ts`, `middleware.ts`).
- `src/lib/stripe.ts`: Stripe SDK client.
- `src/lib/resend.ts`: Resend email client.
- `src/lib/utils.ts`: General helper utilities (`cn` class merger).

---

## 3. Theme & Styling Palettes (Tailwind CSS v4)

### Light Theme
- **Background**: `#FFFFFF`
- **Text**: `#09090B`
- **Primary Button**: `#2563EB`
- **Button Hover**: `#1D4ED8`
- **Cards / Surface**: `#F4F4F5`
- **Borders**: `#E4E4E7`
- **Links**: `#2563EB`

### Dark Theme
- **Background**: `#09090B`
- **Surface**: `#18181B`
- **Text**: `#FFFFFF`
- **Secondary Text**: `#A1A1AA`
- **Primary Button**: `#2563EB`
- **Button Hover**: `#3B82F6`
- **Borders**: `#27272A`

---

## 4. Strictly Forbidden Actions (CRITICAL)

- 🚫 **NEVER use `git push --force` or `git push -f`**: Force-pushing is strictly forbidden under any circumstances. It can destroy commit history and overwrite remote work.
- 🚫 **NEVER generate local SQL migration files**: Database tables and schemas are managed in the Supabase Console directly.
- 🚫 **NEVER use the deprecated `middleware.ts` file convention**: Always use `src/proxy.ts`.
- 🚫 **NEVER commit sensitive secrets or keys**: Always keep real secrets inside `.env.local` which is git-ignored.

---

## 5. Verification Checklist Before Committing

1. Run `npm run build` to verify there are zero TypeScript compilation or Next.js build errors.
2. Run `npm run lint` to confirm ESLint checks pass.
3. Ensure no secrets are committed to `.env` or tracking files (`.env.local` is git-ignored).
