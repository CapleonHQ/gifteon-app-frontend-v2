import { Search } from 'lucide-react'

type EmptyStateCardProps = {
  showViewAll: boolean
  onViewAll: () => void
}

const EmptyStateCard = ({ showViewAll, onViewAll }: EmptyStateCardProps) => {
  return (
    <div className='mt-6 rounded-[16px] border border-grey-100 bg-white p-6 text-center shadow-[0px_12px_30px_-18px_#10192826] md:p-8'>
      <span className='mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-500'>
        <Search className='h-6 w-6' />
      </span>
      <h3 className='mt-3 text-lg font-semibold leading-7 text-blackish'>
        No pages found
      </h3>
      <p className='mx-auto mt-1 max-w-[520px] text-sm leading-6 text-grey-700'>
        We could not find any pages in this category yet. Try a different
        category or view all pages.
      </p>
      {showViewAll ? (
        <button
          type='button'
          onClick={onViewAll}
          className='mt-4 inline-flex h-10 items-center justify-center rounded-[10px] border border-primary-100 bg-primary-50 px-4 text-sm font-medium text-primary-600 transition-colors hover:bg-primary-100'
        >
          View all pages
        </button>
      ) : null}
    </div>
  )
}

export default EmptyStateCard
