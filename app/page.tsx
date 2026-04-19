'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { NaizEvent, VIBE_META } from '@/lib/types'
import { getMyEvents } from '@/lib/store'
import { formatEventDate } from '@/lib/utils'

export default function Home() {
  const [myEvents, setMyEvents] = useState<NaizEvent[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setMyEvents(getMyEvents())
  }, [])

  return (
    <main className="min-h-screen bg-[#09090f] text-white">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-[72vh] px-6 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-violet-600/10 blur-[140px]" />
          <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] rounded-full bg-pink-600/8 blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/40 mb-8">
            🇲🇳 Built for Ulaanbaatar
          </div>
          <h1 className="text-8xl sm:text-9xl font-black tracking-tight mb-3">
            <span className="bg-gradient-to-br from-violet-300 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              NAIZ
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-white/50 mb-3 font-light tracking-wide">
            Plan it. Share it. Show up.
          </p>
          <p className="text-sm text-white/25 mb-10 max-w-sm mx-auto leading-relaxed">
            Create aesthetic invites in seconds — built for how Mongolian youth actually share plans.
          </p>
          <Link
            href="/create"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white font-bold text-base shadow-lg shadow-violet-900/40 transition-all hover:scale-105 hover:shadow-xl"
          >
            Create Event ✨
          </Link>
        </div>
      </section>

      {/* My Events */}
      {mounted && myEvents.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 pb-20">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest">My Events</h2>
            <Link href="/create" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
              + New event
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {myEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-6 pb-28">
        <p className="text-center text-xs font-medium text-white/20 uppercase tracking-widest mb-10">How it works</p>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { step: '01', title: 'Create in 30s', desc: 'Pick a vibe, set the time and place. Live preview as you type.' },
            { step: '02', title: 'Share the card', desc: 'Download the 9:16 IG story card or copy the invite link.' },
            { step: '03', title: 'See who\'s coming', desc: 'Friends RSVP. You track who\'s going, maybe, or out.' },
          ].map(s => (
            <div key={s.step} className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/10 transition-colors">
              <div className="text-3xl font-black text-white/8 mb-3">{s.step}</div>
              <div className="font-semibold text-white/80 mb-1.5">{s.title}</div>
              <div className="text-sm text-white/35 leading-relaxed">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

function EventCard({ event }: { event: NaizEvent }) {
  const going = event.rsvps.filter(r => r.status === 'going').length
  const isPast = new Date(event.eventTime) < new Date()
  const vibeEmojis = event.vibes.slice(0, 3).map(v => VIBE_META[v].emoji).join('')

  return (
    <Link
      href={`/event/${event.id}`}
      className="block p-5 rounded-2xl bg-white/[0.04] border border-white/[0.07] hover:border-violet-500/30 hover:bg-white/[0.06] transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-lg">{vibeEmojis || '✨'}</span>
        {isPast && <span className="text-xs text-white/20 bg-white/5 px-2 py-0.5 rounded-full">Past</span>}
      </div>
      <h3 className="font-bold text-white/90 mb-1 group-hover:text-violet-200 transition-colors line-clamp-1 text-base">
        {event.title}
      </h3>
      <p className="text-xs text-white/35 mb-3">{formatEventDate(event.eventTime)}</p>
      <div className="flex items-center justify-between text-xs text-white/25">
        <span className="truncate mr-2">📍 {event.location}</span>
        {going > 0 && <span className="text-emerald-400/60 shrink-0">{going} going</span>}
      </div>
    </Link>
  )
}
