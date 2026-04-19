export type VibeTag = 'party' | 'chill' | 'cafe' | 'study' | 'networking' | 'gaming'
export type RSVPStatus = 'going' | 'maybe' | 'not_going'
export type ReactionType = 'fire' | 'eyes' | 'skull' | 'cold'
export type LiveStatus = 'getting_ready' | 'on_the_way' | 'there'
export type Privacy = 'private' | 'link_only' | 'friends_of_friends'
export type InviteTemplate = 'minimal' | 'party' | 'meme' | 'dark'
export type PlusLimit = 0 | 1 | 3
export type QuickActionType = 'pulling_up' | 'late' | 'bringing_friends'

export interface RSVP {
  userId: string
  name: string
  status: RSVPStatus
  plusCount: number
}

export interface EventReaction {
  userId: string
  type: ReactionType
}

export interface QuickAction {
  userId: string
  name: string
  type: QuickActionType
}

export interface UserLiveStatus {
  userId: string
  name: string
  status: LiveStatus
}

export interface NaizEvent {
  id: string
  creatorId: string
  title: string
  description: string
  location: string
  eventTime: string
  vibes: VibeTag[]
  privacy: Privacy
  plusLimit: PlusLimit
  viewCount: number
  template: InviteTemplate
  createdAt: string
  rsvps: RSVP[]
  reactions: EventReaction[]
  quickActions: QuickAction[]
  liveStatuses: UserLiveStatus[]
}

export const VIBE_META: Record<VibeTag, { emoji: string; label: string }> = {
  party: { emoji: '🎉', label: 'party' },
  chill: { emoji: '🍻', label: 'chill' },
  cafe: { emoji: '☕', label: 'cafe' },
  study: { emoji: '📚', label: 'study' },
  networking: { emoji: '🧠', label: 'networking' },
  gaming: { emoji: '🎮', label: 'gaming' },
}

export const REACTION_META: Record<ReactionType, string> = {
  fire: '🔥',
  eyes: '👀',
  skull: '💀',
  cold: '🥶',
}

export const QUICK_ACTION_META: Record<QuickActionType, string> = {
  pulling_up: 'Pulling up',
  late: 'Running late',
  bringing_friends: 'Can bring friends?',
}

export const LIVE_STATUS_META: Record<LiveStatus, { emoji: string; label: string }> = {
  getting_ready: { emoji: '✨', label: 'Getting ready' },
  on_the_way: { emoji: '🚗', label: 'On the way' },
  there: { emoji: '📍', label: 'Already there' },
}

export const AUTO_NAMES = [
  'Friday Vibes',
  'Last Minute Hangout 💀',
  'Chill @ Zaisan',
  'Sunday Session',
  'No Plans? Now You Do',
  'Weekend Chaos',
]
