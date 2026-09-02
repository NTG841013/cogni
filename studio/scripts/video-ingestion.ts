import { readFile } from 'node:fs/promises'
import { basename, isAbsolute, relative, resolve } from 'node:path'
import { URL } from 'node:url'
import { fetchTranscript } from 'youtube-transcript'

export interface TranscriptCue {
  startSeconds: number
  text: string
}

export interface Chapter {
  startSeconds: number
  label: string
}

export interface VideoSource {
  id?: string
  url: string
  transcript: string
  chapters?: string
}

export interface CatalogVideo {
  id: string
}

interface YouTubeTranscriptCue {
  text: string
  offset: number
}

export interface IngestionOptions {
  maxChunkCharacters?: number
  maxChunkDurationSeconds?: number
}

export interface VideoDocument {
  _id: string
  _type: 'video'
  url: string
  chapters: Array<Chapter & { _key: string }>
  chunks: Array<TranscriptCue & { _key: string }>
}

const DEFAULT_MAX_CHUNK_CHARACTERS = 480
const DEFAULT_MAX_CHUNK_DURATION_SECONDS = 30
const PROVIDERS = new Set(['youtube.com', 'youtu.be', 'vimeo.com', 'bunny.net', 'mediadelivery.net'])

export function parseTimestamp(value: string): number {
  const input = value.trim().replace(',', '.')
  const parts = input.split(':').map(Number)
  if (parts.some((part) => !Number.isFinite(part)) || parts.length < 2 || parts.length > 3) {
    throw new Error(`Invalid timestamp: ${value}`)
  }

  const seconds = parts.length === 2
    ? parts[0] * 60 + parts[1]
    : parts[0] * 3600 + parts[1] * 60 + parts[2]

  const minutePart = parts.length === 2 ? parts[0] : parts[1]
  const secondPart = parts.length === 2 ? parts[1] : parts[2]
  if (seconds < 0 || !Number.isFinite(seconds) || minutePart >= 60 || secondPart >= 60) {
    throw new Error(`Timestamp must be non-negative: ${value}`)
  }

  return seconds
}

export function canonicalizeVideoUrl(value: string): string {
  let parsed: URL
  try {
    parsed = new URL(value)
  } catch {
    throw new Error(`Invalid video URL: ${value}`)
  }

  const hostname = parsed.hostname.toLowerCase().replace(/^www\./, '')
  if (![...PROVIDERS].some((provider) => hostname === provider || hostname.endsWith(`.${provider}`))) {
    throw new Error(`Unsupported video provider: ${value}`)
  }

  parsed.hash = ''
  parsed.hostname = hostname
  if (hostname === 'youtube.com') {
    const videoId = parsed.searchParams.get('v')
    if (!videoId) throw new Error(`YouTube URL is missing its video id: ${value}`)
    parsed.search = `?v=${encodeURIComponent(videoId)}`
  } else {
    if (!parsed.pathname || parsed.pathname === '/') throw new Error(`Video URL is missing its video id: ${value}`)
    parsed.search = ''
  }
  return parsed.toString().replace(/\/$/, '')
}

