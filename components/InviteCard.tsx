'use client'

import React from 'react'
import { NaizEvent, InviteTemplate, VIBE_META } from '@/lib/types'
import { format } from 'date-fns'

interface InviteCardProps {
  event: Partial<NaizEvent>
  template?: InviteTemplate
  className?: string
}

const InviteCard = React.forwardRef<HTMLDivElement, InviteCardProps>(
  ({ event, template = 'party', className = '' }, ref) => {
    const t = template || event.template || 'party'

    const title = event.title || 'Your Event'
    const location = event.location || 'TBD'
    const vibes = event.vibes || []

    let dateStr = ''
    let timeStr = ''
    if (event.eventTime) {
      try {
        const d = new Date(event.eventTime)
        dateStr = format(d, 'EEE, MMM d')
        timeStr = format(d, 'h:mm a')
      } catch {}
    }

    if (t === 'minimal') return (
      <div
        ref={ref}
        className={className}
        style={{
          width: 360, height: 640, background: '#ffffff', display: 'flex',
          flexDirection: 'column', padding: '48px 40px', boxSizing: 'border-box',
          fontFamily: 'Inter, system-ui, sans-serif', border: '1px solid #e2e8f0',
          position: 'relative', overflow: 'hidden',
        }}
      >
        <div style={{ fontSize: 11, letterSpacing: 4, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 48 }}>
          you're invited
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 38, fontWeight: 800, color: '#0f172a', lineHeight: 1.1, marginBottom: 32 }}>
            {title}
          </div>
          <div style={{ width: 48, height: 2, background: '#6366f1', marginBottom: 32 }} />
          {dateStr && (
            <div style={{ fontSize: 16, color: '#475569', marginBottom: 8, fontWeight: 500 }}>{dateStr}</div>
          )}
          {timeStr && (
            <div style={{ fontSize: 22, color: '#0f172a', fontWeight: 700, marginBottom: 16 }}>{timeStr}</div>
          )}
          <div style={{ fontSize: 15, color: '#64748b', marginBottom: 32 }}>📍 {location}</div>
          {vibes.length > 0 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {vibes.map(v => (
                <span key={v} style={{
                  fontSize: 12, padding: '4px 12px', background: '#f1f5f9',
                  borderRadius: 999, color: '#475569', fontWeight: 500,
                }}>
                  {VIBE_META[v].emoji} {VIBE_META[v].label}
                </span>
              ))}
            </div>
          )}
        </div>
        <div style={{ fontSize: 12, color: '#cbd5e1', letterSpacing: 2 }}>NAIZ</div>
      </div>
    )

    if (t === 'party') return (
      <div
        ref={ref}
        className={className}
        style={{
          width: 360, height: 640,
          background: 'linear-gradient(160deg, #0d0020 0%, #1a0040 40%, #0d001a 100%)',
          display: 'flex', flexDirection: 'column', padding: '48px 40px',
          boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif',
          position: 'relative', overflow: 'hidden',
        }}
      >
        {/* glow orbs */}
        <div style={{
          position: 'absolute', top: -60, right: -60, width: 200, height: 200,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.35) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: 40, left: -40, width: 160, height: 160,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%)',
        }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ fontSize: 28, marginBottom: 32 }}>🎉</div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 20,
              background: 'linear-gradient(90deg, #a855f7, #ec4899)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              you're invited
            </div>
            <div style={{ fontSize: 40, fontWeight: 900, color: '#ffffff', lineHeight: 1.05, marginBottom: 36 }}>
              {title}
            </div>
            {(dateStr || timeStr) && (
              <div style={{
                background: 'rgba(255,255,255,0.07)', borderRadius: 12,
                padding: '16px 20px', marginBottom: 20, backdropFilter: 'blur(10px)',
                border: '1px solid rgba(168,85,247,0.3)',
              }}>
                {dateStr && <div style={{ fontSize: 14, color: '#c4b5fd', marginBottom: 4 }}>{dateStr}</div>}
                {timeStr && <div style={{ fontSize: 22, fontWeight: 700, color: '#ffffff' }}>{timeStr}</div>}
              </div>
            )}
            <div style={{ fontSize: 14, color: '#a78bfa', marginBottom: 28 }}>📍 {location}</div>
            {vibes.length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {vibes.map(v => (
                  <span key={v} style={{
                    fontSize: 12, padding: '5px 14px',
                    background: 'rgba(168,85,247,0.2)', borderRadius: 999,
                    color: '#e9d5ff', border: '1px solid rgba(168,85,247,0.4)',
                  }}>
                    {VIBE_META[v].emoji} {VIBE_META[v].label}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', letterSpacing: 3 }}>NAIZ</div>
        </div>
      </div>
    )

    if (t === 'meme') return (
      <div
        ref={ref}
        className={className}
        style={{
          width: 360, height: 640,
          background: 'linear-gradient(145deg, #f59e0b 0%, #ef4444 100%)',
          display: 'flex', flexDirection: 'column', padding: '44px 36px',
          boxSizing: 'border-box', fontFamily: 'Impact, "Arial Black", system-ui',
          position: 'relative', overflow: 'hidden',
        }}
      >
        <div style={{
          position: 'absolute', top: 16, right: 16, fontSize: 64, opacity: 0.15, transform: 'rotate(20deg)',
        }}>💀</div>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{
            fontSize: 13, letterSpacing: 3, color: 'rgba(0,0,0,0.6)',
            textTransform: 'uppercase', marginBottom: 20, fontFamily: 'Inter, system-ui',
          }}>
            NO CAP YOU'RE INVITED
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: 52, fontWeight: 900, color: '#000000', lineHeight: 1,
              marginBottom: 32, textTransform: 'uppercase',
              textShadow: '3px 3px 0 rgba(255,255,255,0.4)',
            }}>
              {title}
            </div>
            {(dateStr || timeStr) && (
              <div style={{
                background: 'rgba(0,0,0,0.15)', padding: '14px 18px', borderRadius: 8, marginBottom: 20,
              }}>
                {dateStr && <div style={{ fontSize: 16, color: '#1c1917', fontFamily: 'Inter, system-ui' }}>{dateStr}</div>}
                {timeStr && <div style={{ fontSize: 28, fontWeight: 900, color: '#000000' }}>{timeStr}</div>}
              </div>
            )}
            <div style={{ fontSize: 16, color: '#1c1917', marginBottom: 28, fontFamily: 'Inter, system-ui' }}>
              📍 {location}
            </div>
            {vibes.length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {vibes.map(v => (
                  <span key={v} style={{
                    fontSize: 14, padding: '5px 14px',
                    background: 'rgba(0,0,0,0.2)', borderRadius: 999,
                    color: '#000', fontFamily: 'Inter, system-ui', fontWeight: 600,
                  }}>
                    {VIBE_META[v].emoji} {VIBE_META[v].label}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div style={{
            fontSize: 13, color: 'rgba(0,0,0,0.4)', letterSpacing: 3,
            fontFamily: 'Inter, system-ui',
          }}>NAIZ</div>
        </div>
      </div>
    )

    // dark template (default fallback)
    return (
      <div
        ref={ref}
        className={className}
        style={{
          width: 360, height: 640,
          background: 'linear-gradient(160deg, #09090f 0%, #110822 50%, #09090f 100%)',
          display: 'flex', flexDirection: 'column', padding: '48px 40px',
          boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif',
          position: 'relative', overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
        }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{
            fontSize: 11, letterSpacing: 5, color: 'rgba(255,255,255,0.35)',
            textTransform: 'uppercase', marginBottom: 48,
          }}>
            you're invited
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 42, fontWeight: 800, color: '#f8fafc', lineHeight: 1.08, marginBottom: 40 }}>
              {title}
            </div>
            {(dateStr || timeStr) && (
              <div style={{ marginBottom: 20 }}>
                {dateStr && (
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>{dateStr}</div>
                )}
                {timeStr && (
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#e2e8f0' }}>{timeStr}</div>
                )}
              </div>
            )}
            <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 20 }} />
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 32 }}>◈ {location}</div>
            {vibes.length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {vibes.map(v => (
                  <span key={v} style={{
                    fontSize: 11, padding: '4px 12px',
                    background: 'rgba(255,255,255,0.06)', borderRadius: 999,
                    color: 'rgba(255,255,255,0.5)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    letterSpacing: 1,
                  }}>
                    {VIBE_META[v].emoji} {VIBE_META[v].label}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.15)', letterSpacing: 4 }}>NAIZ</div>
        </div>
      </div>
    )
  }
)

InviteCard.displayName = 'InviteCard'

export default InviteCard
