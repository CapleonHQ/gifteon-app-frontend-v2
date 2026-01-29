'use client'

import CancelHalfCircle from '@/assets/icons/CancelHalfCircle'

type GiftsMobileSelectionBarProps = {
  count: number
  onClear: () => void
  onDeactivate: () => void
}

const GiftsMobileSelectionBar = ({
  count,
  onClear,
  onDeactivate,
}: GiftsMobileSelectionBarProps) => {
  return (
    <div className='flex items-center justify-between px-3 py-2 rounded-[10px] border border-grey-100 bg-white mb-2'>
      <span className='text-sm text-grey-700 font-medium'>{count} selected</span>
      <div className='flex items-center gap-2'>
        <button
          type='button'
          onClick={onClear}
          className='px-3 py-2 rounded-[10px] border border-grey-100 bg-white text-sm text-grey-700 hover:bg-grey-50 transition-colors'
        >
          Clear
        </button>
        <button
          type='button'
          onClick={onDeactivate}
          className='flex items-center gap-2 px-3 py-2 rounded-[10px] border border-grey-100 bg-white text-sm text-grey-700 hover:bg-grey-50 transition-colors'
        >
          <span className='w-4 h-4 text-error-400'>
            <CancelHalfCircle />
          </span>
          Deactivate
        </button>
      </div>
    </div>
  )
}

export default GiftsMobileSelectionBar
