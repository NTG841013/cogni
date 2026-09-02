import { createMCPClient, type MCPClient } from '@ai-sdk/mcp'
import { openai } from '@ai-sdk/openai'
import { generateText, Output, stepCountIs } from 'ai'
import { z } from 'zod'
import { auth } from '@clerk/nextjs/server'
import { normalizeSearchOutput, modelSearchOutputSchema, type SearchMetadata } from '@/lib/search'
import { serverClient } from '@/lib/sanity/client'
import { urlFor } from '@/lib/sanity/image'
import { getPostHogClient } from '@/lib/posthog-server'

export const runtime = 'nodejs'

const MAX_QUERY_LENGTH = 200
const MAX_STEPS = 8
const INITIAL_CONTEXT_TTL_MS = 5 * 60 * 1000

let cachedInitialContext: string | null = null
let initialContextCachedAt = 0

const requestSchema = z.object({
  query: z.string().trim().min(1).max(MAX_QUERY_LENGTH),
})

function getInitialContextUrl(mcpUrl: string) {
  const url = new URL(mcpUrl)
  url.pathname = `${url.pathname.replace(/\/$/, '')}/initial-context`
  return url
}

async function fetchInitialContext(mcpUrl: string, readToken: string): Promise<string | null> {
  if (cachedInitialContext && Date.now() - initialContextCachedAt < INITIAL_CONTEXT_TTL_MS) {
    return cachedInitialContext
  }

  try {
    const response = await fetch(getInitialContextUrl(mcpUrl), {
      headers: { Authorization: `Bearer ${readToken}` },
      cache: 'no-store',
    })

    if (!response.ok) return null

    cachedInitialContext = await response.text()
    initialContextCachedAt = Date.now()
    return cachedInitialContext
  } catch {
    return null
  }
}

function buildSystemPrompt(initialContext: string | null) {
  return `You are Cogni's grounded learning search agent. Search the Sanity content available through the MCP tools and return only real courses, lessons, and lesson-linked video moments.

Search rules:
- Always call the Sanity MCP 'groq_query' tool before returning results, including for broad or ambiguous queries. An empty result is allowed only after checking both lesson content and video moments.
- Search lesson topics using title, keyPoints, and pt::text(notes), and search video documents using chapters and timestamped transcript chunks.
- Match chapters first for video moments. Only use a transcript chunk timestamp when no matching chapter exists.
- Use wildcarded token matching and OR multiple query terms in GROQ. Do not match a whole natural-language phrase as one pattern.
- A video document is internal lookup data. Every video result must be tied to a lesson and its reverse-referenced course and module; never return a video document by itself.
- Module and lesson numbers are derived from array order. Derive the module title and lesson number from the course's ordered modules and lesson references.
- Prefer exact lesson-title or chapter matches over broad transcript matches. Return every relevant result the data supports, without inventing anything.
- Return an empty results array when nothing relevant is found. Never invent titles, slugs, descriptions, counts, thumbnails, or timestamps.
- Return the lesson document _id as id for both lesson and video results. Return only ids, type, matchedAtSeconds, and relevance; all display metadata is added by the server.
- Do not return raw transcript arrays, GROQ queries, commentary, or markdown. Use the required structured output.

${initialContext ? `The Sanity Context initial schema is below:\n${initialContext}` : 'Use the MCP schema and tools as the source of truth for available content.'}`
}

const LESSON_METADATA_QUERY = `*[_type == "lesson" && _id in $lessonIds] {
  _id, title, "lessonSlug": slug.current, summary, keyPoints, duration, thumbnail,
  "course": *[_type == "course" && references(^._id)][0] {
    title, "courseSlug": slug.current,
    modules[] { title, lessons[] { _ref } }
  }
}`

