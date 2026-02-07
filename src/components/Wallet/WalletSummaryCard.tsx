'use client'

import { type ReactNode } from 'react'

type WalletSummaryCardProps = {
  title: string
  value: string
  subtitle: string
  icon?: ReactNode
  actions?: ReactNode
  hasBg?: boolean
}

const WalletSummaryCard = ({
  title,
  value,
  subtitle,
  icon,
  actions,
  hasBg,
}: WalletSummaryCardProps) => {
  return (
    <div
      className={`${
        hasBg ? 'bg-secondary-50 border border-secondary-100' : 'bg-white'
      } rounded-[12px] shadow-[0px_10px_30px_-12px_#1019281F] p-4 flex flex-col gap-1 justify-between`}
    >
      <div className='flex flex-col gap-3'>
        <div className='flex items-start justify-between gap-2'>
          <p className={`text-sm ${hasBg ? 'text-grey-600' : 'text-grey-400'}`}>
            {title}
          </p>
          {icon && <span className='w-4 h-4'>{icon}</span>}
        </div>
        <p className='text-[28px] leading-8 font-semibold text-blackish'>
          {value}
        </p>
      </div>
      <div className='flex flex-col gap-1'>
        <div className='flex justify-between items-end'>
          <p className='text-xs text-grey-400 leading-[18px]'>{subtitle}</p>
          {actions && <div className='flex items-center gap-1'>{actions}</div>}
        </div>
      </div>
    </div>
  )
}

export default WalletSummaryCard
