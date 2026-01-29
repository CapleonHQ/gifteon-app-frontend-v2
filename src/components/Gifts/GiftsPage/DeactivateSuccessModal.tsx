'use client'

import CloseIcon from '@/assets/icons/CloseIcon'
import SuccessConfetti from '@/components/common/SuccessConfetti'

type DeactivateSuccessModalProps = {
  isOpen: boolean
  message: string
  onClose: () => void
}

const DeactivateSuccessModal = ({
  isOpen,
  message,
  onClose,
}: DeactivateSuccessModalProps) => {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center px-4'>
      <div
        className='absolute inset-0 bg-black/40 backdrop-blur-sm'
        onClick={onClose}
      />
      <div className='relative w-full max-w-[520px] rounded-[20px] bg-white shadow-[0px_24px_60px_-20px_#10192852] p-6 sm:py-12 sm:px-10 text-center'>
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
        <div className='flex flex-col items-center'>
          <div className='w-[110px] h-[110px]'>
            <SuccessConfetti />
          </div>
          <div className='space-y-1.5'>
            <h3 className='text-lg sm:text-2xl font-medium text-blackish'>
              Success!
            </h3>
            <p className='text-sm text-grey-600'>{message}</p>
          </div>
          <button
            type='button'
            onClick={onClose}
            className='w-full max-w-[200px] py-3.5 rounded-[12px] mt-3 sm:mt-6 bg-linear-to-r from-primary-400 to-primary-600 border border-primary-500 text-white font-medium hover:from-primary-500 hover:to-primary-700 transition-colors duration-300'
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeactivateSuccessModal
