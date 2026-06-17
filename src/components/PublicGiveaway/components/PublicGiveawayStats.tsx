'use client'

import { CalendarClock, Gift, Shuffle, Trophy, Users } from 'lucide-react'
import GiveawaySummaryCard from '@/components/Giveaways/GiveawaySummaryCard'
import { formatPrize } from '@/components/Giveaways/utils'
import { formatDateTimeShort } from '@/lib/utils/dateTime'
import type { Giveaway } from '@/types/Giveaways'

type PublicGiveawayStatsProps = {
  giveaway: Giveaway
  participantCount: number
}

const PublicGiveawayStats = ({
  giveaway,
  participantCount,
}: PublicGiveawayStatsProps) => {
  const maxParticipants = Math.max(1, giveaway.maxParticipants)
  const participantPct = Math.min(
    100,
    (participantCount / maxParticipants) * 100
  )
  const isRandom = giveaway.winnerSelectionRule.method === 'random'

  return (
    <div className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
      <GiveawaySummaryCard
        icon={Gift}
        label='Prize'
        value={<span className='text-base'>{formatPrize(giveaway)}</span>}
        hint={`${giveaway.winnerCount} winner${
          giveaway.winnerCount > 1 ? 's' : ''
        }`}
      />
      <GiveawaySummaryCard
        icon={Users}
        label='Entries'
        value={`${participantCount.toLocaleString()} / ${giveaway.maxParticipants.toLocaleString()}`}
      >
        <div className='h-1.5 w-full rounded-full bg-grey-50 overflow-hidden'>
          <div
            className='h-full rounded-full bg-primary-500 transition-all'
            style={{ width: `${participantPct}%` }}
          />
        </div>
      </GiveawaySummaryCard>
      <GiveawaySummaryCard
        icon={isRandom ? Shuffle : Trophy}
        label='Winners picked by'
        value={
          <span className='text-base'>
            {isRandom ? 'Random draw' : 'Highest score'}
          </span>
        }
        hint='Every valid entry counts'
      />
      <GiveawaySummaryCard
        icon={CalendarClock}
        label='Ends'
        value={
          <span className='text-sm font-medium'>
            {formatDateTimeShort(giveaway.endsAt)}
          </span>
        }
        hint={`Starts ${formatDateTimeShort(giveaway.startsAt)}`}
      />
    </div>
  )
}

export default PublicGiveawayStats
