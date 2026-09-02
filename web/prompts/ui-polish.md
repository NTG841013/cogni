# Implementation Prompt: Cogni UI Polish & Refinement

## Goal
Refine the UI of the Lesson Page, Course Page, and Sidebar to match the high-quality professional design seen in the reference images (`cogni-lesson.png` and `cogni-course.png`). The current implementation was noted as "sloppy" and needs polish in spacing, typography, and color consistency.

## Reference Images
- `design/cogni-lesson.png`: Primary reference for the lesson page and sidebar.
- `design/cogni-course.png`: Primary reference for the course detail page and modules list.

## Core Refinements

### 1. Global & Theme
- **Backgrounds**: Ensure the main content background is White (`#FFFFFF`) and the sidebar/secondary areas are Neutral-50 (`#F9FAFB`).
- **Typography**: Strictly use Playfair Display for headings and Inter for body. Refine line heights and letter spacing to match refs.
- **Icons**: Ensure `lucide-react` icons are sized correctly (mostly 16px-18px for metadata).

### 2. Site Header
- **Logo**: Refine the 'C' logo in a circle.
- **Nav**: Ensure clean spacing and font weights.

### 3. Lesson Page & Sidebar
- **Sidebar (`lesson-sidebar.tsx`)**:
    - Change background to `bg-neutral-50`.
    - Active Module: Use `bg-orange-50/80` background, primary color for title.
    - Active Lesson: Display an orange dot on the left and a Play button icon on the right. Bold the lesson title.
    - Inactive Lessons: Use a small empty circle or dot.
    - Refine "Back to course" link and progress bar area.
- **Lesson Header**:
    - Badge: Update "LESSON X.Y" badge to use `bg-orange-50 text-orange-600` (or similar brand colors).
    - Metadata: Clean horizontal layout with Clock, Signal (Level), and Users icons.
- **Tabs**: Refine the active state underline.
- **Footer**:
    - "Next Lesson": Large solid orange button.
    - "Previous Lesson": Subtle ghost button with icon.

### 4. Course Page
- **What you'll learn**: Wrap the outcomes grid in a large `bg-neutral-50` rounded box. Refine outcome cards to be cleaner (white background, subtle shadow).
- **Course Content (`ModuleAccordion.tsx`)**:
    - Switch from individual module cards to a single unified list with `border-b` separators.
    - Align module numbers, titles, and summaries cleanly.
    - Place duration and chevron together on the right.
- **Hero**: Refine layout and metadata spacing.

### 5. Components Polish
- **Badge**: Update variants to match the orange-themed design system.
- **Card**: Ensure consistent `rounded-2xl` or `rounded-3xl` usage as per ref.

## Proposed Changes

### 1. `web/components/ui/badge.tsx`
- Update `lesson` variant colors to `bg-orange-50 text-orange-600 border-none`.

### 2. `web/components/lesson-sidebar.tsx`
- Complete rewrite of the styling to match `cogni-lesson.png`.
- Implement the "Now playing" dot and play button logic.

### 3. `web/app/courses/[slug]/ModuleAccordion.tsx`
- Redesign to a flat list style with separators.

### 4. `web/app/courses/[slug]/[lessonSlug]/page.tsx`
- Refine main content layout, breadcrumbs, and footer.

### 5. `web/app/courses/[slug]/page.tsx`
- Refine hero, outcomes grid, and overall spacing.

## Acceptance Criteria
- Lesson Page and Sidebar are visually indistinguishable from `cogni-lesson.png`.
- Course Page matches `cogni-course.png` polish.
- Typography and spacing are consistent and professional across all pages.
- Mobile responsiveness is preserved while maintaining desktop exactness.

## Verification
- Manual visual comparison between implementation and reference images.
- `npm run lint` and `npm run type-check`.
