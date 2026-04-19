'use client'

import { NaizEvent, QuickActionType, QUICK_ACTION_META } from '@/lib/types'
import { addQuickAction, getUserName } from '@/lib/store'

interface QuickActionsProps {
  event: NaizEvent
  userId: string
  onUpdate: () => void
}

const ACTIONS: QuickActionType[] = ['pulling_up', 'late', 'bringing_friends']

export default function QuickActions({ event, userId, onUpdate }: QuickActionsProps) {
  function handleAction(type: QuickActionType) {
    const name = getUserName() || 'Someone'
    addQuickAction(event.id, type, name)
    onUpdate()
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {ACTIONS.map(type => {
          const count = event.quickActions.filter(a => a.type === type).length
          const mine = event.quickActions.find(a => a.userId === userId && a.type === type)
          return (
            <button
              key={type}
              onClick={() => handleAction(type)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-all ${
                mine
                  ? 'bg-violet-600/20 border-violet-500/60 text-violet-300'
                  : 'bg-white/5 border-white/10 text-white/50 hover:border-white/25 hover:text-white/70'
              }`}
            >
              {QUICK_ACTION_META[type]}
              {count > 0 && <span className="text-xs opacity-60">{count}</span>}
            </button>
          )
        })}
      </div>
      {event.quickActions.length > 0 && (
        <div className="space-y-1">
          {['pulling_up', 'late', 'bringing_friends'].map(type => {
            const people = event.quickActions.filter(a => a.type === type as QuickActionType)
            if (people.length === 0) return null
            return (
              <p key={type} className="text-xs text-white/35">
                {people.map(a => a.name).join(', ')} {QUICK_ACTION_META[type as QuickActionType].toLowerCase()}
              </p>
            )
          })}
        </div>
      )}
    </div>
  )
}
