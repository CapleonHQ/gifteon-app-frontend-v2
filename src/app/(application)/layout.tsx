'use client'

import React from 'react'
import Sidebar from '@/components/Layout/Sidebar'
import Header from '@/components/Layout/Header'
import { PAGE_TITLES } from '@/lib/constants/menu'
import { usePathname } from 'next/navigation'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()

  // Get page title based on current pathname
  const getPageTitle = () => {
    // Check for exact match first
    if (PAGE_TITLES[pathname]) {
      return PAGE_TITLES[pathname]
    }

    // Check for partial match (useful for dynamic routes)
    const matchedKey = Object.keys(PAGE_TITLES).find(
      (key) => pathname.startsWith(key) && key !== '/'
    )

    return matchedKey ? PAGE_TITLES[matchedKey] : 'Dashboard'
  }

  const pageTitle = getPageTitle()

  return (
    <div className='w-full max-w-[2500px] flex flex-col h-screen bg-grey-50 text-blackish'>
      <main className='grid grid-cols-1 lg:grid-cols-[auto_1fr] flex-1 overflow-hidden'>
        {/* Desktop Sidebar */}
        <div className='hidden lg:block'>
          <Sidebar />
        </div>
        <div className='w-full h-full overflow-hidden flex-1 transition-all duration-300 flex flex-col'>
          <Header pageTitle={pageTitle} />
          <div className='flex-1 overflow-y-auto bg-white lg:bg-grey-50 mt-[72.5px] lg:mt-0 px-4 lg:px-6 pt-8 lg:pt-5 pb-6'>
            <div className='lg:hidden'>
              <h1 className='text-blackish text-2xl leading-[127%] font-medium'>
                {pageTitle}
              </h1>
            </div>
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}

export default DashboardLayout
