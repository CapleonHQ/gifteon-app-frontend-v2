import AlertIcon from '@/assets/icons/AlertIcon'
import PageLoader from '@/components/common/PageLoader'
import Link from 'next/link'

export const PublicGiftPageLoadingView = () => (
  <main className='min-h-screen bg-primary-50 px-4'>
    <PageLoader
      message='Preparing this gift page...'
      subtext='Just a moment while we load everything.'
      minHeightClassName='min-h-screen'
    />
  </main>
)

export const PublicGiftPageErrorView = () => (
  <main className='min-h-screen bg-primary-50 px-4'>
    <div className='min-h-screen flex items-center justify-center'>
      <div className='w-full max-w-[560px] text-center'>
        <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-error-100 bg-error-50 text-error-400'>
          <span className='h-5 w-5'>
            <AlertIcon />
          </span>
        </div>
        <p className='text-2xl font-semibold text-blackish'>Gift page unavailable</p>
        <p className='mt-2 text-grey-700'>
          This link may be invalid, private, or no longer active.
        </p>
        <div className='mt-6'>
          <Link
            href='/'
            className='inline-flex h-11 items-center justify-center rounded-[12px] border border-grey-200 bg-white px-4 text-sm font-medium text-grey-800 hover:bg-grey-50'
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  </main>
)
