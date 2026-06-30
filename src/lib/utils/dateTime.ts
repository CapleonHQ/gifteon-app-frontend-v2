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
