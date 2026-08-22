# Implementation Prompt: Stylized "C" Logo Update

## Goal
Replace the current "V" logo icon in the site header with a new geometric "C" logo for "Cogni".

## Skills Used
- Next.js best practices
- SVG design and implementation

## Code Inspected
- `components/site-header.tsx`: Contains the current SVG logo implementation.
- `package.json`: Verified project dependencies and structure.

## Decisions and Assumptions
- The logo should maintain the 32x32 viewbox to ensure consistent sizing with the current header layout.
- A "folded ribbon" design is chosen for the geometric "C" to satisfy the "overlapping paths" and "3D effect" constraints.
- Colors `text-primary` and `text-primary-400` will be applied to the two paths respectively.
- The design will be responsive and professional, fitting the Cogni learning platform's brand.

## Proposed SVG Design
```html
<svg
  width="32"
  height="32"
  viewBox="0 0 32 32"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M26 6H6V22L12 16V12H26V6Z"
    fill="currentColor"
    className="text-primary"
  />
  <path
    d="M6 10L12 16V20H26V26H6V10Z"
    fill="currentColor"
    className="text-primary-400"
  />
</svg>
```

## Files to Touch
- `components/site-header.tsx`

## Requirements
- Replace the existing SVG in `components/site-header.tsx`.
- Ensure paths use `fill="currentColor"` and the specified Tailwind classes.
- Maintain the `32x32` viewbox.

## Security Considerations
- None (purely a UI/SVG change).

## Acceptance Criteria
- The "V" icon is gone.
- A stylized "C" icon is present in its place.
- The icon uses two paths with the correct primary colors.
- The header layout remains intact.

## Checks to Run
- `npm run lint` to ensure no syntax errors were introduced.

## Manual Test Steps
1. Open the application in a browser.
2. Verify the logo in the top-left corner of the header.
3. Confirm it looks like a geometric "C" with a folded effect.
4. Verify colors match the `text-primary` and `text-primary-400` theme.
