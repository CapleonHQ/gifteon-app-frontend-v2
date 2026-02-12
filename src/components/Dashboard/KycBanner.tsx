'use client'

import Link from 'next/link'
import ProfileCardSvg from '@/assets/icons/ProfileCardSvg'

type KycBannerProps = {
  message: string
  actionLabel: string
  actionHref: string
}

const KycBanner = ({ message, actionLabel, actionHref }: KycBannerProps) => {
  return (
    <div className='lg:-mx-6 lg:-mt-6 mb-4 lg:mb-6'>
      <div className='w-full bg-warning-50 shadow-[0px_1.5px_4px_-1px_#10192812] px-4 py-3 flex flex-col lg:flex-row items-center justify-center gap-1 lg:gap-1.5'>
        <div className='w-5 h-5 flex items-center justify-center bg-[#005C75] rounded-full'>
          <span className='w-3 h-2 text-[#F2F2F2]'>
            <ProfileCardSvg />
          </span>
        </div>
        <div className='flex items-center justify-center'>
          <span className='text-warning-700 text-sm leading-[18px] text-center'>
            {message}{' '}
            <Link
              href={actionHref}
              className='text-primary-500 font-medium hover:text-primary-700 transition-colors duration-300 underline lg:ml-3'
            >
              {actionLabel}
            </Link>
          </span>
        </div>
      </div>
    </div>
  )
}

export default KycBanner