async function loadSearchMetadata(ids: string[]): Promise<Map<string, SearchMetadata>> {
  const lessons = await serverClient.fetch<Array<{
    _id: string
    title?: string
    lessonSlug?: string
    summary?: string
    keyPoints?: string[]
    duration?: number
    thumbnail?: unknown
    course?: { title?: string; courseSlug?: string; modules?: Array<{ title?: string; lessons?: Array<{ _ref?: string }> }> }
  }>>(LESSON_METADATA_QUERY, { lessonIds: ids })
  const metadata = new Map<string, SearchMetadata>()

  for (const lesson of lessons) {
    const course = lesson.course
    if (!lesson.title || !lesson.lessonSlug || !course?.title || !course.courseSlug) continue
    const moduleIndex = course.modules?.findIndex((module) => module.lessons?.some((reference) => reference._ref === lesson._id)) ?? -1
    const moduleRecord = moduleIndex >= 0 ? course.modules?.[moduleIndex] : undefined
    const lessonIndex = moduleRecord?.lessons?.findIndex((reference) => reference._ref === lesson._id) ?? -1
    if (!moduleRecord?.title || lessonIndex < 0) continue

    metadata.set(lesson._id, {
      id: lesson._id,
      courseTitle: course.title,
      courseSlug: course.courseSlug,
      courseHref: `/courses/${encodeURIComponent(course.courseSlug)}`,
      lessonTitle: lesson.title,
      lessonSlug: lesson.lessonSlug,
      moduleTitle: moduleRecord.title,
      lessonNumber: `${moduleIndex + 1}.${lessonIndex + 1}`,
      description: lesson.summary || lesson.keyPoints?.join('. ') || lesson.title,
      keyPoints: lesson.keyPoints || [],
      thumbnailUrl: lesson.thumbnail ? urlFor(lesson.thumbnail as never).width(480).height(360).url() : null,
      durationSeconds: lesson.duration ?? null,
    })
  }

  return metadata
}

export async function POST(request: Request) {
  let mcpClient: MCPClient | null = null

  try {
    let body: unknown

    try {
      body = await request.json()
    } catch {
      return Response.json({ error: 'Request body must be valid JSON.' }, { status: 400 })
    }

    const parsedRequest = requestSchema.safeParse(body)

    if (!parsedRequest.success) {
      return Response.json({ error: 'Query must be between 1 and 200 characters.' }, { status: 400 })
    }

    const mcpUrl = process.env.SANITY_CONTEXT_MCP_URL
    const readToken = process.env.SANITY_API_READ_TOKEN
    const openAiKey = process.env.OPENAI_API_KEY

    if (!mcpUrl || !readToken || !openAiKey) {
      return Response.json({ error: 'Search is not configured on the server.' }, { status: 503 })
    }

    const [client, initialContext] = await Promise.all([
      createMCPClient({
        transport: {
          type: 'http',
          url: mcpUrl,
          headers: { Authorization: `Bearer ${readToken}` },
        },
      }),
      fetchInitialContext(mcpUrl, readToken),
    ])
    mcpClient = client

    const allTools = await client.tools()
    const searchTools = Object.fromEntries(
      Object.entries(allTools).filter(([name]) => name !== 'initial_context'),
    )
    const model = openai(process.env.OPENAI_MODEL || 'gpt-4.1-mini')
    const generation = await generateText({
      model,
      system: buildSystemPrompt(initialContext),
      prompt: `Find all relevant Cogni learning results for this query: ${parsedRequest.data.query}`,
      tools: searchTools,
      stopWhen: stepCountIs(MAX_STEPS),
      output: Output.object({
        schema: modelSearchOutputSchema,
        name: 'cogni_search_results',
      }),
    })

    const modelResults = modelSearchOutputSchema.parse(generation.output).results
    const metadata = await loadSearchMetadata(modelResults.map((result) => result.id))
    const normalized = normalizeSearchOutput(generation.output, parsedRequest.data.query, metadata)

    // Track search event server-side
    const { userId } = await auth()
    if (userId) {
      const posthog = getPostHogClient()
      posthog.capture({
        distinctId: userId,
        event: 'search_performed',
        properties: {
          query: parsedRequest.data.query,
          result_count: normalized.totalResults,
          course_count: normalized.courseCount,
        },
      })
      await posthog.shutdown()
    }

    return Response.json(normalized)
  } catch (error) {
    console.error('Search request failed', error)
    return Response.json({ error: 'Search is temporarily unavailable.' }, { status: 502 })
  } finally {
    await mcpClient?.close()
  }
}
