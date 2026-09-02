import { auth } from '@clerk/nextjs/server'
import { writeClient } from '@/lib/sanity/client'
import { getPostHogClient } from '@/lib/posthog-server'
import { z } from 'zod'

const progressSchema = z.object({
  lessonId: z.string(),
  completed: z.boolean().optional(),
  position: z.number().optional(),
})

interface SanityReference {
  _ref: string
  _type: 'reference'
  _key?: string
}

interface ResumePosition {
  _key: string
  lesson: SanityReference
  position: number
}

interface ProgressDocument {
  _id: string
  completedLessons?: SanityReference[]
  resumePositions?: ResumePosition[]
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const result = progressSchema.safeParse(body)
    if (!result.success) {
      return Response.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const { lessonId, completed, position } = result.data

    // Find or create progress document
    const query = `*[_type == "progress" && clerkUserId == $userId][0]`
    let progress = await writeClient.fetch<ProgressDocument | null>(query, { userId })

    if (!progress) {
      progress = await writeClient.create({
        _type: 'progress',
        clerkUserId: userId,
        completedLessons: [],
        resumePositions: [],
      })
    }

    let patch = writeClient.patch(progress._id)

    if (completed) {
      // Add to completedLessons if not already there
      const isAlreadyCompleted = progress.completedLessons?.some((cl) => cl._ref === lessonId)
      
      if (!isAlreadyCompleted) {
        patch = patch.setIfMissing({ completedLessons: [] })
          .insert('after', 'completedLessons[-1]', [{ _type: 'reference', _ref: lessonId, _key: lessonId }])
        
        // Track lesson completion server-side
        const posthog = getPostHogClient()
        posthog.capture({
          distinctId: userId,
          event: 'lesson_completed',
          properties: {
            lesson_id: lessonId,
            method: 'api_call',
          },
        })
        await posthog.shutdown()
      }
    }

    if (position !== undefined) {
      // Update resume position
      const resumeIndex = progress.resumePositions?.findIndex((rp) => rp.lesson?._ref === lessonId) ?? -1
      
      if (resumeIndex > -1) {
        patch = patch.set({ [`resumePositions[${resumeIndex}].position`]: position })
      } else {
        patch = patch.setIfMissing({ resumePositions: [] })
          .insert('after', 'resumePositions[-1]', [{ 
            _key: lessonId,
            lesson: { _type: 'reference', _ref: lessonId },
            position 
          }])
      }
    }

    await patch.commit()

    return Response.json({ success: true })
  } catch (error) {
    console.error('Progress update failed', error)
    return Response.json({ error: 'Failed to update progress' }, { status: 500 })
  }
}
