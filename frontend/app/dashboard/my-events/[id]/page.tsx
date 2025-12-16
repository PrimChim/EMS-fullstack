"use client"

import type React from "react"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { Event } from "@/app/dashboard/page"
import ShareModal from "@/components/share-modal"
import { EventActions } from "@/app/event/utils"
import { GuestActions } from "./guests/utils"

interface Guest {
  id?: string
  name: string
  email: string
  check_in_time?: string | null
  rsvpStatus?: string
}

export default function EventPage() {
  const params = useParams()
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [showShare, setShowShare] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedEvent, setEditedEvent] = useState<Event | null>(null)
  const [guestNames, setGuestNames] = useState([])
  const [isAddingGuest, setIsAddingGuest] = useState(false)
  const [guests, setGuests] = useState<Guest[]>([])
  const { getEvent } = EventActions();
  const { getEventGuests } = GuestActions();

  useEffect(() => {
    const loadData = async () => {
      const id = String(params.id);
      try {
        const eventDetail = await getEvent(id);
        const guestData = await getEventGuests(id);

        eventDetail.guests = guestData;
        console.log(eventDetail)

        setEvent(eventDetail);
      }
      catch (error) {
        console.error("Error loading event data:", error)
      };

    }
    loadData();
  }, [params.id]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing)
    setEditedEvent(event)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEditedEvent((prev) => {
      if (!prev) return null
      return {
        ...prev,
        [name]: name === "capacity" ? Number.parseInt(value) : value,
      }
    })
  }

  const handleSave = () => {
    if (!editedEvent) return

    const storedEvents = localStorage.getItem("events")
    if (storedEvents) {
      const events: Event[] = JSON.parse(storedEvents)
      const updatedEvents = events.map((e) => (e.id === editedEvent.id ? editedEvent : e))
      localStorage.setItem("events", JSON.stringify(updatedEvents))
      setEvent(editedEvent)
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditedEvent(event)
    setIsEditing(false)
  }

  const handleAddGuest = () => {
    if (!newGuestName.trim() || !event) return

    const updatedEvent = {
      ...event,
      guests: [...(event.guests || []), newGuestName.trim()],
    }

    const storedEvents = localStorage.getItem("events")
    if (storedEvents) {
      const events: Event[] = JSON.parse(storedEvents)
      const updatedEvents = events.map((e) => (e.id === event.id ? updatedEvent : e))
      localStorage.setItem("events", JSON.stringify(updatedEvents))
      setEvent(updatedEvent)
      setEditedEvent(updatedEvent)
    }

    setNewGuestName("")
    setIsAddingGuest(false)
  }

  const handleRemoveGuest = (guestId: string) => {
    setGuests((prev) => prev.filter((g) => g.id !== guestId))
  }

  const formatCheckInTime = (timestamp: string | null | undefined) => {
    if (!timestamp) return "Not checked in"

    const date = new Date(timestamp)
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Event not found</h1>
          <button
            onClick={() => router.push("/dashboard/my-events")}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Back to Events
          </button>
        </div>
      </div>
    )
  }

  const displayEvent = isEditing ? editedEvent! : event
  const eventDate = new Date(displayEvent.date)
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

  const categories = ["Birthday", "Wedding", "Conference", "Party", "Workshop", "Meetup", "Concert", "Other"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => router.push("/dashboard/my-events/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Events
          </button>
        </div>
      </header>

      {/* Event Details */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg mb-8">
          <div className="h-64 bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden flex items-center justify-center">
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
              <div className="text-7xl font-bold text-primary mb-2">{eventDate.getDate()}</div>
              <div className="text-xl text-muted-foreground font-semibold">
                {eventDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Category Badge */}
            <div className="mb-4">
              {isEditing ? (
                <select
                  name="category"
                  value={displayEvent.category}
                  onChange={handleInputChange}
                  className="px-4 py-2 rounded-full text-sm font-semibold bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              ) : (
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${getCategoryColor(displayEvent.category)}`}
                >
                  {displayEvent.category}
                </span>
              )}
            </div>

            {/* name */}
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={displayEvent.name}
                onChange={handleInputChange}
                className="w-full text-4xl font-bold text-foreground mb-4 bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            ) : (
              <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">{displayEvent.name}</h1>
            )}

            {/* Description */}
            {isEditing ? (
              <textarea
                name="description"
                value={displayEvent.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full text-lg text-muted-foreground leading-relaxed mb-8 bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            ) : (
              displayEvent.description && (
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">{displayEvent.description}</p>
              )
            )}

            {/* Event Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-t border-border">
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
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground mb-1">Date</div>
                  {isEditing ? (
                    <input
                      type="date"
                      name="date"
                      value={displayEvent.date}
                      onChange={handleInputChange}
                      className="w-full text-lg font-semibold text-foreground bg-background border border-border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <div className="text-lg font-semibold text-foreground">{formattedDate}</div>
                  )}
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
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground mb-1">Time</div>
                  {isEditing ? (
                    <input
                      type="time"
                      name="time"
                      value={displayEvent.time}
                      onChange={handleInputChange}
                      className="w-full text-lg font-semibold text-foreground bg-background border border-border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <div className="text-lg font-semibold text-foreground">{displayEvent.time}</div>
                  )}
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
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground mb-1">Location</div>
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={displayEvent.location}
                      onChange={handleInputChange}
                      className="w-full text-lg font-semibold text-foreground bg-background border border-border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <div className="text-lg font-semibold text-foreground">{displayEvent.location}</div>
                  )}
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
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground mb-1">Capacity</div>
                  {isEditing ? (
                    <input
                      type="number"
                      name="capacity"
                      value={displayEvent.capacity}
                      onChange={handleInputChange}
                      className="w-full text-lg font-semibold text-foreground bg-background border border-border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <div className="text-lg font-semibold text-foreground">{displayEvent.capacity} guests</div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-muted text-muted-foreground rounded-lg font-semibold hover:opacity-80 transition-opacity"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleEditToggle}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-muted text-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit Event
                  </button>
                  <button
                    onClick={() => setShowShare(true)}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C9.589 12.938 10 12.502 10 12c0-.502-.411-.938-1.316-1.342m0 2.684a3 3 0 110-2.684m9.108-3.342C15.411 5.938 15 5.502 15 5c0-.502.411-.938 1.316-1.342m0 2.684a3 3 0 11-0-2.684"
                      />
                    </svg>
                    Share Event
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Guest List</h2>
                  <p className="text-sm text-muted-foreground">
                    {event.guests.length} of {event.capacity} guests registered
                  </p>
                </div>
              </div>
            </div>

            {/* Guest Table */}
            {event.guests.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No guests yet</h3>
                <p className="text-muted-foreground">Share your event to start receiving RSVPs</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Name</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Check-in Time</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Status</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {event.guests.map((guest) => (
                      <tr key={guest.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-semibold text-primary">
                                {guest.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="font-medium text-foreground">{guest.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-muted-foreground">{guest.email}</span>
                        </td>
                        <td className="py-4 px-4">
                          {guest.check_in_time ? (
                            <span className="text-foreground">{formatCheckInTime(guest.check_in_time)}</span>
                          ) : (
                            <span className="text-muted-foreground italic">Not checked in</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          {guest.check_in_time ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Checked In
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleRemoveGuest(guest.id!)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title="Remove guest"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShare && <ShareModal event={event} onClose={() => setShowShare(false)} />}
    </div>
  )
}
