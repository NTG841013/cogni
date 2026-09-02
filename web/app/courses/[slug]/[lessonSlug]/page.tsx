/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { stegaClean } from "@sanity/client/stega"
import { Clock, BarChart, Users, Bookmark } from "lucide-react"

import { serverClient } from "@/lib/sanity/client"
import { LESSON_QUERY, USER_PROGRESS_QUERY } from "@/lib/sanity/queries"
import { formatDuration, formatStudentCount } from "@/lib/utils"
import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { VideoPlayer } from "@/components/video-player"
import { LessonSidebar } from "@/components/lesson-sidebar"
import { LessonTabs } from "@/components/lesson-tabs"
import { LessonNavigationFooter } from "@/components/lesson-navigation-footer"
import { LESSON_QUERY_RESULT, USER_PROGRESS_QUERY_RESULT } from "@/sanity.types"
import { getPostHogClient } from "@/lib/posthog-server"

interface LessonPageProps {
  params: Promise<{ slug: string; lessonSlug: string }>
  searchParams: Promise<{ start?: string }>
}

export default async function LessonPage({ params, searchParams }: LessonPageProps) {
  const { slug, lessonSlug } = await params
  const { start } = await searchParams
  const { userId } = await auth()

  const lesson = await serverClient.fetch(LESSON_QUERY, { slug: lessonSlug }) as LESSON_QUERY_RESULT

  if (!lesson || !lesson.course || stegaClean(lesson.course.slug) !== slug) {
    notFound()
  }

  if (userId && start) {
    const posthog = getPostHogClient()
    posthog.capture({
      distinctId: userId,
      event: 'resume_used',
      properties: {
        lesson_id: lesson._id,
        lesson_title: stegaClean(lesson.title),
        start_seconds: parseInt(start),
      }
    })
    await posthog.shutdown()
  }

  const course = lesson.course
  const progress = userId 
    ? await serverClient.fetch(USER_PROGRESS_QUERY, { userId }) as USER_PROGRESS_QUERY_RESULT
    : null

  const completedLessonsIds = progress?.completedLessons?.map((cl: { _id: string }) => cl._id) || []
  
  // Flatten all lessons in the course to calculate progress and navigate
  const allLessons = course.modules?.flatMap((m: any) => m.lessons || []) || []
  const currentLessonIndex = allLessons.findIndex((l: { slug: string }) => l.slug === lessonSlug)
  
  const completedLessonsInCourse = allLessons.filter((l: { _id: string }) => completedLessonsIds.includes(l._id)).length
  const progressPercentage = allLessons.length > 0 
    ? Math.round((completedLessonsInCourse / allLessons.length) * 100) 
    : 0

  const prevLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null
  const nextLesson = currentLessonIndex < allLessons.length - 1 ? allLessons[currentLessonIndex + 1] : null

  // Find module index and lesson index within module for "LESSON X.Y" label
  let moduleIndex = -1
  let lessonInModuleIndex = -1
  
  course.modules?.forEach((m: any, mIdx: number) => {
    const lIdx = m.lessons?.findIndex((l: { slug: string }) => l.slug === lessonSlug)
    if (lIdx !== -1 && lIdx !== undefined) {
      moduleIndex = mIdx
      lessonInModuleIndex = lIdx
    }
  })

  const lessonLabel = `LESSON ${moduleIndex + 1}.${lessonInModuleIndex + 1}`
  const moduleTitle = (course.modules as any)?.[moduleIndex]?.title

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-x-hidden">
      <SiteHeader />

      <div className="flex flex-1">
        <LessonSidebar 
          course={course} 
          currentLessonSlug={lessonSlug}
          completedLessonsIds={completedLessonsIds}
          progressPercentage={progressPercentage}
        />

        <main className="flex-1 pb-32">
          <div className="px-4 lg:px-16 py-10">
            <Breadcrumb className="mb-14">
              <BreadcrumbList className="text-[11px] font-medium uppercase tracking-widest text-neutral-400 flex-wrap">
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="hover:text-primary transition-colors">All Courses</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="scale-75 opacity-50" />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/courses/${course.slug}`} className="hover:text-primary transition-colors">{stegaClean(course.title)}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="scale-75 opacity-50" />
                <BreadcrumbItem className="hidden sm:inline-flex">
                  <span className="text-neutral-300">{stegaClean(moduleTitle)}</span>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="scale-75 opacity-50 hidden sm:inline-flex" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-neutral-900 line-clamp-1">{stegaClean(lesson.title)}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="max-w-4xl">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-10">
                <div className="space-y-6">
                  <Badge variant="lesson" className="px-3 py-1 rounded-md text-[10px] uppercase tracking-[0.2em] font-black border-none">
                    {lessonLabel}
                  </Badge>
                  <h1 className="text-display-1 font-serif text-neutral-900 leading-[1.15]">
                    {stegaClean(lesson.title)}
                  </h1>
                  {(lesson as any).summary && (
                    <p className="text-body-large text-neutral-500 leading-relaxed max-w-3xl">
                      {stegaClean((lesson as any).summary)}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-x-10 gap-y-4 pt-4 border-t border-neutral-50">
                    <div className="flex items-center gap-2.5 text-neutral-400">
                      <Clock className="h-4.5 w-4.5" />
                      <span className="text-small font-medium">{formatDuration(lesson.duration || 0)}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-neutral-400">
                      <BarChart className="h-4.5 w-4.5" />
                      <span className="text-small font-medium capitalize">{(lesson as any).level || (course as any).level}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-neutral-400">
                      <Users className="h-4.5 w-4.5" />
                      <span className="text-small font-medium">{formatStudentCount(lesson.studentCount || 0)} students</span>
                    </div>
                  </div>
                </div>

                <Button variant="outline" size="icon" className="shrink-0 h-12 w-12 rounded-xl border-neutral-100 shadow-sm bg-white hover:bg-neutral-50 group">
                  <Bookmark className="h-5 w-5 text-neutral-400 group-hover:text-primary transition-colors" />
                </Button>
              </div>

              <div className="mb-16">
                <VideoPlayer 
                  url={lesson.videoUrl || ""} 
                  startTime={start ? parseInt(start) : undefined} 
                  lessonId={lesson._id}
                  lessonTitle={stegaClean(lesson.title)}
                />
              </div>

              <LessonTabs lesson={lesson} />
            </div>
          </div>
        </main>
      </div>

      <LessonNavigationFooter 
        prevLesson={prevLesson}
        nextLesson={nextLesson}
        courseSlug={course.slug || ""}
      />
    </div>
  )
}
