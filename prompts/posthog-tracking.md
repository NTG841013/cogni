# Implementation Prompt: PostHog Tracking for Cogni

## Goal
Add comprehensive PostHog tracking for search engagement, video interaction, and learner progress while maintaining privacy and cost-efficiency.

## Skills & Context
- PostHog best practices for Next.js (App Router).
- Clerk for user identification.
- Sanity for progress persistence.
- "Better and cheaper" watch depth tracking via milestones.

## Decisions & Assumptions
1. **Milestone Tracking**: Instead of continuous heartbeats, track video watch depth at 25%, 50%, 75%, and 90% (milestones). This is "better and cheaper" as it reduces event volume while providing high-signal engagement data.
2. **Server-Side Tracking**: Move `search_performed` tracking to the server-side `/api/search` route. Implement a new `/api/progress` route for lesson completion and resume positions, tracking `lesson_completed` server-side.
3. **Privacy**: Remove PII (email, name) from `PostHogIdentify` to comply with "no PII beyond Clerk user ID" requirement.
4. **Resume Tracking**: Track `resume_used` when a lesson is loaded with a `start` parameter.
5. **Video SDKs**: Use YouTube and Vimeo player SDKs in `VideoPlayer.tsx` to get accurate time/duration.

## Requirements
- Instrument `video_played`, `video_paused`, and `video_watch_milestone` (percentage: 25, 50, 75, 90).
- Instrument `lesson_completed` (triggered at 90% watch depth or via completion logic).
- Instrument `search_performed` on the server with `query`, `result_count`, and `course_count`.
- Instrument `search_result_clicked` (already exists, but verify consistency).
- Instrument `resume_used` with `start_seconds`.
- Ensure all events are associated with the Clerk `userId`.
- No PII (email, name) in any event or identification.

## Files to Touch
- `web/package.json`: Add `posthog-node`, `@types/youtube`, `@vimeo/player`.
- `web/components/posthog-identify.tsx`: Remove PII.
- `web/app/api/search/route.ts`: Add server-side `search_performed` tracking.
- `web/app/api/progress/route.ts`: New route for progress and `lesson_completed` tracking.
- `web/components/video-player.tsx`: Add SDK integration and milestone tracking.
- `web/app/courses/[slug]/[lessonSlug]/page.tsx`: Add `resume_used` tracking and progress initialization.
- `web/components/search-results-client.tsx`: Remove client-side `search_performed` tracking.

## Security Considerations
- Keep `SANITY_API_WRITE_TOKEN` on the server.
- Ensure only authenticated users can write progress.

## Acceptance Criteria
- Search performed events arrive in PostHog with correct metadata.
- Video play/pause and milestones (25/50/75/90) arrive in PostHog.
- Lesson completion event arrives in PostHog when video reaches 90%.
- No email or name is sent to PostHog.
- Resume events include the correct start time.

## Manual Test Steps
1. Perform a search and verify `search_performed` in PostHog Live Events.
2. Click a search result and verify `search_result_clicked`.
3. Watch a video past 25%, 50%, 75%, 90% and verify `video_watch_milestone` events.
4. Verify `lesson_completed` is sent at 90% milestone.
5. Refresh a lesson page with `?start=30` and verify `resume_used`.
6. Verify in PostHog Person view that no email or name is attached.
