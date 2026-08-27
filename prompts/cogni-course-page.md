# Implementation Prompt: Cogni Course Page

## Goal
Implement the course detail page as shown in `@design/cogni-course.png`. The page will fetch data from Sanity using the `COURSE_QUERY` and display course metadata, learning outcomes, and module/lesson content. It will also integrate with Clerk for progress tracking and feature a sticky progress footer.

## Skills Used
- `sanity-best-practices`: For GROQ queries, fetching, and Portable Text rendering.
- `tailwind-v4-shadcn`: For using existing shadcn/ui components and Tailwind v4 utility classes.
- `next_modules/next/dist/docs/`: For Next.js App Router patterns (dynamic routes, server components).
- `clerk`: For user authentication and progress tracking integration.

## Inspection Summary
- **Route**: `web/app/courses/[slug]/page.tsx`
- **Schema**: `course`, `module` (object), `lesson`, `learningOutcome` (object).
- **Data**: Seeded content in `studio/seed.ndjson` includes a "Next.js App Router in Depth" course which matches the design reference.
- **Components Available**: `Button`, `Badge`, `Progress`, `Breadcrumb`, `Card`, `SiteHeader`.
- **Progress Tracking**: `progress` document in Sanity keyed by `clerkUserId`.

## Decisions & Assumptions
- **Server Components**: The main page will be a Server Component to fetch Sanity data.
- **Dynamic Icons**: Use a helper component to map icon names from `learningOutcome.icon` to Lucide icons.
- **Duration Calculation**: Total course duration will be calculated by summing all `lesson.duration` values.
- **Formatting**: Use `Intl.NumberFormat` for student counts (e.g., 2.1k) and a helper to format seconds into `Xh Ym`.
- **Progress**: If the user is signed in, fetch their progress for the specific course. The sticky footer shows the percentage of completed lessons.
- **Interactivity**: The module list will be an accordion (using Radix/shadcn). "Show all modules" will expand the list if there are more than 6.

## Proposed Changes

### 1. Data Fetching & Types
- Verify `COURSE_QUERY` in `web/lib/sanity/queries.ts` fetches all needed fields:
  ```groq
  *[_type == "course" && slug.current == $slug][0] {
    ...,
    instructor->,
    category->,
    learningOutcomes[] {
      icon,
      title,
      description
    },
    modules[] {
      ...,
      lessons[]-> {
        ...,
      }
    }
  }
  ```
- Add a helper to `web/lib/utils.ts` for formatting duration.

### 2. Page Implementation (`web/app/courses/[slug]/page.tsx`)
- Implement the route with breadcrumbs: `All Courses > [Course Title]`.
- **Hero Section**:
  - `popular` badge if applicable.
  - Title and summary.
  - Stats: Level, Duration, Module Count, Student Count.
  - Action buttons: "Continue Learning" (or "Start Learning") and "Bookmark".
  - Course cover image with specific styling (rounded corners, shadow).
- **"What you'll learn" Section**:
  - Grid of `learningOutcome` cards.
- **"Course Content" Section**:
  - Summary stats.
  - Accordion list of modules.
  - Lesson rows with duration and completion status (if signed in).
  - "Show all modules" toggle.
- **Sticky Footer**:
  - Rendered only if progress exists or user is enrolled.
  - Shows percentage complete and "Continue Learning" button.

### 3. Progress Integration
- Fetch user progress in the Page component using `auth()` from `@clerk/nextjs/server`.
- Pass progress data to the content and footer components.

### 4. Styling
- Follow the typography and color tokens from the design system.
- Ensure responsive layout (stacked on mobile).
- Add the decorative background texture and bars as seen in the home page.

## Security Considerations
- Sanity read token remains on the server.
- Progress writes (future task) will go through server actions/routes.
- Clerk handles all authentication logic.

## Acceptance Criteria
- Page is accessible at `/courses/[slug]`.
- Layout exactly matches `@design/cogni-course.png`.
- Data is correctly pulled from Sanity.
- Duration and module counts are accurate.
- Sticky footer appears and shows correct progress.
- Page is responsive and follows the Cogni design system.

## Verification Plan
1. **Build**: `npm run build` in `web` workspace.
2. **Lint**: `npm run lint` in `web` workspace.
3. **Manual Test Steps**:
   - Start the dev server: `npm run dev`.
   - Navigate to `/courses/nextjs-app-router-in-depth`.
   - Verify all metadata (instructor, level, duration) matches the seeded data.
   - Check if breadcrumbs work correctly.
   - Test the module accordion functionality.
   - Verify the sticky footer appears at the bottom.
   - Test responsiveness by resizing the browser window.
