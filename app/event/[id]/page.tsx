'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import InviteCard from '@/components/InviteCard'
import RSVPSection from '@/components/RSVPSection'
import ReactionBar from '@/components/ReactionBar'
import QuickActions from '@/components/QuickActions'
import LiveStatusBar from '@/components/LiveStatusBar'
import { NaizEvent, VIBE_META } from '@/lib/types'
import { getEvent, saveSharedEvent, incrementViewCount, getUserId } from '@/lib/store'
import { decodeEvent, formatEventDateLong, getEventShareUrl, getEnergyLevel } from '@/lib/utils'

export default function EventPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const cardRef = useRef<HTMLDivElement>(null)
  const id = params.id as string

  const [event, setEvent] = useState<NaizEvent | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [userId] = useState(() => {
    if (typeof window !== 'undefined') return getUserId()
    return ''
  })
  const [copied, setCopied] = useState(false)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    // Try localStorage first
    let ev = getEvent(id)

    // Fallback: decode from URL param
    if (!ev) {
      const encoded = searchParams.get('d')
      if (encoded) {
        const decoded = decodeEvent(encoded)
        if (decoded && decoded.id === id) {
          saveSharedEvent(decoded)
          ev = decoded
        }
      }
    }

    if (!ev) {
      setNotFound(true)
      return
    }

    incrementViewCount(id)
    setEvent({ ...ev, viewCount: (ev.viewCount || 0) + 1 })
  }, [id, searchParams])

  function refresh() {
    const ev = getEvent(id)
    if (ev) setEvent({ ...ev })
  }

  const handleExport = useCallback(async () => {
    if (!cardRef.current || !event) return
    setExporting(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      })
      const url = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = url
      a.download = `${event.title}-naiz.png`
      a.click()
    } catch (err) {
      console.error('Export failed:', err)
    } finally {
      setExporting(false)
    }
  }, [event])

  async function handleCopyLink() {
    if (!event) return
    const url = getEventShareUrl(event)
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  const isCreator = event?.creatorId === userId

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#09090f] text-white flex flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="text-5xl mb-2">💀</div>
        <h1 className="text-2xl font-bold">Event not found</h1>
        <p className="text-sm text-white/40 max-w-sm">
          This event doesn't exist on your device. If someone shared a link, make sure it includes the full URL.
        </p>
        <Link href="/create" className="mt-4 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-colors">
          Create an Event
        </Link>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#09090f] flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  const energy = getEnergyLevel(event)
  const going = event.rsvps.filter(r => r.status === 'going').length
  const maybe = event.rsvps.filter(r => r.status === 'maybe').length
  const isPast = new Date(event.eventTime) < new Date()

  return (
    <div className="min-h-screen bg-[#09090f] text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
        <Link href="/" className="text-2xl font-black bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
          NAIZ
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/25">{event.viewCount} views</span>
          {isCreator && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-violet-600/20 border border-violet-500/40 text-violet-300">
              Host
            </span>
          )}
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="lg:grid lg:grid-cols-[360px,1fr] lg:gap-12 lg:items-start">

          {/* ─── Left: Invite Card ─── */}
          <div className="mb-8 lg:mb-0 lg:sticky lg:top-8">
            <div className="flex justify-center lg:justify-start">
              <div className="overflow-hidden rounded-2xl shadow-2xl shadow-black/60">
                <InviteCard
                  ref={cardRef}
                  event={event}
                  template={event.template}
                />
              </div>
            </div>
            {/* Share actions */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                onClick={handleExport}
                disabled={exporting}
                className="py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/25 text-white/60 hover:text-white text-sm font-medium transition-all text-center disabled:opacity-40"
              >
                {exporting ? 'Saving...' : '⬇ Save Card'}
              </button>
              <button
                onClick={handleCopyLink}
                className="py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/25 text-white/60 hover:text-white text-sm font-medium transition-all text-center"
              >
                {copied ? '✓ Copied!' : '🔗 Copy Link'}
              </button>
            </div>
          </div>

          {/* ─── Right: Details + Actions ─── */}
          <div className="space-y-7">
            {/* Header */}
            <div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {event.vibes.map(v => (
                  <span key={v} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-600/15 border border-violet-500/30 text-xs text-violet-300">
                    {VIBE_META[v].emoji} {VIBE_META[v].label}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-2">{event.title}</h1>
              {/* Energy indicator */}
              <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-white/5 border border-white/10" style={{ color: energy.color }}>
                {energy.label}
              </span>
            </div>

            {/* Event details */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <span className="text-lg mt-0.5">📅</span>
                <div>
                  <p className="text-white/80 font-medium text-sm">{formatEventDateLong(event.eventTime)}</p>
                  {isPast && <p className="text-xs text-white/30 mt-0.5">This event has passed</p>}
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <span className="text-lg mt-0.5">📍</span>
                <p className="text-white/80 font-medium text-sm">{event.location}</p>
              </div>
              {event.description && (
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <p className="text-sm text-white/55 leading-relaxed">{event.description}</p>
                </div>
              )}
            </div>

            {/* RSVP */}
            <div>
              <SectionLabel>RSVP</SectionLabel>
              <RSVPSection event={event} userId={userId} onUpdate={refresh} />
            </div>

            {/* Reactions */}
            <div>
              <SectionLabel>React</SectionLabel>
              <ReactionBar event={event} userId={userId} onUpdate={refresh} />
            </div>

            {/* Quick actions */}
            <div>
              <SectionLabel>Quick update</SectionLabel>
              <QuickActions event={event} userId={userId} onUpdate={refresh} />
            </div>

            {/* Live status */}
            <LiveStatusBar event={event} userId={userId} onUpdate={refresh} />

            {/* Guest list */}
            {event.rsvps.length > 0 && (
              <div>
                <SectionLabel>
                  Guest list · <span className="text-emerald-400">{going} going</span>
                  {maybe > 0 && <span className="text-white/30"> · {maybe} maybe</span>}
                </SectionLabel>
                <div className="space-y-2">
                  {event.rsvps
                    .filter(r => r.status !== 'not_going')
                    .map(rsvp => (
                      <div key={rsvp.userId} className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-xs font-bold">
                            {rsvp.name[0]?.toUpperCase() || '?'}
                          </span>
                          <span className="text-sm text-white/80">{rsvp.name}</span>
                          {rsvp.plusCount > 0 && (
                            <span className="text-xs text-white/30">+{rsvp.plusCount}</span>
                          )}
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          rsvp.status === 'going'
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : 'bg-amber-500/15 text-amber-400'
                        }`}>
                          {rsvp.status === 'going' ? 'Going' : 'Maybe'}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Host-only: clone / delete */}
            {isCreator && (
              <div className="pt-4 border-t border-white/[0.06] flex gap-3">
                <Link
                  href="/create"
                  className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-white/50 hover:text-white/80 text-sm font-medium text-center transition-all"
                >
                  + Clone Event
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-medium text-white/30 uppercase tracking-widest mb-3">{children}</p>
  )
}
