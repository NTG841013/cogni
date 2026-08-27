# Fix Sanity Image Hostname

## Goal
Fix the runtime error `Invalid src prop` for `cdn.sanity.io` images on `next/image` by configuring the hostname in `next.config.ts`.

## Skills Read
- `node_modules/next/dist/docs/` (Next.js Image Optimization)

## Code Inspected
- `web/next.config.ts`: Found existing `remotePatterns` with `images.unsplash.com`.
- `web/components/course-card.tsx`: Uses `next/image` with `urlFor(coverImage).url()`, which produces `cdn.sanity.io` URLs.
- `web/.env.local`: Contains `NEXT_PUBLIC_SANITY_PROJECT_ID="3x30yu9l"`.

## Decisions & Assumptions
- Add `cdn.sanity.io` to `remotePatterns` in `web/next.config.ts`.
- Keep existing `images.unsplash.com` as it might be used for placeholder or other images.
- Use a generic pattern for Sanity CDN to cover all projects if needed, or specific if preferred. Guidelines say "cdn.sanity.io" so I'll use that.

## Files to Touch
- `web/next.config.ts`

## Requirements
- Update `next.config.ts` to allow images from `cdn.sanity.io`.

## Security Considerations
- Restricting `remotePatterns` to known CDNs is a security best practice for `next/image`.

## Acceptance Criteria
- `web/next.config.ts` includes `cdn.sanity.io` in `remotePatterns`.
- The application can render images from Sanity CDN.

## Checks to Run
- `npm run build` in `web` to ensure config is valid.
- `npm run lint` in `web`.

## Manual Test Steps
1. Navigate to `web` directory.
2. Run `npm run dev`.
3. Open the browser at the local dev URL (usually http://localhost:3000).
4. Verify that course images are displayed correctly and no console error appears regarding unconfigured hostname.
