import { z } from 'zod'

export const modelSearchOutputSchema = z.object({
  results: z.array(z.object({
    id: z.string().min(1).max(200),
    type: z.enum(['lesson', 'video']),
    matchedAtSeconds: z.number().int().nonnegative().max(86400).nullable(),
    relevance: z.number().min(0).max(1),
  })).max(250),
})

export type SearchResult = {
  id: string
  type: 'lesson' | 'video'
  courseTitle: string
  courseSlug: string
  courseHref: string
  lessonTitle: string
  lessonSlug: string
  moduleTitle: string
  lessonNumber: string
  description: string
  keyPoints: string[]
  thumbnailUrl: string | null
  durationSeconds: number | null
  matchedAtSeconds: number | null
  relevance: number
}
export type SearchResponse = {
  query: string
  results: SearchResult[]
  totalResults: number
  courseCount: number
}

export type SearchMetadata = Omit<SearchResult, 'type' | 'matchedAtSeconds' | 'relevance'>

export function normalizeSearchOutput(
  value: unknown,
  query: string,
  metadata: Map<string, SearchMetadata>,
): SearchResponse {
  const parsed = modelSearchOutputSchema.safeParse(value)
  const results = parsed.success
    ? parsed.data.results
        .map((result) => {
          const item = metadata.get(result.id)
          return item ? { ...item, type: result.type, matchedAtSeconds: result.matchedAtSeconds, relevance: result.relevance } : null
        })
        .filter((result): result is SearchResult => result !== null)
        .filter((result) => result.type === 'video' ? result.matchedAtSeconds !== null : true)
    : []
  const courseCount = new Set(results.map((result) => result.courseSlug)).size

  return {
    query,
    results,
    totalResults: results.length,
    courseCount,
  }
}
