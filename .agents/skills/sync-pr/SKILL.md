---
name: sync-pr
description: >
  Generates a post-release branch synchronization pull request from main → dev.
  After a release PR is merged to main, this merges main back into dev to keep
  branches aligned. Use when the team lead says "sync branches", "sync main back
  to dev", "post-release sync", "align branches after release", or after a
  release PR has been merged to main.
---

## Workflow

### 1. Fetch and check branch state

```bash
git fetch origin main dev
```

---

### 2. Verify the release PR was actually merged

Before doing anything, confirm the release PR is merged — not just open or closed:

```bash
gh pr view <RELEASE_PR_NUMBER> \
  --repo tensorik-tech/tensorik-webapp \
  --json state,mergedAt,title
```

If `state` is not `MERGED`, STOP and report:
> "The release PR #N is not yet merged. Run this sync after the release PR is merged to main."

If no release PR number is provided, find the most recently merged PR into main:

```bash
gh pr list \
  --repo tensorik-tech/tensorik-webapp \
  --base main --state merged --limit 5 \
  --json number,title,mergedAt
```

Confirm with the user which PR triggered this sync before proceeding.

---

### 3. Determine the diff

```bash
# commits on main not yet in dev
git log --oneline origin/dev..origin/main

# file-level diff summary
git diff --stat origin/dev..origin/main
```

Classify the outcome:

| Outcome | What it means | Action |
|---------|---------------|--------|
| **Zero commits, zero diff** | Fast-forward — branches are already at parity | Note in description, proceed |
| **Only release merge commit** | Standard post-release sync | Standard description, proceed |
| **Hotfix commits present** | Extra changes on main beyond the release | List them explicitly in description |
| **Conflict markers expected** | dev has diverged since release | Flag for manual resolution, tag team lead |

---

### 4. Check for conflicts

```bash
git merge-tree $(git merge-base origin/dev origin/main) origin/dev origin/main
```

If conflicts are detected, STOP and report:
> "Merge conflicts detected in the following files: [list]. Manual resolution required before this PR can be merged. Flagging for team lead review."

Create the PR anyway (as a draft) but include a prominent conflict warning in the description.

---

### 5. List what is being synced

```bash
git log --oneline origin/dev..origin/main
```

Typical inclusions:
- Release merge commit from the just-merged release PR
- Hotfixes applied directly to `main` post-release
- Production configuration changes
- CI/CD or deployment tweaks applied on `main`

If hotfixes are present, fetch their commit details:

```bash
git show <HOTFIX_HASH> --stat
```

---

### 6. ⛔ PAUSE — Confirm before creating

**Do NOT run `gh pr create` yet.**

Present the proposed title and description to the user and ask:

> "Here is the draft sync PR. Does this look correct?
> Reply 'yes' to create it, or tell me what to change."

Wait for explicit confirmation. Do not proceed until the user replies with approval.

---

### 7. Create the PR (only after confirmation)

```bash
cat > /tmp/sync-body.md << 'EOF'
<confirmed description here>
EOF

gh pr create \
  --repo tensorik-tech/tensorik-webapp \
  --base dev \
  --head main \
  --draft \
  --title "chore: sync main back into dev after release #<NUMBER>" \
  --body-file /tmp/sync-body.md
```

After creating, output the PR URL.

---

## Description structure

```
## Overview

Post-release branch synchronization. Merging `main` back into `dev`
after PR #<NUMBER> (<release title>) was merged to `main` on <date>.

## What's included

| Commit | Description |
|--------|-------------|
| `<hash>` | <message> |

## Diff summary

- <N files changed / Zero diff — branches at parity>
- <No conflicts expected / Conflicts detected — see below>

## Hotfixes on main (if any)

- `<hash>` — <description> *(applied directly to main, not part of the release PR)*

## Conflicts (if any)

⚠️ Manual resolution required in: <file list>

## Notes

- No functional changes — pure branch alignment
- Review is a formality unless hotfixes or conflicts are listed above
```

---

## Important Rules

- Always verify the release PR is merged before proceeding.
- If no release PR number is given, identify the correct one and confirm with the user.
- Always check for conflicts before creating the PR.
- If conflicts exist, create as draft with a warning — never silently skip conflict detection.
- If hotfixes are present on main, list them explicitly — never bury them in "misc changes".
- Keep the description under 200 words — this is a mechanical sync, not a feature release.
- Do not repeat the full release notes — link to the release PR instead.
- Step 6 confirmation is mandatory. Never skip it.
- Default to `--draft` — the team lead marks it ready after review.
- Title must include the release PR number for traceability.