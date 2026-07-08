'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import CloseIcon from '@/assets/icons/CloseIcon'
import SuccessConfetti from '@/components/common/SuccessConfetti'

type ElectricityTokenSuccessModalProps = {
  isOpen: boolean
  token: string
  onClose: () => void
}

const ElectricityTokenSuccessModal = ({
  isOpen,
  token,
  onClose,
}: ElectricityTokenSuccessModalProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopyToken = async () => {
    if (!navigator?.clipboard) return
    try {
      await navigator.clipboard.writeText(token)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {
      setCopied(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center px-4'>
      <div
        className='absolute inset-0 bg-black/40 backdrop-blur-sm'
        onClick={onClose}
      />
      <div className='relative w-full max-w-[520px] max-h-[90vh] overflow-hidden rounded-[20px] bg-white shadow-[0px_24px_60px_-20px_#10192852] flex flex-col'>
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
        <div className='px-6 sm:px-10 py-10 text-center overflow-y-auto flex-1 min-h-0'>
          <div className='flex flex-col items-center'>
            <div className='w-[110px] h-[110px]'>
              <SuccessConfetti />
            </div>
            <div className='space-y-1.5 w-full'>
              <h3 className='text-lg sm:text-2xl font-medium text-blackish'>
                Payment successful
              </h3>
              <p className='text-sm text-grey-600'>
                Your electricity token is ready.
              </p>
              <div className='mt-4 rounded-[12px] border border-success-100 bg-success-50/40 px-3 py-3 text-left'>
                <div className='flex items-center justify-between gap-2'>
                  <span className='text-sm text-grey-700'>Token</span>
                  <button
                    type='button'
                    onClick={handleCopyToken}
                    className='h-7 w-7 rounded-md border border-grey-200 text-grey-700 hover:bg-grey-50 transition-colors inline-flex items-center justify-center'
                    aria-label={copied ? 'Token copied' : 'Copy token'}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
                <p className='mt-2 text-grey-900 font-medium break-all'>
                  {token}
                </p>
              </div>
            </div>
            <button
              type='button'
              onClick={onClose}
              className='w-full max-w-[200px] py-3.5 rounded-[12px] mt-6 bg-linear-to-b from-[17.5%] from-primary-400 to-primary-600 border border-primary-500 text-white font-medium hover:from-primary-500 hover:to-primary-700 transition-colors duration-300'
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ElectricityTokenSuccessModal
