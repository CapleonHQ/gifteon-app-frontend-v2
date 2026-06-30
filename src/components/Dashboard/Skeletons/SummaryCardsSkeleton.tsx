const SummaryCardsSkeleton = () => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-5'>
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={`summary-skeleton-${index}`}
          className='bg-white border border-grey-50 rounded-[12px] shadow-[0px_1.5px_4px_-1px_#10192812] p-4 flex flex-col gap-3'
        >
          <div className='flex items-center justify-between'>
            <div className='h-4 w-24 bg-grey-100 rounded-md animate-pulse' />
            <div className='h-6 w-6 rounded-full bg-grey-100 animate-pulse' />
          </div>
          <div className='h-8 w-24 bg-grey-100 rounded-md animate-pulse' />
          <div className='h-3 w-20 bg-grey-100 rounded-md animate-pulse' />
        </div>
      ))}
    </div>
  )
}

export default SummaryCardsSkeleton
