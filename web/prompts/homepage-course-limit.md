# Limit Homepage Courses and Add Catalog Page

## Goal
Modify the homepage to display only 3 courses and create a new "All Courses" page (catalog) to show the full list of courses, as requested by the user.

## Skills Read
- `node_modules/next/dist/docs/`: For App Router page creation and data fetching patterns.
- `AGENTS.md`: For page structure and responsibilities.

## Code Inspected
- `web/app/page.tsx`: Current homepage fetching all courses and displaying them.
- `web/lib/sanity/queries.ts`: `COURSES_QUERY` fetches all courses.
- `web/components/course-card.tsx`: Used to render individual courses.
- `web/components/site-header.tsx`: Header component.

## Decisions and Assumptions
- Create `web/app/courses/page.tsx` for the full course list.
- Use the same styling as the homepage's course grid for the catalog page to maintain consistency.
- Slice the `courses` array to 3 in `web/app/page.tsx` for the homepage display.
- Update all "View all" and "Explore" links on the homepage to point to `/courses`.
- The catalog page will include the `SiteHeader` and a similar footer to the homepage.

## Files to Touch
- `web/app/page.tsx`
- `web/app/courses/page.tsx` (new file)

## Requirements
- Homepage must show exactly 3 courses (or fewer if less than 3 exist).
- "Explore Courses" button must navigate to `/courses`.
- "View all courses" link must navigate to `/courses`.
- `/courses` page must display all available courses in the standard grid layout.

## Security Considerations
- Data fetching remains server-side using the `serverClient` as per project rules.

## Acceptance Criteria
- Homepage displays a maximum of 3 courses.
- Clicking "Explore Courses" or "View all courses" takes the user to `/courses`.
- `/courses` page lists all courses correctly.
- `npm run lint` and `npm run build` pass in the `web` workspace.

## Checks to Run
- `npm run lint` in `web`.
- `npm run build` in `web`.

## Manual Test Steps
1. Open the homepage.
2. Verify only 3 course cards are visible.
3. Click the "Explore Courses" button and verify it navigates to `/courses`.
4. Click the "View all courses" link and verify it navigates to `/courses`.
5. Verify that `/courses` shows all courses in the dataset.
