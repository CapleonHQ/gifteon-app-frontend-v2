import { AlertCircle } from 'lucide-react'

type ErrorStateCardProps = {
  onRetry: () => void
  showViewAll: boolean
  onViewAll: () => void
}

const ErrorStateCard = ({
  onRetry,
  showViewAll,
  onViewAll,
}: ErrorStateCardProps) => {
  return (
    <div className='mt-6 rounded-[16px] border border-grey-100 bg-white p-6 text-center shadow-[0px_12px_30px_-18px_#10192826] md:p-8'>
      <div className='flex flex-col items-center'>
        <span className='inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-error-100 text-error-700'>
          <AlertCircle className='h-5 w-5' />
        </span>
        <div className='min-w-0'>
          <h3 className='text-lg font-semibold leading-7 text-blackish'>
            Unable to load pages
          </h3>
          <p className='mt-1 text-sm leading-6 text-grey-700'>
            Something went wrong while fetching pages. Please retry.
          </p>
          <div className='mt-4 flex flex-wrap justify-center gap-2'>
            <button
              type='button'
              onClick={onRetry}
              className='inline-flex h-10 items-center justify-center rounded-[10px] bg-linear-to-b from-primary-400 to-primary-600 px-4 text-sm font-medium text-white transition-colors hover:from-primary-500 hover:to-primary-700'
            >
              Retry now
            </button>
            {showViewAll ? (
              <button
                type='button'
                onClick={onViewAll}
                className='inline-flex h-10 items-center justify-center rounded-[10px] border border-grey-200 bg-white px-4 text-sm font-medium text-grey-700 transition-colors hover:bg-grey-50'
              >
                View all pages
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ErrorStateCard
