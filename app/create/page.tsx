'use client'

import { useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import InviteCard from '@/components/InviteCard'
import VibeSelector from '@/components/VibeSelector'
import TemplateSelector from '@/components/TemplateSelector'
import { NaizEvent, VibeTag, InviteTemplate, Privacy, PlusLimit, AUTO_NAMES } from '@/lib/types'
import { createEvent, getUserId } from '@/lib/store'
import { getEventShareUrl } from '@/lib/utils'

const PRIVACY_LABELS: Record<Privacy, string> = {
  private: '🔒 Private (invite only)',
  link_only: '🔗 Link only',
  friends_of_friends: '👥 Friends of friends',
}

export default function CreatePage() {
  const router = useRouter()
  const cardRef = useRef<HTMLDivElement>(null)

  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [vibes, setVibes] = useState<VibeTag[]>([])
  const [privacy, setPrivacy] = useState<Privacy>('link_only')
  const [plusLimit, setPlusLimit] = useState<PlusLimit>(1)
  const [template, setTemplate] = useState<InviteTemplate>('party')
  const [saving, setSaving] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [copied, setCopied] = useState(false)

  const eventTime = date && time ? `${date}T${time}` : ''

  const previewEvent: Partial<NaizEvent> = {
    title: title || 'Your Event',
    location: location || 'TBD',
    eventTime: eventTime || undefined,
    vibes,
    template,
  }

  function handleAutoName(name: string) {
    setTitle(name)
  }

  async function handleCreate() {
    if (!title || !date || !time || !location) return
    setSaving(true)
    try {
      const event = createEvent({
        title, description, location, eventTime,
        vibes, privacy, plusLimit, template,
      })
      router.push(`/event/${event.id}`)
    } finally {
      setSaving(false)
    }
  }

  const handleExport = useCallback(async () => {
    if (!cardRef.current) return
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
      a.download = `${title || 'naiz-invite'}.png`
      a.click()
    } catch (err) {
      console.error('Export failed:', err)
    } finally {
      setExporting(false)
    }
  }, [title])

  async function handleCopyLink() {
    if (!title || !date || !time || !location) return
    const event = createEvent({ title, description, location, eventTime, vibes, privacy, plusLimit, template })
    const url = getEventShareUrl(event)
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      router.push(`/event/${event.id}`)
    } catch {
      router.push(`/event/${event.id}`)
    }
  }

  const isValid = title.trim() && date && time && location.trim()

  return (
    <div className="min-h-screen bg-[#09090f] text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
        <a href="/" className="text-2xl font-black bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
          NAIZ
        </a>
        <span className="text-sm text-white/30">Create Event</span>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start">

          {/* ─── Form ─── */}
          <div className="space-y-6 mb-10 lg:mb-0">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">New Event</h1>
              <p className="text-sm text-white/35">Fill in the details. Done in 30 seconds.</p>
            </div>

            {/* Auto-name suggestions */}
            <div>
              <p className="text-xs text-white/30 mb-2 uppercase tracking-widest">Quick names</p>
              <div className="flex flex-wrap gap-2">
                {AUTO_NAMES.map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => handleAutoName(n)}
                    className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/50 hover:border-violet-500/50 hover:text-white/80 transition-all"
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <Field label="Title *">
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="What's the plan?"
                className="input"
              />
            </Field>

            {/* Date + Time */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Date *">
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="input"
                />
              </Field>
              <Field label="Time *">
                <input
                  type="time"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  className="input"
                />
              </Field>
            </div>

            {/* Location */}
            <Field label="Location *">
              <input
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Zaisan Rooftop, Near Shangri-La..."
                className="input"
              />
            </Field>

            {/* Description */}
            <Field label="Description">
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Any extra info... (optional)"
                rows={3}
                className="input resize-none"
              />
            </Field>

            {/* Vibes */}
            <Field label="Vibe">
              <VibeSelector selected={vibes} onChange={setVibes} />
            </Field>

            {/* Template */}
            <Field label="Invite Style">
              <TemplateSelector selected={template} onChange={setTemplate} />
            </Field>

            {/* Privacy + Plus limit */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Privacy">
                <select
                  value={privacy}
                  onChange={e => setPrivacy(e.target.value as Privacy)}
                  className="input"
                >
                  {(Object.keys(PRIVACY_LABELS) as Privacy[]).map(p => (
                    <option key={p} value={p}>{PRIVACY_LABELS[p]}</option>
                  ))}
                </select>
              </Field>
              <Field label="Plus guests">
                <select
                  value={plusLimit}
                  onChange={e => setPlusLimit(Number(e.target.value) as PlusLimit)}
                  className="input"
                >
                  <option value={0}>No +1</option>
                  <option value={1}>+1 allowed</option>
                  <option value={3}>+3 allowed</option>
                </select>
              </Field>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={handleCreate}
                disabled={!isValid || saving}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-base transition-all hover:scale-[1.02] shadow-lg shadow-violet-900/30"
              >
                {saving ? 'Creating...' : 'Create Event →'}
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleExport}
                  disabled={exporting}
                  className="py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/25 text-white/70 hover:text-white text-sm font-medium transition-all disabled:opacity-40"
                >
                  {exporting ? 'Exporting...' : '⬇ Download Card'}
                </button>
                <button
                  onClick={handleCopyLink}
                  disabled={!isValid}
                  className="py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/25 text-white/70 hover:text-white text-sm font-medium transition-all disabled:opacity-40"
                >
                  {copied ? '✓ Copied!' : '🔗 Copy Link'}
                </button>
              </div>
            </div>
          </div>

          {/* ─── Preview ─── */}
          <div className="lg:sticky lg:top-8">
            <p className="text-xs text-white/25 uppercase tracking-widest mb-4 text-center">Live Preview</p>
            <div className="flex justify-center">
              <div className="overflow-hidden rounded-2xl shadow-2xl shadow-black/60">
                <InviteCard
                  ref={cardRef}
                  event={previewEvent}
                  template={template}
                />
              </div>
            </div>
            <p className="text-xs text-white/20 text-center mt-3">9:16 Instagram Story format</p>
          </div>

        </div>
      </div>

      <style>{`
        .input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 10px 14px;
          color: white;
          font-size: 14px;
          outline: none;
          transition: border-color 0.15s;
          color-scheme: dark;
        }
        .input:focus {
          border-color: rgba(139,92,246,0.6);
        }
        .input::placeholder {
          color: rgba(255,255,255,0.25);
        }
        select.input option {
          background: #1a1a2e;
          color: white;
        }
      `}</style>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-white/40 uppercase tracking-widest">{label}</label>
      {children}
    </div>
  )
}
