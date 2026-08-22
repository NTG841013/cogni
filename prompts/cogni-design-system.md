# Implementation Prompt: Cogni Design System

## Goal
Implement the Cogni Design System as defined in `@design/cogni-designsystem.png`. This includes setting up the theme (colors, typography, spacing, radius, shadows) using Tailwind CSS v4 and building core UI components.

## Skills Used
- `tailwind-v4-shadcn`: For Tailwind v4 + shadcn/ui architecture.
- `next_modules/next/dist/docs/`: For Next.js 15+ patterns (next/font, app router).

## Inspection Summary
- **Project Type**: Next.js 16 (App Router) with Tailwind CSS v4.
- **Current State**: Fresh project, `app/globals.css` using default Tailwind 4 setup.
- **Design Tokens**:
    - **Colors**: Primary (#F97316) and Neutral (#0F172A) scales.
    - **Typography**: Playfair Display (Serif) for headings, Inter (Sans) for body.
    - **Spacing**: 4px base unit.
    - **Radius**: xs (4px) to xl (24px).
    - **Shadows**: Sm, Md, Lg, Xl with specific rgba values.

## Decisions & Assumptions
- **Architecture**: Follow the "Four-Step Architecture" from `tailwind-v4-shadcn` skill.
- **Components**: Initialize shadcn/ui and build core components (Button, Input, Badge, Progress, Card) to match design specifications.
- **Fonts**: Use `next/font/google` for Playfair Display and Inter.
- **Dark Mode**: Implement basic dark mode support using CSS variables, though the design reference is light-themed.
- **Icons**: Use `lucide-react` as the base icon library, matching the "Outline" and "Filled" styles where possible.

## Proposed Changes

### 1. Configuration & Dependencies
- Install `lucide-react`, `clsx`, `tailwind-merge`.
- Initialize shadcn/ui with `npx shadcn@latest init` (selecting Tailwind v4 compatible options).
- Update `components.json` to have `"config": ""` and correct CSS path.

### 2. Styling (Tailwind v4)
- **`app/globals.css`**:
    - Define all design tokens in `:root` using `hsl()` values.
    - Map variables to Tailwind utilities in `@theme inline`.
    - Set up base typography and layout styles in `@layer base`.
- **Fonts**:
    - Configure `next/font` in `app/layout.tsx`.
    - Add font-family variables to `@theme inline`.

### 3. Core Components
- **Button**: Implement Primary, Secondary, Tertiary, and Text variants with hover and disabled states.
- **Input**: Implement Search/Text Input and Select styles.
- **Badge**: Implement Video, Lesson, and Popular tags.
- **Progress**: Implement the orange progress bar.
- **Cards**: Implement Course Card, Lesson Card (Video/Lesson), and Resource Card layouts.
- **Navigation**: Implement Breadcrumbs and Pagination components.

### 4. Demo Page
- Create a `app/design-system/page.tsx` to showcase all implemented components and styles.

## Security Considerations
- Ensure all components are accessible (using Radix UI primitives via shadcn).
- No tokens or sensitive data involved in UI implementation.

## Acceptance Criteria
- Tailwind v4 correctly configured with all design system tokens.
- All core components from the design system image are implemented and visually match.
- Typography (Playfair Display and Inter) is correctly applied.
- Components are responsive and handle different states (hover, disabled).

## Verification Plan
1. **Build**: Run `npm run build` to ensure no styling or type errors.
2. **Lint**: Run `npm run lint`.
3. **Visual Check**:
    - Open `/design-system` page.
    - Verify color accuracy against HEX values.
    - Verify font application.
    - Verify component states (hover/focus).
    - Check responsiveness.

## Manual Test Steps
1. Start dev server: `npm run dev`.
2. Navigate to `http://localhost:3000/design-system`.
3. Compare the rendered components with the `@design/cogni-designsystem.png` image.
4. Test the Search Input focus state.
5. Test Button hover effects.
