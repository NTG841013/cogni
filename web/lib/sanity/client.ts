import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId, readToken, writeToken } from './env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  // stega: {
  //   enabled: process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview',
  //   studioUrl: '/studio',
  // },
})

export const serverClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: readToken,
})

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: writeToken || readToken, // Fallback to readToken if writeToken is not set
})
