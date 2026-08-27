"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Clock, BookOpen } from "lucide-react"
import { urlFor } from "@/lib/sanity/image"
import { formatDuration } from "@/lib/utils"
import { stegaClean } from "@sanity/client/stega"
import posthog from "posthog-js"

export interface CourseCardProps {
  title: string
  slug: string
  summary?: string | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  coverImage?: any
  level?: string | null
  totalDuration?: number | null
  moduleCount?: number | null
}

export function CourseCard({
  title,
  slug,
  summary,
  coverImage,
  level,
  totalDuration,
  moduleCount,
}: CourseCardProps) {
  const handleClick = () => {
    posthog.capture("course_card_clicked", {
      course_slug: slug,
      course_title: stegaClean(title),
      course_level: stegaClean(level),
      module_count: moduleCount,
    })
  }

  return (
    <Link href={`/courses/${slug}`} className="block group" onClick={handleClick}>
      <Card className="h-full border-neutral-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group-hover:-translate-y-1">
        <CardHeader className="p-0">
          <div className="aspect-video w-full bg-neutral-100 relative overflow-hidden">
            {coverImage ? (
              <Image
                src={urlFor(coverImage).width(600).height(338).url()}
                alt={stegaClean(title) || ""}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-300">
                <BookOpen className="h-12 w-12" />
              </div>
            )}
            {level && (
              <div className="absolute top-4 left-4">
                <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-neutral-900 shadow-sm">
                  {stegaClean(level)}
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6 flex flex-col h-[calc(100%-56.25%)]">
          <CardTitle className="font-serif text-heading-2 text-neutral-900 mb-4 leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {stegaClean(title)}
          </CardTitle>
          {summary && (
            <p className="text-body text-neutral-500 line-clamp-2 mb-6">
              {stegaClean(summary)}
            </p>
          )}
          
          <div className="flex items-center justify-between pt-6 border-t border-neutral-100 mt-auto">
            <div className="flex items-center gap-1.5 text-small text-neutral-400">
              <BarChart className="h-3.5 w-3.5" />
              <span className="capitalize">{stegaClean(level)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-small text-neutral-400">
              <Clock className="h-3.5 w-3.5" />
              <span>{formatDuration(totalDuration || 0)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-small text-neutral-400">
              <BookOpen className="h-3.5 w-3.5" />
              <span>{moduleCount || 0} modules</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
