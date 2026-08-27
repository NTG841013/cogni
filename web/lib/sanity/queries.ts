import { defineQuery } from 'next-sanity'

export const COURSES_QUERY = defineQuery(`
  *[_type == "course"] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    summary,
    coverImage,
    level,
    price,
    popular,
    studentCount,
    category->{ title, "slug": slug.current },
    instructor->{ name, "slug": slug.current, photo },
    "moduleCount": count(modules),
    "totalDuration": math::sum(modules[].lessons[]->duration)
  }
`)

export const COURSE_QUERY = defineQuery(`
  *[_type == "course" && slug.current == $slug][0] {
    ...,
    instructor->,
    category->,
    learningOutcomes[] {
      icon,
      title,
      description
    },
    modules[] {
      ...,
      lessons[]-> {
        ...,
      }
    }
  }
`)

export const LESSON_QUERY = defineQuery(`
  *[_type == "lesson" && slug.current == $slug][0] {
    ...,
    "course": *[_type == "course" && references(^._id)][0] {
      title,
      "slug": slug.current
    }
  }
`)

export const INSTRUCTOR_QUERY = defineQuery(`
  *[_type == "instructor" && slug.current == $slug][0] {
    ...,
    "courses": *[_type == "course" && instructor._ref == ^._id] {
      title,
      "slug": slug.current,
      coverImage
    }
  }
`)

export const SEARCH_QUERY = defineQuery(`
  {
    "lessons": *[_type == "lesson" && (title match $term || pt::text(notes) match $term)] {
      _id,
      _type,
      title,
      "slug": slug.current,
      "course": *[_type == "course" && references(^._id)][0] {
        title,
        "slug": slug.current
      }
    },
    "videoMoments": *[_type == "video" && (chapters[].label match $term || chunks[].text match $term)] {
      _id,
      _type,
      url,
      "lesson": *[_type == "lesson" && videoUrl == ^.url][0] {
        title,
        "slug": slug.current,
        "course": *[_type == "course" && references(^._id)][0] {
          title,
          "slug": slug.current
        }
      },
      "matchedChapters": chapters[label match $term],
      "matchedChunks": chunks[text match $term]
    }
  }
`)

export const USER_PROGRESS_QUERY = defineQuery(`
  *[_type == "progress" && clerkUserId == $userId][0] {
    ...,
    completedLessons[]->{ _id }
  }
`)
