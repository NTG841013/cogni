/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { PortableText } from "./portable-text"
import { CheckCircle2, Lightbulb, ExternalLink, FileText, Globe, Link as LinkIcon } from "lucide-react"

interface LessonTabsProps {
  lesson: any
}

export function LessonTabs({ lesson }: LessonTabsProps) {
  const [activeTab, setActiveTab] = useState<"content" | "notes">("content")

  return (
    <div className="mt-12">
      <div className="flex items-center gap-10 border-b border-neutral-100 mb-12">
        <button
          onClick={() => setActiveTab("content")}
          className={cn(
            "pb-5 text-body font-bold transition-all relative uppercase tracking-widest text-[11px]",
            activeTab === "content" ? "text-primary" : "text-neutral-400 hover:text-neutral-600"
          )}
        >
          Lesson Content
          {activeTab === "content" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("notes")}
          className={cn(
            "pb-5 text-body font-bold transition-all relative uppercase tracking-widest text-[11px]",
            activeTab === "notes" ? "text-primary" : "text-neutral-400 hover:text-neutral-600"
          )}
        >
          Notes
          {activeTab === "notes" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
      </div>

      <div className="space-y-16">
        {activeTab === "content" ? (
          <>
            {/* Overview */}
            <section>
              <h2 className="text-display-2 font-serif text-neutral-900 mb-8 leading-tight">Overview</h2>
              <div className="prose prose-neutral max-w-none">
                 <PortableText value={lesson.notes} />
              </div>
            </section>

            {/* In this lesson you will */}
            {lesson.keyPoints && lesson.keyPoints.length > 0 && (
              <section className="space-y-8">
                <h3 className="text-[11px] font-black text-neutral-900 uppercase tracking-[0.2em]">In this lesson you will:</h3>
                <div className="grid sm:grid-cols-2 gap-x-12 gap-y-6">
                  {lesson.keyPoints.map((point: string, i: number) => (
                    <div key={`kp-${i}`} className="flex items-start gap-4 group">
                      <div className="w-6 h-6 rounded-full border-2 border-primary/20 flex items-center justify-center shrink-0 mt-0.5 group-hover:border-primary/40 transition-colors">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <p className="text-body font-medium text-neutral-600 leading-relaxed">{point}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Pro Tip */}
            {lesson.proTip && (
              <div className="bg-orange-50/50 border border-orange-100 rounded-[32px] p-10 flex flex-col md:flex-row items-start gap-8">
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm shadow-primary/5">
                  <Lightbulb className="h-7 w-7 text-primary" />
                </div>
                <div className="space-y-3">
                  <h4 className="text-[11px] font-black text-neutral-900 uppercase tracking-[0.2em]">Pro Tip</h4>
                  <p className="text-body-large font-medium text-neutral-600 leading-relaxed">
                    {lesson.proTip}
                  </p>
                </div>
              </div>
            )}

            {/* Resources */}
            {lesson.resources && lesson.resources.length > 0 && (
              <section>
                <h3 className="text-display-2 font-serif text-neutral-900 mb-10 leading-tight">Resources</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {lesson.resources.map((resource: any, i: number) => {
                    const Icon = resource.type === 'github' ? LinkIcon : 
                                 resource.type === 'docs' ? FileText : 
                                 Globe
                    return (
                      <a
                        key={`res-${i}`}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group p-6 bg-white border border-neutral-100 rounded-2xl hover:shadow-xl hover:shadow-neutral-200/50 hover:-translate-y-1 transition-all flex items-start gap-4"
                      >
                        <div className="w-11 h-11 rounded-xl bg-neutral-50 flex items-center justify-center shrink-0 group-hover:bg-orange-50 transition-colors">
                          <Icon className="h-5 w-5 text-neutral-400 group-hover:text-primary transition-colors" />
                        </div>
                        <div className="space-y-1.5 flex-1 pt-1">
                          <h5 className="text-small font-bold text-neutral-900 flex items-center justify-between gap-2">
                            {resource.title}
                            <ExternalLink className="h-3.5 w-3.5 text-neutral-300 group-hover:text-primary transition-colors shrink-0" />
                          </h5>
                          <p className="text-[11px] font-medium text-neutral-400 leading-snug line-clamp-2">
                            {resource.description}
                          </p>
                        </div>
                      </a>
                    )
                  })}
                </div>
              </section>
            )}
          </>
        ) : (
          <section>
            <h2 className="text-display-2 font-serif text-neutral-900 mb-8 leading-tight">Lesson Notes</h2>
            <div className="prose prose-neutral max-w-none">
              <PortableText value={lesson.notes} />
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
