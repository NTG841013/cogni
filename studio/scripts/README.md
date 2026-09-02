# Offline video ingestion

The ingestion tool builds Sanity `video` documents from YouTube captions or local transcript and chapter sidecars. It runs offline as a batch job and never runs in the web request path.

## Manifest

```json
{
  "videos": [
    {
      "url": "https://www.youtube.com/watch?v=VIDEO_ID",
      "transcript": "captions.vtt",
      "chapters": "chapters.json"
    }
  ]
}
```

`transcript` may point to WebVTT, SRT, or JSON. JSON is either an array or `{ "cues": [{ "startSeconds": 12.5, "text": "..." }] }`. Chapters are JSON as an array or `{ "chapters": [{ "startSeconds": 0, "label": "Introduction" }] }`.

## Run

From `studio/`:

```powershell
npm run ingest:videos -- --manifest .\scripts\fixtures\manifest.json --out .\tmp\videos.ndjson --input-root .\scripts\fixtures
```

The default output is local NDJSON. Review it, then import it with the Sanity CLI while explicitly selecting the intended project and dataset:

```powershell
sanity dataset import .\tmp\videos.ndjson <dataset> --replace
```

The importer accepts YouTube, Vimeo, and Bunny URLs. Transcript cues are merged into short chunks (480 characters or 30 seconds by default), and chapters are sorted and deduplicated by timestamp. Duplicate URLs must have identical generated metadata.

## Existing catalog

The existing `studio/videos.json` catalog contains 120 YouTube ids and metadata. Convert it into Sanity video documents with real timestamped YouTube transcript chunks using:

```powershell
npm run ingest:videos -- --catalog .\videos.json --out .\tmp\videos.ndjson
```

This creates the video records needed to match existing lessons. The generated URL intentionally matches the lesson `videoUrl` format exactly. Captions are fetched by video id, normalized, and merged into searchable chunks. Add authored chapter sidecars through a manifest to populate `chapters`; the pipeline never invents timestamps or chapter labels from catalog metadata.
