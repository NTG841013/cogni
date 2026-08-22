# Implementation Prompt: Remove Sign Up Button from Header

## Goal
Remove the "Sign Up" button from the site header as requested, keeping only the "Sign In" button since Clerk's sign-in flow already includes a sign-up option.

## Skills Used
- `clerk-setup`: For understanding Clerk component usage.
- `clerk-nextjs-patterns`: For verifying component properties.

## Inspection Summary
- **File**: `components/site-header.tsx`
- **Current State**: The header contains both `SignInButton` and `SignUpButton` inside a `<Show when="signed-out">` block. `SignInButton` currently uses `variant="ghost"`.

## Decisions & Assumptions
- Remove the `SignUpButton` component and its corresponding import.
- Change the `SignInButton` child button to the primary variant (removing `variant="ghost"`) to make it the clear call-to-action in the header, as it will now be the only authentication button.

## Proposed Changes

### 1. Update UI (`components/site-header.tsx`)
- Remove `SignUpButton` from the `@clerk/nextjs` import.
- Remove the entire `<SignUpButton>` block from the header.
- Update the `<Button>` inside `<SignInButton>` to remove `variant="ghost"`, making it the primary button.

## Security Considerations
- None. This is a purely UI change.

## Acceptance Criteria
- The header displays only one button ("Sign In") when the user is signed out.
- The button is styled as a primary action.
- The project passes type checks.

## Verification Plan
1. Run `npx tsc --noEmit` to ensure no broken imports or types.
2. Manually verify the UI in a browser.

## Manual Test Steps
1. Navigate to the homepage while logged out.
2. Confirm the "Sign Up" button is gone.
3. Confirm the "Sign In" button is now a solid primary button.
4. Click "Sign In" and verify the modal appears.
