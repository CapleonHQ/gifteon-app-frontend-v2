'use client'

import { useCountdown } from '@/components/Giveaways/hooks/useCountdown'
import ClockIcon from '@/assets/icons/ClockIcon'
import type { Giveaway } from '@/types/Giveaways'

type GiveawayCountdownProps = {
  giveaway: Pick<Giveaway, 'startsAt' | 'endsAt'>
  className?: string
}

const GiveawayCountdown = ({ giveaway, className = '' }: GiveawayCountdownProps) => {
  const { label, urgent, phase } = useCountdown(giveaway)

  const tone =
    phase === 'ended'
      ? 'text-grey-500'
      : urgent
        ? 'text-warning-600'
        : 'text-grey-600'

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium ${tone} ${
        urgent ? 'animate-pulse' : ''
      } ${className}`}
    >
      <span className='w-3.5 h-3.5'>
        <ClockIcon />
      </span>
      {label}
    </span>
  )
}

export default GiveawayCountdown
