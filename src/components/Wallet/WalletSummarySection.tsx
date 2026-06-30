'use client'

import CashIcon from '@/assets/icons/CashIcon'
import EyeOnIcon from '@/assets/icons/EyeOnIcon'
import WalletSummaryCard from './WalletSummaryCard'
import HiddenBalanceSvg from './HiddenBalanceSvg'
import MoneyReceiveIcon from '@/assets/icons/MoneyReceiveIcon'
import MoneySendIcon from '@/assets/icons/MoneySendIcon'
import { RefreshCw } from 'lucide-react'

type WalletSummarySectionProps = {
  availableBalance: string
  withdrawableBalance: string
  totalReceived: string
  totalWithdrawn: string
  onTopUp: () => void
  onSend: () => void
  onWithdraw: () => void
  hasError?: boolean
  isRetrying?: boolean
  onRetry?: () => void
  isBalanceHidden?: boolean
  onToggleBalanceVisibility?: () => void
}

const WalletSummarySection = ({
  availableBalance,
  withdrawableBalance,
  totalReceived,
  totalWithdrawn,
  onTopUp,
  onSend,
  onWithdraw,
  hasError = false,
  isRetrying = false,
  onRetry,
  isBalanceHidden = false,
  onToggleBalanceVisibility,
}: WalletSummarySectionProps) => {
  const hiddenValueContent = <HiddenBalanceSvg />

  if (hasError) {
    return (
      <div className='grid grid-cols-1 xl:grid-cols-3 gap-4 px-4 lg:px-0'>
        {['Available balance', 'Total received', 'Total withdrawn'].map(
          (title) => (
            <WalletSummaryCard
              key={title}
              title={title}
              value='Unable to load balance'
              subtitle='Tap retry to try again'
              actions={
                <button
                  type='button'
                  onClick={onRetry}
                  disabled={isRetrying}
                  className='inline-flex items-center justify-center rounded-[6px] border border-grey-200 p-1.5 text-grey-700 hover:bg-grey-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors'
                  aria-label='Retry loading balance'
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${
                      isRetrying ? 'animate-spin' : ''
                    }`}
                  />
                </button>
              }
            />
          )
        )}
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 xl:grid-cols-3 gap-4 px-4 lg:px-0'>
      <WalletSummaryCard
        title='Available balance'
        value={availableBalance}
        valueContent={isBalanceHidden ? hiddenValueContent : undefined}
        subtitle='Updated a min ago'
        icon={
          <span className='text-information-500'>
            <CashIcon />
          </span>
        }
        hasBg
        titleAction={
          <button
            type='button'
            onClick={onToggleBalanceVisibility}
            aria-label={isBalanceHidden ? 'Show balance' : 'Hide balance'}
            className='inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium text-grey-500 transition-colors hover:bg-white/80 hover:text-primary-500'
          >
            <span className='h-4 w-4'>
              <EyeOnIcon />
            </span>
            <span>{isBalanceHidden ? 'Show' : 'Hide'}</span>
          </button>
        }
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
              onClick={onSend}
              className='px-4 py-1 rounded-[6px] bg-primary-400 text-white text-sm font-medium hover:bg-primary-500 transition-colors shadow-[0px_5px_13px_-5px_#1019280D]'
            >
              Send
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
        helperContent={
          <div className='mt-3 text-xs text-grey-600'>
            <p>{`Withdrawable Balance: ${
              isBalanceHidden ? '*****' : withdrawableBalance
            }`}</p>
          </div>
        }
      />
      <WalletSummaryCard
        title='Total received'
        value={totalReceived}
        valueContent={isBalanceHidden ? hiddenValueContent : undefined}
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
        valueContent={isBalanceHidden ? hiddenValueContent : undefined}
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
