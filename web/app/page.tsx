import Link from "next/link"
import { ArrowRight, Star, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SiteHeader } from "@/components/site-header"
import { HomeSearchHero } from "@/components/home-search-hero"
import { CourseCard } from "@/components/course-card"
import { serverClient } from "@/lib/sanity/client"
import { COURSES_QUERY } from "@/lib/sanity/queries"
import { COURSES_QUERY_RESULT } from "@/sanity.types"

const decorativeBars = [
  { height: 120, width: 40, opacity: 0.3 },
  { height: 200, width: 60, opacity: 0.4 },
  { height: 150, width: 30, opacity: 0.2 },
  { height: 250, width: 80, opacity: 0.5 },
  { height: 100, width: 50, opacity: 0.3 },
  { height: 180, width: 70, opacity: 0.4 },
  { height: 220, width: 45, opacity: 0.2 },
  { height: 140, width: 55, opacity: 0.5 },
  { height: 210, width: 65, opacity: 0.3 },
  { height: 160, width: 35, opacity: 0.4 },
  { height: 240, width: 75, opacity: 0.2 },
  { height: 130, width: 50, opacity: 0.5 },
  { height: 190, width: 60, opacity: 0.3 },
  { height: 230, width: 40, opacity: 0.4 },
  { height: 110, width: 55, opacity: 0.2 },
  { height: 170, width: 65, opacity: 0.5 },
  { height: 260, width: 45, opacity: 0.3 },
  { height: 155, width: 55, opacity: 0.4 },
  { height: 205, width: 70, opacity: 0.2 },
  { height: 145, width: 60, opacity: 0.5 },
]

export default async function Home() {
  const courses = await serverClient.fetch(COURSES_QUERY)

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col relative overflow-x-hidden">
      {/* Background Texture */}
      <div className="absolute inset-0 z-[-2] pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'repeating-linear-gradient(45deg, #0f172a 0, #0f172a 1px, transparent 0, transparent 50%)', backgroundSize: '12px 12px' }} 
      />
      
      <SiteHeader />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-20 pb-16 text-center">
          <Badge variant="outline" className="mb-8 border-primary-200 bg-primary-100 text-primary-500 font-medium px-4 py-1 rounded-full text-xs tracking-wider uppercase">
            Intelligent Learning
          </Badge>
          <h1 className="text-display-1 font-serif text-neutral-900 mb-6 max-w-4xl mx-auto leading-tight">
            Search your learning <br /> in plain English.
          </h1>
          <p className="text-body-large text-neutral-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Cogni understands what you want to learn and <br className="hidden md:block" />
            finds the exact lessons across all your courses.
          </p>
          <Button asChild size="lg" className="h-14 px-8 rounded-lg bg-gradient-to-r from-primary to-primary-400 hover:opacity-90 text-white font-medium text-lg gap-2 border-none shadow-md shadow-primary/20">
            <Link href="/courses">
              Explore Courses
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </section>

        {/* Search Bar Section */}
        <section className="container mx-auto px-4 pb-24">
          <HomeSearchHero />
        </section>

        {/* Courses Section */}
        <section id="courses" className="container mx-auto px-4 py-16 border-t border-neutral-100">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-heading-1 font-serif text-neutral-900">Featured Courses</h2>
            <Link href="/courses" className="flex items-center gap-2 text-primary hover:text-primary-400 font-medium transition-colors">
              View all courses
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.slice(0, 3).map((course: COURSES_QUERY_RESULT[number]) => (
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

        {/* Bottom Banner */}
        <section className="container mx-auto px-4 py-24">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-neutral-100"></div>
            </div>
            <div className="relative flex justify-center">
              <div className="flex items-center gap-2 px-6 bg-neutral-50 text-neutral-900 font-medium">
                <Star className="h-5 w-5 text-primary fill-primary" />
                <span>New courses and lessons added every week.</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Decorative background element */}
      <div className="relative w-full h-[200px] pointer-events-none z-[-1] opacity-20 overflow-hidden mt-auto">
        <div className="absolute bottom-0 flex w-[200%] gap-4 animate-scroll-slow items-end">
           {decorativeBars.concat(decorativeBars).map((bar, i) => (
             <div 
               key={i} 
               className="bg-gradient-to-t from-primary to-transparent rounded-t-lg shrink-0"
               style={{ 
                 height: `${bar.height}px`,
                 width: `${bar.width}px`,
                 opacity: bar.opacity
               }}
             />
           ))}
        </div>
      </div>
    </div>
  )
}
