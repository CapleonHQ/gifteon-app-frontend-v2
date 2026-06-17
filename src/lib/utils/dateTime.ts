import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)
dayjs.extend(advancedFormat)

export const formatRelativeTimeOrDate = (
  value: string | number | Date,
  maxRelativeDays = 30
): string => {
  const parsed = dayjs(value)
  if (!parsed.isValid()) return 'Recently'

  const diffInDays = Math.abs(dayjs().diff(parsed, 'day'))
  if (diffInDays > maxRelativeDays) {
    return parsed.format('Do MMM YYYY')
  }

  return parsed.fromNow()
}

export const isoToDate = (iso: string): Date | undefined => {
  if (!iso) return undefined
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? undefined : d
}

export const isoToTime = (iso: string, fallback = '12:00'): string => {
  const d = isoToDate(iso)
  if (!d) return fallback
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export const combineDateTime = (
  date: Date | undefined,
  time: string
): string => {
  if (!date) return ''
  const [h, m] = time.split(':')
  const next = new Date(date)
  next.setHours(Number(h) || 0, Number(m) || 0, 0, 0)
  return next.toISOString()
}

export const formatDateTimeShort = (value: string | number | Date): string => {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
