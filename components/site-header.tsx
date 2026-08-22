"use client"

import Link from "next/link"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SignInButton, UserButton, Show } from "@clerk/nextjs"
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
