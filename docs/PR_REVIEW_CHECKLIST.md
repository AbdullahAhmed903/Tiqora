# Tiqora Pull Request Review Checklist

This checklist defines the review standard for all code contributions, interns, and team members working on **Tiqora**.

---

## 1. Scope & Branch Model

- [ ] **Target Branch**: PR targets `dev` — never `main` directly.
- [ ] **Branch Source**: Feature branches must be cut from `dev`.
- [ ] **Atomic Scope**: The PR only touches files related to the assigned issue.
- [ ] **Shadcn Primitives**: `src/components/ui/` files are read-only primitives. Do not modify them directly in feature PRs.
- [ ] **PR Size**: PRs with >900 lines changed (excluding UI primitives) should be reviewed for splitting.

---

## 2. Tiqora Stack & Conventions

- [ ] **TypeScript Only**: All code must be `.ts` or `.tsx`. No `.js` or `.jsx`.
- [ ] **Design Tokens**: Use variables and utility classes from `src/app/globals.css` and the Tiqora palette. No raw hex codes like `#2563eb` scattered in components.
- [ ] **UI & Icons**: Use Shadcn primitives from `src/components/ui/` and **Lucide React** (`lucide-react`) icons exclusively.
- [ ] **Feedback**: Use **Sonner** (`toast.success()`, `toast.error()`).
- [ ] **Payments & Email**: Payments use Stripe (`src/lib/stripe.ts`); emails use Resend (`src/lib/resend.ts`).
- [ ] **Next.js 16 App Router**:
  - React Server Components (RSC) by default. Client components must have `"use client";`.
  - Next.js 16 Proxy: Tiqora uses `src/proxy.ts`. The old `middleware.ts` file convention is deprecated and strictly forbidden.
  - Server auth verification: Always use `supabase.auth.getUser()`.
- [ ] **Validation**: All user inputs, forms, route handlers, and server actions must validate with **Zod** (`zod`).

---

## 3. Project Structure & Directory Organization

Team members must strictly follow the Tiqora directory structure:
- [ ] **TypeScript Types & Interfaces**: Shared interfaces, database types, and domain models must reside in `src/types/` (e.g. `src/types/auth.ts`, `src/types/events.ts`). Do not define large shared interfaces ad-hoc in component files.
- [ ] **Zod Validation Schemas**: All validation schemas must reside in `src/lib/validations/` (e.g. `src/lib/validations/auth.ts`, `src/lib/validations/events.ts`).
- [ ] **Server Actions**: Server-side mutations and action handlers must be placed in `src/app/actions/` (e.g. `src/app/actions/admin-organizers.ts`).
- [ ] **UI Primitives**: Base design tokens and shadcn primitives in `src/components/ui/` (read-only).
- [ ] **Layout Components**: Global wrappers like Navbar, Footer, and Sidebar in `src/components/layout/`.
- [ ] **Feature Components**: Shared reusable domain components in `src/components/`.
- [ ] **Page-Specific Components**: Sub-components used only by one page co-located in that route's directory in `src/app/` (e.g. `src/app/(auth)/login/_components/`).
- [ ] **SDKs & Libraries**: Third-party wrappers and helpers in `src/lib/` (`src/lib/stripe.ts`, `src/lib/resend.ts`, `src/lib/supabase/`).
- [ ] **Database Migrations**: SQL migration files in `supabase/migrations/` using timestamp prefix (`YYYYMMDDHHMMSS_<name>.sql`).
- [ ] **Static Assets**: Logos, brand assets, and icons in `public/`.

## 4. Content Hygiene

- [ ] No real people's names or contact info in placeholders or mock data.
- [ ] No hardcoded dates (use DB timestamps or explicit `// TODO`).
- [ ] No empty `href="#"` without `// TODO` context.
- [ ] No "Coming Soon" placeholders replacing existing working features.

---

## 5. Dependencies

- [ ] No unapproved general-purpose UI kits (MUI, Chakra, AntD, Mantine).
- [ ] No second animation engine. **Framer Motion is the only approved animation library**.
- [ ] No 3D libraries (Three.js, `@react-three/fiber`) without lead sign-off.
- [ ] Every new dependency in `package.json` must be justified in the PR description.

---

## 6. Security (Automatic Blockers)

- [ ] Zero secrets in code (`.env.local` is git-ignored). Never commit `SUPABASE_SECRET_KEY`, `STRIPE_SECRET_KEY`, or `RESEND_API_KEY`.
- [ ] Server actions and API routes validate with Zod before database operations.
- [ ] Protected routes verify authentication on the server (`supabase.auth.getUser()`).
- [ ] No PII or credentials logged to stdout or returned to clients.
- [ ] Client Components never import `src/lib/supabase/server.ts` or `src/lib/supabase/admin.ts`.
- [ ] Zero `any` casts on authentication or database logic.

---

## 7. Code & Git Hygiene

- [ ] **🚫 Strictly NO `git push --force` or `-f`**: Force-pushing is an automatic blocker.
- [ ] **No Dead Code or Orphan Files**: 
  - Verify there are no orphan/dead files (new files that are never imported, routed, or registered).
  - Check that all touched files have no dead code (unreachable branches, unused exports/functions, commented-out blocks, or unused imports).
- [ ] Conventional commit format (`feat:`, `fix:`, `chore:`, `docs:`).
- [ ] No leftover `console.log` statements in production code.
- [ ] No fake `setTimeout` mocking API calls.
- [ ] Stable `key` props on list renders.
- [ ] Icon-only buttons have an `aria-label`.

---

## 8. Verification Before Merging

```bash
# 1. Run production build
npm run build

# 2. Run linter
npm run lint
```
Both commands must exit with code 0.
