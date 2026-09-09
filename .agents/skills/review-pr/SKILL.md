---
name: review-pr
description: Run the Tiqora PR Review Checklist to review pull requests from team members for stack compliance, security, Next.js 16 conventions, and code hygiene.
---

# /review-pr — Tiqora PR Review Checklist Workflow

Run this workflow when reviewing a pull request or code diff from a team member on **Tiqora**.
Read the PR diff in full before starting any checklist item.

---

## 1. Scope Check (Do This First)

Catches the most common problem: a PR assigned to one feature touching ten unrelated files.

**Fork & Branch model checks:**
- [ ] PR targets `dev` on the main repo — **never** directly into `main`
- [ ] Contributor has NOT been given direct push access to the main repo

**Scope checks:**
- [ ] PR only touches files related to the assigned task/issue
- [ ] No unrelated refactors or "while I was here..." edits
- [ ] `src/components/ui/` was NOT modified — these are shadcn primitives, treat as read-only
- [ ] Feature branch was created off `dev`, not off `main`
- [ ] PR is a reasonable size — if >900 lines changed (excluding `src/components/ui/`), flag for splitting

---

## 2. Project Rules & Stack Compliance (Tiqora Standards)

- [ ] All files are `.ts` or `.tsx` — no `.js` or `.jsx`
- [ ] No hardcoded color values — must use design tokens from `src/app/globals.css` and the Tiqora palette
- [ ] Uses shadcn/ui primitives from `src/components/ui/` — no general-purpose UI library installed (MUI, Chakra, Ant Design, Mantine)
- [ ] Uses **Lucide React** (`lucide-react`) icons exclusively for visual consistency
- [ ] Uses **Sonner** (`toast.success()`, `toast.error()`, `toast.info()`) for notifications
- [ ] Payment processing strictly uses **Stripe** via `src/lib/stripe.ts` — no unauthorized payment libraries
- [ ] Transactional emails strictly use **Resend** via `src/lib/resend.ts`
- [ ] Next.js 16 conventions:
  - React Server Components (RSC) by default; interactive components must start with `"use client";`
  - Auth sessions refreshed in `src/proxy.ts` (the `middleware.ts` file convention is deprecated and strictly forbidden)
  - Always read authenticated user info on the server using `supabase.auth.getUser()`
- [ ] Follows naming conventions: `kebab-case` files, `PascalCase` components, `camelCase` variables
- [ ] New components placed correctly: shared → `src/components/`, page-specific → co-located in `src/app/`
- [ ] All images use `next/image` — no bare `<img>` tags
- [ ] New pages have an `export const metadata` with `title` and `description`

---

## 3. Project Structure & Directory Organization

Team members must strictly adhere to the designated project structure:
- [ ] **TypeScript Types & Interfaces**: Shared interfaces, database types, and domain models must reside in `src/types/` (e.g. `src/types/auth.ts`, `src/types/events.ts`). No massive shared interfaces declared ad-hoc inside UI component files.
- [ ] **Zod Validation Schemas**: All form, API, and action validation schemas must reside in `src/lib/validations/` (e.g. `src/lib/validations/auth.ts`, `src/lib/validations/events.ts`).
- [ ] **Server Actions**: Server-side mutations and action handlers must be placed in `src/app/actions/` (e.g. `src/app/actions/admin-organizers.ts`).
- [ ] **UI Primitives**: Base design tokens and shadcn primitives in `src/components/ui/` (read-only).
- [ ] **Layout Components**: Global wrappers like Navbar, Footer, and Sidebar in `src/components/layout/`.
- [ ] **Feature Components**: Shared reusable domain components across routes in `src/components/`.
- [ ] **Page-Specific Components**: Components used exclusively by a single page/route must be co-located in that route's directory in `src/app/` (e.g. `src/app/(auth)/login/_components/`).
- [ ] **SDKs & Libraries**: Third-party client instances and core helpers in `src/lib/` (`src/lib/stripe.ts`, `src/lib/resend.ts`, `src/lib/supabase/`).
- [ ] **Database Migrations**: SQL migration files in `supabase/migrations/` using timestamp prefix (`YYYYMMDDHHMMSS_<name>.sql`).
- [ ] **Static Assets**: Brand assets, logos, and illustrations in `public/`.

---

## 4. Content Hygiene

