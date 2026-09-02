/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import Link from "next/link"
import { ChevronLeft, ChevronDown, CheckCircle2, PlayCircle, X } from "lucide-react"
import { cn, formatDuration } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { useState } from "react"
import { stegaClean } from "@sanity/client/stega"

interface LessonSidebarProps {
  course: any
  currentLessonSlug: string
  completedLessonsIds: string[]
  progressPercentage: number
}

interface SidebarContentProps {
  course: any
  currentLessonSlug: string
  completedLessonsIds: string[]
  progressPercentage: number
  openModules: Record<string, boolean>
  toggleModule: (key: string) => void
  onLessonSelect?: () => void
  className?: string
  scrollable?: boolean
}

function SidebarContent({
  course,
  currentLessonSlug,
  completedLessonsIds,
  progressPercentage,
  openModules,
  toggleModule,
  onLessonSelect,
  className,
  scrollable = true,
}: SidebarContentProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <div className="p-8 pb-6">
        <Link
          href={`/courses/${course.slug}`}
          className="flex items-center gap-2 text-neutral-400 text-small font-medium hover:text-primary transition-colors mb-10"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to course
        </Link>

        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center text-white font-bold shrink-0 shadow-sm shadow-neutral-200">
            {course.title?.charAt(0)}
          </div>
          <div className="space-y-1 mt-1">
            <h2 className="text-body font-bold text-neutral-900 line-clamp-2 leading-tight">
              {stegaClean(course.title)}
            </h2>
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
              {progressPercentage}% complete
            </p>
          </div>
        </div>
        <div className="px-1">
          <Progress value={progressPercentage} className="h-1.5 bg-neutral-200" />
        </div>
      </div>

      <nav className={cn(
        "p-4 space-y-2",
        scrollable ? "flex-1 overflow-y-auto no-scrollbar pb-20" : "pb-32"
      )}>
        {course.modules?.map((module: any, moduleIndex: number) => {
          const moduleKey = module._key || `module-${moduleIndex}`
          const isOpen = openModules[moduleKey]
          const isCurrentModule = module.lessons?.some((l: any) => l.slug === currentLessonSlug)

          return (
            <div key={moduleKey} className="space-y-1">
              <button
                onClick={() => toggleModule(moduleKey)}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-2xl transition-all text-left group mb-1",
                  isCurrentModule ? "bg-white shadow-sm ring-1 ring-neutral-100" : "hover:bg-neutral-100/50"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0 transition-colors",
                    isCurrentModule ? "bg-primary text-white" : "bg-neutral-100 text-neutral-400"
                  )}>
                    {moduleIndex + 1}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                      Module {moduleIndex + 1} of {course.modules.length}
                    </p>
                    <h3 className={cn(
                      "text-small font-bold transition-colors",
                      isCurrentModule ? "text-neutral-900" : "text-neutral-900"
                    )}>
                      {module.title}
                    </h3>
                  </div>
                </div>
                <ChevronDown className={cn(
                  "h-4 w-4 text-neutral-300 transition-transform duration-300",
                  isOpen && "rotate-180",
                  isCurrentModule && "text-neutral-400"
                )} />
              </button>

              {isOpen && (
                <div className="ml-4 pl-4 border-l-2 border-neutral-100/80 mt-2 space-y-1 mb-4">
                  {module.lessons?.map((lesson: any, lessonIndex: number) => {
                    const isCurrent = lesson.slug === currentLessonSlug
                    const isCompleted = completedLessonsIds.includes(lesson._id)
                    const lessonKey = lesson._id || `${moduleKey}-lesson-${lessonIndex}`

                    return (
                      <Link
                        key={lessonKey}
                        href={`/courses/${course.slug}/${lesson.slug}`}
                        onClick={onLessonSelect}
                        className={cn(
                          "flex items-start gap-4 p-3 rounded-xl transition-all group relative",
                          isCurrent ? "bg-white shadow-sm ring-1 ring-neutral-100" : "hover:bg-neutral-100/30"
                        )}
                      >
                        <div className="mt-1 flex items-center justify-center shrink-0">
                          {isCurrent ? (
                            <div className="w-2 h-2 rounded-full bg-primary" />
                          ) : isCompleted ? (
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                          ) : (
                            <div className="w-2 h-2 rounded-full border-2 border-neutral-200" />
                          )}
                        </div>
                        <div className="flex-1 pr-8">
                          <h4 className={cn(
                            "text-small font-medium leading-snug transition-colors",
                            isCurrent ? "text-primary font-bold" : "text-neutral-500 group-hover:text-neutral-900"
                          )}>
                            {lesson.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={cn(
                              "text-[11px]",
                              isCurrent ? "text-primary/70 font-bold" : "text-neutral-400"
                            )}>
                              {isCurrent ? "Now playing" : formatDuration(lesson.duration)}
                            </span>
                          </div>
                        </div>
                        {isCurrent && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30 transition-transform hover:scale-105">
                            <PlayCircle className="h-4 w-4 text-white fill-white" />
                          </div>
                        )}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </div>
  )
}

export function LessonSidebar({
  course,
  currentLessonSlug,
  completedLessonsIds,
  progressPercentage,
}: LessonSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [openModules, setOpenModules] = useState<Record<string, boolean>>(() => {
    // Open the module that contains the current lesson
    const initial: Record<string, boolean> = {}
    course.modules?.forEach((module: any) => {
      const hasCurrentLesson = module.lessons?.some((l: any) => l.slug === currentLessonSlug)
      if (hasCurrentLesson) {
        initial[module._key || module.title] = true
      }
    })
    return initial
  })

  const toggleModule = (moduleKey: string) => {
    setOpenModules((prev) => ({
      ...prev,
      [moduleKey]: !prev[moduleKey],
    }))
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed bottom-8 right-8 z-50 w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white shadow-2xl shadow-primary/40 active:scale-90 transition-all border-4 border-white"
      >
        <PlayCircle className="h-8 w-8 fill-white/20" />
      </button>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div 
            className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMobileOpen(false)} 
          />
          <div className="absolute left-0 top-0 bottom-0 w-[85%] max-w-[320px] bg-neutral-50 shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            <SidebarContent 
              course={course}
              currentLessonSlug={currentLessonSlug}
              completedLessonsIds={completedLessonsIds}
              progressPercentage={progressPercentage}
              openModules={openModules}
              toggleModule={toggleModule}
              onLessonSelect={() => setIsMobileOpen(false)}
              className="h-full"
              scrollable={true}
            />
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-4 right-[-50px] w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
            >
              <X className="h-6 w-6 text-neutral-900" />
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="w-80 lg:w-[350px] border-r border-neutral-100 bg-neutral-50 hidden lg:block shrink-0">
        <SidebarContent 
          course={course}
          currentLessonSlug={currentLessonSlug}
          completedLessonsIds={completedLessonsIds}
          progressPercentage={progressPercentage}
          openModules={openModules}
          toggleModule={toggleModule}
          scrollable={false}
        />
      </aside>
    </>
  )
}
