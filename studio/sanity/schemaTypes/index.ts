import { type SchemaTypeDefinition } from 'sanity'
import { instructorType } from './documents/instructor'
import { categoryType } from './documents/category'
import { lessonType } from './documents/lesson'
import { courseType } from './documents/course'
import { videoType } from './documents/video'
import { agentContextType } from './documents/agentContext'
import { progressType } from './documents/progress'
import { resourceType } from './objects/resource'
import { moduleType } from './objects/module'
import { learningOutcomeType } from './objects/learningOutcome'
import { videoChapterType } from './objects/videoChapter'
import { videoChunkType } from './objects/videoChunk'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    instructorType,
    categoryType,
    lessonType,
    courseType,
    videoType,
    agentContextType,
    progressType,
    resourceType,
    moduleType,
    learningOutcomeType,
    videoChapterType,
    videoChunkType,
  ],
}
