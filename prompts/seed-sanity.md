# Implementation Prompt: Seed Sanity Content

This prompt covers seeding the Sanity production dataset using the provided `seed.ndjson` and `videos.json` files.

## Goal
Seed the Sanity dataset with courses, lessons, instructors, categories, and video documents to enable the catalog and search features.

## Skills Used
- `sanity-best-practices`: for CLI import patterns.
- `AGENTS.md`: for the `video` document schema requirements.

## Inspected Code & Config
- `studio/seed.ndjson`: Contains 141 documents (category, course, instructor, lesson).
- `studio/videos.json`: Contains metadata for 120 videos.
- `studio/sanity/schemaTypes/documents/video.ts`: Defines `video` type with `url`, `chapters`, and `chunks`.
- `web/lib/sanity/queries.ts`: Shows lessons matching video moments by `url`.

## Decisions & Assumptions
- `seed.ndjson` will be imported directly using Sanity CLI.
- `videos.json` will be converted to `video` documents in NDJSON format.
- Each `video` document will have:
    - `_id`: `video-{youtubeId}`
    - `_type`: `video`
    - `url`: `https://www.youtube.com/watch?v={youtubeId}`
    - `chapters`: `[]` (initialized empty as the source lacks this data)
    - `chunks`: `[]` (initialized empty as the source lacks this data)
- We assume the Sanity CLI is authenticated and the `production` dataset exists.
- We will use `--replace` to ensure a clean seed if documents already exist.

## Files to be Created/Modified
- `studio/convert-videos.js` (temporary)
- `studio/videos.ndjson` (temporary)

## Requirements
- Use `sanity dataset import` for both files.
- Verify document counts after import.
- Do not modify the original source files.

## Security Considerations
- The import uses the local environment's Sanity authentication.
- No sensitive tokens are hardcoded; we use the existing CLI session.

## Acceptance Criteria
1. `seed.ndjson` imported successfully.
2. `videos.ndjson` generated correctly from `videos.json`.
3. `videos.ndjson` imported successfully.
4. Document counts in Sanity match expectations:
    - 141 documents from `seed.ndjson`.
    - 120 documents from `videos.ndjson`.
    - Total content documents: 261.

## Verification Steps
1. Run `npx sanity documents query "count(*[_type in ['course', 'lesson', 'instructor', 'category', 'video']])"` in the `studio` directory.
2. Expect output: `261`.
