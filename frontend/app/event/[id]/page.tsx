"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { EventActions } from "@/app/event/utils";
import React from "react";
import type { Event } from "@/app/dashboard/page"
import GuestRSVPModal from "@/components/guest-rsvp-modal";

export default function PublicEventPage() {
  const params = useParams()
  const [event, setEvent] = useState({})
  const [showRSVPModal, setShowRSVPModal] = useState(false)
  const [hasRSVPd, setHasRSVPd] = useState(false)
  const { getEvent } = EventActions();

    useEffect(() => {
      const loadEvent = async () => {
        const eventData = await getEvent(String(params.id))
        if (eventData) setEvent(eventData);
      }

      loadEvent();
    }, [params.id])

  const handleRSVP = (name: string, email: string, status: "yes" | "maybe" | "no") => {
    if (!event) return

    const newRSVP = {
      name,
      email,
      status,
      addedAt: new Date().toISOString(),
    }

    const updatedEvent = {
      ...event,
      rsvps: [...(event.rsvps || []), newRSVP],
    }

    // Update events in localStorage
    const storedEvents = localStorage.getItem("events")
    if (storedEvents) {
      const events: Event[] = JSON.parse(storedEvents)
      const updatedEvents = events.map((e) => (e.id === event.id ? updatedEvent : e))
      localStorage.setItem("events", JSON.stringify(updatedEvents))
      setEvent(updatedEvent)
    }

    // Mark that user has RSVP'd
    localStorage.setItem(`rsvp_${event.id}`, JSON.stringify(newRSVP))
    setHasRSVPd(true)
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Event not found</h1>
          <p className="text-muted-foreground">This event may have been removed or the link is incorrect.</p>
        </div>
      </div>
    )
  }

  const eventDate = new Date(event.date)
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
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

  const yesCount = event.rsvps?.filter((r) => r.status === "yes").length || 0
  const maybeCount = event.rsvps?.filter((r) => r.status === "maybe").length || 0
  const noCount = event.rsvps?.filter((r) => r.status === "no").length || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section with Event Details */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xl">
          {/* Event Header Image */}
          <div className="h-64 bg-gradient-to-br from-primary via-accent to-primary/80 relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 opacity-20">
              <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={0.3}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="text-center z-10 text-white">
              <div className="text-8xl font-bold mb-2">{eventDate.getDate()}</div>
              <div className="text-2xl font-semibold">
                {eventDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="p-8">
            <div className="mb-4">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getCategoryColor(event.category)}`}>
                {event.category}
              </span>
            </div>

            <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">{event.name}</h1>

            {event.description && (
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">{event.description}</p>
            )}

            {/* Event Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-t border-b border-border mb-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Date</div>
                  <div className="text-lg font-semibold text-foreground">{formattedDate}</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Time</div>
                  <div className="text-lg font-semibold text-foreground">{event.time}</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Location</div>
                  <div className="text-lg font-semibold text-foreground">{event.location}</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Capacity</div>
                  <div className="text-lg font-semibold text-foreground">{event.capacity} guests</div>
                </div>
              </div>
            </div>

            {/* RSVP Stats */}
            {event.rsvps && event.rsvps.length > 0 && (
              <div className="mb-8 p-6 bg-muted/50 rounded-xl">
                <h3 className="text-lg font-semibold text-foreground mb-4">RSVP Summary</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="text-3xl font-bold text-green-700 dark:text-green-400">{yesCount}</div>
                    <div className="text-sm text-green-600 dark:text-green-500 font-medium">Attending</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <div className="text-3xl font-bold text-yellow-700 dark:text-yellow-400">{maybeCount}</div>
                    <div className="text-sm text-yellow-600 dark:text-yellow-500 font-medium">Maybe</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="text-3xl font-bold text-red-700 dark:text-red-400">{noCount}</div>
                    <div className="text-sm text-red-600 dark:text-red-500 font-medium">Can't Attend</div>
                  </div>
                </div>
              </div>
            )}

            {/* RSVP Button */}
            {hasRSVPd ? (
              <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <svg
                    className="w-6 h-6 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-lg font-semibold text-green-700 dark:text-green-400">
                    You've already RSVP'd
                  </span>
                </div>
                <p className="text-sm text-green-600 dark:text-green-500">Thank you for responding to this event!</p>
              </div>
            ) : (
              <button
                onClick={() => setShowRSVPModal(true)}
                className="w-full px-8 py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:opacity-90 transition-opacity shadow-lg"
              >
                RSVP to this Event
              </button>
            )}
          </div>
        </div>
      </div>

      {/* RSVP Modal */}
      {showRSVPModal && <GuestRSVPModal event={event} onClose={() => setShowRSVPModal(false)} onRSVP={handleRSVP} />}
    </div>
  )
}
