"use client"

import Link from "next/link"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SignInButton, UserButton, Show } from "@clerk/nextjs"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <div className="w-5 h-5 border-t-4 border-l-4 border-b-4 border-white rounded-sm" />
              </div>
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
          <Show when="signed-in">
            <Button variant="ghost" size="icon" className="text-neutral-500">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <UserButton />
          </Show>
          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button>Sign In</Button>
            </SignInButton>
          </Show>
        </div>
      </div>
    </header>
  )
}
