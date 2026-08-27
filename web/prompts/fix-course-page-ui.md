# Fix Course Page UI to match design

## Goal
Update the course detail page UI to exactly match the reference designs provided in `1.png`, `2.png`, and `3.png`.

## Skills Read
- `AGENTS.md` (UI work guidelines)
- `node_modules/next/dist/docs/`

## Code Inspected
- `web/app/courses/[slug]/page.tsx`: Found background texture, decorative bars, and layout discrepancies in Hero and "What you'll learn" sections.
- `web/app/courses/[slug]/ModuleAccordion.tsx`: Found discrepancies in rounded corners and lesson icon styles.
- `web/components/site-header.tsx`: Found the logo SVG is more complex than the reference.
- `web/app/globals.css`: Confirmed font and spacing tokens.

## Decisions & Assumptions
- The attached images (`1.png`, `2.png`, `3.png`) are the ground truth for the UI.
- Background texture and decorative bars should be removed as they are not in the reference.
- The hero image should be `aspect-video` (16:9) to match the source image dimensions and reference layout.
- Icons in "What you'll learn" should be plain orange without a background box.
- Module cards in the accordion should have larger rounded corners (`rounded-3xl`).
- The logo should be simplified to a single primary color shape if it matches the reference more closely.

## Files to Touch
- `web/app/courses/[slug]/page.tsx`
- `web/app/courses/[slug]/ModuleAccordion.tsx`
- `web/components/site-header.tsx`

## Requirements
- Match layout, spacing, typography, and colors from `1.png`, `2.png`, and `3.png`.
- Remove all non-reference decorative elements.
- Ensure responsive behavior (stacking columns on mobile) while keeping desktop exact.

## Security Considerations
- No sensitive data or tokens are handled in this UI-only task.

## Acceptance Criteria
- Hero section matches `1.png` (landscape image, soft shadow, no texture).
- "What you'll learn" matches `2.png` (cards on background, simple icons).
- "Course Content" matches `3.png` (soft rounded corners, outline icons for lessons).
- Site header logo matches `1.png`.

## Checks to Run
- `npm run lint` in `web`.
- `npm run build` in `web`.

## Manual Test Steps
1. Navigate to a course page.
2. Compare the top hero section with `1.png`.
3. Compare the "What you'll learn" section with `2.png`.
4. Compare the "Course Content" section with `3.png`.
5. Verify the logo in the header matches `1.png`.
