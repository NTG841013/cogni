import { describe, expect, it } from 'vitest'
import {
  buildVideoDocument,
  buildCatalogDocument,
  canonicalizeVideoUrl,
  chunkTranscript,
  parseTimestamp,
  parseWebVttOrSrt,
  videoDocumentId,
} from './video-ingestion'

describe('video ingestion', () => {
  it('parses timestamps and subtitle cues', () => {
    expect(parseTimestamp('01:02.500')).toBe(62.5)
    expect(parseWebVttOrSrt('00:00:01,500 --> 00:00:02,000\nHello\n\n')).toEqual([
      { startSeconds: 1.5, text: 'Hello' },
    ])
  })

  it('canonicalizes supported provider URLs and creates stable ids', () => {
    expect(canonicalizeVideoUrl('https://www.youtube.com/watch?v=abc#t=12')).toBe('https://youtube.com/watch?v=abc')
    expect(videoDocumentId('https://youtu.be/abc')).toBe('video.youtu-be-abc')
    expect(canonicalizeVideoUrl('https://iframe.mediadelivery.net/embed/library/video')).toBe('https://iframe.mediadelivery.net/embed/library/video')
    expect(() => canonicalizeVideoUrl('https://example.com/video')).toThrow('Unsupported video provider')
    expect(() => parseTimestamp('00:61')).toThrow('Timestamp')
  })

  it('chunks transcript cues by duration and preserves oversized cues', () => {
    expect(chunkTranscript([
      { startSeconds: 0, text: 'one' },
      { startSeconds: 10, text: 'two' },
      { startSeconds: 40, text: 'a very long cue' },
    ], { maxChunkDurationSeconds: 20 })).toEqual([
      { startSeconds: 0, text: 'one two' },
      { startSeconds: 40, text: 'a very long cue' },
    ])
  })

  it('sorts and deduplicates chapters in the Sanity document', () => {
    const document = buildVideoDocument({
      url: 'https://vimeo.com/123',
      transcript: [{ startSeconds: 1, text: 'A lesson' }],
      chapters: [
        { startSeconds: 4, label: 'Second' },
        { startSeconds: 0, label: 'First' },
        { startSeconds: 4, label: 'Duplicate' },
      ],
    })
    expect(document.chapters.map(({ startSeconds, label }) => ({ startSeconds, label }))).toEqual([
      { startSeconds: 0, label: 'First' },
      { startSeconds: 4, label: 'Second' },
    ])
  })

  it('converts the existing catalog entry into an empty video document', () => {
    expect(buildCatalogDocument({ id: '9602Yzvd7ik' })).toEqual({
      _id: 'video-9602Yzvd7ik',
      _type: 'video',
      url: 'https://www.youtube.com/watch?v=9602Yzvd7ik',
      chapters: [],
      chunks: [],
    })
  })
})
