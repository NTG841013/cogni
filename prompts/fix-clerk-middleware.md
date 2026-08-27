# Fix Clerk Middleware Location

## Goal
Fix the Clerk runtime error `auth() was called but Clerk can't detect usage of clerkMiddleware()` by moving the authentication middleware to the correct location in the `web` workspace.

## Skills Read
- `clerk-nextjs-patterns`
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`

## Code Inspected
- `D:\cogni\proxy.ts`: Found the existing middleware configuration in the repo root.
- `D:\cogni\web\app\courses\[slug]\page.tsx`: Uses `auth()` which requires middleware.
- `D:\cogni\web\app\layout.tsx`: `ClerkProvider` is correctly configured.
- `node_modules/next/dist/docs/`: Confirmed that in Next.js 16, `middleware.ts` is renamed to `proxy.ts`.

## Decisions & Assumptions
- Move `D:\cogni\proxy.ts` to `D:\cogni\web\proxy.ts`.
- Next.js 16 expects `proxy.ts` in the project root (the `web` workspace root).
- The existing content of `proxy.ts` is correct for Clerk.

## Files to Touch
- `D:\cogni\proxy.ts` (delete/move)
- `D:\cogni\web\proxy.ts` (create)

## Requirements
- Ensure Clerk middleware is active for the `web` workspace.
- The `proxy.ts` file must export `clerkMiddleware()` and a valid `matcher`.

## Security Considerations
- Middleware is critical for protecting routes. The existing matcher excludes static assets which is correct for performance and preventing infinite loops.

## Acceptance Criteria
- `D:\cogni\web\proxy.ts` exists.
- `npm run build` in `web` succeeds.
- The runtime error in `CoursePage` is resolved.

## Checks to Run
- `npm run lint` in `web`.
- `npm run build` in `web`.

## Manual Test Steps
1. Navigate to `web` directory.
2. Run `npm run dev`.
3. Access a course page (e.g., `/courses/some-slug`).
4. Verify no Clerk error is thrown and `auth()` returns the user state.
