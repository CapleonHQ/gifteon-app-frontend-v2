'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Trophy } from 'lucide-react'
import { getInitials } from '@/components/Giveaways/utils'
import type { LeaderboardEntry } from '@/types/Giveaways'

type LeaderboardListProps = {
  entries: LeaderboardEntry[]
  showScore?: boolean
  currentUserTag?: string | null
  animate?: boolean
}

const rankBadge = (rank: number): string => {
  if (rank === 1) return 'bg-warning-50 text-warning-700'
  if (rank === 2) return 'bg-grey-100 text-grey-700'
  if (rank === 3) return 'bg-secondary-100 text-secondary-700'
  return 'bg-grey-50 text-grey-600'
}

const LeaderboardList = ({
  entries,
  showScore = true,
  currentUserTag,
  animate = true,
}: LeaderboardListProps) => {
  return (
    <ul className='flex flex-col gap-2'>
      {entries.map((entry, index) => {
        const isYou =
          currentUserTag &&
          entry.userGiftseonTag.replace(/^@/, '') ===
            currentUserTag.replace(/^@/, '')
        return (
          <motion.li
            key={`${entry.userGiftseonTag}-${entry.rank}`}
            initial={animate ? { opacity: 0, y: 8 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: animate ? index * 0.04 : 0, duration: 0.25 }}
            className={`flex items-center gap-3 rounded-[12px] px-3 py-2.5 border ${
              isYou
                ? 'border-primary-200 bg-primary-50/60'
                : 'border-grey-50 bg-white'
            }`}
          >
            <span
              className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-xs font-semibold ${rankBadge(
                entry.rank
              )}`}
            >
              {entry.rank}
            </span>

            <div className='w-8 h-8 shrink-0 rounded-full overflow-hidden bg-grey-100 flex items-center justify-center'>
              {entry.userProfilePicture ? (
                <Image
                  src={entry.userProfilePicture}
                  alt={entry.userGiftseonTag}
                  width={32}
                  height={32}
                  className='w-full h-full object-cover'
                />
              ) : (
                <span className='text-[11px] font-semibold text-grey-600'>
                  {getInitials(entry.userGiftseonTag)}
                </span>
              )}
            </div>

            <div className='flex-1 min-w-0'>
              <p className='text-sm font-medium text-grey-900 truncate'>
                @{entry.userGiftseonTag.replace(/^@/, '')}
                {isYou ? (
                  <span className='ml-1.5 text-[11px] text-primary-600'>(You)</span>
                ) : null}
              </p>
            </div>

            {entry.isWinner ? (
              <span className='shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-success-50 text-success-600'>
                <Trophy className='h-3 w-3' />
                Winner
              </span>
            ) : null}

            {showScore ? (
              <span className='shrink-0 text-sm font-semibold text-grey-700 tabular-nums'>
                {entry.score}
              </span>
            ) : null}
          </motion.li>
        )
      })}
    </ul>
  )
}

export default LeaderboardList
