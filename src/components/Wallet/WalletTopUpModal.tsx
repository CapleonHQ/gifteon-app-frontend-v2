'use client'

import { useState } from 'react'
import CloseIcon from '@/assets/icons/CloseIcon'
import BackLeftIcon from '@/assets/icons/BackLeftIcon'
import { Loader2 } from 'lucide-react'

type WalletTopUpModalProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (amount: number) => void
  isSubmitting?: boolean
  errorMessage?: string
}

const WalletTopUpModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  errorMessage,
}: WalletTopUpModalProps) => {
  const [amountInput, setAmountInput] = useState('')

  if (!isOpen) return null

  const formattedAmount = amountInput
    ? Number(amountInput.replace(/\D/g, '') || '0').toLocaleString('en-US')
    : ''
  const amountValue = Number(amountInput.replace(/\D/g, ''))
  const isDisabled = amountValue <= 0 || isSubmitting

  const handleClose = () => {
    setAmountInput('')
    onClose()
  }

  const handleSubmit = () => {
    if (isDisabled) return
    onSubmit(amountValue)
  }

  const actions = (
    <div className='flex items-center gap-3'>
      <button
        type='button'
        onClick={handleClose}
        className='flex-1 py-2.5 rounded-[12px] border border-grey-200 text-grey-700 font-medium bg-grey-50/70 hover:bg-grey-100/70 transition-colors'
      >
        Cancel
      </button>
      <button
        type='button'
        onClick={handleSubmit}
        disabled={isDisabled}
        className='flex-1 py-2.5 rounded-[12px] font-medium text-white bg-primary-400 hover:bg-primary-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2'
      >
        {isSubmitting ? (
          <>
            <Loader2 className='w-4 h-4 animate-spin' />
            Initializing...
          </>
        ) : (
          'Continue'
        )}
      </button>
    </div>
  )

  const body = (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <label className='text-sm text-grey-700'>Amount</label>
        <input
          type='text'
          value={formattedAmount}
          onChange={(event) => setAmountInput(event.target.value)}
          placeholder='0'
          inputMode='numeric'
          className='w-full px-3 py-3.5 border border-grey-100 rounded-lg outline-hidden focus:outline-hidden text-sm text-blackish font-medium focus:border-primary-500'
        />
      </div>
      {errorMessage ? (
        <p className='text-sm text-error-500'>{errorMessage}</p>
      ) : null}
    </div>
  )

  return (
    <div className='fixed inset-0 z-30 lg:z-50'>
      <div
        className='absolute inset-0 bg-black/40 backdrop-blur-sm hidden lg:block'
        onClick={handleClose}
      />

      <div className='hidden lg:flex items-center justify-center h-full px-4'>
        <div className='relative w-full max-w-[500px] max-h-[90vh] overflow-hidden rounded-[20px] bg-white shadow-[0px_24px_60px_-20px_#10192852] flex flex-col gap-3'>
          <div className='px-6 sm:px-10 pt-12 pb-3 bg-white sticky top-0 z-10 text-center'>
            <button
              type='button'
              onClick={handleClose}
              className='absolute right-5 top-5 w-9 h-9 rounded-full flex items-center justify-center hover:bg-grey-50'
              aria-label='Close'
            >
              <span className='text-grey-700 w-6 h-6'>
                <CloseIcon />
              </span>
            </button>
            <h3 className='text-2xl font-medium text-blackish'>Top Up</h3>
            <p className='text-sm text-grey-600 max-w-[356px] mx-auto mt-1'>
              Enter amount to initialize your top-up payment.
            </p>
          </div>
          <div className='px-6 sm:px-10 pb-12 overflow-y-auto flex-1 min-h-0'>
            <div className='space-y-4'>
              {body}
              {actions}
            </div>
          </div>
        </div>
      </div>

      <div className='lg:hidden fixed inset-x-0 bottom-0 top-[72.5px] bg-white'>
        <div className='flex flex-col h-full'>
          <div className='pt-8 pb-4 px-4'>
            <div className='flex flex-col gap-3'>
              <button
                type='button'
                onClick={handleClose}
                className='w-6 h-6'
                aria-label='Go back'
              >
                <span className='text-blackish hover:text-black/70 flex'>
                  <BackLeftIcon />
                </span>
              </button>
              <div className='flex flex-col items-center justify-center gap-1'>
                <span className='text-2xl font-medium text-blackish'>Top Up</span>
                <p className='text-sm text-grey-600 text-center'>
                  Enter amount to initialize your top-up payment.
                </p>
              </div>
            </div>
          </div>
          <div className='flex-1 overflow-y-auto px-4 pb-4'>{body}</div>
          <div className='px-4 py-3 shadow-[0px_-10px_18px_5px_#4040401A] bg-white'>
            {actions}
          </div>
        </div>
      </div>
    </div>
  )
}

export default WalletTopUpModal