Catches PII and stale mock content shipped by accident.

- [ ] No real people's names in placeholder content or hardcoded data
- [ ] No real email addresses or phone numbers anywhere in source code
- [ ] No hardcoded dates — dates must come from the database or be marked with a `// TODO` comment
- [ ] No `href="#"` links without a `// TODO` comment explaining the intent
- [ ] No "Coming Soon" placeholder shipped on a route that already has a working component

---

## 5. Dependency Audit (Check `package.json` Diff)

- [ ] No new general-purpose UI library added (MUI, Chakra, Radix standalone, Mantine, etc.)
- [ ] No second animation engine added — **Framer Motion is the only approved animation library**
  - Flag if `framer-motion` AND `gsap` / `animejs` / `@react-spring/web` appear
- [ ] No Three.js / `@react-three/fiber` added without prior team lead approval
- [ ] Any new package in `package.json` is justified by the PR description — if there's no explanation, block and ask
- [ ] If a component was copied from React Bits / 21st.dev / Vengeance UI, verify peer dependencies

---

## 6. Security (Non-Negotiable — Flag as Blockers)

- [ ] No secrets, API keys, or credentials in code — environment variables only (`.env.local` is git-ignored)
- [ ] No `.env*` files accidentally committed or tracked
- [ ] Any new API route or Server Action validates input with **Zod** (`zod`) before processing
- [ ] No unguarded protected routes — verify server-side auth in new `src/app/` pages or `src/proxy.ts`
- [ ] No sensitive data (passwords, tokens, PII) logged or returned in client responses
- [ ] File uploads (if any) validate type, size, and content
- [ ] No `any` type used to bypass type safety on auth or data-handling code
- [ ] Client Components do NOT import from `src/lib/supabase/server.ts` or `src/lib/supabase/admin.ts`

---

## 7. Code Quality

- [ ] **Dead Code & Orphan Files Check (CRITICAL)**:
  - **No orphan / dead files**: Every newly introduced or modified file must be actively imported, routed, or registered in the application. Flag abandoned drafts, duplicate copies, or dangling scratch files that are not referenced anywhere.
  - **No dead code within files**: No unreachable code branches, abandoned helper functions, unreferenced exports, obsolete type definitions, or blocks of commented-out code.
  - **No unused imports**: All imports must be actively used; remove any dangling or residual imports.
- [ ] Proper TypeScript types — `any` must be justified with a comment
- [ ] No business logic inside UI components — data fetching/mutations belong in Server Components, Server Actions (`src/app/actions/`), or hooks
- [ ] No `console.log` left in production code
- [ ] No fake/placeholder API calls (`setTimeout` pretending to be a fetch, hardcoded mock data shipped as real)
- [ ] List rendering uses a stable, unique `key` prop — not array index for mutable data
- [ ] Icon-only buttons and links have an `aria-label`

---

## 8. Commit & Git Hygiene

- [ ] **No force push (`git push --force` or `-f`)** — check the branch push history on GitHub. If a rewrite or force-push occurred, this is an automatic blocker.
- [ ] Conventional commit format (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`)
- [ ] Descriptive commit messages — not "fix stuff" or "update"
- [ ] One logical change per commit (not 10 unrelated files in one commit)
- [ ] PR is linked to a GitHub issue

---

## 9. Build & Regression Check

- [ ] `npm run build` passes with zero errors
- [ ] `npm run lint` passes with zero warnings or errors
- [ ] No TypeScript compilation errors introduced
- [ ] Existing pages and routes still render correctly
- [ ] No new ESLint warnings silenced with `// eslint-disable` without justification

---

## 10. Feedback Guidelines

- Be specific — reference file name and line number: `[filename](file:///path/to/file#L10)`.
- Suggest a fix, don't just identify a problem.
- Acknowledge good patterns when you see them.
- **Blockers** (must fix before merge): security issues, unapproved packages, broken build/lint, PII in code, `src/components/ui/` modified, force push.
- **Non-blockers** (can merge, track as follow-up): style nits, minor refactors, missing aria-labels.

---

## 11. Decision

- **Approve**: All blockers resolved, code is solid and meets Tiqora standards.
- **Request Changes**: One or more blockers present, list them clearly with suggested fixes.
- **Escalate to Team Lead**: Architectural decision or dependency question beyond contributor scope.
