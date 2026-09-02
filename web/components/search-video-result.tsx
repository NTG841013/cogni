"use client"

import Link from "next/link"
import Image from "next/image"
import { Play, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type SearchResult } from "@/lib/search"
import posthog from "posthog-js"

interface SearchVideoResultProps {
  result: SearchResult & { type: "video" }
}

function formatTime(seconds: number | null): string {
  if (seconds === null || seconds === undefined) return "0:00"
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export function SearchVideoResult({ result }: SearchVideoResultProps) {
  const handleWatch = () => {
    posthog.capture("search_result_clicked", {
      result_id: result.id,
      result_type: result.type,
      course_slug: result.courseSlug,
      lesson_slug: result.lessonSlug,
      matched_at_seconds: result.matchedAtSeconds,
    })
  }

  const watchUrl = result.matchedAtSeconds !== null 
    ? `${result.courseHref}/${result.lessonSlug}?start=${result.matchedAtSeconds}`
    : `${result.courseHref}/${result.lessonSlug}`

  return (
    <div className="group border border-neutral-200 rounded-[16px] overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="grid md:grid-cols-[1fr_250px] gap-6 p-6">
        <div className="min-w-0 space-y-3">
          <div className="space-y-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              {result.courseTitle}
            </div>
            <p className="text-sm text-neutral-600 font-medium">
              {result.moduleTitle} • Lesson {result.lessonNumber}
            </p>
          </div>

          <h3 className="text-3xl font-serif font-bold text-neutral-900 group-hover:text-primary transition-colors line-clamp-2">
            {result.lessonTitle}
          </h3>

          <p className="text-base text-neutral-600 line-clamp-2 leading-normal">
            {result.description}
          </p>

          <Link href={watchUrl} onClick={handleWatch}>
            <Button
              variant="default"
              size="sm"
              className="mt-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-full px-6 h-10"
            >
              Watch from {formatTime(result.matchedAtSeconds)}
            </Button>
          </Link>
        </div>

        <div className="flex flex-col gap-4">
          <div className="relative aspect-video overflow-hidden rounded-[12px] bg-neutral-100 flex-shrink-0">
            {result.thumbnailUrl ? (
              <>
                <Image
                  src={result.thumbnailUrl}
                  alt={result.lessonTitle}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="rounded-full bg-white/90 p-2 shadow-sm">
                    <Play className="h-6 w-6 text-neutral-800 fill-neutral-800" />
                  </div>
                </div>
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-neutral-100 text-neutral-400">
                <Play className="h-8 w-8" />
              </div>
            )}
            {result.matchedAtSeconds !== null && (
              <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-black/80 px-2 py-1 text-xs font-semibold text-white">
                <Clock className="h-3 w-3" />
                {formatTime(result.matchedAtSeconds)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
