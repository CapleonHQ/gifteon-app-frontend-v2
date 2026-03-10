'use client'

import type { ReactNode } from 'react'
import Sidebar from '@/components/Layout/Sidebar'
import Header from '@/components/Layout/Header'
import MobileTitleBar from '@/components/Layout/MobileTitleBar'

type ApplicationShellProps = {
  children: ReactNode
  pageTitle: string
}

const ApplicationShell = ({ children, pageTitle }: ApplicationShellProps) => {
  return (
    <div className='w-full h-screen bg-grey-50 text-blackish flex flex-col overflow-hidden'>
      <main className='flex-1 grid grid-cols-1 lg:grid-cols-[auto_1fr] overflow-hidden'>
        {/* Desktop Sidebar */}
        <div className='hidden lg:block overflow-y-auto app-shell-scrollbar'>
          <Sidebar />
        </div>
        <div className='flex flex-col overflow-hidden min-w-0'>
          <Header pageTitle={pageTitle} />
          <div className='flex-1 overflow-y-auto app-shell-scrollbar mt-[72.5px] lg:mt-0'>
            <div className='w-full min-h-full lg:px-6 h-full'>
              <div className='w-full min-h-full mx-auto max-w-[1440px] 2xl:max-w-[1600px] h-full'>
                <div className='px-4 lg:hidden bg-white py-4'>
                  <MobileTitleBar title={pageTitle} />
                </div>
                <div className='lg:mt-6 mb-4 lg:pb-[30px] min-h-full flex flex-col'>
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ApplicationShell
