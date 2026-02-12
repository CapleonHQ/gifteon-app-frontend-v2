'use client'

import Image from 'next/image'
import CloseIcon from '@/assets/icons/CloseIcon'

type DeactivateModalProps = {
  isOpen: boolean
  count: number
  message: string
  onClose: () => void
  onConfirm: () => void
}

const DeactivateModal = ({
  isOpen,
  count,
  message,
  onClose,
  onConfirm,
}: DeactivateModalProps) => {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center px-4'>
      <div
        className='absolute inset-0 bg-black/40 backdrop-blur-sm'
        onClick={onClose}
      />
      <div className='relative w-full max-w-[520px] rounded-[20px] bg-white shadow-[0px_24px_60px_-20px_#10192852] p-6 sm:py-12 sm:px-10'>
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
        <div className='flex flex-col items-center text-center gap-3'>
          <div className='w-[100px] h-[100px]'>
            <Image
              src='/assets/images/disconnect.gif'
              width={120}
              height={120}
              alt='disconnect'
            />
          </div>
          <div className='space-y-1.5'>
            <h3 className='text-lg md:text-2xl font-medium text-blackish'>
              Deactivate {count === 1 ? 'Page' : 'Pages'}
            </h3>
            <p className='text-sm text-grey-600 leading-5 max-w-[380px] mx-auto'>
              {message}
            </p>
          </div>
          <div className='flex flex-col sm:flex-row gap-2 sm:gap-5 w-full mt-6 max-w-[420px] mx-auto'>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 py-3.5 rounded-[12px] border border-grey-200 text-grey-800 font-medium bg-grey-50/70 hover:bg-grey-100/70 transition-colors duration-300 order-2 sm:order-1'
            >
              Cancel
            </button>
            <button
              type='button'
              onClick={onConfirm}
              className='flex-1 py-3.5 rounded-[12px] bg-linear-to-r border border-error-500 from-[#C94C48] to-[#AB1D18] text-white font-medium hover:from-error-400 hover:to-error-600 transition-colors duration-300 order-1 sm:order-2'
            >
              Deactivate {count === 1 ? 'Page' : 'Pages'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeactivateModal
