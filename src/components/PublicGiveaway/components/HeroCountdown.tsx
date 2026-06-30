'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useCountdown } from '@/components/Giveaways/hooks/useCountdown'
import {
  getCountdownParts,
  isLiveCountdownStatus,
} from '@/components/Giveaways/utils'
import type { Giveaway } from '@/types/Giveaways'

type HeroCountdownProps = {
  giveaway: Pick<Giveaway, 'startsAt' | 'endsAt' | 'status'>
  concluded?: boolean
}

const Unit = ({
  value,
  label,
  reduce,
}: {
  value: number
  label: string
  reduce: boolean | null
}) => {
  const padded = String(value).padStart(2, '0')
  return (
    <div className='flex flex-col items-center'>
      <div className='relative w-12 h-14 sm:w-14 sm:h-16 rounded-[12px] bg-white/80 backdrop-blur shadow-sm border border-white/60 overflow-hidden flex items-center justify-center'>
        {reduce ? (
          <span className='text-2xl sm:text-3xl font-semibold text-grey-900 tabular-nums'>
            {padded}
          </span>
        ) : (
          <AnimatePresence mode='popLayout' initial={false}>
            <motion.span
              key={padded}
              initial={{ y: '-100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className='absolute text-2xl sm:text-3xl font-semibold text-grey-900 tabular-nums'
            >
              {padded}
            </motion.span>
          </AnimatePresence>
        )}
      </div>
      <span className='text-[11px] uppercase tracking-wide text-grey-500 mt-1.5'>
        {label}
      </span>
    </div>
  )
}

const STATUS_PILL: Partial<Record<Giveaway['status'], string>> = {
  closed: 'Entries are closed',
  completed: 'This giveaway has ended',
  disbursed: 'This giveaway has ended',
  cancelled: 'This giveaway was cancelled',
}

const HeroCountdown = ({ giveaway, concluded = false }: HeroCountdownProps) => {
  const reduce = useReducedMotion()
  const { phase, totalSeconds } = useCountdown(giveaway)
  const parts = getCountdownParts(totalSeconds)

  const isLive = isLiveCountdownStatus(giveaway.status)
  if (!isLive || concluded || phase === 'ended') {
    return (
      <span className='inline-flex px-3 py-1.5 rounded-full bg-grey-100 text-grey-600 text-sm font-medium'>
        {STATUS_PILL[giveaway.status] ?? 'This giveaway has ended'}
      </span>
    )
  }

  return (
    <div className='flex flex-col gap-2'>
      <span className='text-xs uppercase tracking-wide text-grey-500'>
        {phase === 'upcoming' ? 'Starts in' : 'Ends in'}
      </span>
      <div className='flex items-center gap-2'>
        <Unit value={parts.days} label='Days' reduce={reduce} />
        <span className='text-2xl text-grey-300'>:</span>
        <Unit value={parts.hours} label='Hrs' reduce={reduce} />
        <span className='text-2xl text-grey-300'>:</span>
        <Unit value={parts.minutes} label='Min' reduce={reduce} />
        <span className='text-2xl text-grey-300'>:</span>
        <Unit value={parts.seconds} label='Sec' reduce={reduce} />
      </div>
    </div>
  )
}

export default HeroCountdown
