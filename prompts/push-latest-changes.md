# Implementation Prompt: Push Latest Changes to GitHub

## Goal
Commit and push the current workspace changes to the GitHub repository.

## Inspected Code & Config
- `git status` reveals modified files (`AGENTS.md`, `app/globals.css`, `app/layout.tsx`, `eslint.config.mjs`, `package.json`, `package-lock.json`, `tsconfig.json`) and untracked files (`.agents/`, `.claude/`, `agent/`, `app/design-system/`, `components/`, `lib/`, `prompts/`, `skills-lock.json`, `components.json`, `design/`).
- `git remote -v` confirms the origin is `https://github.com/NTG841013/cogni.git`.
- `package.json` contains `lint` and `build` scripts.

## Decisions & Assumptions
- All modified and untracked files (except `.idea/`) are part of the platform setup and should be committed.
- A single commit will be used to wrap up the initial setup and design system implementation.
- `lint` and `tsc` checks must pass before pushing.
- The commit message will follow a clear structure and include the Co-authored-by trailer.

## Requirements
- Stage all relevant files.
- Run `npm run lint` and `npx tsc --noEmit`.
- Commit with message: `feat: initialize platform structure, design system, and agent configuration`
- Include trailer: `Co-authored-by: Junie <junie@jetbrains.com>`
- Push to `main`.

## Security Considerations
- Ensure no `.env` files or sensitive tokens are staged (verified via `.gitignore` and `git status`).

## Acceptance Criteria
- Changes are successfully pushed to `https://github.com/NTG841013/cogni.git`.
- Remote `main` branch is up to date with local state.

## Checks to Run
- `npm run lint`
- `npx tsc --noEmit`

## Manual Test Steps
1. Run `git log -n 1` to verify the commit and author trailer.
2. Run `git status` to ensure the working tree is clean.
3. Verify the changes are visible on GitHub.
