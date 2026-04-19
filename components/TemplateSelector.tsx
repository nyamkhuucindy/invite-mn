'use client'

import { InviteTemplate } from '@/lib/types'

interface TemplateSelectorProps {
  selected: InviteTemplate
  onChange: (t: InviteTemplate) => void
}

const TEMPLATES: { id: InviteTemplate; label: string; bg: string; text: string }[] = [
  { id: 'party', label: 'Party', bg: 'linear-gradient(135deg, #0d0020, #1a0040)', text: '#fff' },
  { id: 'minimal', label: 'Minimal', bg: '#ffffff', text: '#0a0a0a' },
  { id: 'dark', label: 'Dark', bg: 'linear-gradient(135deg, #09090f, #110822)', text: '#f8fafc' },
  { id: 'meme', label: 'Meme', bg: 'linear-gradient(135deg, #f59e0b, #ef4444)', text: '#000' },
]

export default function TemplateSelector({ selected, onChange }: TemplateSelectorProps) {
  return (
    <div className="flex gap-3">
      {TEMPLATES.map(t => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={`flex-1 rounded-xl overflow-hidden border-2 transition-all ${
            selected === t.id ? 'border-violet-500 scale-105' : 'border-white/10 hover:border-white/30'
          }`}
        >
          <div
            className="h-14 flex items-center justify-center text-xs font-bold"
            style={{ background: t.bg, color: t.text }}
          >
            {t.label}
          </div>
        </button>
      ))}
    </div>
  )
}
