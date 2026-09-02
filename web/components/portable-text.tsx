/* eslint-disable @typescript-eslint/no-explicit-any */
import { PortableText as PortableTextComponent } from "@portabletext/react"
import { urlFor } from "@/lib/sanity/image"
import Image from "next/image"

const components = {
  types: {
    image: ({ value }: any) => {
      return (
        <div className="relative aspect-video my-8 rounded-lg overflow-hidden">
          <Image
            src={urlFor(value).width(1200).url()}
            alt={value.alt || "Image"}
            fill
            className="object-cover"
          />
        </div>
      )
    },
  },
  block: {
    h1: ({ children }: any) => <h1 className="text-display-2 font-serif text-neutral-900 mt-12 mb-6">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-heading-2 font-sans font-semibold text-neutral-900 mt-10 mb-4">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-heading-3 font-sans font-medium text-neutral-900 mt-8 mb-3">{children}</h3>,
    normal: ({ children }: any) => <p className="text-body text-neutral-500 mb-4 leading-relaxed">{children}</p>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-primary bg-primary-50 p-6 my-8 italic text-neutral-700 rounded-r-lg">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc list-inside space-y-2 mb-6 text-neutral-500">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal list-inside space-y-2 mb-6 text-neutral-500">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: any) => <li className="text-body">{children}</li>,
    number: ({ children }: any) => <li className="text-body">{children}</li>,
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-semibold text-neutral-900">{children}</strong>,
    em: ({ children }: any) => <em className="italic">{children}</em>,
    link: ({ children, value }: any) => {
      const rel = !value.href.startsWith("/") ? "noreferrer noopener" : undefined
      return (
        <a
          href={value.href}
          rel={rel}
          className="text-primary hover:underline decoration-primary/30 underline-offset-4"
        >
          {children}
        </a>
      )
    },
  },
}

export function PortableText({ value }: { value: any }) {
  if (!value) return null
  return <PortableTextComponent value={value} components={components} />
}
