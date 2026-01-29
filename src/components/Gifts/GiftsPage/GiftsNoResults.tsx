'use client'

import EmptyBox from '@/assets/icons/EmptyBox'

type GiftsNoResultsProps = {
  onReset: () => void
}

const GiftsNoResults = ({ onReset }: GiftsNoResultsProps) => {
  return (
    <div className='px-4 py-16 lg:py-24 h-full flex lg:items-center lg:justify-center'>
      <div className='max-w-[420px] mx-auto text-center flex flex-col items-center gap-4'>
        <span className='text-grey-400 w-12 h-12'>
          <EmptyBox />
        </span>

        <div className='flex flex-col gap-2'>
          <h3 className='text-xl font-medium'>No results found</h3>
          <p className='text-sm text-grey-600'>
            Try adjusting or resetting your filters to see more gift pages.
          </p>
        </div>
        <button
          type='button'
          onClick={onReset}
          className='inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-grey-200 text-grey-800 font-medium bg-grey-50/70 hover:bg-grey-100/70 transition-colors duration-300'
        >
          Reset filters
        </button>
      </div>
    </div>
  )
}

export default GiftsNoResults
