"use client"

import { useEffect, useRef, useState } from "react"
import posthog from "posthog-js"
import VimeoPlayer from "@vimeo/player"

interface VideoPlayerProps {
  url: string
  startTime?: number
  lessonId?: string
  lessonTitle?: string
}

export function VideoPlayer({ url, startTime, lessonId, lessonTitle }: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YT.Player | VimeoPlayer | null>(null)
  const milestonesRef = useRef<Set<number>>(new Set())
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!url || !container) return

    let player: YT.Player | VimeoPlayer | null = null
    const milestones = [25, 50, 75, 90]
    
    const trackMilestone = (percent: number) => {
      if (milestonesRef.current.has(percent)) return
      milestonesRef.current.add(percent)
      
      posthog.capture("video_watch_milestone", {
        lesson_id: lessonId,
        lesson_title: lessonTitle,
        percentage: percent,
        video_url: url
      })

      if (percent >= 90) {
        posthog.capture("lesson_completed", {
          lesson_id: lessonId,
          lesson_title: lessonTitle,
          method: "video_completion"
        })
        
        // Call progress API (to be implemented)
        fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonId, completed: true }),
        }).catch(() => {})
      }
    }

    const checkMilestones = (currentTime: number, duration: number) => {
      if (!duration) return
      const percent = (currentTime / duration) * 100
      milestones.forEach(m => {
        if (percent >= m) trackMilestone(m)
      })
    }

    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = url.includes("youtube.com") 
        ? new URL(url).searchParams.get("v")
        : url.split("/").pop()

      const initYoutube = () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        player = new (window as any).YT.Player(container, {
          height: "100%",
          width: "100%",
          videoId: videoId,
          playerVars: {
            autoplay: 0,
            rel: 0,
            start: startTime || 0,
          },
          events: {
            onReady: () => {
              setIsLoaded(true)
              posthog.capture("video_played", {
                lesson_id: lessonId,
                lesson_title: lessonTitle,
                video_url: url,
                provider: "youtube",
                start_time: startTime || 0
              })
            },
            onStateChange: (event: YT.OnStateChangeEvent) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              if (event.data === (window as any).YT.PlayerState.PLAYING) {
                const interval = setInterval(() => {
                  const p = player as YT.Player
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  if (p.getPlayerState() !== (window as any).YT.PlayerState.PLAYING) {
                    clearInterval(interval)
                    return
                  }
                  checkMilestones(p.getCurrentTime(), p.getDuration())
                }, 5000)
              }
            }
          }
        })
        playerRef.current = player
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!(window as any).YT) {
        const tag = document.createElement("script")
        tag.src = "https://www.youtube.com/iframe_api"
        const firstScriptTag = document.getElementsByTagName("script")[0]
        if (firstScriptTag && firstScriptTag.parentNode) {
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(window as any).onYouTubeIframeAPIReady = initYoutube
      } else {
        initYoutube()
      }
    } else if (url.includes("vimeo.com")) {
      const videoId = url.split("/").pop()
      const iframe = document.createElement("iframe")
      iframe.src = `https://player.vimeo.com/video/${videoId}?autoplay=0${startTime ? `#t=${startTime}s` : ""}`
      iframe.className = "absolute inset-0 w-full h-full border-0"
      iframe.allow = "autoplay; fullscreen; picture-in-picture"
      container.appendChild(iframe)

      const vPlayer = new VimeoPlayer(iframe)
      player = vPlayer
      playerRef.current = player

      vPlayer.on("play", () => {
        setIsLoaded(true)
        posthog.capture("video_played", {
          lesson_id: lessonId,
          lesson_title: lessonTitle,
          video_url: url,
          provider: "vimeo",
          start_time: startTime || 0
        })
      })

      vPlayer.on("timeupdate", (data: { seconds: number; duration: number }) => {
        checkMilestones(data.seconds, data.duration)
      })
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy()
      }
      if (container) {
        container.innerHTML = ""
      }
    }
  }, [url, startTime, lessonId, lessonTitle])

  return (
    <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl">
      <div ref={containerRef} className="w-full h-full" />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}
