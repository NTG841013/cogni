import { defineField, defineType } from 'sanity'
import { CheckmarkIcon } from '@sanity/icons'

export const learningOutcomeType = defineType({
  name: 'learningOutcome',
  title: 'Learning Outcome',
  type: 'object',
  icon: CheckmarkIcon,
  fields: [
    defineField({
      name: 'icon',
      type: 'string',
      description: 'Icon name (e.g. from Lucide)',
    }),
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
    }),
  ],
})
