'use client'

import { useMemo, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { resolvePageTitle } from '@/lib/utils/pageTitle'
import { MobileBackProvider } from '@/components/Layout/MobileTitleContext'
import ApplicationShell from '@/components/Layout/ApplicationShell'
import { SuccessModalProvider } from '@/context/SuccessModalContext'
import AuthGuard from '@/components/Auth/AuthGuard'
import ApplicationPinGuard from '@/components/Dashboard/ApplicationPinGuard'

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname()
  const pageTitle = useMemo(() => resolvePageTitle(pathname), [pathname])

  return (
    <MobileBackProvider>
      <SuccessModalProvider>
        <AuthGuard>
          <ApplicationShell pageTitle={pageTitle}>
            {children}
          </ApplicationShell>
          <ApplicationPinGuard />
        </AuthGuard>
      </SuccessModalProvider>
    </MobileBackProvider>
  )
}

export default DashboardLayout
