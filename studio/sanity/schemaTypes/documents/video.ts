import { defineArrayMember, defineField, defineType } from 'sanity'
import { PlayIcon } from '@sanity/icons'

export const videoType = defineType({
  name: 'video',
  title: 'Video',
  type: 'document',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'url',
      type: 'url',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'chapters',
      type: 'array',
      of: [defineArrayMember({ type: 'videoChapter' })],
    }),
    defineField({
      name: 'chunks',
      type: 'array',
      of: [defineArrayMember({ type: 'videoChunk' })],
    }),
  ],
})
