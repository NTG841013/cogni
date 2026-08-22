import { defineArrayMember, defineField, defineType } from 'sanity'
import { UserIcon } from '@sanity/icons'

export const progressType = defineType({
  name: 'progress',
  title: 'Learner Progress',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'clerkUserId',
      title: 'Clerk User ID',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'completedLessons',
      title: 'Completed Lessons',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'lesson' }],
        }),
      ],
    }),
    defineField({
      name: 'resumePositions',
      title: 'Resume Positions',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'lesson',
              type: 'reference',
              to: [{ type: 'lesson' }],
            }),
            defineField({
              name: 'position',
              type: 'number',
              description: 'Resume position in seconds',
            }),
          ],
        }),
      ],
    }),
  ],
})
