import { ChevronLeft, ChevronRight } from 'lucide-react'

type ExplorePaginationProps = {
  visibleCount: number
  totalItems: number
  currentPage: number
  totalPages: number
  isFetching: boolean
  onPrev: () => void
  onNext: () => void
}

const ExplorePagination = ({
  visibleCount,
  totalItems,
  currentPage,
  totalPages,
  isFetching,
  onPrev,
  onNext,
}: ExplorePaginationProps) => {
  const hasExtraPages = totalPages > 1

  return (
    <div className='mt-8 flex flex-col items-center justify-center gap-4 pb-4'>
      <p className='text-sm text-grey-700'>
        Showing {visibleCount} of {totalItems}
      </p>
      {hasExtraPages ? (
        <div className='flex items-center gap-3'>
          <button
            type='button'
            onClick={onPrev}
            disabled={currentPage <= 1 || isFetching}
            className='inline-flex h-8 w-8 items-center justify-center rounded-[5px] bg-grey-50 text-primary-400 transition-colors enabled:hover:bg-grey-100 disabled:cursor-not-allowed disabled:opacity-70'
            aria-label='Previous page'
          >
            <ChevronLeft className='h-6 w-6' />
          </button>
          <div className='flex gap-2 items-center'>
            <span className='inline-flex h-8 min-w-8 items-center justify-center rounded-[5px] border border-primary-100 bg-base-bg px-3 text-sm font-semibold text-primary-400'>
              {currentPage}
            </span>
            <span className='w-10 text-center text-sm text-grey-700'>
              of {totalPages}
            </span>
          </div>
          <button
            type='button'
            onClick={onNext}
            disabled={currentPage >= totalPages || isFetching}
            className='inline-flex h-8 w-8 items-center justify-center rounded-[5px] bg-grey-50 text-primary-400 transition-colors enabled:hover:bg-grey-100 disabled:cursor-not-allowed disabled:opacity-70'
            aria-label='Next page'
          >
            <ChevronRight className='h-6 w-6' />
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default ExplorePagination
