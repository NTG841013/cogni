import { defineField, defineType } from 'sanity'

export const videoChunkType = defineType({
  name: 'videoChunk',
  title: 'Video Chunk',
  type: 'object',
  fields: [
    defineField({
      name: 'startSeconds',
      type: 'number',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'text',
      type: 'text',
      validation: (rule) => rule.required(),
    }),
  ],
})
