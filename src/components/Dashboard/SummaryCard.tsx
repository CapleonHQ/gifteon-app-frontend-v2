'use client'

import { motion } from 'framer-motion'
import useCountUp from '@/hooks/useCountUp'
import type { SummaryCardItem } from '@/types/Stats'

type SummaryCardProps = {
  item: SummaryCardItem
}

const SummaryCard = ({ item }: SummaryCardProps) => {
  const numericValue = Number(item.value)
  const isNumeric = !isNaN(numericValue) && item.value.trim() !== '' && !item.value.includes('₦') && !item.value.includes('$') && !item.value.includes(',')
  const count = useCountUp(numericValue, isNumeric)

  const displayValue = isNumeric ? String(count) : item.value

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className='bg-white border border-grey-100 rounded-2xl p-5 flex flex-col gap-4 hover:shadow-md transition-shadow duration-200'
    >
      <div className='flex items-start justify-between gap-3'>
        <div
          className='w-10 h-10 rounded-xl flex items-center justify-center'
          style={item.iconBg ? { background: item.iconBg } : undefined}
        >
          {item.icon}
        </div>
        {item.actionLabel && (
          <button
            type='button'
            onClick={item.onAction}
            disabled={item.actionDisabled}
            className='px-4 py-1 rounded-lg bg-primary-400 text-white text-sm font-medium hover:bg-primary-500 transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-primary-400'
          >
            {item.actionLabel}
          </button>
        )}
      </div>

      <div className='flex flex-col gap-1'>
        <p className='text-3xl font-bold text-grey-900'>{displayValue}</p>
        <p className='text-sm text-grey-500'>{item.title}</p>
        <span className='text-xs text-grey-400'>{item.meta}</span>
      </div>
    </motion.div>
  )
}

export default SummaryCard
