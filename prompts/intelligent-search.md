# Intelligent Search Implementation Prompt

## Goal
Implement Cogni's intelligent search logic over courses and lessons. Connect the Next.js server route to the Sanity Context MCP and an LLM, and return a grounded, validated JSON contract for a future results page.

## Skills Read
- `create-agent-with-sanity-context`: Sanity Context MCP connection, initial context caching, MCP tool discovery, server-side AI integration, and private token handling.
- `dial-your-context`: keep Context document instructions as concise data-specific deltas and scope the agent to searchable content.
- `shape-your-agent`: keep the inline prompt short, grounded, and explicit about uncertainty.
- `sanity-best-practices`: use the existing Sanity schema, GROQ relationships, typed queries, and server-only data access.
- Next.js App Router guidance from the installed Next.js documentation.

## Code Inspected
- `web/lib/sanity/queries.ts`: existing `SEARCH_QUERY` is a raw keyword placeholder and does not shape complete result cards.
- `web/lib/sanity/client.ts`: `serverClient` is the server-side private-token client.
- `web/app/page.tsx`: home search input is presentational and currently does not submit or navigate.
- `web/app/courses/page.tsx`: existing course catalog and empty-state patterns.
- `web/app/courses/[slug]/[lessonSlug]/page.tsx`: lesson URLs accept `?start=` and keep playback on-site.
- `web/sanity.types.ts`: generated types include the existing search query but need regeneration after query changes.
- `studio/sanity.config.ts`: Studio currently has structure and Vision only; no Context plugin.
- `studio/sanity/schemaTypes/documents/agentContext.ts`: existing `agentContext` document has `contentScope` and `instructions`, rather than the Context plugin's `groqFilter` field.
- `studio/seed.ndjson`: seeded courses, lessons, relationships, notes, and thumbnails exist; video documents are separate internal lookup documents.
- `web/package.json`: currently missing `ai`, `@ai-sdk/mcp`, `@ai-sdk/openai`, `zod`, and `react-markdown`.

## Decisions and Assumptions
- Use the Vercel AI SDK with `@ai-sdk/openai`, `@ai-sdk/mcp`, and `ai`, matching the repository's stated stack. The model is selected from `OPENAI_MODEL` with a sensible default.
- The browser sends only a query to `/api/search`; it never receives or uses Sanity tokens, the MCP URL, or the OpenAI key.
- The route uses the Sanity Context MCP over server-side HTTP with `Authorization: Bearer SANITY_API_READ_TOKEN`, fetches and caches `/initial-context`, excludes the redundant `initial_context` tool, and uses bounded tool steps.
- Structured output is validated with Zod. The model may query Sanity through MCP, but the response must contain only real lessons and video moments with enough identifiers for the UI. Video documents are never returned as standalone results.
- The inline system prompt repeats critical search rules: search lessons and video moments, chapters before transcript chunks, wildcarded token matching, specificity ranking, reverse course/module relationships, no invented fields/results/counts/timestamps, and an honest empty result.
- The Context document remains the data-specific tuning layer. Because the current Studio schema does not match the official Context plugin schema and the plugin may be incompatible with Sanity 4/6, inspect installed compatibility before deciding whether to add the plugin. Preserve the existing custom `agentContext` if the plugin cannot be safely added; add/import a search configuration document with the existing fields and document the MCP URL slug/requirements.
- Results page UI is explicitly out of scope for this slice. The API contract must contain enough data for a future `/search` page, including lesson links and matched start seconds.
- Since MCP/LLM responses can be unavailable locally, the UI must show a useful error state rather than silently inventing fallback results. Do not replace intelligent search with a client-side mock.
- Keep existing visual language and components. Do not redesign unrelated pages.

