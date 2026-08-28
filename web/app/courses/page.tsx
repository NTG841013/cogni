import { BookOpen } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { CourseCard } from "@/components/course-card"
import { serverClient } from "@/lib/sanity/client"
import { COURSES_QUERY } from "@/lib/sanity/queries"
import { COURSES_QUERY_RESULT } from "@/sanity.types"

export default async function CoursesPage() {
  const courses = await serverClient.fetch(COURSES_QUERY)

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col relative overflow-x-hidden">
      <SiteHeader />
      
      <main className="flex-1">
        <section className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-10">
            <h1 className="text-display-2 font-serif text-neutral-900">All Courses</h1>
            <p className="text-body text-neutral-500">
              Showing {courses.length} courses
            </p>
          </div>
          
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course: COURSES_QUERY_RESULT[number]) => (
                <CourseCard 
                  key={course._id} 
                  title={course.title || ""}
                  slug={course.slug || ""}
                  summary={course.summary}
                  coverImage={course.coverImage}
                  level={course.level}
                  moduleCount={course.moduleCount}
                  totalDuration={course.totalDuration}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-neutral-200">
              <BookOpen className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-heading-3 text-neutral-900 font-semibold mb-2">No courses found</h3>
              <p className="text-neutral-500">Check back soon for new content!</p>
            </div>
          )}
        </section>
      </main>

      {/* Decorative footer-like background element */}
      <div className="relative w-full h-[100px] pointer-events-none z-[-1] opacity-10 overflow-hidden mt-auto">
        <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
      </div>
    </div>
  )
}
