'use client'

import KeyboardRightIcon from '@/assets/icons/KeyboardRightIcon'
import KeyboardLeftIcon from '@/assets/icons/KeyboardLeftIcon'

type GiftsPaginationProps = {
  total: number
  limit: number
  offset: number
  onPrevious: () => void
  onNext: () => void
}

const GiftsPagination = ({
  total,
  limit,
  offset,
  onPrevious,
  onNext,
}: GiftsPaginationProps) => {
  const safeLimit = Math.max(1, limit || 1)
  const totalPages = Math.max(1, Math.ceil(total / safeLimit))
  const currentPage = Math.min(totalPages, Math.floor(offset / safeLimit) + 1)
  const showingCount = Math.min(safeLimit, Math.max(total - offset, 0))
  const canGoPrevious = currentPage > 1
  const canGoNext = currentPage < totalPages

  return (
    <div className='flex flex-col gap-4 lg:flex-row items-center lg:justify-between px-6 py-4 text-sm text-grey-700'>
      <span>Showing {showingCount} of {total}</span>
      <div className='flex items-center gap-4'>
        <button
          type='button'
          disabled={!canGoPrevious}
          onClick={onPrevious}
          className={`w-8 h-8 rounded-[5px] text-grey-700 bg-grey-50 hover:bg-grey-100 transition-colors duration-300 flex items-center justify-center ${
            canGoPrevious ? '' : 'opacity-30'
          }`}
          aria-label='Previous page'
        >
          <span className='w-6 h-6 block relative'>
            <KeyboardLeftIcon />
          </span>
        </button>
        <div className='flex gap-2 items-center justify-center'>
          <span className='w-8 h-8 rounded-[5px] bg-base-bg border border-primary-100 text-primary-400 text-sm font-medium flex items-center justify-center'>
            {currentPage}
          </span>
          <span className='text-sm text-gray-700'>of {totalPages}</span>
        </div>
        <button
          type='button'
          disabled={!canGoNext}
          onClick={onNext}
          className={`w-8 h-8 rounded-[5px] text-primary-400 bg-grey-50 hover:bg-grey-100 transition-colors duration-300 flex items-center justify-center ${
            canGoNext ? '' : 'opacity-30'
          }`}
          aria-label='Next page'
        >
          <span className='w-6 h-6 block relative'>
            <KeyboardRightIcon />
          </span>
        </button>
      </div>
    </div>
  )
}

export default GiftsPagination
