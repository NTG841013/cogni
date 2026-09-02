# Implementation Prompt: Final Submission of Intelligent Search and Tracking

## Goal
Commit all implementation changes, push the `feat/intelligent-search` branch to origin, and provide a PR link. This includes the intelligent search UI, video engagement tracking, learner progress persistence, and all supporting content models and scripts.

## Skills Read
- `git`: For version control and PR workflow.
- `AGENTS.md`: For commit standards and reporting protocols.

## Code Inspected
- `git status`: Verified a clean working tree of relevant files after restoring `.env.example` and deleting artifacts.
- `web/`: Contains the intelligent search, lesson, and course page implementations, along with PostHog instrumentation.
- `studio/`: Contains the updated content model (lesson, progress, video) and ingestion scripts.
- `prompts/`: Contains the implementation history and design decisions.

## Decisions & Assumptions
- **Branch**: Push to the current active branch `feat/intelligent-search`.
- **Commit Message**: `feat: implement intelligent search, video engagement tracking, and learner progress`.
- **Co-author**: Include `Co-authored-by: Junie <junie@jetbrains.com>` in the commit trailer.
- **Exclusions**: Already removed `.png` artifacts and `IMPLEMENTATION_COMPLETE.md`. Sensitive `.env*` files are ignored by `.gitignore`.
- **PR Link**: Provide a direct GitHub URL to create the PR since `gh` CLI is not available.

## Proposed Changes
### Project Root
- `.env.example`: Updated with new keys for PostHog, AI Search, and Sanity tokens.
- Stage `AGENTS.md`, `CLAUDE.md`, `README.md`, `package.json`, and `package-lock.json`.
- Stage all files in `prompts/`.

### web
- Stage all implementation files in `app/`, `components/`, and `lib/`.
- Stage `package.json`, `package-lock.json`, and `sanity.types.ts`.

### studio
- Stage all schema changes and ingestion scripts.
- Stage `package.json` and `package-lock.json`.

## Security Considerations
- Verified that `.env` files are not staged.
- Verified that `.env.example` only contains placeholders.
- Verified that tokens are not hardcoded in the committed files.

## Acceptance Criteria
- All implementation files are staged and committed.
- The repository reflects the full feature set as described in `AGENTS.md`.
- Code is pushed to `origin/feat/intelligent-search`.
- A PR link is provided.

## Checks to Run
- `git status`: Verify no sensitive files are staged.
- `npm run lint` in `web`: Ensure no regressions.
- `git push`: Confirm success.

## Manual Test Steps
1. Open the provided PR link in a browser.
2. Review the diff to ensure all search, video, and progress features are present.
3. Confirm that no secret tokens are included in the diff.
