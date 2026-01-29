'use client'

import EyeOnIcon from '@/assets/icons/EyeOnIcon'
import EditIcon from '@/assets/icons/EditIcon'
import ShareIcon from '@/assets/icons/ShareIcon'
import CancelHalfCircle from '@/assets/icons/CancelHalfCircle'

type GiftsMobileActionButtonsProps = {
  onDeactivate: () => void
}

const GiftsMobileActionButtons = ({
  onDeactivate,
}: GiftsMobileActionButtonsProps) => {
  return (
    <div className='mt-3 grid grid-cols-1 gap-3'>
      <button
        className='flex items-center justify-center gap-2 w-full py-3 rounded-[8px] bg-primary-400 transition-colors hover:bg-primary-500 duration-300 text-white text-sm font-medium'
        onClick={(event) => event.stopPropagation()}
      >
        <span className='w-3.5 h-3.5 text-white'>
          <EyeOnIcon />
        </span>
        <span>View</span>
      </button>
      <button
        className='flex items-center justify-center gap-2 w-full py-3 rounded-[8px] border border-grey-200 bg-grey-50/70 transition-colors hover:bg-grey-100/70 duration-300 text-grey-800 text-sm font-medium'
        onClick={(event) => event.stopPropagation()}
      >
        <span className='w-3.5 h-3.5 text-secondary-800'>
          <EditIcon />
        </span>{' '}
        <span>Edit</span>
      </button>
      <button
        className='flex items-center justify-center gap-2 w-full py-3 rounded-[8px] border border-grey-200 bg-grey-50/70 transition-colors hover:bg-grey-100/70 duration-300 text-grey-800 text-sm font-medium'
        onClick={(event) => event.stopPropagation()}
      >
        <span className='w-3.5 h-3.5 text-secondary-800'>
          <ShareIcon />
        </span>{' '}
        <span>Share</span>
      </button>
      <button
        className='flex items-center justify-center gap-2 w-full py-3 rounded-[8px] border border-grey-200 bg-grey-50/70 transition-colors hover:bg-grey-100/70 duration-300 text-grey-800 text-sm font-medium'
        onClick={(event) => {
          event.stopPropagation()
          onDeactivate()
        }}
      >
        <span className='w-3.5 h-3.5 text-error-400'>
          <CancelHalfCircle />
        </span>{' '}
        <span>Deactivate</span>
      </button>
    </div>
  )
}

export default GiftsMobileActionButtons
