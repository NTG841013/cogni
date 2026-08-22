import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Clock, BookOpen } from "lucide-react"

export interface CourseCardProps {
  title: string
  description: string
  icon: React.ReactNode
  level: string
  duration: string
  modules: number
}

export function CourseCard({
  title,
  description,
  icon,
  level,
  duration,
  modules,
}: CourseCardProps) {
  return (
    <Card className="h-full border-neutral-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden hover:-translate-y-1">
      <CardHeader className="p-6">
        <div className="w-16 h-16 bg-neutral-50 rounded-lg flex items-center justify-center mb-6">
          {icon}
        </div>
        <CardTitle className="font-serif text-heading-2 text-neutral-900 mb-4 leading-tight">
          {title}
        </CardTitle>
        <p className="text-body text-neutral-500 line-clamp-2">
          {description}
        </p>
      </CardHeader>
      <CardContent className="p-6 pt-0 mt-auto">
        <div className="flex items-center justify-between pt-6 border-t border-neutral-100">
          <div className="flex items-center gap-1.5 text-small text-neutral-400">
            <BarChart className="h-3.5 w-3.5" />
            <span>{level}</span>
          </div>
          <div className="flex items-center gap-1.5 text-small text-neutral-400">
            <Clock className="h-3.5 w-3.5" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1.5 text-small text-neutral-400">
            <BookOpen className="h-3.5 w-3.5" />
            <span>{modules} modules</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