export function videoDocumentId(url: string): string {
  const canonicalUrl = canonicalizeVideoUrl(url)
  const encoded = canonicalUrl
    .replace(/^https?:\/\//, '')
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  return `video.${encoded}`
}

export function buildCatalogDocument(video: CatalogVideo): VideoDocument {
  if (!/^[a-zA-Z0-9_-]+$/.test(video.id)) {
    throw new Error(`Invalid YouTube video id: ${video.id}`)
  }
  const url = `https://www.youtube.com/watch?v=${encodeURIComponent(video.id)}`
  return {
    _id: `video-${video.id}`,
    _type: 'video',
    url,
    chapters: [],
    chunks: [],
  }
}

export async function fetchYouTubeCues(videoId: string): Promise<TranscriptCue[]> {
  const transcript = await fetchTranscript(videoId) as YouTubeTranscriptCue[]
  if (!transcript.length) throw new Error(`YouTube transcript is empty: ${videoId}`)
  return transcript.map((cue, index) => {
    if (typeof cue.offset !== 'number' || typeof cue.text !== 'string') {
      throw new Error(`YouTube transcript cue ${index + 1} is malformed: ${videoId}`)
    }
    return validateCue({ startSeconds: cue.offset / 1000, text: cue.text }, `YouTube cue ${index + 1}`)
  })
}

export async function ingestCatalog(
  catalogPath: string,
  options: IngestionOptions = {},
): Promise<VideoDocument[]> {
  const catalog = JSON.parse(await readFile(catalogPath, 'utf8')) as Record<string, CatalogVideo>
  const documents = await Promise.all(Object.values(catalog).map(async (video) => {
    const document = buildCatalogDocument(video)
    const transcript = await fetchYouTubeCues(video.id)
    return buildVideoDocument({ url: document.url, transcript, chapters: [] }, options)
  }))
  const ids = new Set<string>()
  for (const document of documents) {
    if (ids.has(document._id)) throw new Error(`Duplicate catalog video id: ${document._id}`)
    ids.add(document._id)
  }
  return documents.sort((a, b) => a._id.localeCompare(b._id))
}

function validateCue(cue: TranscriptCue, kind: string): TranscriptCue {
  if (!Number.isFinite(cue.startSeconds) || cue.startSeconds < 0) {
    throw new Error(`${kind} timestamp must be a non-negative number`)
  }
  const text = cue.text.replace(/\s+/g, ' ').trim()
  if (!text) throw new Error(`${kind} text cannot be empty`)
  return { startSeconds: cue.startSeconds, text }
}

export function parseTranscriptJson(value: unknown): TranscriptCue[] {
  const cues = Array.isArray(value) ? value : (value as { cues?: unknown } | null)?.cues
  if (!Array.isArray(cues)) throw new Error('Transcript JSON must be an array or an object with a cues array')
  return cues.map((cue, index) => {
    const item = cue as Partial<TranscriptCue>
    if (typeof item.startSeconds !== 'number' || typeof item.text !== 'string') {
      throw new Error(`Transcript cue ${index + 1} must contain startSeconds and text`)
    }
    return validateCue(item as TranscriptCue, `Transcript cue ${index + 1}`)
  })
}

export function parseWebVttOrSrt(input: string): TranscriptCue[] {
  const normalized = input.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n')
  const blocks = normalized.split(/\n{2,}/)
  const cues: TranscriptCue[] = []

  for (const block of blocks) {
    const lines = block.split('\n').map((line) => line.trim()).filter(Boolean)
    const timingIndex = lines.findIndex((line) => line.includes('-->'))
    if (timingIndex === -1) continue
    const [start] = lines[timingIndex].split('-->')
    const text = lines.slice(timingIndex + 1).join(' ')
    if (!text) continue
    cues.push(validateCue({ startSeconds: parseTimestamp(start), text }, 'Transcript cue'))
  }

  if (!cues.length) throw new Error('Transcript file contains no cues')
  return cues
}

export function parseTranscript(input: string, fileName: string): TranscriptCue[] {
  if (fileName.toLowerCase().endsWith('.json')) return parseTranscriptJson(JSON.parse(input) as unknown)
  return parseWebVttOrSrt(input)
}

export function parseChapters(value: unknown): Chapter[] {
  const chapters = Array.isArray(value) ? value : (value as { chapters?: unknown } | null)?.chapters
  if (!Array.isArray(chapters)) throw new Error('Chapter JSON must be an array or an object with a chapters array')
  return chapters.map((chapter, index) => {
    const item = chapter as Partial<Chapter>
    if (typeof item.startSeconds !== 'number' || typeof item.label !== 'string') {
      throw new Error(`Chapter ${index + 1} must contain startSeconds and label`)
    }
    if (!Number.isFinite(item.startSeconds) || item.startSeconds < 0 || !item.label.trim()) {
      throw new Error(`Chapter ${index + 1} has an invalid timestamp or label`)
    }
    return { startSeconds: item.startSeconds, label: item.label.replace(/\s+/g, ' ').trim() }
  })
}

export function chunkTranscript(cues: TranscriptCue[], options: IngestionOptions = {}): TranscriptCue[] {
  const maxCharacters = options.maxChunkCharacters ?? DEFAULT_MAX_CHUNK_CHARACTERS
  const maxDuration = options.maxChunkDurationSeconds ?? DEFAULT_MAX_CHUNK_DURATION_SECONDS
  if (maxCharacters < 1 || maxDuration < 0) throw new Error('Chunk limits must be positive')

  const sorted = cues.map((cue) => validateCue(cue, 'Transcript cue')).sort((a, b) => a.startSeconds - b.startSeconds)
  const chunks: TranscriptCue[] = []
  let current: TranscriptCue | undefined

  for (const cue of sorted) {
    if (!current) {
      current = { ...cue }
      continue
    }
    const combinedText = `${current.text} ${cue.text}`
    const exceedsCharacters = combinedText.length > maxCharacters
    const exceedsDuration = cue.startSeconds - current.startSeconds > maxDuration
    if (exceedsCharacters || exceedsDuration) {
      chunks.push(current)
      current = { ...cue }
    } else {
      current.text = combinedText
    }
  }
  if (current) chunks.push(current)
  return chunks
}

function stableKey(prefix: string, index: number, startSeconds: number): string {
  return `${prefix}-${index}-${Math.round(startSeconds * 1000)}`
}

export function buildVideoDocument(
  source: { url: string; transcript: TranscriptCue[]; chapters?: Chapter[] },
  options?: IngestionOptions,
): VideoDocument {
  const url = canonicalizeVideoUrl(source.url)
  const chapters = [...(source.chapters ?? [])]
    .sort((a, b) => a.startSeconds - b.startSeconds)
    .filter((chapter, index, all) => index === 0 || chapter.startSeconds !== all[index - 1].startSeconds)
    .map((chapter, index) => ({ ...chapter, _key: stableKey('chapter', index, chapter.startSeconds) }))
  const chunks = chunkTranscript(source.transcript, options)
    .map((chunk, index) => ({ ...chunk, _key: stableKey('chunk', index, chunk.startSeconds) }))
  return { _id: videoDocumentId(url), _type: 'video', url, chapters, chunks }
}

export async function ingestManifest(
  manifestPath: string,
  options: IngestionOptions & { inputRoot?: string } = {},
): Promise<VideoDocument[]> {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8')) as { videos?: VideoSource[] }
  if (!Array.isArray(manifest.videos)) throw new Error('Manifest must contain a videos array')
  const inputRoot = options.inputRoot ? resolve(options.inputRoot) : undefined
  const documents = new Map<string, VideoDocument>()

  for (const [index, source] of manifest.videos.entries()) {
    if (!source || typeof source.url !== 'string' || typeof source.transcript !== 'string') {
      throw new Error(`Manifest video ${index + 1} must contain url and transcript paths`)
    }
    const readInput = async (path: string) => {
      const resolved = resolve(inputRoot ?? resolve(manifestPath, '..'), path)
      if (inputRoot && (isAbsolute(path) || relative(inputRoot, resolved).startsWith('..'))) {
        throw new Error(`Input path escapes input root: ${path}`)
      }
      return { content: await readFile(resolved, 'utf8'), name: basename(resolved) }
    }
    const transcriptFile = await readInput(source.transcript)
    const chapterFile = source.chapters ? await readInput(source.chapters) : undefined
    const document = buildVideoDocument({
      url: source.url,
      transcript: parseTranscript(transcriptFile.content, transcriptFile.name),
      chapters: chapterFile ? parseChapters(JSON.parse(chapterFile.content) as unknown) : [],
    }, options)
    const existing = documents.get(document._id)
    if (existing && JSON.stringify(existing) !== JSON.stringify(document)) {
      throw new Error(`Conflicting metadata for duplicate video URL: ${source.url}`)
    }
    documents.set(document._id, document)
  }

  return [...documents.values()].sort((a, b) => a._id.localeCompare(b._id))
}
