"use client"

import { useState } from "react"
import { ChevronDown, CheckCircle2 } from "lucide-react"
import { cn, formatDuration } from "@/lib/utils"
import { COURSE_QUERY_RESULT } from "@/sanity.types"
import posthog from "posthog-js"

type Module = NonNullable<NonNullable<COURSE_QUERY_RESULT>['modules']>[number]

interface ModuleAccordionProps {
  modules: Module[]
  completedLessonsIds: string[]
}

export function ModuleAccordion({ modules, completedLessonsIds }: ModuleAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const [showAll, setShowAll] = useState(false)

  const displayedModules = showAll ? modules : modules.slice(0, 6)

  return (
    <div className="space-y-4">
      {displayedModules.map((module, moduleIndex) => {
        const isOpen = openIndex === moduleIndex
        const moduleDuration = module.lessons?.reduce((acc, l) => acc + (l.duration || 0), 0) || 0

        return (
          <div key={module._key} className="border border-neutral-100 rounded-[32px] overflow-hidden bg-white shadow-sm mb-4">
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
              className="w-full flex items-center justify-between p-8 cursor-pointer hover:bg-neutral-50/50 transition-colors group text-left"
            >
              <div className="flex items-center gap-8">
                <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900 font-bold text-sm shrink-0">
                  {moduleIndex + 1}
                </div>
                <div>
                  <h3 className="text-heading-3 font-sans font-semibold text-neutral-900 group-hover:text-primary transition-colors">
                    {module.title}
                  </h3>
                  {module.summary && (
                    <p className="text-body text-neutral-500 mt-1 max-w-2xl">
                      {module.summary}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-small text-neutral-400">
                  {formatDuration(moduleDuration)}
                </span>
                <ChevronDown className={cn(
                  "h-5 w-5 text-neutral-300 transition-transform duration-200",
                  isOpen && "rotate-180"
                )} />
              </div>
            </button>
            
            {isOpen && (
              <div className="border-t border-neutral-50 bg-neutral-50/20 pb-4">
                {module.lessons?.map((lesson) => {
                  const isCompleted = completedLessonsIds.includes(lesson._id)
                  return (
                    <div key={lesson._id} className="flex items-center justify-between py-4 px-8 hover:bg-neutral-50/50 transition-colors border-b last:border-b-0 border-neutral-50 ml-20 mr-4">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-6 h-6 rounded-full border flex items-center justify-center transition-colors",
                          isCompleted ? "bg-green-500 border-green-500" : "border-neutral-100 bg-white"
                        )}>
                          {isCompleted && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                        </div>
                        <span className="text-body font-medium text-neutral-700">
                          {lesson.title}
                        </span>
                      </div>
                      <span className="text-small text-neutral-400">
                        {formatDuration(lesson.duration || 0)}
                      </span>
                    </div>
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
