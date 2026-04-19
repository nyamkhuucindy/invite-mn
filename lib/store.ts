import { NaizEvent, RSVPStatus, ReactionType, QuickActionType, LiveStatus, InviteTemplate, PlusLimit, Privacy, VibeTag } from './types'

const EVENTS_KEY = 'naiz_events'
const USER_ID_KEY = 'naiz_user_id'
const USER_NAME_KEY = 'naiz_user_name'

function genId(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function getUserId(): string {
  let id = localStorage.getItem(USER_ID_KEY)
  if (!id) {
    id = genId()
    localStorage.setItem(USER_ID_KEY, id)
  }
  return id
}

export function getUserName(): string {
  return localStorage.getItem(USER_NAME_KEY) || ''
}

export function setUserName(name: string): void {
  localStorage.setItem(USER_NAME_KEY, name)
}

function getAllEvents(): Record<string, NaizEvent> {
  try {
    const raw = localStorage.getItem(EVENTS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveAllEvents(events: Record<string, NaizEvent>): void {
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events))
}

export function createEvent(data: {
  title: string
  description: string
  location: string
  eventTime: string
  vibes: VibeTag[]
  privacy: Privacy
  plusLimit: PlusLimit
  template: InviteTemplate
}): NaizEvent {
  const events = getAllEvents()
  const userId = getUserId()
  const event: NaizEvent = {
    id: genId(),
    creatorId: userId,
    title: data.title,
    description: data.description,
    location: data.location,
    eventTime: data.eventTime,
    vibes: data.vibes,
    privacy: data.privacy,
    plusLimit: data.plusLimit,
    template: data.template,
    viewCount: 0,
    createdAt: new Date().toISOString(),
    rsvps: [],
    reactions: [],
    quickActions: [],
    liveStatuses: [],
  }
  events[event.id] = event
  saveAllEvents(events)
  return event
}

export function getEvent(id: string): NaizEvent | null {
  const events = getAllEvents()
  return events[id] || null
}

export function saveSharedEvent(event: NaizEvent): void {
  const events = getAllEvents()
  if (!events[event.id]) {
    events[event.id] = event
    saveAllEvents(events)
  }
}

export function incrementViewCount(id: string): void {
  const events = getAllEvents()
  if (events[id]) {
    events[id].viewCount = (events[id].viewCount || 0) + 1
    saveAllEvents(events)
  }
}

export function upsertRSVP(eventId: string, status: RSVPStatus, name: string, plusCount: number): void {
  const events = getAllEvents()
  if (!events[eventId]) return
  const userId = getUserId()
  const existing = events[eventId].rsvps.findIndex(r => r.userId === userId)
  const rsvp = { userId, name, status, plusCount }
  if (existing >= 0) {
    events[eventId].rsvps[existing] = rsvp
  } else {
    events[eventId].rsvps.push(rsvp)
  }
  saveAllEvents(events)
}

export function toggleReaction(eventId: string, type: ReactionType): void {
  const events = getAllEvents()
  if (!events[eventId]) return
  const userId = getUserId()
  const idx = events[eventId].reactions.findIndex(r => r.userId === userId && r.type === type)
  if (idx >= 0) {
    events[eventId].reactions.splice(idx, 1)
  } else {
    // remove any other reaction by this user
    events[eventId].reactions = events[eventId].reactions.filter(r => r.userId !== userId)
    events[eventId].reactions.push({ userId, type })
  }
  saveAllEvents(events)
}

export function addQuickAction(eventId: string, type: QuickActionType, name: string): void {
  const events = getAllEvents()
  if (!events[eventId]) return
  const userId = getUserId()
  events[eventId].quickActions = events[eventId].quickActions.filter(a => a.userId !== userId)
  events[eventId].quickActions.push({ userId, name, type })
  saveAllEvents(events)
}

export function setLiveStatus(eventId: string, status: LiveStatus, name: string): void {
  const events = getAllEvents()
  if (!events[eventId]) return
  const userId = getUserId()
  const idx = events[eventId].liveStatuses.findIndex(s => s.userId === userId)
  if (idx >= 0) {
    events[eventId].liveStatuses[idx] = { userId, name, status }
  } else {
    events[eventId].liveStatuses.push({ userId, name, status })
  }
  saveAllEvents(events)
}

export function getMyEvents(): NaizEvent[] {
  const events = getAllEvents()
  const userId = getUserId()
  return Object.values(events)
    .filter(e => e.creatorId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function deleteEvent(id: string): void {
  const events = getAllEvents()
  delete events[id]
  saveAllEvents(events)
}
