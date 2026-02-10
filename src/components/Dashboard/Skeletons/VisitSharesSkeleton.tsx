const VisitSharesSkeleton = () => {
  return (
    <div className='bg-white border border-grey-50 rounded-[12px] shadow-[0px_1.5px_4px_-1px_#10192812] p-4'>
      <div className='flex items-center justify-between gap-3'>
        <div className='h-5 w-40 bg-grey-100 rounded-md animate-pulse' />
        <div className='h-8 w-40 bg-grey-100 rounded-full animate-pulse' />
      </div>
      <div className='mt-4 h-[260px] bg-grey-100/70 rounded-[12px] animate-pulse' />
    </div>
  )
}

export default VisitSharesSkeleton
