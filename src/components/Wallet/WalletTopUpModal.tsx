'use client'

import { useState } from 'react'
import CloseIcon from '@/assets/icons/CloseIcon'
import BackLeftIcon from '@/assets/icons/BackLeftIcon'
import { Copy } from 'lucide-react'

type WalletTopUpModalProps = {
  isOpen: boolean
  onClose: () => void
  bankName: string
  accountName: string
  accountNumber: string
}

const WalletTopUpModal = ({
  isOpen,
  onClose,
  bankName,
  accountName,
  accountNumber,
}: WalletTopUpModalProps) => {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(accountNumber)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    } catch (error) {
      setCopied(false)
    }
  }

  const detailsCard = (
    <div className='bg-white rounded-[12px] border border-grey-50 px-3 py-5 text-base text-grey-700 space-y-2.5 shadow-[0px_10px_18px_-2px_#10192812]'>
      <div className='flex items-center justify-between pb-2.5 border-b border-grey-50'>
        <span>Bank Name:</span>
        <span className='font-medium text-grey-900'>{bankName}</span>
      </div>
      <div className='flex items-center justify-between pb-2.5 border-b border-grey-50'>
        <span>Account Name:</span>
        <span className='font-medium text-grey-900'>{accountName}</span>
      </div>
      <div className='flex items-center justify-between'>
        <span>Account Number:</span>
        <span className='font-medium text-grey-900 flex items-center gap-2'>
          {accountNumber}
          <button
            type='button'
            onClick={handleCopy}
            className='text-primary-400 hover:text-primary-600 transition-colors'
            aria-label='Copy account number'
          >
            <Copy className='w-4 h-4' />
          </button>
        </span>
      </div>
      {copied && <p className='text-xs text-success-500'>Copied!</p>}
    </div>
  )

  const body = (
    <div className='space-y-3'>
      <div>
        <p className='text-sm font-medium text-grey-700 mb-1'>
          YOUR VIRTUAL ACCOUNT DETAILS
        </p>
        {detailsCard}
      </div>
      <div className='bg-secondary-50 rounded-[12px] p-3 text-sm text-[#143535]'>
        Once you make a transfer to this account, your wallet will be
        automatically credited within minutes.
      </div>
    </div>
  )

  return (
    <div className='fixed inset-0 z-30 lg:z-50'>
      <div
        className='absolute inset-0 bg-black/40 backdrop-blur-sm hidden lg:block'
        onClick={onClose}
      />

      <div className='hidden lg:flex items-center justify-center h-full px-4'>
        <div className='relative w-full max-w-[500px] max-h-[90vh] overflow-hidden rounded-[20px] bg-white shadow-[0px_24px_60px_-20px_#10192852] flex flex-col gap-3'>
          <div className='px-6 sm:px-10 pt-12 pb-3 bg-white sticky top-0 z-10 text-center'>
            <button
              type='button'
              onClick={onClose}
              className='absolute right-5 top-5 w-9 h-9 rounded-full flex items-center justify-center hover:bg-grey-50'
              aria-label='Close'
            >
              <span className='text-grey-700 w-6 h-6'>
                <CloseIcon />
              </span>
            </button>
            <h3 className='text-2xl font-medium text-blackish'>Top Up</h3>
            <p className='text-sm text-grey-600 max-w-[356px] mx-auto mt-1'>
              Add funds to your wallet easily using your personalized virtual
              account details.
            </p>
          </div>
          <div className='px-6 sm:px-10 pb-12 overflow-y-auto flex-1 min-h-0'>
            {body}
          </div>
        </div>
      </div>

      <div className='lg:hidden fixed inset-x-0 bottom-0 top-[72.5px] bg-white overflow-y-auto'>
        <div className='pt-8 pb-4 px-4'>
          <div className='flex flex-col gap-3'>
            <button
              type='button'
              onClick={onClose}
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
                Add funds to your wallet easily using your personalized virtual
                account details.
              </p>
            </div>

            <div>{body}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WalletTopUpModal
