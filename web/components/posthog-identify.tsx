"use client"

import { useUser } from "@clerk/nextjs"
import posthog from "posthog-js"
import { useEffect } from "react"

export function PostHogIdentify() {
  const { user, isLoaded } = useUser()

  useEffect(() => {
    if (!isLoaded) return

    if (user) {
      posthog.identify(user.id)
    }
  }, [user, isLoaded])

  return null
}
