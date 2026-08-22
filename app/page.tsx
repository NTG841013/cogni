import Link from "next/link"
import { Search, ArrowRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { SiteHeader } from "@/components/site-header"
import { CourseCard } from "@/components/course-card"

const mockCourses = [
  {
    title: "Next.js for Production",
    description: "Build scalable, high-performance web applications with Next.js.",
    icon: (
      <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-black text-white font-bold">
        N
      </div>
    ),
    level: "Intermediate",
    duration: "18h 24m",
    modules: 12,
  },
  {
    title: "Docker Essentials",
    description: "Containerize applications and streamline your development workflow.",
    icon: (
      <div className="text-primary-500">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.983 11.078h2.119c.102 0 .186.084.186.186v2.119c0 .102-.084.186-.186.186h-2.119c-.102 0-.186-.084-.186-.186v-2.119c0-.102.084-.186.186-.186zm-2.958 0h2.119c.102 0 .186.084.186.186v2.119c0 .102-.084.186-.186.186h-2.119c-.102 0-.186-.084-.186-.186v-2.119c0-.102.084-.186.186-.186zm-2.958 0h2.119c.102 0 .186.084.186.186v2.119c0 .102-.084.186-.186.186h-2.119c-.102 0-.186-.084-.186-.186v-2.119c0-.102.084-.186.186-.186zm-2.958 0h2.119c.102 0 .186.084.186.186v2.119c0 .102-.084.186-.186.186h-2.119c-.102 0-.186-.084-.186-.186v-2.119c0-.102.084-.186.186-.186zm2.958-2.958h2.119c.102 0 .186.084.186.186v2.119c0 .102-.084.186-.186.186h-2.119c-.102 0-.186-.084-.186-.186v-2.119c0-.102.084-.186.186-.186zm2.958 0h2.119c.102 0 .186.084.186.186v2.119c0 .102-.084.186-.186.186h-2.119c-.102 0-.186-.084-.186-.186v-2.119c0-.102.084-.186.186-.186zm-2.958-2.958h2.119c.102 0 .186.084.186.186v2.119c0 .102-.084.186-.186.186h-2.119c-.102 0-.186-.084-.186-.186v-2.119c0-.102.084-.186.186-.186zm5.916 5.916h2.119c.102 0 .186.084.186.186v2.119c0 .102-.084.186-.186.186h-2.119c-.102 0-.186-.084-.186-.186v-2.119c0-.102.084-.186.186-.186zm-2.958 0h2.119c.102 0 .186.084.186.186v2.119c0 .102-.084.186-.186.186h-2.119c-.102 0-.186-.084-.186-.186v-2.119c0-.102.084-.186.186-.186zm11.055-2.529c-.027-.083-.053-.162-.079-.239-.573-1.637-1.662-2.933-3.135-3.934 0 0 .012-.012.012-.024-.206-.073-.437-.133-.668-.182-.206-.024-.413-.048-.631-.048-.048 0-.084.012-.133.012.218-.582.461-1.152.716-1.722.06-.133.012-.291-.121-.352-.133-.06-.291-.012-.352.121-.291.667-.558 1.334-.789 2.013-.012.024-.024.06-.024.097 0 .024.012.048.024.073-.364.097-.716.23-1.055.4-.048.024-.097.048-.133.073-.012.048-.048.084-.048.133-.012.339-.024.679-.036 1.018-.012.158-.024.315-.024.473 0 .206.012.413.024.619.012.182.024.37.048.558.606 0 1.213.012 1.819.048.339.024.679.048 1.018.096.473.06.946.158 1.407.279.389.109.764.243 1.14.413.073.036.158.06.23.097.145.06.303 0 .364-.145.048-.121 0-.279-.121-.339zm-2.317 2.108c0 .121-.109.218-.218.218h-10.648c-.461 0-.897-.036-1.322-.097-.667-.097-1.286-.255-1.819-.461-.546-.206-.97-.485-1.286-.825-.303-.339-.449-.703-.449-1.091 0-.06.012-.121.012-.182.012-.048.012-.084.024-.121v-.024c.012-.048.024-.097.036-.145v-.024c.012-.048.024-.097.048-.133v-.024c.012-.048.036-.084.048-.133v-.024c.024-.048.036-.084.06-.133l.048-.073c.158-.291.389-.558.679-.789.291-.23.631-.424 1.019-.582.389-.158.825-.267 1.286-.339.461-.073.946-.109 1.455-.109h.303c.339 0 .679.024 1.019.048h.012c.473.048.946.097 1.419.145.522.06 1.043.109 1.565.145.716.06 1.431.085 2.147.085 1.213 0 2.426-.048 3.627-.145.582-.048 1.164-.121 1.734-.206.145-.024.279.085.303.23.024.145-.085.279-.23.303-.546.085-1.104.145-1.662.206-1.177.109-2.365.158-3.554.158-.703 0-1.407-.024-2.11-.073-.522-.036-1.043-.085-1.552-.145-.461-.048-.922-.097-1.383-.145h-.012c-.327-.024-.655-.048-.982-.048h-.315c-.473 0-.91.036-1.322.097-.413.06-.776.158-1.092.291-.315.133-.57.291-.776.473-.206.182-.339.376-.4.594-.048.158-.073.315-.073.485 0 .303.121.57.339.813.218.243.522.449.91.619.389.17 849.327 1.346.413 1.832.473.389.048.776.085 1.177.085h10.454c.06.012.109.06.109.121z" />
        </svg>
      </div>
    ),
    level: "Beginner",
    duration: "10h 12m",
    modules: 8,
  },
  {
    title: "TypeScript Deep Dive",
    description: "Go beyond the basics and write safer, more expressive code.",
    icon: (
      <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-[#3178C6] text-white font-bold text-sm">
        TS
      </div>
    ),
    level: "Intermediate",
    duration: "14h 36m",
    modules: 10,
  },
]

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

export default function Home() {
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
          <Button size="lg" className="h-14 px-8 rounded-lg bg-gradient-to-r from-primary to-primary-400 hover:opacity-90 text-white font-medium text-lg gap-2 border-none shadow-md shadow-primary/20">
            Explore Courses
            <ArrowRight className="h-5 w-5" />
          </Button>
        </section>

        {/* Search Bar Section */}
        <section className="container mx-auto px-4 pb-24">
          <div className="max-w-3xl mx-auto relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors">
              <Search className="h-6 w-6" />
            </div>
            <Input 
              placeholder="Ask anything about your learning..." 
              className="h-20 pl-16 pr-24 rounded-2xl border-neutral-100 bg-white text-lg shadow-lg shadow-neutral-200/40 focus-visible:ring-primary focus-visible:border-primary transition-all"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-neutral-100 bg-neutral-50 text-neutral-400 text-xs font-medium">
              <span className="text-[14px]">⌘</span>
              <span>K</span>
            </div>
          </div>
        </section>

        {/* All Courses Section */}
        <section className="container mx-auto px-4 py-16 border-t border-neutral-100">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-heading-1 font-serif text-neutral-900">All Courses</h2>
            <Link href="/courses" className="flex items-center gap-2 text-primary hover:text-primary-400 font-medium transition-colors">
              View all courses
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockCourses.map((course) => (
              <CourseCard key={course.title} {...course} />
            ))}
          </div>
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
