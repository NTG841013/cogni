# Implementation Prompt: Cogni Home Page

## Goal
Implement the Cogni home page based on the `@design/cogni-home.png` design reference. This includes the header, hero section, search bar, course grid, and decorative footer elements.

## Skills Used
- `node_modules/next/dist/docs/`: For Next.js 15+ patterns (App Router, Server Components).
- `tailwind-v4-shadcn`: For styling with Tailwind CSS v4.
- `sanity-best-practices`: For future-proofing the data fetching architecture.

## Inspection Summary
- **Current State**: `app/page.tsx` is the default Next.js template. Design tokens (colors, typography, spacing) are already configured in `app/globals.css`.
- **Components Available**: `Button`, `Input`, `Badge`, `Card`, `Progress` in `components/ui/`.
- **Design Specifications**:
    - **Header**: Logo (Cogni), Nav (Courses, My Learning), Notification bell, User avatar.
    - **Hero**: Playfair Display heading, Inter body, Primary orange button.
    - **Search**: Large input with search icon and keyboard shortcut hint (⌘ K).
    - **Courses**: Grid of 3 cards (Next.js, Docker, TypeScript).
    - **Branding**: The design uses "Vertex" as the logo/brand name.

## Decisions & Assumptions
- **Branding**: Use the "Cogni" branding as shown in the design image.
- **Data**: Since the Sanity client is not yet initialized in the project, I will use a local `mockCourses` array for the initial implementation to ensure immediate visual fidelity.
- **Layout**: Create a main `SiteHeader` component and use standard Tailwind containers for the page sections.
- **Icons**: Use `lucide-react` for the search icon, notification bell, clock, bar-chart, and book icons in the course cards.
- **Responsiveness**: Implement a mobile-responsive layout that stacks columns on smaller screens while maintaining the exact desktop design.

## Proposed Changes

### 1. New Components
- **`components/site-header.tsx`**: Header with logo, navigation, and user actions.
- **`components/course-card.tsx`**: Individual course card showing icon, title, summary, and metadata (level, duration, modules).

### 2. Home Page Implementation (`app/page.tsx`)
- Replace the existing content with:
    - **Hero Section**: Badge "INTELLIGENT LEARNING", Heading "Search your learning in plain English.", subtext, and "Explore Courses" button.
    - **Search Section**: Centered search input with shadow and ⌘ K hint.
    - **Course Grid**: "All Courses" heading with "View all courses" link, followed by a grid of `CourseCard` components.
    - **Footer Banner**: Decorative section with the star icon and "New courses and lessons added every week" message.
    - **Decorations**: Orange gradient bars at the bottom as seen in the design.

### 3. Styling
- Use Tailwind v4 custom spacing and type scales (e.g., `text-display-1`, `font-serif`, `bg-primary`).
- Match the background colors and shadows precisely from the design.

## Security Considerations
- The current implementation is presentational. Once Clerk is integrated, the user avatar and "My Learning" link will be conditionally rendered.
- No sensitive data or tokens are used.

## Acceptance Criteria
- The layout exactly matches `@design/cogni-home.png` (desktop).
- The page is responsive and usable on mobile devices.
- Typography and colors match the design system definitions in `globals.css`.
- Course cards correctly display all metadata (Level, Time, Modules).
- The search bar focus state and button hover states are implemented.

## Verification Plan
1. **Type Check**: Run `npx tsc --noEmit`.
2. **Lint**: Run `npm run lint`.
3. **Visual Check**:
    - Verify Header alignment and spacing.
    - Verify Hero section typography (Playfair Display).
    - Verify Course card layout and icons.
    - Verify the bottom orange decorations.

## Manual Test Steps
1. Start dev server: `npm run dev`.
2. Open `http://localhost:3000`.
3. Compare the implementation side-by-side with `@design/cogni-home.png`.
4. Test resizing the window to ensure responsiveness.
5. Verify hover states for the "Explore Courses" button and course cards.
