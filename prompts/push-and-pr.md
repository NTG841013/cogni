# Implementation Prompt: Push Code and Open PR

## Goal
Push the current implementation of the Cogni home page, logo changes, and configuration fixes to a new branch and open a Pull Request on GitHub.

## Skills Used
- `git`: For version control operations.
- `AGENTS.md`: For following the project's reporting and implementation protocol.

## Inspection Summary
- **Current Branch**: `main`.
- **Changes not staged**:
    - `app/globals.css` (Container refinement, background pattern, animations)
    - `app/page.tsx` (Home page layout, hero section, course grid)
    - `next.config.ts` (Unsplash image configuration)
- **Untracked files**:
    - `components/course-card.tsx`
    - `components/site-header.tsx`
    - `prompts/cogni-home-page.md`
    - `prompts/cogni-logo-change.md`
    - `prompts/logo-update.md`
- **Exclusion candidates**:
    - `1.png`, `2.png` (Session artifacts/screenshots)
    - `.idea/vcs.xml` (IDE specific config)

## Decisions & Assumptions
- **Branch Name**: `feat/cogni-home-page-implementation`.
- **Commit Message**: `feat: implement Cogni home page and branding updates`.
- **Co-author**: Include Junie as a co-author as per `AGENTS.md`.
- **PR Creation**: Since `gh` CLI is not installed, I will attempt to install it via `winget` or provide the push link for manual PR creation if installation fails.

## Proposed Changes
1. Create a new branch: `git checkout -b feat/cogni-home-page-implementation`.
2. Stage relevant files:
    - `app/globals.css`
    - `app/page.tsx`
    - `next.config.ts`
    - `components/course-card.tsx`
    - `components/site-header.tsx`
    - `prompts/*.md`
3. Commit with co-author trailer.
4. Push to origin.
5. Create PR (if `gh` available) or report push success.

## Security Considerations
- Ensure no sensitive tokens are committed (verified in `next.config.ts` and `app/`).
- The repository is private (per `AGENTS.md`), but my current push access is via the environment's git config.

## Acceptance Criteria
- Code is pushed to a new branch on `https://github.com/NTG841013/cogni.git`.
- A PR is initiated or a link for manual creation is provided.
- All session-relevant code and documentation (prompts) are included.

## Verification Plan
1. `git status` after commit to ensure no intended files are left.
2. `git remote show origin` to verify the new branch exists on the remote.

## Manual Test Steps
1. Verify the PR on GitHub UI.
