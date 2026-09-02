import { notFound } from "next/navigation"
import Image from "next/image"
import { auth } from "@clerk/nextjs/server"
import { stegaClean } from "@sanity/client/stega"
import { 
  BarChart, 
  Clock, 
  BookOpen, 
  Users, 
  CheckCircle2,
  Layers,
  Workflow,
  Gauge,
  Rocket,
  Database,
  Cloud,
  Layout as LayoutIcon,
} from "lucide-react"

import { serverClient } from "@/lib/sanity/client"
import { COURSE_QUERY, USER_PROGRESS_QUERY } from "@/lib/sanity/queries"
import { urlFor } from "@/lib/sanity/image"
import { formatDuration, formatStudentCount } from "@/lib/utils"
import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import { CourseActionButtons } from "@/components/course-action-buttons"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card } from "@/components/ui/card"
import { ModuleAccordion } from "./ModuleAccordion"
import { CourseProgressFooter } from "@/components/course-progress-footer"
import { COURSE_QUERY_RESULT, USER_PROGRESS_QUERY_RESULT } from "@/sanity.types"

interface CoursePageProps {
  params: Promise<{ slug: string }>
}

type LearningOutcome = NonNullable<NonNullable<COURSE_QUERY_RESULT>['learningOutcomes']>[number]
type CourseModule = NonNullable<NonNullable<COURSE_QUERY_RESULT>['modules']>[number]
type CourseLesson = NonNullable<CourseModule['lessons']>[number]
type CompletedLesson = NonNullable<NonNullable<USER_PROGRESS_QUERY_RESULT>['completedLessons']>[number]

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  layers: Layers,
  workflow: Workflow,
  gauge: Gauge,
  rocket: Rocket,
  database: Database,
  cloud: Cloud,
  layout: LayoutIcon,
}

function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICON_MAP[name.toLowerCase()] || CheckCircle2
  return <Icon className={className} />
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params
  const { userId } = await auth()

  const course = await serverClient.fetch(COURSE_QUERY, { slug })

  if (!course) {
    notFound()
  }

  const progress = userId 
    ? await serverClient.fetch(USER_PROGRESS_QUERY, { userId })
    : null

  const lessons = course.modules?.flatMap((m: CourseModule) => m.lessons || []) || []
  const totalLessons = lessons.length
  const totalDuration = lessons.reduce((acc: number, l: CourseLesson) => acc + (l.duration || 0), 0)
  
  const completedLessonsIds = progress?.completedLessons?.map((cl: CompletedLesson) => cl._id) || []
  const completedLessonsInCourse = lessons.filter((l: CourseLesson) => completedLessonsIds.includes(l._id)).length

  const progressPercentage = totalLessons > 0 
    ? Math.round((completedLessonsInCourse / totalLessons) * 100) 
    : 0

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col relative overflow-x-hidden">
      <SiteHeader />

      <main className="flex-1 pb-32">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumb className="mb-12">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">All Courses</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{stegaClean(course.title)}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Hero Section */}
          <section className="grid lg:grid-cols-[1fr_520px] gap-12 items-center mb-24">
            <div className="space-y-8">
              {course.popular && (
                <Badge variant="popular" className="px-4 py-1 rounded-full text-xs tracking-wider uppercase">
                  Popular
                </Badge>
              )}
              <h1 className="text-display-1 font-serif text-neutral-900 leading-tight">
                {stegaClean(course.title)}
              </h1>
              <p className="text-body-large text-neutral-500 max-w-2xl leading-relaxed">
                {stegaClean(course.summary)}
              </p>
              
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-4">
                <div className="flex items-center gap-2 text-neutral-400">
                  <BarChart className="h-4 w-4" />
                  <span className="text-small capitalize">{course.level}</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-400">
                  <Clock className="h-4 w-4" />
                  <span className="text-small">{formatDuration(totalDuration)}</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-400">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-small">{course.modules?.length || 0} modules</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-400">
                  <Users className="h-4 w-4" />
                  <span className="text-small">{formatStudentCount(course.studentCount || 0)} students</span>
                </div>
              </div>

              <CourseActionButtons
                courseSlug={slug}
                courseTitle={stegaClean(course.title) || ""}
                courseLevel={course.level}
                hasProgress={progressPercentage > 0}
                firstLessonSlug={lessons[0]?.slug?.current}
              />
            </div>

            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl shadow-neutral-100">
              {course.coverImage && (
                <Image
                  src={urlFor(course.coverImage).width(1200).height(675).url()}
                  alt={stegaClean(course.title) || ""}
                  fill
                  className="object-cover"
                  priority
                />
              )}
            </div>
          </section>

          {/* What you'll learn */}
          <section className="mb-24 bg-neutral-50 rounded-[40px] p-12 lg:p-16 border border-neutral-100">
            <h2 className="text-heading-1 font-serif text-neutral-900 mb-12">What you&apos;ll learn</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {course.learningOutcomes?.map((outcome: LearningOutcome, i: number) => (
                <Card key={i} className="p-8 border-none shadow-sm hover:shadow-md transition-all rounded-3xl bg-white group">
                  <div className="flex items-start gap-8">
                    <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                      <DynamicIcon name={outcome.icon || ""} className="h-7 w-7 text-primary" />
                    </div>
                    <div className="space-y-3 pt-1">
                      <h3 className="text-heading-3 font-sans font-bold text-neutral-900 leading-tight">
                        {outcome.title}
                      </h3>
                      <p className="text-body text-neutral-500 leading-relaxed font-medium">
                        {outcome.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Course Content */}
          <section>
            <div className="flex items-end justify-between mb-10">
              <h2 className="text-heading-1 font-serif text-neutral-900">Course Content</h2>
              <span className="text-small text-neutral-400 mb-2">
                {course.modules?.length || 0} modules • {formatDuration(totalDuration)}
              </span>
            </div>

            <ModuleAccordion 
              courseSlug={slug}
              modules={(course.modules as CourseModule[]) || []} 
              completedLessonsIds={completedLessonsIds} 
            />
          </section>
        </div>
      </main>

      <CourseProgressFooter
        courseSlug={slug}
        courseTitle={stegaClean(course.title) || ""}
        courseLevel={course.level}
        progressPercentage={progressPercentage}
        showProgress={!!userId}
        firstLessonSlug={lessons[0]?.slug?.current}
      />
    </div>
  )
}
