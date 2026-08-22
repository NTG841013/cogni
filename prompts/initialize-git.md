# Implementation Prompt: Initialize Git and Push to Remote

## Goal
Initialize the Git repository, configure the remote origin, and push the initial commit to GitHub.

## Skills Used
- Terminal/PowerShell proficiency.
- Git workflow.

## Inspection Findings
- The project already has a `.git` directory (likely from `create-next-app`).
- No remotes are currently configured.
- `README.md` already exists with standard Next.js content.

## Decisions and Assumptions
- I will follow the user's provided commands exactly, which appends `# cogni` to `README.md` and only adds `README.md` to the initial commit.
- I assume the user intends to follow the standard GitHub initialization flow.
- I will use `git init` which is safe to run on an existing repository.
- I will use `git branch -M main` to ensure the default branch is named `main`.

## Files to Touch
- `README.md` (append content)
- `.git/` (configuration)

## Requirements
- `README.md` must contain `# cogni` at the end.
- The repository must have a remote `origin` pointing to `https://github.com/NTG841013/cogni.git`.
- The `main` branch must be pushed to the remote.

## Security Considerations
- The remote URL is public (GitHub).
- No sensitive tokens are being added to the repository in this step (only `README.md` is added).

## Acceptance Criteria
- `README.md` updated.
- `git remote -v` shows the correct origin.
- `git status` shows the commit is successful.
- `git push` command is executed (verification of successful push depends on network/permissions, but command execution will be reported).

## Checks to Run
- `git remote -v`
- `git branch`
- `tail -n 1 README.md`

## Manual Test Steps
1. Run `git remote -v` to verify the origin is set.
2. Run `git log -1` to verify the commit.
3. Check the GitHub repository at `https://github.com/NTG841013/cogni.git` to see the pushed content.
