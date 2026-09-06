## Summary of Changes

<!-- Briefly describe what this PR does and why. Link related issues. -->
Closes #

---

## Contributor & Reviewer Checklist

### 1. Scope & Git Model
- [ ] PR is targeting the `dev` branch (not `main`).
- [ ] Feature branch was created off `dev`.
- [ ] PR only touches files related to the assigned task.
- [ ] `src/components/ui/` was NOT modified (read-only shadcn primitives).
- [ ] **NO force-pushing** was used (`git push --force` is strictly forbidden).

### 2. Tiqora Stack & Architecture
- [ ] All code is in TypeScript (`.ts` or `.tsx`).
- [ ] Design tokens and Tailwind CSS v4 variables from `src/app/globals.css` used (no hardcoded arbitrary colors).
- [ ] Icons are strictly from `lucide-react`.
- [ ] UI notifications use `sonner` (`toast.success()`, `toast.error()`).
- [ ] Next.js 16 conventions followed:
  - React Server Components (RSC) by default; interactive components marked `"use client";`.
  - Auth sessions refreshed in `src/proxy.ts` (no deprecated `middleware.ts`).
- [ ] Payments use Stripe (`src/lib/stripe.ts`); emails use Resend (`src/lib/resend.ts`).
- [ ] All forms, route handlers, and server actions validate inputs using **Zod** (`zod`).

### 3. Project Structure
- [ ] Shared TypeScript interfaces and types are located in `src/types/` (not defined ad-hoc in component files).
- [ ] All Zod validation schemas are located in `src/lib/validations/`.
- [ ] Server Actions are placed in `src/app/actions/`.
- [ ] Shared components in `src/components/`; page-specific components co-located in `src/app/`.
- [ ] Migrations placed in `supabase/migrations/` using timestamp prefix (`YYYYMMDDHHMMSS_<name>.sql`).

### 4. Content Hygiene & Security
- [ ] No real PII (names, emails, phone numbers) in mock or placeholder data.
- [ ] No hardcoded dates or dead links (`href="#"` without `// TODO`).
- [ ] No secrets or credentials committed (`.env.local` remains git-ignored).
- [ ] No `any` type used on sensitive auth or database code.
- [ ] Client components do not import from `src/lib/supabase/server.ts` or `src/lib/supabase/admin.ts`.

### 5. Dependencies
- [ ] No unapproved UI or animation libraries added (Framer Motion is the sole approved animation engine).
- [ ] Any new package in `package.json` is justified in the description above.

### 6. Verification
- [ ] `npm run build` completed with zero errors.
- [ ] `npm run lint` passed with zero warnings or errors.