## Expected Files
- `web/package.json` and workspace lockfile: add the required AI/MCP/OpenAI/Zod/Markdown dependencies using the repository package manager.
- `web/app/api/search/route.ts`: server-only validated request, MCP client lifecycle, initial-context cache, prompt, bounded model/tool execution, structured response, and error handling.
- `web/lib/search.ts` or equivalent server/shared search types and Zod schema for the result contract.
- No results page, result card, or home UI files are in scope for this slice.
- `web/.env.example`: add `SANITY_CONTEXT_MCP_URL`, `SANITY_API_READ_TOKEN`, `OPENAI_API_KEY`, and `OPENAI_MODEL` if the file exists or create the canonical example required by project rules; never add secret values.
- `studio/sanity.config.ts`, `studio/sanity/schemaTypes/documents/agentContext.ts`, `studio/seed.ndjson`, and/or `studio/README` only as needed to make the searchable Context configuration usable without breaking the current Studio.
- `web/sanity.types.ts`: regenerate with the existing typegen command if GROQ query types change.

## Requirements
1. Validate query input, trim it, reject empty/overlong queries, and return appropriate JSON errors.
2. Keep all credentials and MCP calls server-side.
3. Fetch initial Context once with a short TTL and handle MCP/API failures cleanly.
4. Use the MCP tools to query real Sanity content. Ensure lesson results include course, module, lesson numbering, title, summary/key points, slug, and thumbnail where applicable. Ensure video results include the parent lesson/course/module, matched timestamp, description, thumbnail, and a lesson URL target.
5. Resolve video timestamp by matched chapter first, falling back to matched transcript chunk only when no chapter matches. Convert/validate non-negative seconds.
6. Return all relevant results permitted by the model/tool response, with a count and distinct course count. Do not expose raw transcript arrays or video documents as their own UI results.
7. Validate and normalize the model response with Zod. Discard malformed result items rather than rendering unsafe/unknown links. Escape/encode query-derived URL values through normal URL construction.
8. The API response must include controlled lesson link fields and preserve matched start seconds for a future results page.
9. Keep prompts and content grounded. Never fabricate course names, lesson labels, counts, durations, thumbnails, or timestamps.
10. Add focused tests if the project has a test setup; otherwise make the result schema and pure normalization helpers independently checkable and run type/lint/build checks.

## Security Considerations
- `SANITY_API_READ_TOKEN`, `OPENAI_API_KEY`, and the MCP URL are server-only environment variables.
- Do not accept a client-supplied GROQ query, tool name, MCP URL, model name, or system prompt.
- Bound query length, MCP tool steps, and response size to limit abuse and cost.
- Do not render arbitrary URLs from the model; derive lesson links from validated slugs and controlled route construction.
- Do not return whole transcripts, secrets, internal MCP tool output, or raw video documents to the browser.
- Preserve Next.js server/client boundaries and avoid importing server-only modules into client components.

## Acceptance Criteria
- `POST /api/search` returns a validated JSON search contract for a real query when environment credentials and a deployed Sanity Context endpoint are available.
- The route uses Sanity Context MCP server-side and does not expose tokens or LLM credentials.
- The API response contains grounded video-moment and lesson data, counts, controlled lesson slugs, and non-negative `matchedAtSeconds` values based on chapters-first matching.
- Studio has a documented, usable Context configuration scoped to `course` and `lesson` content, with video documents internal to lookup and not UI results.
- Existing course and lesson routes continue to typecheck and build.

## Checks to Run
- From `web/`: `npm run lint`, `npx tsc --noEmit`, and `npm run build`.
- From `studio/`: `npx tsc --noEmit` and `npm run build` if Studio configuration/schema changes.
- Run a focused request/normalization check with a representative query such as `how do I cache repeated prompts?` when credentials are configured.
- Verify that missing environment variables produce a clear server error and do not leak secrets.

## Manual Test Steps
1. Configure the server-only variables in `web/.env.local`: Sanity project/dataset/read token, Context MCP URL, and OpenAI API key/model. Ensure the Studio application is deployed, not only the schema.
2. Start the web app with `cd web; npm run dev`.
3. POST a query such as `caching` or `streaming responses` to `/api/search` and inspect the JSON contract.
4. Confirm video results are tied to lessons and have non-negative chapter-first timestamps.
5. POST a nonsense query and confirm an empty results array with zero counts.
6. Temporarily omit one required server variable and confirm a safe 503 response with no credential details.
