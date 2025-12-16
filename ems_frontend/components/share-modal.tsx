"use client"

import { useState } from "react"
import type { Event } from "@/app/dashboard/page"

interface ShareModalProps {
  event: Event
  onClose: () => void
}

export default function ShareModal({ event, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false)

  const eventLink = `${typeof window !== "undefined" ? window.location.origin : ""}/event/${event.id}`

  const eventText = `
🎉 ${event.name}

📅 ${event.date}
⏰ ${event.time}
📍 ${event.location}
👥 Capacity: ${event.capacity}

${event.description ? `Description: ${event.description}\n` : ""}
${eventLink}
  `.trim()

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(eventText)}`
    window.open(whatsappUrl, "_blank")
  }

  const handleEmailShare = () => {
    const subject = `You're invited to: ${event.name}`
    const body = eventText
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailtoUrl
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(eventLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full border border-border">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Share Event</h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="bg-background rounded-lg p-4 mb-6 border border-border">
            <p className="text-sm font-semibold text-foreground mb-2">Event Details</p>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                <span className="font-semibold text-foreground">{event.name}</span>
              </p>
              <p>
                {event.date} at {event.time}
              </p>
              <p>{event.location}</p>
            </div>
          </div>

          {/* Share Options */}
          <div className="space-y-3 mb-6">
            {/* WhatsApp */}
            <button
              onClick={handleWhatsAppShare}
              className="w-full flex items-center gap-3 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.992 1.527v.474c0 2.718 2.237 4.92 4.992 4.92 2.754 0 4.992-2.202 4.992-4.92 0-2.718-2.237-4.92-4.992-4.92z" />
              </svg>
              Share via WhatsApp
            </button>

            {/* Email */}
            <button
              onClick={handleEmailShare}
              className="w-full flex items-center gap-3 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Share via Email
            </button>
          </div>

          {/* Copy Link */}
          <div className="border-t border-border pt-6">
            <p className="text-sm font-semibold text-foreground mb-3">Or copy the event link</p>
            <div className="flex gap-2">
              <div className="flex-1 bg-background border border-border rounded-lg px-4 py-3 text-sm text-muted-foreground truncate">
                {eventLink}
              </div>
              <button
                onClick={handleCopyLink}
                className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                  copied ? "bg-green-500 text-white" : "bg-primary text-primary-foreground hover:opacity-90"
                }`}
              >
                {copied ? "✓ Copied" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
