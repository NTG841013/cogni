"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import posthog from "posthog-js"

interface CourseProgressFooterProps {
  courseSlug: string
  courseTitle: string
  courseLevel?: string | null
  progressPercentage: number
  showProgress: boolean
  firstLessonSlug?: string
}

export function CourseProgressFooter({
  courseSlug,
  courseTitle,
  courseLevel,
  progressPercentage,
  showProgress,
  firstLessonSlug,
}: CourseProgressFooterProps) {
  if (!showProgress) return null

  const handleContinue = () => {
    const event = progressPercentage > 0 ? "course_continued" : "course_started"
    posthog.capture(event, {
      course_slug: courseSlug,
      course_title: courseTitle,
      course_level: courseLevel,
      from: "sticky_footer",
    })
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-neutral-100 py-6 px-4 z-40 shadow-[0_-8px_30px_rgb(0,0,0,0.06)]">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">
        <div className="flex-1 w-full max-w-2xl space-y-3">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Your Progress</p>
              <p className="text-heading-3 font-serif text-neutral-900">{progressPercentage}% complete</p>
            </div>
          </div>
          <Progress value={progressPercentage} className="h-1.5 bg-neutral-100" />
        </div>
        <Button 
          asChild 
          size="lg" 
          onClick={handleContinue}
          className="h-14 px-10 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium text-lg gap-2 shrink-0 w-full md:w-auto shadow-md shadow-primary/20"
        >
          <Link href={`/courses/${courseSlug}/${firstLessonSlug || ""}`}>
            {progressPercentage > 0 ? "Continue Learning" : "Start Learning"}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
