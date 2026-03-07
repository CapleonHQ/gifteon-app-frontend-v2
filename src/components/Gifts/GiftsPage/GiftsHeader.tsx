'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'
import { SearchIcon } from '@/assets/icons'
import FilterIcon from '@/assets/icons/FilterIcon'

type GiftsHeaderProps = {
  onFilterClick: () => void
  totalCount: number
  searchValue: string
  onSearchChange: (value: string) => void
}

const GiftsHeader = ({
  onFilterClick,
  totalCount,
  searchValue,
  onSearchChange,
}: GiftsHeaderProps) => {
  const pageLabel = `${totalCount} ${totalCount === 1 ? 'Page' : 'Pages'}`

  return (
    <div className='flex flex-col gap-4 py-4 lg:pt-3 lg:pb-0 px-4'>
      <div className='lg:hidden'>
        <Link
          href='/gifts/create-new'
          className='inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-linear-to-r from-primary-400 to-primary-600 border border-primary-500 text-white font-medium hover:from-primary-500 hover:to-primary-700 transition-colors duration-300'
        >
          <Plus className='w-5 h-5' />
          Create a new page
        </Link>
      </div>
      <div className='flex gap-3 items-center justify-between'>
        <span className='text-xl lg:text-sm font-medium text-blackish max-w-[200px]'>
          {pageLabel}
        </span>
        <div className='flex items-center gap-2 sm:gap-6'>
          <div className='hidden lg:block relative w-[250px]'>
            <span className='absolute left-3 top-1/2 -translate-y-1/2 text-grey-700 w-4 h-4'>
              <SearchIcon />
            </span>

            <input
              type='text'
              placeholder='Search'
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              className='w-full pl-9 pr-3 py-[7px] bg-grey-50/30 border border-grey-50 rounded-[12px] text-grey-700 placeholder:text-grey-700 focus:outline-none focus:bg-white focus:ring-1 focus:ring-primary-300 transition-colors'
            />
          </div>
          <button
            type='button'
            onClick={onFilterClick}
            className='flex items-center gap-2 px-4 py-[9px] bg-grey-50/30 border border-grey-50 rounded-[12px] text-sm leading-[18px] text-grey-700 hover:bg-grey-50 transition-colors'
          >
            <span className='text-grey-800 w-4 h-4'>
              <FilterIcon />
            </span>
            <span>Filters</span>
          </button>
        </div>

        <Link
          href='/gifts/create-new'
          className='hidden lg:inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-linear-to-r from-primary-400 to-primary-600 border border-primary-500 text-white font-medium hover:from-primary-500 hover:to-primary-700 transition-colors'
        >
          <Plus className='w-4 h-4' />
          Create a new page
        </Link>
      </div>
    </div>
  )
}

export default GiftsHeader
