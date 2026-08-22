"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Search, Play, Clock, BookOpen, ChevronRight } from "lucide-react"

export default function DesignSystemPage() {
  return (
    <div className="container mx-auto py-12 px-4 space-y-24 bg-neutral-50 min-h-screen">
      {/* Header */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
             <span className="text-white font-bold">C</span>
           </div>
           <span className="text-xl font-bold text-neutral-900">Cogni</span>
        </div>
        <h1 className="text-display-1 font-serif text-neutral-900">Design System</h1>
        <p className="text-body-large text-neutral-500 max-w-2xl">
          A unified design language for Cogni learning platform. Clean, modern and focused on clarity, consistency and intuitive learning experiences.
        </p>
      </section>

      {/* 01 COLORS */}
      <section className="space-y-6">
        <h2 className="text-heading-2 font-serif text-neutral-900 border-b pb-2">01 COLORS</h2>
        <div className="space-y-8">
          <div>
            <h3 className="text-body font-bold mb-4">Primary</h3>
            <div className="flex flex-wrap gap-4">
              <ColorBox color="bg-primary-500" name="Primary 500" hex="#F97316" />
              <ColorBox color="bg-primary-400" name="Primary 400" hex="#FB923C" />
              <ColorBox color="bg-primary-300" name="Primary 300" hex="#FDBA74" />
              <ColorBox color="bg-primary-200" name="Primary 200" hex="#FED7AA" />
              <ColorBox color="bg-primary-100" name="Primary 100" hex="#FFEEE5" />
            </div>
          </div>
          <div>
            <h3 className="text-body font-bold mb-4">Neutral</h3>
            <div className="flex flex-wrap gap-4">
              <ColorBox color="bg-neutral-900" name="Neutral 900" hex="#0F172A" />
              <ColorBox color="bg-neutral-700" name="Neutral 700" hex="#334155" />
              <ColorBox color="bg-neutral-500" name="Neutral 500" hex="#64748B" />
              <ColorBox color="bg-neutral-300" name="Neutral 300" hex="#CBD5E1" />
              <ColorBox color="bg-neutral-200" name="Neutral 200" hex="#E2E8F0" />
              <ColorBox color="bg-neutral-100" name="Neutral 100" hex="#F1F5F9" />
              <ColorBox color="bg-neutral-50" name="Neutral 50" hex="#FAFAFC" />
              <ColorBox color="bg-white border" name="White" hex="#FFFFFF" />
            </div>
          </div>
        </div>
      </section>

      {/* 02 TYPOGRAPHY & 03 TYPE SCALE */}
      <section className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h2 className="text-heading-2 font-serif text-neutral-900 border-b pb-2">02 TYPOGRAPHY</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-8">
              <span className="text-4xl font-serif">Ag</span>
              <div>
                <p className="text-xl font-serif">Playfair Display</p>
                <p className="text-sm text-neutral-500">Elegant • Readable • Timeless</p>
              </div>
            </div>
            <div className="flex items-start gap-8">
              <span className="text-4xl font-sans">Ag</span>
              <div>
                <p className="text-xl font-sans">Inter</p>
                <p className="text-sm text-neutral-500">Clean • Modern • Highly legible</p>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <h2 className="text-heading-2 font-serif text-neutral-900 border-b pb-2">03 TYPE SCALE</h2>
          <div className="space-y-4">
            <p className="text-display-1 font-serif">Display 1</p>
            <p className="text-display-2 font-serif">Display 2</p>
            <p className="text-heading-1 font-sans font-semibold">Heading 1</p>
            <p className="text-heading-2 font-sans font-semibold">Heading 2</p>
            <p className="text-heading-3 font-sans font-medium">Heading 3</p>
            <p className="text-body-large font-sans">Body Large</p>
            <p className="text-body font-sans">Body</p>
            <p className="text-small font-sans">Small</p>
          </div>
        </div>
      </section>

      {/* 07 BUTTONS */}
      <section className="space-y-6">
        <h2 className="text-heading-2 font-serif text-neutral-900 border-b pb-2">07 BUTTONS</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <p className="text-small font-bold text-neutral-500">Primary</p>
            <Button>Get Started</Button>
            <Button className="opacity-80">Hover</Button>
            <Button disabled>Disabled</Button>
          </div>
          <div className="space-y-4">
            <p className="text-small font-bold text-neutral-500">Secondary</p>
            <Button variant="outline">Explore Courses</Button>
            <Button variant="outline" className="bg-primary-100">Hover</Button>
            <Button variant="outline" disabled>Disabled</Button>
          </div>
          <div className="space-y-4">
            <p className="text-small font-bold text-neutral-500">Tertiary</p>
            <Button variant="secondary">View Lesson <ChevronRight className="w-4 h-4 ml-2" /></Button>
            <Button variant="secondary" className="bg-neutral-100">Hover</Button>
            <Button variant="secondary" disabled>Disabled</Button>
          </div>
          <div className="space-y-4">
            <p className="text-small font-bold text-neutral-500">Text</p>
            <Button variant="text">Watch Video <Play className="w-4 h-4 ml-2" /></Button>
            <Button variant="text" className="opacity-70">Hover</Button>
            <Button variant="text" disabled>Disabled</Button>
          </div>
        </div>
      </section>

      {/* 08 INPUTS */}
      <section className="space-y-6">
        <h2 className="text-heading-2 font-serif text-neutral-900 border-b pb-2">08 INPUTS</h2>
        <div className="max-w-md space-y-4">
          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
             <Input className="pl-10" placeholder="Search anything..." />
             <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-300 border rounded px-1">⌘ K</div>
          </div>
          <select className="flex h-11 w-full rounded-md border border-input bg-transparent px-4 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:border-primary-400">
            <option>Most Relevant</option>
            <option>Newest</option>
          </select>
        </div>
      </section>

      {/* 09 BADGES / TAGS & 10 STATUS */}
      <section className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h2 className="text-heading-2 font-serif text-neutral-900 border-b pb-2">09 BADGES / TAGS</h2>
          <div className="flex gap-4">
            <Badge variant="video">VIDEO</Badge>
            <Badge variant="lesson">LESSON</Badge>
            <Badge variant="popular">POPULAR</Badge>
          </div>
        </div>
        <div className="space-y-6">
          <h2 className="text-heading-2 font-serif text-neutral-900 border-b pb-2">10 STATUS / INDICATORS</h2>
          <div className="flex gap-6 items-center">
            <div className="flex items-center gap-2 text-primary-500 text-small">
              <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
              In Progress
            </div>
            <div className="flex items-center gap-2 text-green-600 text-small">
               <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">✓</div>
               Completed
            </div>
          </div>
        </div>
      </section>

      {/* 11 PROGRESS BAR */}
      <section className="space-y-6">
        <h2 className="text-heading-2 font-serif text-neutral-900 border-b pb-2">11 PROGRESS BAR</h2>
        <div className="max-w-md space-y-2">
           <Progress value={35} />
           <p className="text-small text-neutral-500 text-right">35% complete</p>
        </div>
      </section>

      {/* 12 CARDS */}
      <section className="space-y-6">
        <h2 className="text-heading-2 font-serif text-neutral-900 border-b pb-2">12 CARDS</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Course Card */}
          <Card className="overflow-hidden">
            <CardHeader>
              <div className="w-10 h-10 bg-neutral-900 rounded flex items-center justify-center text-white font-bold mb-4">N</div>
              <CardTitle className="text-heading-1 font-sans">Next.js for Production</CardTitle>
              <CardDescription>Build scalable, high-performance web applications with Next.js.</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between text-neutral-500 text-small">
              <div className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> Intermediate</div>
              <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> 18h 24m</div>
            </CardFooter>
          </Card>

          {/* Lesson Card (Video) */}
          <Card className="overflow-hidden">
            <div className="aspect-video bg-neutral-200 relative">
               <Badge variant="video" className="absolute top-4 left-4">VIDEO</Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-heading-2 font-sans">Data Fetching in Server Components</CardTitle>
              <CardDescription>Learn how to fetch data on the server using async/await and Next.js best practices.</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between items-center text-small">
              <span className="text-neutral-500">Lesson 5.1 • 12:45</span>
              <Button variant="text" size="sm">Watch from 12:45 <Play className="w-3 h-3 ml-1" /></Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* 13 NAVIGATION */}
      <section className="space-y-6">
        <h2 className="text-heading-2 font-serif text-neutral-900 border-b pb-2">13 NAVIGATION</h2>
        <div className="space-y-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">All Courses</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/courses/nextjs">Next.js for Production</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching & Caching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">8</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </section>
    </div>
  )
}

function ColorBox({ color, name, hex }: { color: string; name: string; hex: string }) {
  return (
    <div className="space-y-2">
      <div className={`w-24 h-24 rounded-lg ${color}`} />
      <div>
        <p className="text-xs font-bold text-neutral-900">{name}</p>
        <p className="text-[10px] text-neutral-500 uppercase">{hex}</p>
      </div>
    </div>
  )
}
