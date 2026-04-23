'use client'

import AlertIcon from '@/assets/icons/AlertIcon'
import BackLeftIcon from '@/assets/icons/BackLeftIcon'
import CloseIcon from '@/assets/icons/CloseIcon'
import ResponsiveModal from '@/components/common/ResponsiveModal'
import { formatCurrency } from '@/lib/utils/currency'
import type { WalletWithdrawal } from '@/types/Wallet'

type WalletCancelWithdrawalConfirmModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  withdrawal: WalletWithdrawal | null
  isSubmitting?: boolean
}

const WalletCancelWithdrawalConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  withdrawal,
  isSubmitting = false,
}: WalletCancelWithdrawalConfirmModalProps) => {
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

  const body = withdrawal ? (
    <div className='flex flex-col gap-5 text-center'>
      <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-error-50 text-error-500 shadow-[0px_18px_28px_-24px_#D92D20]'>
        <span className='h-6 w-6'>
          <AlertIcon />
        </span>
      </div>

      <div className='space-y-2'>
        <h3 className='text-[28px] font-semibold leading-8 text-blackish'>
          Cancel this withdrawal request?
        </h3>
        <p className='mx-auto max-w-[380px] text-sm leading-6 text-grey-500'>
          This will stop the payout review and return the amount to your wallet
          balance.
        </p>
      </div>

      <div className='rounded-[18px] border border-grey-100 bg-grey-50/40 px-4 py-4 text-left'>
        <div className='flex items-center justify-between gap-3 border-b border-grey-100 py-3 text-sm pt-0'>
          <span className='text-grey-500'>Amount</span>
          <span className='font-medium text-grey-900'>
            {formatCurrency(withdrawal.amount, {
              currency: withdrawal.currency,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
        <div className='flex items-center justify-between gap-3 border-b border-grey-100 py-3 text-sm'>
          <span className='text-grey-500'>Bank</span>
          <span className='font-medium text-right text-grey-900'>
            {withdrawal.bankName} • {withdrawal.accountNumber}
          </span>
        </div>
        <div className='flex items-center justify-between gap-3 pb-0 pt-3 text-sm'>
          <span className='text-grey-500'>Reference</span>
          <span className='font-medium text-right text-grey-900'>
            {withdrawal.reference}
          </span>
        </div>
      </div>
    </div>
  ) : null

  const footer = (
    <div className='flex items-center gap-3'>
      <button
        type='button'
        onClick={onClose}
        disabled={isSubmitting}
        className='flex-1 rounded-[12px] border border-grey-200 bg-grey-50/70 py-3 font-medium text-grey-700 transition-colors hover:bg-grey-100/70 disabled:cursor-not-allowed disabled:opacity-60'
      >
        Keep request
      </button>
      <button
        type='button'
        onClick={() => void onConfirm()}
        disabled={isSubmitting || !withdrawal}
        className='flex-1 rounded-[12px] bg-error-500 py-3 font-medium text-white transition-colors hover:bg-error-600 disabled:cursor-not-allowed disabled:opacity-60'
      >
        {isSubmitting ? 'Cancelling...' : 'Yes, cancel request'}
      </button>
    </div>
  )

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      header={header}
      body={body}
      footer={footer}
      desktopMaxWidthClass='max-w-[520px]'
    />
  )
}

export default WalletCancelWithdrawalConfirmModal
