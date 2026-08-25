# Fix Sanity Schema Errors

## Goal
Fix the validation errors and schema mismatches in Sanity Studio as reported in images `1.png` and `2.png`.

## Skills Read
- sanity-best-practices

## Code Inspected
- `studio/sanity/schemaTypes/documents/instructor.ts`: `expertise` is `string` and `bio` is `text`, but data is `string[]` and `block[]`.
- `studio/sanity/schemaTypes/documents/lesson.ts`: Field is named `poster`, but data uses `thumbnail`.
- `studio/seed.ndjson`: Confirmed data shape for `instructor` and `lesson`.
- `web/lib/sanity/queries.ts`: Queries use `...` to fetch all fields, so schema changes will be picked up.

## Decisions and Assumptions
- Rename `poster` to `thumbnail` in `lesson.ts` to match the seeded data and the error in Sanity Studio.
- Change `expertise` to an array of strings in `instructor.ts`.
- Change `bio` to Portable Text (array of blocks) in `instructor.ts`.
- I assume that `bio` should be a standard Portable Text block.

## Files to Touch
- `studio/sanity/schemaTypes/documents/instructor.ts`
- `studio/sanity/schemaTypes/documents/lesson.ts`

## Requirements
- `instructor.expertise` must be an array of strings.
- `instructor.bio` must be Portable Text (array of blocks).
- `lesson.thumbnail` must be the name of the image field (replacing `poster`).

## Security Considerations
- N/A (Schema changes only).

## Acceptance Criteria
- Sanity Studio no longer shows "Unknown field found" for `thumbnail` in Lessons.
- Sanity Studio no longer shows validation errors for `Expertise` and `Bio` in Instructors.
- Data is correctly rendered in the Studio UI.

## Checks to Run
- In `studio`: `npm run lint`
- In `studio`: `npm run typegen`

## Manual Test Steps
1. Open Sanity Studio at `http://localhost:3333`.
2. Navigate to "Instructor" and select "Alina Costa". Verify `Expertise` and `Bio` fields are correctly populated and have no errors.
3. Navigate to "Lesson" and select "Building an agent loop". Verify the `Thumbnail` field exists and has the image populated, and there is no "Unknown field found" warning.
