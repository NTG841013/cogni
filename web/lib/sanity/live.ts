import { defineLive } from 'next-sanity/live'
import { client } from './client'
import { readToken } from './env'

export const { sanityFetch, SanityLive } = defineLive({
  client: client.withConfig({
    apiVersion: '2026-08-22'
  }),
  serverToken: readToken,
})
