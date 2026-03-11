'use client'

import { useMemo, useState } from 'react'
import { format, formatDistanceToNowStrict } from 'date-fns'
import BackLeftIcon from '@/assets/icons/BackLeftIcon'
import ClockIcon from '@/assets/icons/ClockIcon'
import CloseIcon from '@/assets/icons/CloseIcon'
import ResponsiveModal from '@/components/common/ResponsiveModal'
import { formatCurrency } from '@/lib/utils/currency'
import type { WalletWithdrawal } from '@/types/Wallet'

type WalletPendingWithdrawalsModalProps = {
  isOpen: boolean
  onClose: () => void
  withdrawals: WalletWithdrawal[]
  isCancelling?: boolean
  onCancel: (withdrawal: WalletWithdrawal) => void
}

const formatDateTime = (value: string) => {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return 'N/A'

  return format(parsed, 'MMM d, yyyy • h:mm a')
}

const formatRelativeTime = (value: string) => {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return 'Recently'

  return formatDistanceToNowStrict(parsed, { addSuffix: true })
}

const PendingDetailRow = ({
  label,
  value,
  hasBorder = true,
}: {
  label: string
  value: string
  hasBorder?: boolean
}) => (
  <div
    className={`flex items-start justify-between gap-4 py-3 text-sm ${
      hasBorder ? 'border-b border-grey-100' : ''
    }`}
  >
    <span className='text-grey-500'>{label}</span>
    <span className='max-w-[60%] text-right font-medium text-grey-900'>
      {value}
    </span>
  </div>
)

const WalletPendingWithdrawalsModal = ({
  isOpen,
  onClose,
  withdrawals,
  isCancelling = false,
  onCancel,
}: WalletPendingWithdrawalsModalProps) => {
  const [selectedWithdrawalId, setSelectedWithdrawalId] = useState<
    string | null
  >(null)

  const selectedWithdrawal = useMemo(() => {
    return (
      withdrawals.find((item) => item.id === selectedWithdrawalId) ??
      withdrawals[0] ??
      null
    )
  }, [selectedWithdrawalId, withdrawals])

  const header = (
    <div className='relative'>
      <button
        type='button'
        onClick={onClose}
        className='absolute -right-5 -top-5 hidden h-9 w-9 items-center justify-center rounded-full hover:bg-grey-50 lg:flex'
        aria-label='Close'
      >
        <span className='h-5 w-5 text-grey-700'>
          <CloseIcon />
        </span>
      </button>

      <div className='flex items-center gap-2 lg:hidden'>
        <button
          type='button'
          onClick={onClose}
          className='h-6 w-6'
          aria-label='Go back'
        >
          <span className='flex text-blackish'>
            <BackLeftIcon />
          </span>
        </button>
      </div>
    </div>
  )

  const body = selectedWithdrawal ? (
    <div className='flex flex-col gap-5'>
      <div className='px-1 pb-1'>
        <div className='flex h-18 w-18 items-center justify-center rounded-[24px] bg-primary-50 text-primary-500 shadow-[0px_16px_28px_-20px_#1818AB]'>
          <div className='flex h-12 w-12 items-center justify-center rounded-[18px] bg-white shadow-[0px_10px_22px_-18px_#1818AB73]'>
            <span className='h-7 w-7'>
              <ClockIcon />
            </span>
          </div>
        </div>
        <p className='mt-4 text-[32px] font-semibold leading-[36px] text-blackish'>
          Withdrawal in review
        </p>
        <div className='mt-2 inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1.5 text-sm font-medium text-primary-500'>
          <span className='h-1.5 w-1.5 rounded-full bg-primary-400' />
          Review checks in progress
        </div>
        <p className='mt-3 max-w-[440px] text-sm leading-6 text-grey-500'>
          Your payout request is being reviewed before processing. You can
          cancel it while it is still pending.
        </p>
      </div>

      {withdrawals.length > 1 ? (
        <div className='flex gap-3 overflow-x-auto pb-1'>
          {withdrawals.map((withdrawal) => {
            const isSelected = withdrawal.id === selectedWithdrawal.id

            return (
              <button
                key={withdrawal.id}
                type='button'
                onClick={() => setSelectedWithdrawalId(withdrawal.id)}
                className={`min-w-[220px] rounded-[16px] border px-4 py-3 text-left transition-colors ${
                  isSelected
                    ? 'border-primary-300 bg-primary-50'
                    : 'border-grey-100 bg-white hover:border-grey-200'
                }`}
              >
                <p className='text-sm font-semibold text-blackish'>
                  {formatCurrency(withdrawal.amount, {
                    currency: withdrawal.currency,
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className='mt-1 text-xs text-grey-500'>
                  {withdrawal.bankName} • {withdrawal.accountNumber}
                </p>
                <p className='mt-2 text-[11px] text-grey-400'>
                  {formatRelativeTime(withdrawal.createdAt)}
                </p>
              </button>
            )
          })}
        </div>
      ) : null}

      <div
        key={selectedWithdrawal.id}
        className='rounded-[20px] border border-grey-100 bg-white px-5 py-4 shadow-[0px_18px_32px_-26px_#10192826]'
      >
        <div className='mb-4 flex items-start justify-between gap-4'>
          <p className='text-sm font-semibold text-blackish'>
            Withdrawal details
          </p>
          <span className='rounded-full bg-warning-50 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-warning-700'>
            Pending
          </span>
        </div>

        <div className='rounded-[18px] bg-grey-50/30 px-4 lg:px-5'>
          <PendingDetailRow
            label='Bank'
            value={`${selectedWithdrawal.bankName} • ${selectedWithdrawal.accountNumber}`}
          />
          <PendingDetailRow
            label='Amount'
            value={formatCurrency(selectedWithdrawal.amount, {
              currency: selectedWithdrawal.currency,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          />
          <PendingDetailRow
            label='Requested on'
            value={formatDateTime(selectedWithdrawal.createdAt)}
          />
          <PendingDetailRow
            label='Time left'
            value={formatRelativeTime(selectedWithdrawal.scheduledAt)}
          />
          <PendingDetailRow
            label='Reference'
            value={selectedWithdrawal.reference}
            hasBorder={false}
          />
        </div>

        <div className='mt-5 flex flex-col gap-3 border-t border-grey-100 pt-5 sm:flex-row sm:items-center sm:justify-between'>
          <p className='text-sm text-grey-500'>Need to stop this payout?</p>
          <button
            type='button'
            onClick={() => onCancel(selectedWithdrawal)}
            disabled={isCancelling}
            className='inline-flex items-center justify-center rounded-[10px] px-0 py-1 text-sm font-medium text-error-500 transition-colors hover:text-error-600 disabled:cursor-not-allowed disabled:opacity-60'
          >
            {isCancelling ? 'Cancelling request...' : 'Cancel request'}
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className='rounded-[22px] border border-grey-100 bg-grey-50/40 p-6 text-center'>
      <p className='text-base font-medium text-blackish'>
        No pending withdrawals
      </p>
      <p className='mt-2 text-sm text-grey-600'>
        Any payout that enters review will show up here.
      </p>
    </div>
  )

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      header={header}
      body={body}
      desktopMaxWidthClass='max-w-[640px]'
    />
  )
}

export default WalletPendingWithdrawalsModal
