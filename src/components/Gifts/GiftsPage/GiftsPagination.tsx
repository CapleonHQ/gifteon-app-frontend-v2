'use client'

import KeyboardRightIcon from '@/assets/icons/KeyboardRightIcon'
import KeyboardLeftIcon from '@/assets/icons/KeyboardLeftIcon'

const GiftsPagination = () => {
  return (
    <div className='flex flex-col gap-4 lg:flex-row items-center lg:justify-between px-6 py-4 text-sm text-grey-700'>
      <span>Showing 14 of 132</span>
      <div className='flex items-center gap-4'>
        <button
          type='button'
          className='w-8 h-8 rounded-[5px] text-grey-700 bg-grey-50 hover:bg-grey-100 transition-colors duration-300 flex items-center justify-center opacity-30'
          aria-label='Previous page'
        >
          <span className='w-6 h-6 block relative'>
            <KeyboardLeftIcon />
          </span>
        </button>
        <div className='flex gap-2 items-center justify-center'>
          <span className='w-8 h-8 rounded-[5px] bg-base-bg border border-primary-100 text-primary-400 text-sm font-medium flex items-center justify-center'>
            1
          </span>
          <span className='text-sm text-gray-700'>of 8</span>
        </div>
        <button
          type='button'
          className='w-8 h-8 rounded-[5px] text-primary-400 bg-grey-50 hover:bg-grey-100 transition-colors duration-300 flex items-center justify-center'
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
