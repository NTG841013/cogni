"use client"

import Link from "next/link"
import { useState } from "react"
import { ChevronDown, CheckCircle2 } from "lucide-react"
import { cn, formatDuration } from "@/lib/utils"
import { COURSE_QUERY_RESULT } from "@/sanity.types"
import posthog from "posthog-js"

type Module = NonNullable<NonNullable<COURSE_QUERY_RESULT>['modules']>[number]

interface ModuleAccordionProps {
  courseSlug: string
  modules: Module[]
  completedLessonsIds: string[]
}

export function ModuleAccordion({ courseSlug, modules, completedLessonsIds }: ModuleAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const [showAll, setShowAll] = useState(false)

  const displayedModules = showAll ? modules : modules.slice(0, 6)

  return (
    <div className="bg-neutral-50 rounded-[32px] overflow-hidden border border-neutral-100">
      {displayedModules.map((module, moduleIndex) => {
        const moduleKey = module._key || `module-${moduleIndex}`
        const isOpen = openIndex === moduleIndex
        const moduleDuration = module.lessons?.reduce((acc, l) => acc + (l.duration || 0), 0) || 0

        return (
          <div key={moduleKey} className="border-b last:border-b-0 border-neutral-100">
            <button 
              onClick={() => {
                const opening = !isOpen
                setOpenIndex(isOpen ? null : moduleIndex)
                if (opening) {
                  posthog.capture("module_expanded", {
                    module_title: module.title,
                    module_index: moduleIndex + 1,
                    lesson_count: module.lessons?.length ?? 0,
                  })
                }
              }}
              className="w-full flex items-center justify-between p-6 sm:p-8 cursor-pointer hover:bg-white transition-all group text-left"
            >
              <div className="flex items-center gap-4 sm:gap-8">
                <div className="text-neutral-900 font-bold text-lg shrink-0 w-6 sm:w-8 text-center">
                  {moduleIndex + 1}
                </div>
                <div>
                  <h3 className="text-heading-3 font-sans font-bold text-neutral-900 group-hover:text-primary transition-colors">
                    {module.title}
                  </h3>
                  {module.summary && (
                    <p className="text-body text-neutral-500 mt-1 max-w-2xl font-medium">
                      {module.summary}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-small font-bold text-neutral-400">
                  {formatDuration(moduleDuration)}
                </span>
                <ChevronDown className={cn(
                  "h-5 w-5 text-neutral-300 transition-transform duration-300",
                  isOpen && "rotate-180"
                )} />
              </div>
            </button>
            
            {isOpen && (
              <div className="bg-white/50 pb-4">
                {module.lessons?.map((lesson, lessonIndex) => {
                  const isCompleted = completedLessonsIds.includes(lesson._id)
                  const lessonKey = lesson._id || `${moduleKey}-lesson-${lessonIndex}`
                  return (
                    <Link 
                      key={lessonKey} 
                      href={`/courses/${courseSlug}/${lesson.slug?.current}`}
                      className="flex items-center justify-between py-5 px-6 sm:px-8 hover:bg-white transition-colors border-b last:border-b-0 border-neutral-100/50 sm:ml-16 sm:mr-8 group"
                    >
                      <div className="flex items-center gap-5">
                        <div className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                          isCompleted ? "bg-primary border-primary" : "border-neutral-200 bg-white"
                        )}>
                          {isCompleted && <CheckCircle2 className="h-3 w-3 text-white" />}
                        </div>
                        <span className="text-body font-medium text-neutral-700 group-hover:text-primary transition-colors">
                          {lesson.title}
                        </span>
                      </div>
                      <span className="text-small font-medium text-neutral-400">
                        {formatDuration(lesson.duration || 0)}
                      </span>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}

      {!showAll && modules.length > 6 && (
        <div className="flex justify-center mt-12">
          <button 
            onClick={() => {
              setShowAll(true)
              posthog.capture("all_modules_shown", {
                total_modules: modules.length,
              })
            }}
            className="flex items-center justify-center h-12 px-6 rounded-lg gap-2 border border-neutral-200 font-medium hover:bg-neutral-50 transition-colors"
          >
            Show all {modules.length} modules
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
