/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDuration } from "@/lib/utils"
import { stegaClean } from "@sanity/client/stega"

interface LessonNavigationFooterProps {
  prevLesson: any
  nextLesson: any
  courseSlug: string
}

export function LessonNavigationFooter({
  prevLesson,
  nextLesson,
  courseSlug,
}: LessonNavigationFooterProps) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 lg:left-[350px] bg-white/95 backdrop-blur-sm border-t border-neutral-100 h-24 z-30 px-4 md:px-12">
      <div className="h-full flex items-center justify-between max-w-5xl mx-auto w-full gap-4">
        {/* Previous Lesson */}
        <div className="flex items-center gap-6 flex-1">
          {prevLesson ? (
            <>
              <Button 
                asChild
                variant="outline" 
                className="h-12 px-6 rounded-xl border-neutral-100 text-neutral-900 font-bold shadow-sm hover:bg-neutral-50 shrink-0 hidden sm:flex"
              >
                <Link href={`/courses/${courseSlug}/${prevLesson.slug}`}>
                  <ChevronLeft className="h-5 w-5 mr-2" />
                  Previous Lesson
                </Link>
              </Button>
              {/* Mobile button icon only */}
              <Button 
                asChild
                variant="outline" 
                size="icon"
                className="h-12 w-12 rounded-xl border-neutral-100 text-neutral-900 font-bold shadow-sm hover:bg-neutral-50 shrink-0 flex sm:hidden"
              >
                <Link href={`/courses/${courseSlug}/${prevLesson.slug}`}>
                  <ChevronLeft className="h-5 w-5" />
                </Link>
              </Button>
              
              <div className="hidden md:block">
                <p className="text-[13px] font-bold text-neutral-900 line-clamp-1">{stegaClean(prevLesson.title)}</p>
                <p className="text-[11px] text-neutral-400 font-medium">{formatDuration(prevLesson.duration || 0)}</p>
              </div>
            </>
          ) : <div className="flex-1" />}
        </div>

        {/* Next Lesson */}
        <div className="flex items-center justify-end gap-6 flex-1 text-right">
          {nextLesson ? (
            <>
              <div className="hidden md:block">
                <p className="text-[13px] font-bold text-neutral-900 line-clamp-1">{stegaClean(nextLesson.title)}</p>
                <p className="text-[11px] text-neutral-400 font-medium">{formatDuration(nextLesson.duration || 0)}</p>
              </div>

              <Button 
                asChild
                className="h-12 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 shrink-0 hidden sm:flex"
              >
                <Link href={`/courses/${courseSlug}/${nextLesson.slug}`}>
                  Next Lesson
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              {/* Mobile button icon only */}
              <Button 
                asChild
                className="h-12 w-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 shrink-0 flex sm:hidden"
              >
                <Link href={`/courses/${courseSlug}/${nextLesson.slug}`}>
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </Button>
            </>
          ) : (
            <div className="flex-1" />
          )}
        </div>
      </div>
    </footer>
  )
}
