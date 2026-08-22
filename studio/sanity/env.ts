function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(`Missing environment variable: ${errorMessage}`)
  }

  return v
}

export const apiVersion =
  process.env.SANITY_STUDIO_API_VERSION || '2026-08-22'

export const dataset = assertValue(
  process.env.SANITY_STUDIO_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET,
  'SANITY_STUDIO_DATASET'
)

export const projectId = assertValue(
  process.env.SANITY_STUDIO_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'SANITY_STUDIO_PROJECT_ID'
)
