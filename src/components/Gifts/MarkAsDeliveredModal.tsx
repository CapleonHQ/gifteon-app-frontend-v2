'use client'

import CloseIcon from '@/assets/icons/CloseIcon'
import BackLeftIcon from '@/assets/icons/BackLeftIcon'
import ResponsiveModal from '@/components/common/ResponsiveModal'

type MarkAsDeliveredModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  itemName: string
}

const MarkAsDeliveredModal = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
}: MarkAsDeliveredModalProps) => {
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
    </div>
  )

  const body = (
    <div className='flex flex-col items-center text-center gap-3'>
      <div className='inline-flex items-center gap-2 px-3 py-2.5 rounded-[8px] border border-[#F5EFE6] bg-white shadow-[0px_4px_12px_-4px_#1019281A]'>
        <span className='text-xl leading-6 text-grey-900'>{itemName}</span>
      </div>
      <div className='space-y-1 w-full max-w-[380px]'>
        <h3 className='text-2xl font-medium text-blackish'>
          Mark as Delivered
        </h3>
        <p className='text-sm text-grey-600'>
          You are about to mark this item as delivered, <br /> Do you want to
          proceed?
        </p>
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
        Yes, Mark Item
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

export default MarkAsDeliveredModal
