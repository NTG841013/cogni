"use client"

import Link from "next/link"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M26 6H6V22L12 16V12H26V6Z"
                  fill="currentColor"
                  className="text-primary"
                />
                <path
                  d="M6 10L12 16V20H26V26H6V10Z"
                  fill="currentColor"
                  className="text-primary-400"
                />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-neutral-900">Cogni</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/courses"
              className="text-body font-medium text-neutral-900 hover:text-primary transition-colors"
            >
              Courses
            </Link>
            <Link
              href="/my-learning"
              className="text-body font-medium text-neutral-900 hover:text-primary transition-colors"
            >
              My Learning
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-neutral-500">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <div className="h-9 w-9 overflow-hidden rounded-full bg-neutral-200">
            <Image
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150"
              alt="User avatar"
              width={36}
              height={36}
            />
          </div>
        </div>
      </div>
    </header>
  )
}
