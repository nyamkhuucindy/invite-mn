import { format, formatDistanceToNow, isPast } from 'date-fns'
import { NaizEvent } from './types'

export function formatEventDate(isoString: string): string {
  try {
    return format(new Date(isoString), "EEE, MMM d • h:mm a")
  } catch {
    return isoString
  }
}

export function formatEventDateLong(isoString: string): string {
  try {
    return format(new Date(isoString), "EEEE, MMMM d, yyyy 'at' h:mm a")
  } catch {
    return isoString
  }
}

export function formatRelativeTime(isoString: string): string {
  try {
    const date = new Date(isoString)
    if (isPast(date)) return 'happened ' + formatDistanceToNow(date, { addSuffix: true })
    return formatDistanceToNow(date, { addSuffix: true })
  } catch {
    return ''
  }
}

export function encodeEvent(event: NaizEvent): string {
  return btoa(encodeURIComponent(JSON.stringify(event)))
}

export function decodeEvent(encoded: string): NaizEvent | null {
  try {
    return JSON.parse(decodeURIComponent(atob(encoded)))
  } catch {
    return null
  }
}

export function getEventShareUrl(event: NaizEvent): string {
  if (typeof window === 'undefined') return ''
  const encoded = encodeEvent(event)
  return `${window.location.origin}/event/${event.id}?d=${encoded}`
}

export function getEnergyLevel(event: NaizEvent): { label: string; color: string } {
  const going = event.rsvps.filter(r => r.status === 'going').length
  const reactions = event.reactions.length
  const score = going * 2 + reactions
  if (score >= 15) return { label: 'Big night 🌙', color: '#a855f7' }
  if (score >= 5) return { label: 'Active 🔥', color: '#f97316' }
  return { label: 'Lowkey 🌊', color: '#60a5fa' }
}

export function getRSVPCounts(event: NaizEvent) {
  const going = event.rsvps.filter(r => r.status === 'going')
  const maybe = event.rsvps.filter(r => r.status === 'maybe')
  const notGoing = event.rsvps.filter(r => r.status === 'not_going')
  const totalGuests = going.reduce((sum, r) => sum + r.plusCount + 1, 0)
  return { going: going.length, maybe: maybe.length, notGoing: notGoing.length, totalGuests }
}
