"use client"

import Link from "next/link"
import { ArrowRight, Bookmark } from "lucide-react"
import posthog from "posthog-js"
import { Button } from "@/components/ui/button"

interface CourseActionButtonsProps {
  courseSlug: string
  courseTitle: string
  courseLevel?: string | null
  hasProgress: boolean
  firstLessonSlug?: string
}

export function CourseActionButtons({
  courseSlug,
  courseTitle,
  courseLevel,
  hasProgress,
  firstLessonSlug,
}: CourseActionButtonsProps) {
  const handleStartOrContinue = () => {
    if (hasProgress) {
      posthog.capture("course_continued", {
        course_slug: courseSlug,
        course_title: courseTitle,
        course_level: courseLevel,
      })
    } else {
      posthog.capture("course_started", {
        course_slug: courseSlug,
        course_title: courseTitle,
        course_level: courseLevel,
      })
    }
  }

  const handleBookmark = () => {
    posthog.capture("course_bookmarked", {
      course_slug: courseSlug,
      course_title: courseTitle,
      course_level: courseLevel,
    })
  }

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-6">
      <Button
        asChild
        size="lg"
        onClick={handleStartOrContinue}
        className="h-14 px-8 rounded-lg bg-gradient-to-r from-primary to-primary-400 hover:opacity-90 text-white font-medium text-lg gap-2 border-none shadow-md shadow-primary/20 w-full sm:w-auto"
      >
        <Link href={`/courses/${courseSlug}/${firstLessonSlug || ""}`}>
          {hasProgress ? "Continue Learning" : "Start Learning"}
          <ArrowRight className="h-5 w-5" />
        </Link>
      </Button>
      <Button
        variant="secondary"
        size="lg"
        onClick={handleBookmark}
        className="h-14 px-8 rounded-lg font-medium text-lg gap-2 border-neutral-200 bg-white w-full sm:w-auto"
      >
        <Bookmark className="h-5 w-5" />
        Bookmark
      </Button>
    </div>
  )
}
