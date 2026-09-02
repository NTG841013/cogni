"use client"

import Link from "next/link"
import Image from "next/image"
import { BookOpen, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type SearchResult } from "@/lib/search"
import posthog from "posthog-js"

interface SearchLessonResultProps {
  result: SearchResult & { type: "lesson" }
}

export function SearchLessonResult({ result }: SearchLessonResultProps) {
  const handleViewLesson = () => {
    posthog.capture("search_result_clicked", {
      result_id: result.id,
      result_type: result.type,
      course_slug: result.courseSlug,
      lesson_slug: result.lessonSlug,
    })
  }

  const lessonUrl = `${result.courseHref}/${result.lessonSlug}`

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

          {result.keyPoints && result.keyPoints.length > 0 && (
            <ul className="space-y-1.5 pt-1">
              {result.keyPoints.slice(0, 3).map((point, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-neutral-600 leading-snug">
                  <span className="text-primary font-bold flex-shrink-0 mt-0.5">•</span>
                  <span className="line-clamp-1">{point}</span>
                </li>
              ))}
            </ul>
          )}

          <Link href={lessonUrl} onClick={handleViewLesson}>
            <Button
              variant="default"
              size="sm"
              className="mt-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-full px-6 h-10 gap-2 whitespace-nowrap"
            >
              View lesson
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="flex flex-col gap-4">
          {result.thumbnailUrl ? (
            <div className="relative aspect-video overflow-hidden rounded-[12px] bg-neutral-100 flex-shrink-0">
              <Image
                src={result.thumbnailUrl}
                alt={result.lessonTitle}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="rounded-full bg-white/90 p-2 shadow-sm">
                  <BookOpen className="h-6 w-6 text-neutral-800" />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex aspect-video w-full items-center justify-center rounded-[12px] bg-neutral-100 text-neutral-400">
              <BookOpen className="h-8 w-8" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
