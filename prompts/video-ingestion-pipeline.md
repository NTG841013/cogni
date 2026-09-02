# Implement Offline Video Ingestion

## Goal

Implement the offline video ingestion pipeline for Cogni. Given video source metadata and local transcript/chapter sidecars, build one Sanity `video` document per unique video URL with ordered chapter markers and short timestamped transcript chunks.

## Skills and guidance read

- `AGENTS.md`
- `agent/skills/sanity-best-practices/SKILL.md`

## Existing code inspected

- `studio/sanity/schemaTypes/documents/video.ts`: the target document has `url`, `chapters`, and `chunks`.
- `studio/sanity/schemaTypes/objects/videoChapter.ts`: chapter shape is `{ startSeconds, label }`.
- `studio/sanity/schemaTypes/objects/videoChunk.ts`: transcript shape is `{ startSeconds, text }`.
- `studio/videos.json`: current source catalog has stable keys, YouTube ids, durations, and lesson-oriented metadata, but no captions or chapters.
- `studio/seed.ndjson`: lessons contain provider URLs, but no generated video documents.
- `web/components/video-player.tsx`: playback supports YouTube, Vimeo, and Bunny URLs and consumes a start time.
- `studio/package.json`: scripts currently include dev, build, start, lint, and typegen only.

## Decisions and assumptions

- Keep ingestion offline and outside Next.js request handling.
- Do not scrape or download provider content in the pipeline. Caption and chapter acquisition is provider/account specific and is supplied as local JSON or WebVTT/SRT sidecars.
- Accept a manifest that maps each source video URL to transcript and optional chapter files. This makes runs reproducible and supports authored chapters when a provider has none.
- Support YouTube, Vimeo, and Bunny URL validation and canonicalization. Reject unsupported providers and malformed timestamps with actionable errors.
- Generate deterministic Sanity document ids from a normalized video URL, stripping characters Sanity rejects. Do not expose the transcript as one large field.
- Normalize cues in ascending timestamp order, merge adjacent cues until a configurable maximum duration or character count, preserve the first cue timestamp for each chunk, trim whitespace, and discard empty cues.
- Chapters are ordered, deduplicated by start time, and retain clean labels. Transcript chunks and chapters are emitted as Sanity array objects with `_key` values.
- Output NDJSON suitable for `sanity dataset import`; optionally support authenticated replacement through Sanity's official client when a write token is explicitly provided. Never commit or print secrets.
- The generated document must contain only the schema fields needed by the existing `video` type: `_id`, `_type`, `url`, `chapters`, and `chunks`.

## Expected files

- Add a focused TypeScript ingestion module under `studio/scripts/` with exported pure parsing/normalization helpers.
- Add a CLI entry point under `studio/scripts/` or a closely related `studio` tooling directory.
- Add a small fixture set for WebVTT/SRT and chapters, plus unit tests for timestamp parsing, chunking, URL canonicalization, id generation, deduplication, and malformed input.
- Add the smallest required Studio dependencies and package scripts.
- Add concise usage documentation for manifest shape, sidecar formats, dry-run/output behavior, and Sanity import.

## Requirements

1. Parse WebVTT and SRT cues without depending on a browser runtime; also accept normalized JSON cues `{ startSeconds, text }`.
2. Parse chapter JSON as `{ startSeconds, label }` and accept common chapter sidecar forms when practical.
3. Validate finite, non-negative timestamps and require non-empty transcript text and chapter labels.
4. Ensure all generated arrays are stable and sorted, and avoid duplicate chapter timestamps.
5. Use safe filesystem handling and explicit CLI errors; do not silently omit a configured source file.
6. Make chunk limits configurable with sensible defaults and ensure a single oversized cue remains searchable rather than being dropped.
7. Handle duplicate URLs in a manifest deterministically and fail when their supplied metadata conflicts.
8. Keep credentials in environment variables and make the default behavior a local NDJSON file, not a remote write.

## Security considerations

- Never log transcript contents or Sanity tokens by default.
- Never put Sanity tokens in generated documents or committed fixtures.
- Treat manifest paths as local input and reject paths that escape the configured input directory when an input root is used.
- Use Sanity's official client for writes and require an explicit write flag plus token.

## Acceptance criteria

- A documented command can transform fixture inputs into valid video-document NDJSON.
- The output imports against the existing Studio schema without changing the public video document shape.
- Re-running the same inputs produces byte-stable document content apart from intentional output ordering.
- YouTube, Vimeo, and Bunny URLs are accepted; unsupported or malformed URLs fail before output is written.
- WebVTT, SRT, and JSON transcript fixtures produce multiple ordered chunks with correct starting timestamps.
- Chapter-first data is preserved and transcript-only videos produce an empty chapter array.
- Unit tests cover happy paths and validation failures.
- Studio typecheck/lint/tests (or the closest available checks) pass.

## Checks and manual test

- Run the ingestion unit tests.
- Run the CLI against fixtures in dry-run mode and inspect the generated NDJSON with a JSON parser.
- Run Studio typecheck and lint.
- Run `sanity dataset import <output> <dataset> --replace` only after setting the project and dataset explicitly and reviewing the output.
- Query Sanity for `_type == "video"` and confirm chapters/chunks are ordered and linked by exact lesson `videoUrl`.
