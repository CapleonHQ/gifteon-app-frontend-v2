'use client'

const DesktopSkeletonRow = () => (
  <div className='grid grid-cols-[1fr_2fr_0.9fr_1fr_1fr_32px] items-center gap-4 px-4 py-2.5 border-b border-grey-50'>
    <div className='h-3.5 w-20 rounded bg-grey-100' />
    <div className='h-3.5 w-52 rounded bg-grey-100' />
    <div className='h-6 w-16 rounded-full bg-grey-100' />
    <div className='h-3.5 w-20 rounded bg-grey-100' />
    <div className='h-6 w-20 rounded-full bg-grey-100' />
    <div className='h-5 w-5 rounded bg-grey-100' />
  </div>
)

const MobileSkeletonCard = () => (
  <div className='border-b border-grey-50 p-3'>
    <div className='flex items-center justify-between'>
      <div className='h-3.5 w-24 rounded bg-grey-100' />
      <div className='h-6 w-20 rounded-full bg-grey-100' />
    </div>
    <div className='mt-3 space-y-2'>
      <div className='flex items-center justify-between'>
        <div className='h-3 w-16 rounded bg-grey-100' />
        <div className='h-3 w-28 rounded bg-grey-100' />
      </div>
      <div className='flex items-center justify-between'>
        <div className='h-3 w-16 rounded bg-grey-100' />
        <div className='h-6 w-16 rounded-full bg-grey-100' />
      </div>
      <div className='flex items-center justify-between'>
        <div className='h-3 w-16 rounded bg-grey-100' />
        <div className='h-3 w-24 rounded bg-grey-100' />
      </div>
      <div className='h-10 w-full rounded-[8px] bg-grey-100' />
    </div>
  </div>
)

const WalletTransactionsSkeleton = () => {
  return (
    <div className='animate-pulse'>
      <div className='hidden lg:block overflow-x-auto'>
        <div className='min-w-[980px]'>
          <div className='px-4 py-2.5 border-b border-grey-50 bg-grey-50/50'>
            <div className='grid grid-cols-[1fr_2fr_0.9fr_1fr_1fr_32px] gap-4 items-center'>
              <div className='h-3.5 w-10 rounded bg-grey-100' />
              <div className='h-3.5 w-20 rounded bg-grey-100' />
              <div className='h-3.5 w-10 rounded bg-grey-100' />
              <div className='h-3.5 w-14 rounded bg-grey-100' />
              <div className='h-3.5 w-12 rounded bg-grey-100' />
              <div className='h-5 w-5 rounded bg-grey-100' />
            </div>
          </div>
          {Array.from({ length: 6 }).map((_, index) => (
            <DesktopSkeletonRow key={index} />
          ))}
        </div>
      </div>

      <div className='lg:hidden px-4'>
        {Array.from({ length: 4 }).map((_, index) => (
          <MobileSkeletonCard key={index} />
        ))}
      </div>
    </div>
  )
}

export default WalletTransactionsSkeleton
