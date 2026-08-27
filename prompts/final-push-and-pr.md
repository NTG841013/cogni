# Implementation Prompt: Final Commit, Push, and PR

## Goal
Finalize the implementation by committing the remaining type definition changes, cleaning up unused imports, pushing the feature branch to GitHub, and providing a link for PR creation.

## Skills Read
- `git`: For version control.
- `AGENTS.md`: For commit and reporting protocols.

## Code Inspected
- `web/sanity.types.ts`: Contains minor formatting changes (likely auto-generated).
- `web/components/site-header.tsx`: Has an unused `Image` import (lint warning).
- `.gitignore`: Does not ignore root `.png` files, which should be manually excluded.
- `git log`: Verified that core features are already committed on `feat/cogni-home-page-implementation`.

## Decisions & Assumptions
- **Unused Imports**: Remove `Image` from `web/components/site-header.tsx` to ensure a clean build.
- **Commit Message**: `chore: finalize types and cleanup before PR`.
- **Co-author**: Include `Co-authored-by: Junie <junie@jetbrains.com>` in the commit trailer.
- **PR Link**: Since `gh` CLI is missing, I will rely on the standard Git push output which typically provides the URL to create a PR on GitHub.
- **Exclusions**: `1.png` and `2.png` are design artifacts and will not be committed.

## Proposed Changes
### web
- `components/site-header.tsx`: Remove unused `import Image from "next/image"`.
- `sanity.types.ts`: Stage the formatting changes.

### git
- Add and commit the changes.
- Push the current branch `feat/cogni-home-page-implementation` to `origin`.

## Security Considerations
- Verified that no new environment variables or tokens were introduced in the unstaged changes.

## Acceptance Criteria
- Lint passes with zero warnings.
- Code is pushed to `origin/feat/cogni-home-page-implementation`.
- A PR creation link is provided to the user.

## Checks to Run
- `npm run lint` in `web` after the cleanup.
- `git status` to verify clean state (except for ignored artifacts).

## Manual Test Steps
1. Click the provided GitHub link to open the PR.
2. Verify that the PR contains all the implementation commits.
