"use client"

import { useState } from "react"
import Link from "next/link"
import type { Event } from "@/app/dashboard/page"
import ShareModal from "./share-modal"

interface EventCardProps {
  event: Event
  onDelete: (id: string) => void
}

export default function EventCard({ event, onDelete }: EventCardProps) {
  const [showShare, setShowShare] = useState(false)

  const eventDate = new Date(event.date)
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Birthday: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
      Wedding: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      Conference: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      Party: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      Workshop: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      Meetup: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      Concert: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    }
    return colors[category] || "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
  }

  return (
    <>
      <Link href={`/dashboard/my-events/${event.id}`}>
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:border-primary/50 cursor-pointer">
          {/* Card Header with Image */}
          <div className="h-40 bg-gradient-to-br from-primary/10 to-accent/10 relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={0.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="text-center z-10">
              <div className="text-4xl font-bold text-primary mb-1">{eventDate.getDate()}</div>
              <div className="text-sm text-muted-foreground font-medium">
                {eventDate.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-6">
            {/* Category Badge */}
            <div className="mb-3 flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(event.category)}`}>
                {event.category}
              </span>
            </div>

            {/* name */}
            <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">{event.name}</h3>

            {/* Description */}
            {event.description && (
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{event.description}</p>
            )}

            {/* Event Details */}
            <div className="space-y-3 mb-6 py-4 border-t border-border">
              <div className="flex items-center gap-3 text-sm">
                <svg
                  className="w-5 h-5 text-accent flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-foreground font-medium">{event.time}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <svg
                  className="w-5 h-5 text-accent flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-foreground font-medium line-clamp-1">{event.location}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <svg
                  className="w-5 h-5 text-accent flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-foreground font-medium">{event.capacity} guests</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setShowShare(true)
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C9.589 12.938 10 12.502 10 12c0-.502-.411-.938-1.316-1.342m0 2.684a3 3 0 110-2.684m9.108-3.342C15.411 5.938 15 5.502 15 5c0-.502.411-.938 1.316-1.342m0 2.684a3 3 0 11-0-2.684"
                  />
                </svg>
                Share
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onDelete(event.id)
                }}
                className="px-4 py-3 bg-destructive/10 text-destructive rounded-lg font-semibold hover:bg-destructive/20 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </Link>

      {/* Share Modal */}
      {showShare && <ShareModal event={event} onClose={() => setShowShare(false)} />}
    </>
  )
}
