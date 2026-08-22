import { defineField, defineType } from 'sanity'

export const videoChapterType = defineType({
  name: 'videoChapter',
  title: 'Video Chapter',
  type: 'object',
  fields: [
    defineField({
      name: 'startSeconds',
      type: 'number',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
  ],
})
