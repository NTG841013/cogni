# Implementation Prompt: Cogni Search Results Page

## Goal
Build a full-screen search results page that displays lesson and video results from the Sanity Context MCP search API, matching the attached UI design exactly. The page must be queryable via URL params, handle loading/error states, support sorting, and render all results with proper pagination and metadata.

## Skills Applied
- **AGENTS.md section 11**: Search behavior (full results page, two result kinds, grounding, sorting, count display)
- **AGENTS.md section 5 & 12**: Server/client boundaries, token handling, dataset privacy
- **Tailwind v4 and shadcn/ui patterns** from existing components

## Inspection Summary
**Current state:**
- `web/lib/search.ts` defines `SearchResult` (with id, type, courseTitle/Slug, lessonTitle/Slug, moduleTitle, lessonNumber, description, keyPoints, thumbnailUrl, durationSeconds, matchedAtSeconds, relevance) and `SearchResponse` (query, results[], totalResults, courseCount)
- `web/app/api/search/route.ts` handles POST requests, validates query, calls MCP, fetches metadata, and returns normalized results
- Home page (`web/app/page.tsx`) has a search input with icon and shortcut hint
- UI components (Button, Input, Badge, Card, Progress) and icons (Search, Play, Clock, BookOpen, ChevronRight) are available
- Design system and globals.css have established colors, typography, and spacing

**Design expectations from attached UI:**
- Header: Logo, Nav, Notification, User avatar
- Content area: "SEARCH RESULTS" label, heading with query in orange, result count and course count, search bar, sort dropdown
- Results grid: Two result types as cards:
  - **Video result**: Thumbnail with play icon and timestamp, course badge with icon, lesson label (e.g., "Lesson 5.1 in Data Fetching"), title, description, "Watch from XX:XX" red pill button
  - **Lesson result**: Course badge, lesson label, title, description, key points bullet list, "View lesson" red pill button
- Empty state: Search icon, helpful message, "Browse all courses" link
- Responsive: Adapt to mobile (stack results, collapse sidebar patterns if any)

**Search API contract:**
- Request: POST with `{ query: string }`
- Response: `{ query, results: SearchResult[], totalResults, courseCount }`
- SearchResult includes type ('lesson' or 'video'), matchedAtSeconds (null for lessons), and all display metadata

## Decisions
1. **Route structure**: New `app/search/page.tsx` server page that accepts `?q=...` query param, validates it, and renders a client component that fetches results
2. **Result card components**: Two components (`SearchVideoResult.tsx` and `SearchLessonResult.tsx`) for consistent, reusable rendering
3. **Sorting**: Initially "Most Relevant" (default from API), with UI dropdown to support future sorts (e.g., newest)
4. **Pagination**: All results rendered on one page (no pagination control) per AGENTS.md section 11
5. **Empty state**: Shows when results array is empty; does not hide the search bar
6. **Link encoding**: Use URL searchParams and encodeURIComponent for all user-derived URL values
7. **Timestamp formatting**: Display matched seconds as "MM:SS" format in video results (e.g., "12:45")
8. **No pagination component**: Per design, show all results. If count is large and performance is a concern, add later.

## Proposed Files
- `web/app/search/page.tsx`: Server page that validates query, renders SearchResultsClient
- `web/components/search-results-client.tsx`: Client component that calls API, manages loading/error state, renders results and empty state
- `web/components/search-video-result.tsx`: Video result card (thumbnail, play icon, timestamp, course badge, lesson label, title, description, watch link)
- `web/components/search-lesson-result.tsx`: Lesson result card (course badge, lesson label, title, description, key points list, view lesson link)

## Requirements
1. **Search page (`app/search/page.tsx`)**:
   - Accept `?q=` query param
   - Trim and validate query (1-200 chars per API)
   - Render SiteHeader (logo, nav, user actions)
   - Render SearchResultsClient with query prop
   - Show helpful message if no query param provided
   - Never expose any server token to the client

