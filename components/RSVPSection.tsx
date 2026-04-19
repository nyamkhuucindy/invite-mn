'use client'

import { useState } from 'react'
import { NaizEvent, RSVPStatus, PlusLimit } from '@/lib/types'
import { upsertRSVP, getUserName, setUserName } from '@/lib/store'
import { getRSVPCounts } from '@/lib/utils'

interface RSVPSectionProps {
  event: NaizEvent
  userId: string
  onUpdate: () => void
}

export default function RSVPSection({ event, userId, onUpdate }: RSVPSectionProps) {
  const myRSVP = event.rsvps.find(r => r.userId === userId)
  const [name, setName] = useState(getUserName())
  const [plusCount, setPlusCount] = useState(myRSVP?.plusCount ?? 0)
  const [showNameInput, setShowNameInput] = useState(false)
  const [pendingStatus, setPendingStatus] = useState<RSVPStatus | null>(null)

  const counts = getRSVPCounts(event)

  function handleRSVP(status: RSVPStatus) {
    const userName = getUserName()
    if (!userName) {
      setPendingStatus(status)
      setShowNameInput(true)
      return
    }
    upsertRSVP(event.id, status, userName, status === 'going' ? plusCount : 0)
    onUpdate()
  }

  function confirmWithName() {
    if (!name.trim()) return
    setUserName(name.trim())
    const status = pendingStatus || (myRSVP?.status ?? 'going')
    upsertRSVP(event.id, status, name.trim(), status === 'going' ? plusCount : 0)
    setShowNameInput(false)
    setPendingStatus(null)
    onUpdate()
  }

  const btnBase = 'flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all border'
  const activeGoing = 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
  const activeMaybe = 'bg-amber-500/20 border-amber-500 text-amber-300'
  const activeNo = 'bg-red-500/20 border-red-500 text-red-300'
  const inactive = 'bg-white/5 border-white/10 text-white/50 hover:border-white/30 hover:text-white/80'

  return (
    <div className="space-y-4">
      {showNameInput && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
          <p className="text-sm text-white/60">What's your name?</p>
          <input
            autoFocus
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && confirmWithName()}
            placeholder="Your name"
            className="w-full bg-white/10 border border-white/15 rounded-lg px-3 py-2 text-white placeholder-white/30 text-sm outline-none focus:border-violet-500"
          />
          <button
            onClick={confirmWithName}
            className="w-full py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm font-semibold text-white transition-colors"
          >
            Confirm
          </button>
        </div>
      )}

      <div className="flex gap-2">
        <button onClick={() => handleRSVP('going')} className={`${btnBase} ${myRSVP?.status === 'going' ? activeGoing : inactive}`}>
          Going ✓
        </button>
        <button onClick={() => handleRSVP('maybe')} className={`${btnBase} ${myRSVP?.status === 'maybe' ? activeMaybe : inactive}`}>
          Maybe 🤔
        </button>
        <button onClick={() => handleRSVP('not_going')} className={`${btnBase} ${myRSVP?.status === 'not_going' ? activeNo : inactive}`}>
          Can't go
        </button>
      </div>

      {myRSVP?.status === 'going' && event.plusLimit > 0 && (
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
          <span className="text-sm text-white/50">Bringing +</span>
          <div className="flex gap-2">
            {([0, 1, 2, 3] as number[]).filter(n => n <= event.plusLimit).map(n => (
              <button
                key={n}
                onClick={() => {
                  setPlusCount(n)
                  upsertRSVP(event.id, 'going', getUserName(), n)
                  onUpdate()
                }}
                className={`w-8 h-8 rounded-full text-sm font-bold border transition-all ${
                  plusCount === n ? 'bg-violet-600/40 border-violet-500 text-white' : 'bg-white/5 border-white/15 text-white/50 hover:border-white/30'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-4 text-sm text-white/40">
        <span><span className="text-emerald-400 font-semibold">{counts.going}</span> going</span>
        <span><span className="text-amber-400 font-semibold">{counts.maybe}</span> maybe</span>
        {counts.totalGuests > counts.going && (
          <span><span className="text-white/60 font-semibold">{counts.totalGuests}</span> total w/ guests</span>
        )}
      </div>
    </div>
  )
}
