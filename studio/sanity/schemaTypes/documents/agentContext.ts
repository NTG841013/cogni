import { defineField, defineType } from 'sanity'
import { CogIcon } from '@sanity/icons'

export const agentContextType = defineType({
  name: 'agentContext',
  title: 'Agent Context',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      initialValue: 'Search Agent Configuration',
      readOnly: true,
    }),
    defineField({
      name: 'contentScope',
      title: 'Content Scope Filter',
      type: 'text',
      description: 'GROQ filter to limit the searchable content (e.g. _type in ["course", "lesson"])',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'instructions',
      type: 'text',
      description: 'Search agent query instructions',
      validation: (rule) => rule.required(),
    }),
  ],
})
