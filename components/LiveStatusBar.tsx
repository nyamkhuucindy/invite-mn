'use client'

import { NaizEvent, LiveStatus, LIVE_STATUS_META } from '@/lib/types'
import { setLiveStatus, getUserName } from '@/lib/store'

interface LiveStatusBarProps {
  event: NaizEvent
  userId: string
  onUpdate: () => void
}

const STATUSES: LiveStatus[] = ['getting_ready', 'on_the_way', 'there']

export default function LiveStatusBar({ event, userId, onUpdate }: LiveStatusBarProps) {
  const myStatus = event.liveStatuses.find(s => s.userId === userId)?.status

  function handleStatus(status: LiveStatus) {
    const name = getUserName() || 'Someone'
    setLiveStatus(event.id, status, name)
    onUpdate()
  }

  const goingUsers = event.rsvps.filter(r => r.status === 'going')
  if (goingUsers.length === 0) return null

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-white/40 uppercase tracking-widest">Live Status</p>
      <div className="flex gap-2">
        {STATUSES.map(s => {
          const meta = LIVE_STATUS_META[s]
          const count = event.liveStatuses.filter(ls => ls.status === s).length
          const active = myStatus === s
          return (
            <button
              key={s}
              onClick={() => handleStatus(s)}
              className={`flex-1 py-2 px-2 rounded-xl text-xs font-medium border transition-all text-center ${
                active
                  ? 'bg-violet-600/25 border-violet-500 text-violet-200'
                  : 'bg-white/5 border-white/10 text-white/40 hover:border-white/25 hover:text-white/60'
              }`}
            >
              <div>{meta.emoji}</div>
              <div className="mt-0.5">{meta.label}</div>
              {count > 0 && <div className="text-white/30 mt-0.5">{count}</div>}
            </button>
          )
        })}
      </div>
      {event.liveStatuses.length > 0 && (
        <div className="text-xs text-white/30">
          {event.liveStatuses.map(s => `${s.name} ${LIVE_STATUS_META[s.status].label.toLowerCase()}`).join(' · ')}
        </div>
      )}
    </div>
  )
}
