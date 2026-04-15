'use client'

import { useState } from 'react'
import CloseIcon from '@/assets/icons/CloseIcon'
import BackLeftIcon from '@/assets/icons/BackLeftIcon'
import Tick01Icon from '@/assets/icons/Tick01Icon'
import ResponsiveModal from '@/components/common/ResponsiveModal'
import ShakeOnError from '@/components/common/ShakeOnError'
import { useClaimCashGifts } from '@/hooks/tanstack/pages'
import { useSuccessModal } from '@/context/SuccessModalContext'
import { toApiError } from '@/api/errorHelpers'
import { formatCurrency } from '@/lib/utils/currency'

type ClaimableBalanceModalProps = {
  isOpen: boolean
  onClose: () => void
  claimableBalance: number
  currency: string
}

const PAGE_REQUEST_ERROR_MESSAGE = 'Unable to complete the page request.'

const getClaimBalanceErrorMessage = (message?: string): string => {
  if (!message || message.trim() === '') {
    return 'Unable to claim your balance right now. Please try again.'
  }
  return message.trim() === PAGE_REQUEST_ERROR_MESSAGE
    ? 'Unable to claim your balance right now. Please try again.'
    : message
}

const ClaimableBalanceModal = ({
  isOpen,
  onClose,
  claimableBalance,
  currency,
}: ClaimableBalanceModalProps) => {
  const { openSuccess } = useSuccessModal()
  const claimCashGiftsMutation = useClaimCashGifts()
  const [inlineError, setInlineError] = useState('')

  const handleConfirm = async () => {
    setInlineError('')
    try {
      await claimCashGiftsMutation.mutateAsync()
      setInlineError('')
      onClose()
      openSuccess({
        title: 'Success!',
        message: 'Claimable balance has been added to your wallet.',
      })
    } catch (error) {
      const apiError = toApiError(error)
      setInlineError(getClaimBalanceErrorMessage(apiError.message))
    }
  }

  const header = (
    <div className='relative'>
      <button
        type='button'
        onClick={() => {
          setInlineError('')
          onClose()
        }}
        className='absolute -right-5 -top-5 w-9 h-9 rounded-full hidden lg:flex items-center justify-center hover:bg-grey-50'
        aria-label='Close'
      >
        <span className='text-grey-700 w-5 h-5'>
          <CloseIcon />
        </span>
      </button>

      <div className='lg:hidden flex items-center gap-2'>
        <button
          type='button'
          onClick={() => {
            setInlineError('')
            onClose()
          }}
          className='w-6 h-6'
          aria-label='Go back'
        >
          <span className='text-blackish flex'>
            <BackLeftIcon />
          </span>
        </button>
      </div>

      <div className='text-center mt-4 lg:mt-0'>
        <h3 className='text-2xl font-medium text-blackish'>Claim Balance</h3>
        <p className='text-sm text-grey-600 mt-1'>
          Confirm that you want to claim your available cash and custom gifts.
        </p>
      </div>
    </div>
  )

  const body = (
    <div className='space-y-4'>
      {inlineError ? (
        <ShakeOnError active={Boolean(inlineError)}>
          <p className='text-sm text-error-500'>{inlineError}</p>
        </ShakeOnError>
      ) : null}

      <div className='rounded-[12px] border border-[#F5EFE6] bg-white px-3 py-5 text-sm text-grey-600 flex items-center justify-between'>
        <span>Total claim amount:</span>
        <span className='text-grey-900 font-medium'>
          {formatCurrency(claimableBalance, {
            currency,
            maximumFractionDigits: 0,
          })}
        </span>
      </div>

      <div className='rounded-[12px] bg-secondary-50 p-3 text-sm text-secondary-800'>
        <p className='font-medium text-[#143535] text-base mb-3'>
          What happens next?
        </p>
        <ul className='space-y-2'>
          {[
            'All claimable cash and custom gifts will be marked as claimed',
            'Funds will be added to your wallet balance',
            'Dashboard and wallet totals will update automatically',
          ].map((step) => (
            <li key={step} className='flex items-start gap-2'>
              <span className='w-4 h-4 text-[#5B7880]'>
                <Tick01Icon />
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )

  const footer = (
    <div className='flex items-center gap-3'>
      <button
        type='button'
        onClick={() => {
          setInlineError('')
          onClose()
        }}
        disabled={claimCashGiftsMutation.isPending}
        className='flex-1 py-3 rounded-[12px] border border-grey-200 text-grey-700 font-medium bg-grey-50/70 hover:bg-grey-100/70 transition-colors disabled:cursor-not-allowed disabled:opacity-60'
      >
        Cancel
      </button>
      <button
        type='button'
        onClick={handleConfirm}
        disabled={claimCashGiftsMutation.isPending}
        className='flex-1 py-3 rounded-[12px] bg-linear-to-b from-primary-400 from-17% to-primary-600 border border-primary-500 text-white font-medium hover:from-primary-500 hover:to-primary-700 transition-colors disabled:cursor-not-allowed disabled:opacity-60'
      >
        {claimCashGiftsMutation.isPending ? 'Claiming...' : 'Claim Balance'}
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
      desktopMaxWidthClass='max-w-[500px]'
    />
  )
}

export default ClaimableBalanceModal
