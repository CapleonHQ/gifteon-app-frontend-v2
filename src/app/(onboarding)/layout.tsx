import Link from 'next/link'
import React from 'react'
import HomeIcon from '../../assets/icons/HomeIcon'
import Image from 'next/image'

const OnboardingLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <div className='min-h-screen bg-white flex'>
      <div className='hidden lg:flex lg:flex-1 h-screen sticky top-0'>
        <div className='flex-1'>
          <img
            src='/assets/images/onboarding-image.jpg'
            alt='Unwrap gift images'
            className='w-full h-full object-cover opacity-90'
          />
        </div>
      </div>

      <div className='flex-1 overflow-y-auto relative'>
        <div className='hidden lg:block absolute top-10 right-10 z-10'>
          <Link href='/'>
            <div className='flex items-center space-x-1'>
              <span className='w-4 h-4 text-[#5B7880]'>
                <HomeIcon />
              </span>
              <span className='text-secondary-800 tracking-[-3%] hover:text-[#7B7574]'>
                Back to Home
              </span>
            </div>
          </Link>
        </div>
        <div className='flex lg:hidden justify-between items-center py-6 px-4'>
          <Link href='/'>
            <div className='w-[146px] h-[60px] flex items-center justify-center'>
              <Image
                src='/assets/images/logo/logo.svg'
                alt='Giftseon'
                className='w-full h-full'
                width={200}
                height={80}
              />
            </div>
          </Link>
          <Link href='/'>
            <div className='flex items-center space-x-1'>
              <span className='w-4 h-4 text-[#5B7880]'>
                <HomeIcon />
              </span>
              <span className='text-secondary-800 tracking-[-3%] hover:text-[#7B7574]'>
                Back to Home
              </span>
            </div>
          </Link>
        </div>
        <div className='lg:mt-20'>{children}</div>
      </div>
    </div>
  )
}

export default OnboardingLayout
