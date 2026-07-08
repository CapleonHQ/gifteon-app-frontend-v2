'use client'

import Link from 'next/link'
import React, { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import HomeIcon from '../../assets/icons/HomeIcon'
import OnboardingLogo from './components/OnboardingLogo'
import { useAuth } from '@/context/AuthContext'

const OnboardingLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  const router = useRouter()
  const pathname = usePathname()
  const { status } = useAuth()

  useEffect(() => {
    if (status === 'authenticated') {
      const nextPath = new URLSearchParams(window.location.search).get('next')
      const safeNextPath =
        nextPath &&
        nextPath.startsWith('/') &&
        !nextPath.startsWith('//') &&
        !nextPath.startsWith('/login')
          ? nextPath
          : null

      if (pathname === '/login' && safeNextPath) {
        router.replace(safeNextPath)
        return
      }
      router.replace('/dashboard')
    }
  }, [status, router, pathname])

  if (status !== 'unauthenticated') {
    return (
      <div className='w-full min-h-screen flex items-center justify-center bg-white'>
        <div className='w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin' />
      </div>
    )
  }

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
          <OnboardingLogo />
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
