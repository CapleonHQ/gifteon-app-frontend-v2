const RecentGiftsSkeleton = () => {
  return (
    <div className='bg-white border border-grey-50 rounded-[12px] shadow-[0px_1.5px_4px_-1px_#10192812] overflow-hidden'>
      <div className='px-4 py-3 flex items-center justify-between border-b border-grey-50'>
        <div className='h-5 w-28 bg-grey-100 rounded-md animate-pulse' />
        <div className='h-4 w-28 bg-grey-100 rounded-md animate-pulse' />
      </div>
      <div className='hidden lg:block px-4 py-3'>
        <div className='h-10 w-full bg-grey-100/70 rounded-[10px] animate-pulse' />
        <div className='mt-3 space-y-2'>
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={`recent-gift-skeleton-${index}`}
              className='h-12 w-full bg-grey-100/70 rounded-[10px] animate-pulse'
            />
          ))}
        </div>
      </div>
      <div className='lg:hidden px-4 py-3 space-y-2'>
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={`recent-gift-mobile-skeleton-${index}`}
            className='h-16 w-full bg-grey-100/70 rounded-[10px] animate-pulse'
          />
        ))}
      </div>
    </div>
  )
}

export default RecentGiftsSkeleton
