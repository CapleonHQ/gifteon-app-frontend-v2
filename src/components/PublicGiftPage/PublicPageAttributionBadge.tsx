'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function PublicPageAttributionBadge() {
  return (
    <div className='fixed inset-x-0 bottom-[30.5px] z-30 px-4'>
      <div className='mx-auto flex max-w-[924px] justify-end'>
        <Link
          href='/'
          aria-label='Made on Giftseon'
          className='inline-flex items-center gap-1 rounded-[8px] bg-blackish px-4 py-2.5 leading-5 font-medium text-white shadow-[0px_16px_24px_-8px_rgba(16,24,40,0.35)] transition-transform hover:scale-[1.02] border-[0.5px] border-grey-100'
        >
          <span>Made on Giftseon</span>
          <Image
            src='/assets/images/logo/icon-color-white.svg'
            alt=''
            width={18}
            height={18}
            className='h-[18px] w-[18px]'
            aria-hidden='true'
          />
        </Link>
      </div>
    </div>
  )
}
