# Implementation Prompt: Cogni Logo Change

## Goal
Change the branding logo from "Vertex" to "Cogni" in the `SiteHeader` component to align with the Cogni design system.

## Skills Used
- `tailwind-v4-shadcn`: For ensuring consistency with the Tailwind v4 design tokens.
- `AGENTS.md`: For following the project rules on branding and UI implementation.

## Inspection Summary
- **Current Component**: `components/site-header.tsx` uses a hardcoded `<span>Vertex</span>` and an inverted triangle SVG.
- **Design Requirement**: The project branding is "Cogni". The design system reference `@design/cogni-designsystem.png` confirms the name and the primary orange color.

## Decisions & Assumptions
- **Branding**: The brand name is "Cogni".
- **Visuals**: Keep the current inverted triangle SVG as it was previously adjusted to match the "orange logo in the design". Only the text label needs to change.
- **Typography**: The logo text uses `text-xl font-bold tracking-tight text-neutral-900`, which is consistent with the design's header branding.

## Proposed Changes

### 1. Update `components/site-header.tsx`
- Replace `<span className="text-xl font-bold tracking-tight text-neutral-900">Vertex</span>` with `<span className="text-xl font-bold tracking-tight text-neutral-900">Cogni</span>`.

## Security Considerations
- This is a purely presentational change. No security implications.

## Acceptance Criteria
- The logo text in the header displays "Cogni" instead of "Vertex".
- The layout and styling remain intact.

## Verification Plan
1. **Type Check**: Run `npx tsc --noEmit`.
2. **Lint**: Run `npm run lint`.
3. **Visual Check**:
    - Verify the header logo displays "Cogni".
    - Ensure the SVG icon and spacing are preserved.

## Manual Test Steps
1. Start dev server: `npm run dev`.
2. Open `http://localhost:3000`.
3. Confirm the logo in the top-left corner says "Cogni".
