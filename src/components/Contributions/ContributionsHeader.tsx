'use client'

import FilterIcon from '@/assets/icons/FilterIcon'

type ContributionsHeaderProps = {
  onFilterClick: () => void
  totalCount: number
  activeFilterCount: number
}

const ContributionsHeader = ({
  onFilterClick,
  totalCount,
  activeFilterCount,
}: ContributionsHeaderProps) => {
  const pageLabel = `${totalCount} ${totalCount === 1 ? 'Gift' : 'Gifts'}`

  return (
    <div className='flex flex-col gap-4 py-4 lg:pt-3 lg:pb-0 px-4'>
      <div className='flex gap-3 items-center justify-between'>
        <span className='text-xl lg:text-sm font-medium text-blackish max-w-[200px]'>
          {pageLabel}
        </span>
        <button
          type='button'
          onClick={onFilterClick}
          className='relative flex items-center gap-2 px-4 py-[9px] bg-grey-50/30 border border-grey-50 rounded-[12px] text-sm leading-[18px] text-grey-700 hover:bg-grey-50 transition-colors'
        >
          {activeFilterCount > 0 ? (
            <span className='absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full bg-primary-500 text-white text-[11px] leading-5 text-center font-medium border border-white'>
              {activeFilterCount}
            </span>
          ) : null}
          <span className='text-grey-800 w-4 h-4'>
            <FilterIcon />
          </span>
          <span>Filters</span>
        </button>
      </div>
    </div>
  )
}

export default ContributionsHeader
