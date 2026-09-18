---
name: release-pr
description: >
  Generates a professional release pull request from dev → main for Tiqora.
  Analyzes the full diff, reviews commits and merged PRs, categorizes
  changes, and produces a structured release description suitable for
  engineering and executive audiences. Use when the team lead says
  "cut a release", "prepare release PR", "publish release notes",
  "merge dev to main", or when preparing a production release.
---

# /release-pr — Tiqora Production Release PR Workflow

This workflow generates a structured, production-grade Release Pull Request from `dev` &rarr; `main` for **Tiqora** (`AbdullahAhmed903/Tiqora`).

---

## Workflow

### 1. Fetch branches and gather PR data

Ensure local tracking references are fresh and fetch merged pull requests that landed on `dev`:

```bash
git fetch origin main dev

gh pr list \
  --repo AbdullahAhmed903/Tiqora \
  --base dev --state merged --limit 100 \
  --json number,title,mergedAt,headRefName,labels,author,body,url
```

---

### 2. Analyze the diff

Quantify the scope of changes awaiting release:

```bash
# commit count
git log --oneline origin/main..origin/dev | wc -l

# full commit log
git log --oneline --no-decorate origin/main..origin/dev

# file stats
git diff origin/main..origin/dev --stat

# migration files only
git diff origin/main..origin/dev -- 'supabase/migrations/*.sql' --stat
```

If `origin/main..origin/dev` returns zero commits, STOP and report:
> "dev has no commits ahead of main. Nothing to release."

---

### 3. Check for hotfixes on main not in dev

Inspect if any commits were pushed directly to `main` (e.g. emergency hotfixes):

```bash
git log --oneline origin/dev..origin/main
```

If any commits exist here, call them out explicitly in the release description
under a **"Hotfixes on main (not in dev)"** section. Do not silently ignore them.

---

### 4. Review key PRs

For PRs matching `feat:`, `security:`, `fix: security`, `refactor:`, or database changes, inspect their descriptions for context:

```bash
gh pr view <NUMBER> \
  --repo AbdullahAhmed903/Tiqora \
  --json body --jq '.body | split("\n")[:30] | join("\n")'
```

---

### 5. Scan migrations for breaking changes

Inspect the schema diff in `supabase/migrations/`:

```bash
git diff origin/main..origin/dev -- 'supabase/migrations/*.sql'
```

Flag as **Breaking** if any migration contains:
- `ALTER TABLE ... DROP COLUMN`
- `DROP TABLE`
- `DROP CONSTRAINT ... ADD CONSTRAINT` (if values may have changed)
- `ALTER COLUMN ... SET NOT NULL` (may break existing inserts)
- `UPDATE ... SET status = ...` (status renames affect client code)
- Changes to custom ENUMs (`user_role`, `user_status`, `permission_section`, `access_level`) without backwards-compatibility

---

### 6. Categorize changes (Tiqora Domain Architecture)

Group all commits and merged PRs into structured categories:

| Category | Description |
|----------|-------------|
| **Features & Pages** | New user-facing capabilities — events explorer, categories/subcategories navigation, bookings, organizer portals, admin dashboards |
| **UI / UX & Design System** | Tailwind CSS v4 styling, design tokens (`src/app/globals.css`), Framer Motion micro-animations, Lucide React icons, Sonner notifications, mobile responsiveness |
| **Security & RBAC** | Supabase RLS policies, role checks (`is_admin()`), proxy auth session refresh (`src/proxy.ts`), server action guards, Zod validation schemas (`src/lib/validations/`) |
| **Integrations & Commerce** | Stripe checkout sessions/webhooks (`src/lib/stripe.ts`), Resend transactional emails (`src/lib/resend.ts`), Supabase SSR client |
| **Database Migrations** | List each SQL migration file in `supabase/migrations/` with its exact purpose and tables affected |
| **Breaking Changes** | Dropped columns, changed table constraints, modified API routes, server action signature updates |
| **Architecture & Docs** | `docs/DB_STRUCTURE.md`, `docs/db-diagram.svg`, roadmaps, specifications, agent guidelines |

*Skip any category with nothing to report rather than including an empty section.*

---

### 7. Draft the release description

**Title format:** `release: <short summary of major themes>`

Examples:
- `release: category exploration, subcategory admin management, and database schema documentation`
- `release: organizer RBAC, event checkout flow, and Stripe payment integration`

**Description structure:**

```markdown
## Overview

High-level summary — what this release delivers, commit count,
files changed, migrations, and line stats. Call out any hotfixes on
main not included in dev.

---

## Key Changes

### Features & Pages
- **Feature Name** — Description of functionality. (#PR)

### UI / UX & Design System
- **Component / Polish** — Visual refinements, responsive fixes, animation updates. (#PR)

### Security & RBAC
- **Policy / Auth** — RLS hardening, server action validation, session proxy updates. (#PR)

### Integrations & Commerce
- **Stripe / Resend** — Payment or transactional email updates. (#PR)

### Database Migrations

| Migration File | Purpose | Tables Affected |
|----------------|---------|-----------------|
| `20260916153000_create_subcategories_table.sql` | Subcategories schema, indexes, and RLS policies | `public.subcategories` |

### Breaking Changes
- None. *(or list explicitly with migration/code upgrade instructions)*

---

## Deployment & Database Notes

1. **Supabase Console Migrations**: Apply all N new migration files in `supabase/migrations/` in chronological order.
2. **Environment Variables**: New required keys in `.env.local` / production environment: *(list keys or "None")*
3. **Runtime Behavioral Changes**: *(new rate limits, proxy session rules, RLS policies, etc.)*
4. **Data Backfills / Scripts**: *(specify if any data migration is needed, or "None")*

---

## Pre-Release Verification

- [ ] `npm run build` completed with zero TypeScript compilation errors
- [ ] `npm run lint` completed with zero ESLint errors
- [ ] Zero force-pushes on source branches
- [ ] No sensitive credentials or secrets committed (`.env.local` git-ignored)
- [ ] Staging database verified against latest migrations
```

---

### 8. ⛔ PAUSE — Confirm before creating

**Do NOT run `gh pr create` yet.**

Present the proposed title and full release description to the user and ask:

> "Here is the draft release PR for `dev` → `main` in `AbdullahAhmed903/Tiqora`.
> Does the title and description look correct?
> Reply 'yes' to create it, or tell me what to change."

Wait for explicit confirmation. Do not proceed until the user replies with approval.

---

### 9. Create the PR (only after confirmation)

Write the confirmed description to a file (e.g. `.agents/scratch/release-body.md` or temp path), then create as a **draft PR**:

```bash
gh pr create \
  --repo AbdullahAhmed903/Tiqora \
  --base main \
  --head dev \
  --draft \
  --title "<confirmed title>" \
  --body-file .agents/scratch/release-body.md
```

After creating:
1. Output the PR URL for the user to review.
2. Remind the user to run the post-release sync workflow (`/sync-pr`) after the release PR is merged into `main`.

---

## Important Rules

- **Strict Target & Source**: Releases always go from `dev` &rarr; `main` in `AbdullahAhmed903/Tiqora`.
- **No Raw Commit Dumps**: Always categorize changes by feature domain and business impact.
- **Explicit Breaking Changes**: Always call out breaking schema or API changes with remediation steps.
- **Default to Draft**: Never open a ready-for-review release PR automatically; use `--draft` so team lead does final sign-off.
- **Mandatory Confirmation**: Step 8 confirmation is mandatory. Never execute `gh pr create` without user approval.
- **No Force Pushing**: Force-pushing (`git push --force` or `-f`) is strictly forbidden under all circumstances.
