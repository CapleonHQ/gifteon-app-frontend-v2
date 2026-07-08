const GiftTypeDistributionSkeleton = () => {
  return (
    <div className='bg-white border border-grey-50 rounded-[12px] shadow-[0px_1.5px_4px_-1px_#10192812] p-4'>
      <div className='h-5 w-48 bg-grey-100 rounded-md animate-pulse' />
      <div className='mt-4 flex flex-col items-center'>
        <div className='h-[260px] w-[260px] rounded-full bg-grey-100 animate-pulse' />
        <div className='mt-4 flex items-center gap-4'>
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={`legend-skeleton-${index}`} className='flex items-center gap-2'>
              <div className='w-2.5 h-2.5 rounded-full bg-grey-100 animate-pulse' />
              <div className='h-3 w-14 bg-grey-100 rounded-md animate-pulse' />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default GiftTypeDistributionSkeleton
