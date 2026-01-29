'use client'

const DesktopSkeletonRow = () => (
  <div className='grid grid-cols-[24px_1.5fr_1fr_1fr_1fr_0.8fr_0.9fr_0.7fr_0.8fr_28px] items-center gap-4 px-4 py-2.5 text-sm border-b border-grey-50'>
    <div className='h-5 w-5 rounded-[4px] border border-grey-100 bg-grey-50' />
    <div className='flex items-center gap-2 min-w-0'>
      <div className='w-8 h-8 rounded-[4px] bg-grey-100' />
      <div className='h-3.5 w-28 rounded bg-grey-100' />
    </div>
    <div className='h-3.5 w-16 rounded bg-grey-100' />
    <div className='h-6 w-16 rounded-full bg-grey-100' />
    <div className='h-3.5 w-20 rounded bg-grey-100' />
    <div className='h-3.5 w-10 rounded bg-grey-100' />
    <div className='h-3.5 w-10 rounded bg-grey-100' />
    <div className='h-3.5 w-10 rounded bg-grey-100' />
    <div className='h-6 w-16 rounded-full bg-grey-100' />
    <div className='h-5 w-5 rounded bg-grey-100' />
  </div>
)

const MobileSkeletonCard = () => (
  <div className='bg-white p-3 border-b border-grey-50'>
    <div className='flex items-center justify-between gap-10 pb-3 border-b border-grey-50'>
      <div className='flex items-center gap-2'>
        <div className='w-8 h-8 rounded-[4px] bg-grey-100' />
        <div className='h-3.5 w-32 rounded bg-grey-100' />
      </div>
      <div className='h-6 w-16 rounded-full bg-grey-100' />
    </div>
    <div className='pt-3 space-y-2'>
      <div className='flex items-center justify-between'>
        <div className='h-3 w-16 rounded bg-grey-100' />
        <div className='h-3 w-20 rounded bg-grey-100' />
      </div>
      <div className='flex items-center justify-between'>
        <div className='h-3 w-16 rounded bg-grey-100' />
        <div className='h-3 w-20 rounded bg-grey-100' />
      </div>
    </div>
  </div>
)

const GiftsSkeleton = () => {
  return (
    <div className='animate-pulse'>
      <div className='hidden lg:block'>
        <div className='px-4 py-2.5 border-b border-grey-50 bg-grey-50/50'>
          <div className='grid grid-cols-[24px_1.5fr_1fr_1fr_1fr_0.8fr_0.9fr_0.7fr_0.8fr_28px] text-sm gap-4 text-grey-600 items-center'>
            <div className='h-5 w-5 rounded-[4px] border border-grey-100 bg-grey-50' />
            <div className='h-3.5 w-20 rounded bg-grey-100' />
            <div className='h-3.5 w-16 rounded bg-grey-100' />
            <div className='h-3.5 w-16 rounded bg-grey-100' />
            <div className='h-3.5 w-20 rounded bg-grey-100' />
            <div className='h-3.5 w-16 rounded bg-grey-100' />
            <div className='h-3.5 w-16 rounded bg-grey-100' />
            <div className='h-3.5 w-16 rounded bg-grey-100' />
            <div className='h-3.5 w-16 rounded bg-grey-100' />
            <div className='h-5 w-5 rounded bg-grey-100' />
          </div>
        </div>
        {Array.from({ length: 6 }).map((_, index) => (
          <DesktopSkeletonRow key={index} />
        ))}
      </div>

      <div className='lg:hidden px-4 py-4 space-y-1'>
        {Array.from({ length: 4 }).map((_, index) => (
          <MobileSkeletonCard key={index} />
        ))}
      </div>
    </div>
  )
}

export default GiftsSkeleton
