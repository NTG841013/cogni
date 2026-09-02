import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SearchResultsClient } from "@/components/search-results-client"

interface SearchPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const query = Array.isArray(params.q) ? params.q[0] : params.q

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteHeader />
      <main className="flex-1">
        {!query ? (
          <div className="container mx-auto px-4 py-24 text-center">
            <h1 className="text-display-1 font-serif text-neutral-900 mb-4">
              No search query provided
            </h1>
            <p className="text-body-large text-neutral-500 mb-8">
              Enter a search term to get started.
            </p>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 text-primary font-medium hover:opacity-80 transition-opacity"
            >
              Browse all courses
            </Link>
          </div>
        ) : (
          <SearchResultsClient query={query} />
        )}
      </main>
    </div>
  )
}
