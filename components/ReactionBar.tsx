'use client'

import { NaizEvent, ReactionType, REACTION_META } from '@/lib/types'
import { toggleReaction } from '@/lib/store'

interface ReactionBarProps {
  event: NaizEvent
  userId: string
  onUpdate: () => void
}

const REACTIONS: ReactionType[] = ['fire', 'eyes', 'skull', 'cold']

export default function ReactionBar({ event, userId, onUpdate }: ReactionBarProps) {
  function handleReact(type: ReactionType) {
    toggleReaction(event.id, type)
    onUpdate()
  }

  const myReaction = event.reactions.find(r => r.userId === userId)?.type

  return (
    <div className="flex gap-2 flex-wrap">
      {REACTIONS.map(type => {
        const count = event.reactions.filter(r => r.type === type).length
        const active = myReaction === type
        return (
          <button
            key={type}
            onClick={() => handleReact(type)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all border ${
              active
                ? 'bg-violet-600/30 border-violet-500'
                : 'bg-white/5 border-white/10 hover:border-white/25'
            }`}
          >
            <span className="text-base">{REACTION_META[type]}</span>
            {count > 0 && <span className="text-white/60 text-xs font-medium">{count}</span>}
          </button>
        )
      })}
    </div>
  )
}
