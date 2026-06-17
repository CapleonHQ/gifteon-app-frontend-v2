'use client'

import { useCountdown } from '@/components/Giveaways/hooks/useCountdown'
import { isLiveCountdownStatus } from '@/components/Giveaways/utils'
import ClockIcon from '@/assets/icons/ClockIcon'
import type { Giveaway } from '@/types/Giveaways'

type GiveawayCountdownProps = {
  giveaway: Pick<Giveaway, 'startsAt' | 'endsAt' | 'status'>
  className?: string
}

const STATUS_LABEL: Partial<Record<Giveaway['status'], string>> = {
  closed: 'Entries closed',
  completed: 'Ended',
  disbursed: 'Ended',
  cancelled: 'Cancelled',
}

const GiveawayCountdown = ({
  giveaway,
  className = '',
}: GiveawayCountdownProps) => {
  const { label, urgent, phase } = useCountdown(giveaway)

  const isTerminal =
    !isLiveCountdownStatus(giveaway.status) || phase === 'ended'
  const displayLabel = isTerminal
    ? STATUS_LABEL[giveaway.status] ?? 'Ended'
    : label
  const isUrgent = !isTerminal && urgent

  const tone = isTerminal
    ? 'text-grey-500'
    : isUrgent
    ? 'text-warning-600'
    : 'text-grey-600'

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium ${tone} ${
        isUrgent ? 'animate-pulse' : ''
      } ${className}`}
    >
      <span className='w-3.5 h-3.5'>
        <ClockIcon />
      </span>
      {displayLabel}
    </span>
  )
}

export default GiveawayCountdown
