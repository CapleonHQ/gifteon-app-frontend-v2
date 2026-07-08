'use client'

import React, { useMemo } from 'react'
import { usePathname } from 'next/navigation'
import Header from '@/components/LandingPage/Layout/Header'
import Footer from '@/components/LandingPage/Layout/Footer'
import ApplicationShell from '@/components/Layout/ApplicationShell'
import OfflineBanner from '@/components/Layout/OfflineBanner'
import AccountSetupGuard from '@/components/Auth/AccountSetupGuard'
import { MobileBackProvider } from '@/components/Layout/MobileTitleContext'
import { resolvePageTitle } from '@/lib/utils/pageTitle'
import { useAuth } from '@/context/AuthContext'

const LandingPageLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  const pathname = usePathname()
  const { status } = useAuth()
  const pageTitle = useMemo(() => resolvePageTitle(pathname), [pathname])
  const isAuthenticatedExplore =
    pathname === '/explore' && status === 'authenticated'

  if (isAuthenticatedExplore) {
    return (
      <MobileBackProvider>
        <AccountSetupGuard>
          <ApplicationShell pageTitle={pageTitle}>
            <OfflineBanner />
            {children}
          </ApplicationShell>
        </AccountSetupGuard>
      </MobileBackProvider>
    )
  }

  return (
    <div className='min-h-screen bg-white flex flex-col'>
      <Header />
      {children}
      <Footer />
    </div>
  )
}

export default LandingPageLayout