2. **SearchResultsClient (`components/search-results-client.tsx`)**:
   - Accept `query: string` prop
   - Fetch from `/api/search` with POST, passing `{ query }`
   - Show loading state (optional skeleton or spinner)
   - Show error state if fetch fails (user-friendly message)
   - Parse and display SearchResponse
   - Render header: "SEARCH RESULTS" label, heading with query in orange, "{count} results across {courseCount} courses" line
   - Show search input with search icon, value matching query
   - Show sort dropdown (currently only "Most Relevant" option; styled to match design)
   - Render results: loop through results array, render `<SearchVideoResult>` for type='video' or `<SearchLessonResult>` for type='lesson'
   - Empty state: Search icon, message "Can't find what you're looking for?", "Try different keywords or browse our full course catalog", "Browse all courses" link to `/courses`
   - Responsive: Results stack vertically on mobile

3. **SearchVideoResult (`components/search-video-result.tsx`)**:
   - Props: SearchResult with type='video'
   - Layout: Thumbnail image (left or top on mobile), play icon overlay, timestamp badge
   - Course badge with course icon/name linking to course
   - Lesson label: "{courseTitle}" + "{moduleTitle}" + "Lesson {lessonNumber}"
   - Title (bold)
   - Description (truncated to 2-3 lines)
   - Action: "Watch from MM:SS" red button linking to lesson page with `?start={matchedAtSeconds}` param
   - Thumbnail error fallback: Gray placeholder with video icon
   - TypeScript: Use SearchResult type from `@/lib/search`

4. **SearchLessonResult (`components/search-lesson-result.tsx`)**:
   - Props: SearchResult with type='lesson'
   - Course badge with course name linking to course
   - Lesson label: "{moduleTitle}" + "Lesson {lessonNumber}"
   - Title (bold)
   - Description (truncated)
   - Key points: Bullet list of keyPoints (limit to first 3-4 items)
   - Action: "View lesson" red button linking to lesson page (no query param)
   - TypeScript: Use SearchResult type

5. **Styling**:
   - Match design exactly: colors (primary orange #FF6B35 or per design tokens), typography (Playfair Display for headings, Inter for body), spacing
   - Use existing Tailwind classes and component patterns
   - Result cards: border, shadow, hover effects per design-system
   - Responsive: Adapt gracefully to mobile (stack, scale appropriately)
   - No custom CSS; use Tailwind only

6. **Data flow**:
   - Server validates query param, passes to client
   - Client fetches results on mount (no server-side fetch; results page is interactive, not static)
   - Display normalizes results with type, course/module metadata, and thumbnails already set by the API
   - Never construct course/lesson URLs with hardcoded logic; use courseHref/lessonSlug from SearchResult

7. **Error handling**:
   - Network error: Show user-friendly message, suggest retry or browse catalog
   - Empty results: Show empty state (no error, just no results)
   - Invalid query: Show empty state or error on the server page before rendering

8. **Security**:
   - Search API key stays server-side (route.ts handles POST)
   - Query param from URL is displayed in UI (not executed as code)
   - All URLs built with searchParams or encodeURIComponent
   - No eval or dynamic imports

9. **Testing checklist**:
   - Search for a real query (e.g., "data fetching") and verify results display
   - Verify video results show thumbnails, timestamps, and "Watch from" action
   - Verify lesson results show key points and "View lesson" action
   - Test empty query param and no query param scenarios
   - Test empty results (query with no matches)
   - Test error state (simulate API failure)
   - Verify links to lesson pages and courses are correct
   - Check responsive layout on mobile and desktop
   - Verify timestamps format correctly (MM:SS)

## Acceptance Criteria
- Search results page renders at `/search?q=...`
- All results display correctly: video and lesson cards match design
- Sort dropdown is present (even if only one option for now)
- Empty state shows when no results
- Error state shows when fetch fails
- All links navigate correctly (no 404s, params preserved)
- No console errors
- Responsive to mobile
- Type-safe: TypeScript catches issues before runtime
- No hardcoded URLs; derived from SearchResult metadata
