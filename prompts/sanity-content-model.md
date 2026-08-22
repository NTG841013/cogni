# Implementation Prompt: Sanity Content Model and Data Layer

## Goal
Implement the full Sanity content model for Cogni as defined in `AGENTS.md` and set up the server-side data layer in the Next.js application. This includes restructuring the project into two standalone workspaces (Studio and Web) to follow the project guidelines.

## Skills Used
- `sanity-best-practices`: For schema design, standalone Studio setup, and Next.js integration.
- `content-modeling-best-practices`: For relationship design and field selection.

## Inspection Findings
- The project currently has an embedded-style structure with Sanity files in the root and a single `package.json`.
- `sanity/schemaTypes` is currently empty.
- `sanity/lib/client.ts` is a basic client without token-based server-side setup.
- `.env.local` is missing `SANITY_API_READ_TOKEN` and `SANITY_API_WRITE_TOKEN`.
- `AGENTS.md` explicitly requires two standalone workspaces and forbids embedding the Studio in Next.js.

## Decisions and Assumptions
- **Restructuring**: I will move Sanity files to a `studio/` directory and Next.js files to a `web/` directory. The root will manage these as npm workspaces.
- **Content Model**: I will strictly follow Section 8 of `AGENTS.md` for field names and relationships.
- **Data Layer**: I will use `next-sanity`'s `defineLive` for real-time updates and Visual Editing, ensuring the read token is used only on the server.
- **Video Model**: The `video` document will be an internal lookup as specified, not exposed directly in search results.

## Proposed Changes

### 1. Project Restructuring
- Create `studio/` and `web/` directories.
- Move existing Next.js files (`app/`, `components/`, `lib/`, `public/`, `next.config.ts`, etc.) to `web/`.
- Move Sanity files (`sanity.config.ts`, `sanity.cli.ts`, `sanity/` folder) to `studio/`.
- Create `studio/package.json` and `web/package.json` by splitting the root `package.json`.
- Update root `package.json` to use `workspaces: ["studio", "web"]`.

### 2. Sanity Schemas (in `studio/schemaTypes/`)
- `course.ts`: Course document with modules as embedded objects.
- `module.ts`: Object type for course modules.
- `lesson.ts`: Lesson document.
- `instructor.ts`: Instructor document.
- `category.ts`: Category document.
- `video.ts`: Video document (internal lookup).
- `context.ts`: Search agent context document.
- `progress.ts`: Learner progress document.
- `index.ts`: Register all types.

### 3. Data Layer (in `web/lib/sanity/`)
- `client.ts`: Configure a private client with `SANITY_API_READ_TOKEN`.
- `queries.ts`: Define GROQ queries for courses, lessons, and search.
- `live.ts`: Setup `defineLive` for real-time updates.

### 4. Environment Configuration
- Create `web/.env.example` with all required keys.
- Update `.env.local` (root or `web/`) with necessary tokens.

## Security Considerations
- The `SANITY_API_READ_TOKEN` and `SANITY_API_WRITE_TOKEN` must never be exposed to the browser.
- All data fetching will be done via Server Components or Server Actions.
- CORS origins will be configured for the Studio to allow access from the web app.

## Acceptance Criteria
- Sanity Studio runs independently at `localhost:3333` with all schemas visible.
- The Next.js app runs at `localhost:3000` and can successfully fetch data from Sanity using the private client.
- The content model matches `AGENTS.md` Section 8 exactly.
- Real-time updates are enabled via `SanityLive`.
- Project structure aligns with the "standalone workspaces" requirement.

## Checks to Run
- `npm run build` in `web/` to ensure no broken imports after move.
- `npx sanity typegen generate` in `studio/` to verify schema and queries.
- `npx sanity lint` in `studio/`.

## Manual Test Steps
1. Start Sanity Studio: `cd studio && npm run dev`.
2. Open Studio at `localhost:3333` and create a test Course, Instructor, and Lesson.
3. Start Next.js app: `cd web && npm run dev`.
4. Verify that the app can fetch and log the created content (via a temporary test route or `console.log` in layout).
5. Verify that editing content in Studio reflects immediately in the app (if `SanityLive` is active).
