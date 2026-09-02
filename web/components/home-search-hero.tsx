"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function HomeSearchHero() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="max-w-3xl mx-auto relative group">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors">
          <Search className="h-6 w-6" />
        </div>
        <Input
          placeholder="Ask anything about your learning..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-20 pl-16 pr-24 rounded-2xl border-neutral-100 bg-white text-lg shadow-lg shadow-neutral-200/40 focus-visible:ring-primary focus-visible:border-primary transition-all"
        />
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-neutral-100 bg-neutral-50 text-neutral-400 text-xs font-medium">
          <span className="text-[14px]">⌘</span>
          <span>K</span>
        </div>
      </div>
    </form>
  )
}
