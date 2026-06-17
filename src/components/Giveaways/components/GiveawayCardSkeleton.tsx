const GiveawayCardSkeleton = () => {
  return (
    <div className='rounded-[16px] bg-white border border-grey-50 shadow-[0px_10px_30px_-12px_#1019281F] overflow-hidden animate-pulse'>
      <div className='h-1.5 w-full bg-grey-100' />
      <div className='flex flex-col gap-3 p-4 lg:p-5'>
        <div className='flex items-center justify-between'>
          <div className='h-5 w-16 rounded-full bg-grey-100' />
          <div className='h-5 w-14 rounded-full bg-grey-100' />
        </div>
        <div className='h-4 w-3/4 rounded bg-grey-100' />
        <div className='h-4 w-1/2 rounded bg-grey-100' />
        <div className='flex items-center justify-between'>
          <div className='h-3 w-20 rounded bg-grey-100' />
          <div className='h-3 w-16 rounded bg-grey-100' />
        </div>
        <div className='h-9 w-full rounded-[10px] bg-grey-100 mt-2' />
      </div>
    </div>
  )
}

export default GiveawayCardSkeleton
