"use client"

import { useState, useEffect } from "react"
import EventForm from "@/components/EventForm"
import EventCard from "@/components/EventCard"
import Header from "@/components/Header"
import { EventActions } from "@/app/event/utils"
import { AuthActions } from "@/app/auth/utils"
import { Wretch } from "wretch"
import { WretchError } from "wretch/resolver";

export interface Event {
  id: string
  name: string
  description: string
  date: string
  time: string
  location: string
  category: string
  capacity: number
  cover_image?: string
}

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false)

  const { addEvent, getEvents, getEvent, deleteEvent } = EventActions();
  const { handleJWTRefresh } = AuthActions();

  let isRefreshing = false;

  // Load events when page loads
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await getEvents();
        if (data) setEvents(data);
      } catch (err: any) {
        if (err instanceof WretchError && err.response) {
          const res = await err.response.clone().json();

          if (res?.code === "token_not_valid" && !isRefreshing) {
            isRefreshing = true;
            try {
              await handleJWTRefresh();
              const retryData = await getEvents();
              if (retryData) setEvents(retryData);
            } catch (refreshErr) {
              console.error("JWT refresh failed:", refreshErr);
            } finally {
              isRefreshing = false;
            }
          }
        } else {
          console.error("Unknown error:", err);
        }
      }
    };

    loadEvents();
  }, []);

  const handleCreateEvent = async (eventData: Event) => {
    // Combine date + time into ISO format
    const start_time = `${eventData.date}T${eventData.time}:00Z`;

    const payload = {
      ...eventData,
      start_time,
    };
    const newEvent = await addEvent(payload);

    setEvents([newEvent, ...events]);
    setShowForm(false);
  };


  const handleDeleteEvent = async (id: string) => {
    try {
      await deleteEvent(id);
    } catch (err: any) {
      if (err instanceof WretchError) {
        const error = await err.response.clone().json();

        if (error?.code === "token_not_valid") {
          try {
            await handleJWTRefresh();
            await handleDeleteEvent(id);
          } catch (refreshError: WretchError) {
            console.error("error while refreshing", refreshError)
          }
        }
      }
    }
    setEvents(events.filter((event) => event.id !== id))
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section with Create Button */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-balance text-foreground mb-3">Manage Your Events</h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Create stunning events and easily share them with your friends via WhatsApp or email.
              </p>
            </div>
            <a href="/dashboard/my-events/"
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity whitespace-nowrap">My Events</a>
            <button
              onClick={() => setShowForm(true)}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              + Create Event
            </button>
          </div>
        </div>

        {/* Create Event Form Modal */}
        {showForm && (
          <div className="mb-12">
            <EventForm onClose={() => setShowForm(false)} onSubmit={handleCreateEvent} />
          </div>
        )}

        {/* Events Grid */}
        {events.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-6">
              <svg
                className="mx-auto w-16 h-16 text-muted-foreground/30"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">No events yet</h2>
            <p className="text-muted-foreground mb-6">Create your first event to get started</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Create First Event
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} onDelete={handleDeleteEvent} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
