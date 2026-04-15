'use client'

import { useMemo, useState } from 'react'
import CloseIcon from '@/assets/icons/CloseIcon'
import BackLeftIcon from '@/assets/icons/BackLeftIcon'
import ResponsiveModal from '@/components/common/ResponsiveModal'
import Tick01Icon from '@/assets/icons/Tick01Icon'
import ShakeOnError from '@/components/common/ShakeOnError'
import { useClaimGiftContribution } from '@/hooks/tanstack/pages'
import { useSuccessModal } from '@/context/SuccessModalContext'
import { toApiError } from '@/api/errorHelpers'
import type { GiftItem } from '@/types/Gifts/'

type ClaimGiftModalProps = {
  isOpen: boolean
  onClose: () => void
  item: GiftItem | null
}

const PAGE_REQUEST_ERROR_MESSAGE = 'Unable to complete the page request.'

const getClaimGiftErrorMessage = (message?: string): string => {
  if (!message || message.trim() === '') {
    return 'Unable to claim this gift right now. Please try again.'
  }
  return message.trim() === PAGE_REQUEST_ERROR_MESSAGE
    ? 'Unable to claim this gift right now. Please try again.'
    : message
}

const ClaimGiftModal = ({ isOpen, onClose, item }: ClaimGiftModalProps) => {
  const { openSuccess } = useSuccessModal()
  const claimGiftMutation = useClaimGiftContribution()
  const [errorState, setErrorState] = useState<{
    message: string
    contributionId: string
  } | null>(null)
  const isSubmitting = claimGiftMutation.isPending
  const isCashClaim = useMemo(() => {
    if (!item) return false
    const normalizedType = item.type.toLowerCase()
    return normalizedType === 'cash' || normalizedType === 'custom'
  }, [item])

  const nextSteps = useMemo(() => {
    if (isCashClaim) {
      return [
        'Gift will be marked as Claimed',
        'Funds will be added to your wallet',
        'A thank you message will be sent to the sender',
      ]
    }
    return [
      'Gift will be marked as Claimed',
      'Gift claim status will update on this page',
      'A thank you message will be sent to the sender',
    ]
  }, [isCashClaim])

  const handleConfirm = async () => {
    if (!item) return
    setErrorState(null)
    try {
      await claimGiftMutation.mutateAsync({ contributionId: item.id })
      openSuccess({
        title: 'Success!',
        message: isCashClaim
          ? `This cash has been deposited into your wallet, you have a total of ${item.worth} in your wallet.`
          : 'This gift has been successfully claimed.',
      })
      onClose()
    } catch (error) {
      const apiError = toApiError(error)
      setErrorState({
        message: getClaimGiftErrorMessage(apiError.message),
        contributionId: item.id,
      })
    }
  }

  if (!item) return null
  const inlineError =
    errorState && errorState.contributionId === item.id
      ? errorState.message
      : ''

  const header = (
    <div className='relative'>
      <button
        type='button'
        onClick={() => {
          if (isSubmitting) return
          setErrorState(null)
          onClose()
        }}
        disabled={isSubmitting}
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
            if (isSubmitting) return
            setErrorState(null)
            onClose()
          }}
          disabled={isSubmitting}
          className='w-6 h-6'
          aria-label='Go back'
        >
          <span className='text-blackish flex'>
            <BackLeftIcon />
          </span>
        </button>
      </div>

      <div className='text-center mt-4 lg:mt-0'>
        <h3 className='text-2xl font-medium text-blackish'>Claim Gift 🎁</h3>
        <p className='text-sm text-grey-600 mt-1'>
          Confirm that you want to claim gift from {item.fromName || 'Sender'}
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

      <div className='rounded-[12px] border border-[#F5EFE6] bg-white px-3 py-5 text-sm text-grey-600 flex flex-col gap-3'>
        <div className='flex items-center justify-between'>
          <span>Gift:</span>
          <span className='text-grey-900 font-medium'>{item.name}</span>
        </div>
        <div className='flex items-center justify-between'>
          <span>From:</span>
          <span className='text-grey-900 font-medium'>
            {item.fromName || 'Sender'}
          </span>
        </div>
        <div className='flex items-center justify-between'>
          <span>Type:</span>
          <span className='text-grey-900 font-medium capitalize'>
            {item.type}
          </span>
        </div>
        <div className='flex items-center justify-between'>
          <span>{isCashClaim ? 'Amount' : 'Worth'}:</span>
          <span className='text-grey-900 font-medium'>{item.worth}</span>
        </div>
      </div>

      <div className='rounded-[12px] bg-secondary-50 p-3 text-sm text-secondary-800'>
        <p className='font-medium text-[#143535] text-base mb-3'>
          What happens next?
        </p>
        <ul className='space-y-2'>
          {nextSteps.map((step) => (
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
          setErrorState(null)
          onClose()
        }}
        disabled={isSubmitting}
        className='flex-1 py-3 rounded-[12px] border border-grey-200 text-grey-700 font-medium bg-grey-50/70 hover:bg-grey-100/70 transition-colors disabled:opacity-60 disabled:cursor-not-allowed'
      >
        Cancel
      </button>
      <button
        type='button'
        onClick={handleConfirm}
        disabled={isSubmitting}
        className='flex-1 py-3 rounded-[12px] bg-linear-to-b from-primary-400 from-17% to-primary-600 border border-primary-500 text-white font-medium hover:from-primary-500 hover:to-primary-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed'
      >
        {isSubmitting ? 'Claiming...' : 'Claim Gift'}
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

export default ClaimGiftModal
