'use client'

import Link from 'next/link'
import EmptyBox from '@/assets/icons/EmptyBox'

const GiftsEmptyState = () => {
  return (
    <div className='px-4 py-16 lg:pt-60 h-full flex lg:items-center lg:justify-center'>
      <div className='max-w-[420px] mx-auto text-center flex flex-col items-center gap-4'>
        <span className='text-grey-400 w-12 h-12'>
          <EmptyBox />
        </span>

        <div className='flex flex-col gap-2'>
          <h3 className='text-xl font-medium'>No gift pages yet!</h3>
          <p className='text-sm text-grey-600'>
            Start by creating your first gift page to make gifting more special
          </p>
        </div>
        <Link
          href='/gifts/create-new'
          className='inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-linear-to-r from-primary-400 to-primary-600 border border-primary-500 text-white font-medium hover:from-primary-500 hover:to-primary-700 transition-colors duration-300'
        >
          Create your first page
        </Link>
      </div>
    </div>
  )
}

export default GiftsEmptyState
