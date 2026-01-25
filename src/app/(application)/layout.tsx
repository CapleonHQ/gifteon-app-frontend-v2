'use client'

import { useMemo, type ReactNode } from 'react'
import Sidebar from '@/components/Layout/Sidebar'
import Header from '@/components/Layout/Header'
import { usePathname } from 'next/navigation'
import { resolvePageTitle } from '@/lib/utils/pageTitle'
import { MobileBackProvider } from '@/components/Layout/MobileTitleContext'
import MobileTitleBar from '@/components/Layout/MobileTitleBar'

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname()
  const pageTitle = useMemo(() => resolvePageTitle(pathname), [pathname])

  return (
    <MobileBackProvider>
      <div className='w-full flex flex-col h-screen bg-grey-50 text-blackish'>
        <main className='grid grid-cols-1 lg:grid-cols-[auto_1fr] flex-1 overflow-hidden'>
          {/* Desktop Sidebar */}
          <div className='hidden lg:block'>
            <Sidebar />
          </div>
          <div className='w-full h-full overflow-hidden flex-1 transition-all duration-300 flex flex-col'>
            <Header pageTitle={pageTitle} />
            <div className='flex-1 overflow-y-auto bg-white lg:bg-grey-50 mt-[72.5px] lg:mt-0 px-4 lg:px-6 pt-8 lg:pt-5 pb-6'>
              <div className='w-full mx-auto max-w-[1440px] 2xl:max-w-[1600px]'>
                <MobileTitleBar title={pageTitle} />
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </MobileBackProvider>
  )
}

export default DashboardLayout
