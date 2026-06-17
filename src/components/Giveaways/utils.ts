import { formatCurrency } from '@/lib/utils/currency'
import type {
  Giveaway,
  GiveawayCategory,
  GiveawayStatus,
  GiveawayTask,
} from '@/types/Giveaways'

export type CategoryMeta = {
  label: string
  description: string
  badge: string
  tile: string
  accentText: string
  ring: string
  gradient: string
}

export const CATEGORY_META: Record<GiveawayCategory, CategoryMeta> = {
  trivia: {
    label: 'Trivia',
    description: 'Players answer questions; top scores win.',
    badge: 'bg-information-50 text-information-600',
    tile: 'bg-information-50 text-information-600',
    accentText: 'text-information-600',
    ring: 'stroke-information-500',
    gradient: 'from-information-50 to-white',
  },
  task: {
    label: 'Task',
    description: 'Players complete tasks to qualify.',
    badge: 'bg-warning-50 text-warning-600',
    tile: 'bg-warning-50 text-warning-600',
    accentText: 'text-warning-600',
    ring: 'stroke-warning-500',
    gradient: 'from-warning-50 to-white',
  },
  lottery: {
    label: 'Lottery',
    description: 'Random draw — every entry has a chance.',
    badge: 'bg-primary-50 text-primary-600',
    tile: 'bg-primary-50 text-primary-600',
    accentText: 'text-primary-600',
    ring: 'stroke-primary-500',
    gradient: 'from-primary-50 to-white',
  },
}

export type StatusMeta = { label: string; tone: string; dot: string }

export const STATUS_META: Record<GiveawayStatus, StatusMeta> = {
  pending: {
    label: 'Pending',
    tone: 'bg-grey-50 text-grey-600',
    dot: 'bg-grey-400',
  },
  active: {
    label: 'Active',
    tone: 'bg-success-50 text-success-600',
    dot: 'bg-success-500',
  },
  closed: {
    label: 'Closed',
    tone: 'bg-grey-50 text-grey-600',
    dot: 'bg-grey-400',
  },
  completed: {
    label: 'Completed',
    tone: 'bg-information-50 text-information-600',
    dot: 'bg-information-500',
  },
  disbursed: {
    label: 'Winners paid',
    tone: 'bg-success-50 text-success-600',
    dot: 'bg-success-500',
  },
  cancelled: {
    label: 'Cancelled',
    tone: 'bg-error-50 text-error-600',
    dot: 'bg-error-500',
  },
}

export const getStatusMeta = (status: GiveawayStatus): StatusMeta =>
  STATUS_META[status] ?? STATUS_META.pending

export const formatPrize = (giveaway: Giveaway): string => {
  if (giveaway.prizeDescription) return giveaway.prizeDescription
  const value = Number(giveaway.prizeValue)
  if (!Number.isFinite(value)) return giveaway.prizeCurrency
  return formatCurrency(value, {
    currency: giveaway.prizeCurrency,
    maximumFractionDigits: 0,
  })
}

export type CountdownState = {
  phase: 'upcoming' | 'live' | 'ended'
  label: string
  totalSeconds: number
  urgent: boolean
}

export const getCountdownState = (
  giveaway: Pick<Giveaway, 'startsAt' | 'endsAt'>,
  now: number = Date.now()
): CountdownState => {
  const start = new Date(giveaway.startsAt).getTime()
  const end = new Date(giveaway.endsAt).getTime()

  if (now < start) {
    const seconds = Math.max(0, Math.floor((start - now) / 1000))
    return {
      phase: 'upcoming',
      label: `starts in ${formatDuration(seconds)}`,
      totalSeconds: seconds,
      urgent: false,
    }
  }

  if (now >= end) {
    return { phase: 'ended', label: 'Ended', totalSeconds: 0, urgent: false }
  }

  const seconds = Math.max(0, Math.floor((end - now) / 1000))
  return {
    phase: 'live',
    label: `ends in ${formatDuration(seconds)}`,
    totalSeconds: seconds,
    urgent: seconds <= 3600,
  }
}

export const formatDuration = (totalSeconds: number): string => {
  const s = Math.max(0, totalSeconds)
  const days = Math.floor(s / 86400)
  const hours = Math.floor((s % 86400) / 3600)
  const minutes = Math.floor((s % 3600) / 60)
  const seconds = s % 60

  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  if (minutes > 0) return `${minutes}m ${seconds}s`
  return `${seconds}s`
}

export type CountdownParts = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export const getCountdownParts = (totalSeconds: number): CountdownParts => {
  const s = Math.max(0, totalSeconds)
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  }
}

export const getInitials = (tag: string): string => {
  const clean = tag.replace(/^@/, '').replace(/[-_]/g, ' ').trim()
  if (!clean) return '?'
  const parts = clean.split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

export const needsUpload = (task: GiveawayTask) =>
  task.taskType === 'upload_proof' ||
  task.verificationMethod === 'manual_review'
