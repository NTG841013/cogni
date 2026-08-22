# Implementation Prompt: Add Clerk Authentication

## Goal
Set up Clerk authentication using the Clerk CLI, integrate it into the Next.js App Router project, and ensure UI components (Sign In, Sign Up, User Button) match the design using the shadcn theme.

## Skills Used
- `clerk-setup`: For CLI-driven initialization and framework-specific patterns.
- `clerk-cli`: For operating the `clerk` binary.
- `node_modules/next/dist/docs/`: For Next.js 15+ async `auth()` and middleware patterns.

## Inspection Summary
- **Framework**: Next.js (App Router).
- **Package Manager**: npm (based on `package-lock.json`).
- **UI System**: shadcn/ui (`components.json` exists).
- **App ID**: `app_3IEqGCM7WoVMo6klIa59oy9mZsq`.
- **Target Files**:
    - `app/layout.tsx`: Root layout for `ClerkProvider`.
    - `components/site-header.tsx`: Header for auth controls.
    - `middleware.ts`: Clerk middleware and proxy matcher.
    - `app/globals.css`: Global styles for shadcn theme.

## Decisions & Assumptions
- **SDK**: Use `@clerk/nextjs`.
- **Theme**: Apply `shadcn` theme from `@clerk/ui/themes`.
- **Middleware**: Use the recommended Next.js proxy matcher.
- **Controls**: Replace the current mock avatar in `SiteHeader` with `UserButton`, and add `SignInButton`/`SignUpButton` for signed-out states.

## Proposed Changes

### 1. Clerk Initialization
- Install/update Clerk CLI: `npm install -g clerk` / `clerk update --yes`.
- Authenticate: `clerk auth login`.
- Initialize: `clerk init --app app_3IEqGCM7WoVMo6klIa59oy9mZsq`.

### 2. Provider Setup (`app/layout.tsx`)
- Wrap the `<body>` content with `<ClerkProvider appearance={{ theme: shadcn }}>`.
- Ensure it's inside the `<body>` tag as per Next.js 15+ best practices.

### 3. Middleware (`middleware.ts`)
- Verify/Create `middleware.ts`.
- Ensure `config.matcher` includes `'/__clerk/:path*'` after `'/(api|trpc)(.*)'`.

### 4. UI Integration (`components/site-header.tsx`)
- Import `SignInButton`, `SignUpButton`, `UserButton` from `@clerk/nextjs`.
- Use conditional rendering to show:
    - `SignInButton` and `SignUpButton` when signed out.
    - `UserButton` and `Bell` when signed in.

### 5. Styling (`app/globals.css`)
- Import `@clerk/ui/themes/shadcn.css`.

## Security Considerations
- Ensure `CLERK_SECRET_KEY` is kept in `.env.local` and never exposed to the client.
- Use `await auth()` in any server components as per Next.js 15+ rules.

## Acceptance Criteria
- `clerk doctor` reports no issues.
- Sign-in and Sign-up flows work correctly.
- User button appears upon successful login.
- Layout remains responsive and consistent with the design.

## Verification Plan
1. Run `clerk doctor`.
2. Start dev server and verify the header UI changes.
3. Test sign-up flow.
4. Verify `UserButton` functionality.
5. Check console for any Clerk-related errors or warnings.

## Manual Test Steps
1. Run `npm run dev`.
2. Navigate to `http://localhost:3000`.
3. Click "Sign In" or "Sign Up" and complete the flow.
4. Confirm the avatar/user button replaces the sign-in buttons.
5. Log out and confirm the buttons reappear.
