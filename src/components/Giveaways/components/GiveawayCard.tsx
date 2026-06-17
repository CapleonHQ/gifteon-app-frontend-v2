'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Gift } from 'lucide-react'
import CategoryBadge from '@/components/Giveaways/components/CategoryBadge'
import GiveawayStatusPill from '@/components/Giveaways/components/GiveawayStatusPill'
import GiveawayCountdown from '@/components/Giveaways/components/GiveawayCountdown'
import { CATEGORY_META, formatPrize } from '@/components/Giveaways/utils'
import type { Giveaway } from '@/types/Giveaways'

type GiveawayCardProps = {
  giveaway: Giveaway
  href: string
  ctaLabel: string
  showStatus?: boolean
}

const GiveawayCard = ({
  giveaway,
  href,
  ctaLabel,
  showStatus = true,
}: GiveawayCardProps) => {
  const meta = CATEGORY_META[giveaway.category]
  const max = Math.max(1, giveaway.maxParticipants)
  const progress = 0

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className='flex flex-col rounded-[16px] bg-white border border-grey-50 shadow-[0px_10px_30px_-12px_#1019281F] overflow-hidden'
    >
      <div className={`h-1.5 w-full bg-linear-to-r ${meta.gradient}`} />
      <div className='flex flex-col gap-3 p-4 lg:p-5 flex-1'>
        <div className='flex items-center justify-between gap-2'>
          <CategoryBadge category={giveaway.category} />
          {showStatus ? <GiveawayStatusPill status={giveaway.status} /> : null}
        </div>

        <h3 className='text-base font-medium text-grey-900 line-clamp-2'>
          {giveaway.title}
        </h3>

        <div className='flex items-center gap-1.5 text-sm text-grey-700'>
          <Gift className='h-4 w-4 shrink-0 text-grey-400' />
          <span className='truncate'>{formatPrize(giveaway)}</span>
        </div>

        <div className='flex items-center justify-between gap-3 text-xs text-grey-600 mt-auto pt-1'>
          <span>up to {max.toLocaleString()} entries</span>
          <GiveawayCountdown giveaway={giveaway} />
        </div>

        {progress > 0 ? (
          <div className='h-1.5 w-full rounded-full bg-grey-50 overflow-hidden'>
            <div
              className='h-full rounded-full bg-primary-500'
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
        ) : null}

        <Link
          href={href}
          className={`mt-2 text-center text-sm font-medium py-2.5 rounded-[10px] ${meta.tile} hover:opacity-90 transition-opacity`}
        >
          {ctaLabel}
        </Link>
      </div>
    </motion.div>
  )
}

export default GiveawayCard
