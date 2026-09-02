# Implementation Prompt: Cogni Lesson Page

## Goal
Implement the lesson page as shown in `@design/cogni-lesson.png`. The page will feature a video player, a course navigation sidebar, breadcrumbs, and a tabbed interface for lesson content and notes. It will be wired to Sanity for content and Clerk for progress display.

## Skills Used
- `tailwind-v4-shadcn`: For UI components and styling.
- `portable-text-serialization`: For rendering lesson notes.
- `node_modules/next/dist/docs/`: For App Router patterns.

## Inspection Summary
- **Route**: `web/app/courses/[courseSlug]/[lessonSlug]/page.tsx`
- **Design Features**:
    - Sidebar: Back to course, Course title, Progress %, Module/Lesson list.
    - Header: Breadcrumbs: All Courses > [Course] > [Module] > [Lesson].
    - Lesson Info: Label (LESSON X.Y), Title, Summary, Metadata (Duration, Level, Students).
    - Video Player: Embedded player (YouTube/Vimeo/Bunny) starting at a specific timestamp if provided in query.
    - Tabs: "Lesson Content" (Overview, Checklist, Pro Tip, Resources) and "Notes" (Portable Text).
    - Footer: Previous and Next lesson navigation.
- **Sanity Schema**: `lesson`, `course`, `module`, `video`.
- **Missing Fields**: The design shows a lesson summary under the title. I will add a `summary` field to the `lesson` schema to support this, or fallback to the first block of notes if not provided.

## Decisions & Assumptions
- **Route**: Using `/courses/[courseSlug]/[lessonSlug]` to match the design's breadcrumb flow.
- **Data Fetching**: Fetch the course and the specific lesson in a single page component (Server Component).
- **Video Player**: Create a `VideoPlayer` component that handles YouTube, Vimeo, and Bunny embeds with a `start` parameter.
- **Sidebar**: Implement a `LessonSidebar` component that reflects the course structure and highlights the current lesson.
- **Tabs**: Implement a client-side tab switcher for "Lesson Content" and "Notes".
- **Progress**: Use existing Clerk integration to show progress percentage in the sidebar.
- **Navigation**: Calculate "Previous" and "Next" lessons based on their order in the course modules.

## Proposed Changes

### 1. Schema Update (`studio/sanity/schemaTypes/documents/lesson.ts`)
- Add a `summary` field (string/text) to the `lesson` document.

### 2. Components

#### `web/components/video-player.tsx` (Client)
- Accept `url` and optional `startTime`.
- Detect provider (YouTube, Vimeo, Bunny).
- Render appropriate `<iframe>` with correct parameters (e.g., `?t=123`, `?start=123`).

#### `web/components/lesson-sidebar.tsx` (Client)
- Display course info and progress.
- Render module accordions with lesson links.
- Highlight "Now playing" for the current lesson.

#### `web/components/lesson-tabs.tsx` (Client)
- Handle switching between "Lesson Content" and "Notes".

#### `web/components/portable-text.tsx`
- Reusable component for rendering Sanity Portable Text using `@portabletext/react`.

### 3. Page Implementation (`web/app/courses/[courseSlug]/[lessonSlug]/page.tsx`)
- Fetch Course, Lesson, and User Progress.
- Construct breadcrumbs.
- Render Sidebar and Main Content area.
- Implement "In this lesson you will" using `lesson.keyPoints`.
- Implement "Pro Tip" box using `lesson.proTip`.
- Implement "Resources" grid using `lesson.resources`.

### 4. Styling
- Follow Tailwind v4 patterns and Cogni design system tokens.
- Ensure the layout is responsive (sidebar collapses or moves to top/bottom on mobile).

## Security Considerations
- Keep Sanity tokens on the server.
- Validate slugs to prevent injections or broken links.

## Acceptance Criteria
- Lesson page exactly matches `@design/cogni-lesson.png`.
- Video plays correctly and respects the `start` query parameter.
- Sidebar shows all lessons and correctly highlights the active one.
- Navigation (Previous/Next) works as expected.
- Page is responsive and follows the design system.

## Verification Plan
1. **Sanity**: Add a summary to a test lesson in Studio.
2. **Build**: `npm run build` in `web`.
3. **Manual Test Steps**:
    - Navigate to `/courses/[course-slug]/[lesson-slug]`.
    - Verify video embed loads and plays.
    - Check breadcrumbs and sidebar links.
    - Test tab switching.
    - Verify responsive layout on mobile view.
    - Test Previous/Next navigation.
