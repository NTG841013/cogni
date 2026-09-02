"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Search, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { SearchVideoResult } from "@/components/search-video-result"
import { SearchLessonResult } from "@/components/search-lesson-result"
import { type SearchResponse, type SearchResult } from "@/lib/search"
import posthog from "posthog-js"

interface SearchResultsClientProps {
  query: string
}

type SortOption = "relevance"

export function SearchResultsClient({ query }: SearchResultsClientProps) {
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sort, setSort] = useState<SortOption>("relevance")
  const [courseCount, setCourseCount] = useState(0)

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Search failed")
        }

        const data: SearchResponse = await response.json()
        setResults(data.results)
        setCourseCount(data.courseCount)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Search failed")
        posthog.capture("search_error", {
          query: query,
          error: err instanceof Error ? err.message : "Unknown error",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [query])

  const displayResults = [...results].sort((a, b) => {
    if (sort === "relevance") {
      return b.relevance - a.relevance
    }
    return 0
  })

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Search Results Header */}
      <div className="mb-12 text-center">
        <p className="text-small font-semibold text-primary mb-2">SEARCH RESULTS</p>
        <h1 className="text-display-1 font-serif text-neutral-900 mb-2">
          Results for <span className="text-primary">&ldquo;{query}&rdquo;</span>
        </h1>
        <p className="text-body-large text-neutral-500">
          Found {results.length} result{results.length !== 1 ? "s" : ""} across{" "}
          {courseCount} course{courseCount !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Search Bar and Controls */}
      <div className="mb-10 flex flex-col gap-4">
        <div className="relative max-w-3xl mx-auto w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
          <Input
            placeholder="Ask anything about your learning..."
            value={query}
            readOnly
            className="w-full pl-12 pr-4 h-12 rounded-lg border-neutral-100 bg-neutral-50 text-neutral-900"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 rounded-md border border-neutral-100 bg-white text-neutral-400 text-xs font-medium">
            <span>⌘</span>
            <span>K</span>
          </div>
        </div>

        <div className="flex items-center justify-between px-4 md:px-0">
          <span className="text-small text-neutral-600 font-medium">
            {results.length} results
          </span>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="appearance-none bg-white border border-neutral-100 rounded-lg px-4 py-2.5 pr-10 h-10 text-body font-medium text-neutral-900 hover:border-neutral-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors cursor-pointer"
            >
              <option value="relevance">Most Relevant</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-24">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
          <p className="text-body-large text-neutral-500 mt-6">Searching...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-24">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-red-50 p-3">
              <Search className="h-8 w-8 text-red-500" />
            </div>
          </div>
          <h2 className="text-heading-2 font-serif text-neutral-900 mb-2">
            Search Error
          </h2>
          <p className="text-body-large text-neutral-500 mb-8">
            {error}
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-primary font-medium hover:opacity-80 transition-opacity"
          >
            Browse all courses
          </Link>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && results.length === 0 && (
        <div className="text-center py-24">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-neutral-100 p-3">
              <Search className="h-8 w-8 text-neutral-500" />
            </div>
          </div>
          <h2 className="text-heading-2 font-serif text-neutral-900 mb-2">
            Can&apos;t find what you&apos;re looking for?
          </h2>
          <p className="text-body-large text-neutral-500 mb-8">
            Try different keywords or browse our full course catalog.
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-primary font-medium hover:opacity-80 transition-opacity"
          >
            Browse all courses
          </Link>
        </div>
      )}

      {/* Results Grid */}
      {!loading && !error && results.length > 0 && (
        <div className="space-y-6">
          {displayResults.map((result) => {
            if (result.type === "video") {
              return (
                <SearchVideoResult 
                  key={`${result.id}-${result.matchedAtSeconds}`} 
                  result={result as SearchResult & { type: "video" }} 
                />
              )
            } else {
              return (
                <SearchLessonResult 
                  key={result.id} 
                  result={result as SearchResult & { type: "lesson" }} 
                />
              )
            }
          })}
        </div>
      )}
    </div>
  )
}
