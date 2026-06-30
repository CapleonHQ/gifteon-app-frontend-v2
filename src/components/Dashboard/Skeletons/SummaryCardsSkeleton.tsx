const SummaryCardsSkeleton = () => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-3 gap-3 lg:gap-5'>
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={`summary-skeleton-${index}`}
          className='bg-white border border-grey-100 rounded-2xl p-5 flex flex-col gap-4'
        >
          <div className='flex items-start justify-between'>
            <div className='w-10 h-10 rounded-xl bg-grey-100 animate-pulse' />
          </div>
          <div className='flex flex-col gap-2'>
            <div className='h-8 w-20 bg-grey-100 rounded-lg animate-pulse' />
            <div className='h-4 w-28 bg-grey-100 rounded-md animate-pulse' />
            <div className='h-3 w-20 bg-grey-100 rounded-md animate-pulse' />
          </div>
        </div>
      ))}
    </div>
  )
}

export default SummaryCardsSkeleton
