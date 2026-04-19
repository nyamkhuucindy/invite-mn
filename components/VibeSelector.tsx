'use client'

import { VibeTag, VIBE_META } from '@/lib/types'

interface VibeSelectorProps {
  selected: VibeTag[]
  onChange: (vibes: VibeTag[]) => void
}

const ALL_VIBES: VibeTag[] = ['party', 'chill', 'cafe', 'study', 'networking', 'gaming']

export default function VibeSelector({ selected, onChange }: VibeSelectorProps) {
  function toggle(vibe: VibeTag) {
    if (selected.includes(vibe)) {
      onChange(selected.filter(v => v !== vibe))
    } else {
      onChange([...selected, vibe])
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {ALL_VIBES.map(vibe => {
        const { emoji, label } = VIBE_META[vibe]
        const active = selected.includes(vibe)
        return (
          <button
            key={vibe}
            type="button"
            onClick={() => toggle(vibe)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
              active
                ? 'bg-violet-600/30 border-violet-500 text-violet-200'
                : 'bg-white/5 border-white/10 text-white/50 hover:border-white/30 hover:text-white/80'
            }`}
          >
            <span>{emoji}</span>
            <span>{label}</span>
          </button>
        )
      })}
    </div>
  )
}
