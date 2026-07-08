'use client'

import SortIcon from '@/assets/icons/SortIcon'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { WishItem } from '@/types/Gifts/giftDetails'
import WishRow from './WishRow'

type WishesSectionProps = {
  wishes: WishItem[]
  wishSort: string
  onWishSortChange: (value: string) => void
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
  canLoadMore?: boolean
  isLoadingMore?: boolean
  onLoadMore?: () => void
}

const WishesSection = ({
  wishes,
  wishSort,
  onWishSortChange,
  isLoading = false,
  isError = false,
  onRetry,
  canLoadMore = false,
  isLoadingMore = false,
  onLoadMore,
}: WishesSectionProps) => {
  return (
    <div className='bg-white border border-grey-50 rounded-[20px] shadow-[0px_10px_18px_-2px_#10192812] pb-3 gap-1 flex flex-col xl:sticky xl:top-6 xl:max-w-[364px] xl:w-full xl:justify-self-end xl:max-h-[calc(100vh-160px)]'>
      <div className='px-4 py-3 flex items-center justify-between'>
        <h2 className='text-lg font-medium text-blackish'>
          Wishes{' '}
          <span className='text-grey-500 text-sm font-normal'>
            ({wishes.length})
          </span>
        </h2>
        <Select value={wishSort} onValueChange={onWishSortChange}>
          <SelectTrigger className='flex items-center gap-1 text-grey-700 h-auto border-none shadow-none px-0 py-0'>
            <span className='w-4 h-4'>
              <SortIcon />
            </span>
            <span className='text-xs text-grey-700'>
              <SelectValue placeholder='Most recent' />
            </span>
          </SelectTrigger>
          <SelectContent className='rounded-[12px] border-grey-50'>
            <SelectItem value='most-recent'>Most recent</SelectItem>
            <SelectItem value='oldest'>Oldest</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className='flex-1 overflow-y-auto px-4 space-y-3 divide-y divide-grey-50'>
        {isLoading ? (
          <div className='py-10 text-center text-sm text-grey-600'>
            Loading wishes...
          </div>
        ) : isError ? (
          <div className='py-10 text-center space-y-3'>
            <p className='text-sm text-error-500'>Unable to load wishes.</p>
            {onRetry && (
              <button
                type='button'
                onClick={onRetry}
                className='inline-flex items-center justify-center px-4 py-2 rounded-[10px] border border-grey-200 text-sm text-grey-800 hover:bg-grey-50 transition-colors duration-200'
              >
                Retry
              </button>
            )}
          </div>
        ) : wishes.length === 0 ? (
          <div className='py-10 text-center text-sm text-grey-600'>
            No wishes yet for this page.
          </div>
        ) : (
          <>
            {wishes.map((wish) => (
              <WishRow key={wish.id} wish={wish} />
            ))}
            {canLoadMore && onLoadMore ? (
              <div className='pt-3 pb-1 text-center'>
                <button
                  type='button'
                  onClick={onLoadMore}
                  disabled={isLoadingMore}
                  className='inline-flex items-center justify-center px-4 py-2 rounded-[10px] border border-grey-200 text-sm text-grey-800 hover:bg-grey-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200'
                >
                  {isLoadingMore ? 'Loading...' : 'Load more wishes'}
                </button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  )
}

export default WishesSection
