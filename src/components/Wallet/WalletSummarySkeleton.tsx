'use client'

const WalletSummarySkeleton = () => {
  return (
    <div className='grid grid-cols-1 xl:grid-cols-3 gap-4 px-4 lg:px-0 animate-pulse'>
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className='rounded-[12px] shadow-[0px_10px_30px_-12px_#1019281F] p-4 flex flex-col gap-4 bg-white'
        >
          <div className='flex items-start justify-between gap-2'>
            <div className='h-3.5 w-28 rounded bg-grey-100' />
            <div className='h-4 w-4 rounded bg-grey-100' />
          </div>
          <div className='h-8 w-40 rounded bg-grey-100' />
          <div className='flex items-end justify-between gap-3'>
            <div className='h-3 w-20 rounded bg-grey-100' />
            {index === 0 ? (
              <div className='flex items-center gap-2'>
                <div className='h-7 w-14 rounded bg-grey-100' />
                <div className='h-7 w-20 rounded bg-grey-100' />
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  )
}

export default WalletSummarySkeleton
