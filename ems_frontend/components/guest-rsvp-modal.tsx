"use client"

import type React from "react"

import { useState } from "react"
import type { Event } from "@/app/dashboard/page"
import { GuestActions } from "@/app/dashboard/my-events/[id]/guests/utils"
import alertify from 'alertifyjs';

interface GuestRSVPModalProps {
  event: Event
  onClose: () => void
  onRSVP: (name: string, email: string, status: "Y" | "M" | "N") => void
}

export default function GuestRSVPModal({ event, onClose, onRSVP }: GuestRSVPModalProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<"Y" | "M" | "N" | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { registerGuest } = GuestActions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    alertify.set("notifier", "position", "top-center");

    if (!name.trim() || !email.trim() || !selectedStatus) {
      alertify.error("Please fill in all fields");
      return;
    }

    try {
      setIsSubmitting(true);

      await registerGuest({
        event: event.id,
        name: name.trim(),
        email: email.trim(),
        rsvp_status: selectedStatus,
      });

      alertify.success("You have registered successfully!");
      onClose();
    } catch (err: any) {
      console.error(err);
      alertify.error("Failed to register guest");
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusOptions = [
    {
      value: "Y" as const,
      label: "Yes, I'll be there",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      bgColor: "bg-green-500",
      hoverColor: "hover:bg-green-600",
      selectedBorder: "ring-green-500",
    },
    {
      value: "M" as const,
      label: "Maybe",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      bgColor: "bg-yellow-500",
      hoverColor: "hover:bg-yellow-600",
      selectedBorder: "ring-yellow-500",
    },
    {
      value: "N" as const,
      label: "Can't make it",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      bgColor: "bg-red-500",
      hoverColor: "hover:bg-red-600",
      selectedBorder: "ring-red-500",
    },
  ]

  const eventDate = new Date(event.date)
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">RSVP to Event</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Event Summary */}
        <div className="px-6 py-6 bg-gradient-to-br from-primary/5 to-accent/5 border-b border-border">
          <h3 className="text-2xl font-bold text-foreground mb-2 text-balance">{event.title}</h3>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {formattedDate}
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {event.time}
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
              </svg>
              {event.location}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* RSVP Status Options */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">Will you attend?</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedStatus(option.value)}
                  className={`relative p-4 border-2 rounded-xl transition-all ${selectedStatus === option.value
                      ? `ring-4 ${option.selectedBorder} border-transparent bg-${option.value === "Y" ? "green" : option.value === "M" ? "yellow" : "red"}-50 dark:bg-${option.value === "Y" ? "green" : option.value === "M" ? "yellow" : "red"}-900/20`
                      : "border-border hover:border-primary/50 bg-background"
                    }`}
                >
                  <div
                    className={`flex flex-col items-center gap-2 transition-colors ${selectedStatus === option.value ? "text-foreground" : "text-muted-foreground"
                      }`}
                  >
                    <div
                      className={`p-3 rounded-full text-white ${option.bgColor} ${selectedStatus !== option.value && "opacity-60"
                        }`}
                    >
                      {option.icon}
                    </div>
                    <span className="font-semibold text-sm text-center">{option.label}</span>
                  </div>
                  {selectedStatus === option.value && (
                    <div className="absolute top-2 right-2">
                      <div className={`w-6 h-6 rounded-full ${option.bgColor} flex items-center justify-center`}>
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-muted text-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || !email.trim() || !selectedStatus || isSubmitting}
              className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit RSVP"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
