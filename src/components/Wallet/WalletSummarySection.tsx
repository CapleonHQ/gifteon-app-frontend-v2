'use client'

import CashIcon from '@/assets/icons/CashIcon'
import WalletSummaryCard from './WalletSummaryCard'
import MoneyReceiveIcon from '@/assets/icons/MoneyReceiveIcon'
import MoneySendIcon from '@/assets/icons/MoneySendIcon'

type WalletSummarySectionProps = {
  availableBalance: string
  totalReceived: string
  totalWithdrawn: string
  onTopUp: () => void
  onWithdraw: () => void
}

const WalletSummarySection = ({
  availableBalance,
  totalReceived,
  totalWithdrawn,
  onTopUp,
  onWithdraw,
}: WalletSummarySectionProps) => {
  return (
    <div className='grid grid-cols-1 xl:grid-cols-3 gap-4 px-4 lg:px-0'>
      <WalletSummaryCard
        title='Available balance'
        value={availableBalance}
        subtitle='Updated a min ago'
        icon={
          <span className='text-information-500'>
            <CashIcon />
          </span>
        }
        hasBg
        actions={
          <>
            <button
              type='button'
              onClick={onTopUp}
              className='px-4 py-1 text-sm font-medium text-primary-400 underline leading-[18px] hover:text-primary-600 transition-colors'
            >
              Top Up
            </button>
            <button
              type='button'
              onClick={onWithdraw}
              className='px-4 py-1 rounded-[6px] bg-primary-400 text-white text-sm font-medium hover:bg-primary-500 transition-colors shadow-[0px_5px_13px_-5px_#1019280D]'
            >
              Withdraw
            </button>
          </>
        }
      />
      <WalletSummaryCard
        title='Total received'
        value={totalReceived}
        subtitle='Updated today'
        icon={
          <span className='text-success-500'>
            <MoneyReceiveIcon />
          </span>
        }
      />
      <WalletSummaryCard
        title='Total withdrawn'
        value={totalWithdrawn}
        subtitle='Updated today'
        icon={
          <span className='text-error-400'>
            <MoneySendIcon />
          </span>
        }
      />
    </div>
  )
}

export default WalletSummarySection
