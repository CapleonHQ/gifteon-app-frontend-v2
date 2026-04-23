import { SKELETON_COUNT } from '../constants'

const ExploreSkeletonGrid = () => {
  return (
    <div className='mt-6 grid grid-cols-1 gap-x-7 gap-y-8 md:grid-cols-2 xl:grid-cols-3'>
      {Array.from({ length: SKELETON_COUNT }, (_, index) => (
        <div
          key={`explore-skeleton-${index}`}
          className='overflow-hidden rounded-[12px] border border-secondary-100 bg-white shadow-[0px_10px_18px_-2px_#10192812]'
        >
          <div className='h-[238px] w-full animate-pulse bg-grey-100' />
          <div className='space-y-4 p-4'>
            <div className='h-8 w-[68%] animate-pulse rounded bg-grey-100' />
            <div className='h-6 w-full animate-pulse rounded bg-grey-50' />
            <div className='h-6 w-[82%] animate-pulse rounded bg-grey-50' />
            <div className='h-[54px] w-full animate-pulse rounded-[12px] border border-primary-100 bg-primary-50/60' />
          </div>
        </div>
      ))}
    </div>
  )
}

export default ExploreSkeletonGrid
