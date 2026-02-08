'use client'

import CloseIcon from '@/assets/icons/CloseIcon'
import BackLeftIcon from '@/assets/icons/BackLeftIcon'
import CheckmarkStyledIcon from '@/assets/icons/CheckmarkStyledIcon'
import ResponsiveModal from '@/components/common/ResponsiveModal'
import Tick01Icon from '@/assets/icons/Tick01Icon'

type ClaimGiftModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  giftName: string
  fromName: string
  typeLabel: string
  amountLabel: string
  amountValue: string
  nextSteps: string[]
}

const ClaimGiftModal = ({
  isOpen,
  onClose,
  onConfirm,
  giftName,
  fromName,
  typeLabel,
  amountLabel,
  amountValue,
  nextSteps,
}: ClaimGiftModalProps) => {
  const header = (
    <div className='relative'>
      <button
        type='button'
        onClick={onClose}
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
          onClick={onClose}
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
          Confirm that you want to claim gift from {fromName}
        </p>
      </div>
    </div>
  )

  const body = (
    <div className='space-y-4'>
      <div className='rounded-[12px] border border-[#F5EFE6] bg-white px-3 py-5 text-sm text-grey-600 flex flex-col gap-3'>
        <div className='flex items-center justify-between'>
          <span>Gift:</span>
          <span className='text-grey-900 font-medium'>{giftName}</span>
        </div>
        <div className='flex items-center justify-between'>
          <span>From:</span>
          <span className='text-grey-900 font-medium'>{fromName}</span>
        </div>
        <div className='flex items-center justify-between'>
          <span>Type:</span>
          <span className='text-grey-900 font-medium'>{typeLabel}</span>
        </div>
        <div className='flex items-center justify-between'>
          <span>{amountLabel}:</span>
          <span className='text-grey-900 font-medium'>{amountValue}</span>
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
        onClick={onClose}
        className='flex-1 py-3 rounded-[12px] border border-grey-200 text-grey-700 font-medium bg-grey-50/70 hover:bg-grey-100/70 transition-colors'
      >
        Cancel
      </button>
      <button
        type='button'
        onClick={onConfirm}
        className='flex-1 py-3 rounded-[12px] bg-linear-to-r from-primary-400 to-primary-600 border border-primary-500 text-white font-medium hover:from-primary-500 hover:to-primary-700 transition-colors'
      >
        Claim Gift
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
