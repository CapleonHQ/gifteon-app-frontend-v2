'use client'

import { X } from 'lucide-react'

type ComingSoonModalProps = {
  isOpen: boolean
  onClose: () => void
}

export default function ComingSoonModal({
  isOpen,
  onClose,
}: ComingSoonModalProps) {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-70 flex items-center justify-center px-4'>
      <div
        className='absolute inset-0 bg-black/40 backdrop-blur-sm'
        onClick={onClose}
      />
      <div className='relative w-full max-w-[400px] rounded-[20px] bg-white shadow-[0px_24px_60px_-20px_#10192852] px-8 py-10 flex flex-col items-center text-center gap-4'>
        <button
          type='button'
          onClick={onClose}
          className='absolute right-4 top-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-grey-50 transition-colors'
          aria-label='Close'
        >
          <X className='w-4 h-4 text-grey-500' />
        </button>

        <div className='flex h-14 w-14 items-center justify-center rounded-full bg-secondary-50 text-2xl'>
          🎁
        </div>

        <div className='space-y-1.5'>
          <h3 className='text-xl font-semibold text-grey-900'>Coming Soon</h3>
          <p className='text-sm text-grey-500 leading-relaxed'>
            Custom gifts are on the way. We&apos;re working on something special
            — check back soon!
          </p>
        </div>

        <button
          type='button'
          onClick={onClose}
          className='mt-2 w-full h-11 rounded-[12px] bg-linear-to-b from-primary-400 to-primary-600 text-sm font-medium text-white hover:from-primary-500 hover:to-primary-700 transition-colors duration-300'
        >
          Got it
        </button>
      </div>
    </div>
  )
}
