import { defineArrayMember, defineField, defineType } from 'sanity'
import { SquareIcon } from '@sanity/icons'

export const moduleType = defineType({
  name: 'module',
  title: 'Module',
  type: 'object',
  icon: SquareIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      type: 'text',
    }),
    defineField({
      name: 'lessons',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'lesson' }],
        }),
      ],
    }),
  ],
})
