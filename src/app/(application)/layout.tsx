'use client'

import { useMemo, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { resolvePageTitle } from '@/lib/utils/pageTitle'
import { MobileBackProvider } from '@/components/Layout/MobileTitleContext'
import ApplicationShell from '@/components/Layout/ApplicationShell'
import OfflineBanner from '@/components/Layout/OfflineBanner'
import { SuccessModalProvider } from '@/context/SuccessModalContext'
import AuthGuard from '@/components/Auth/AuthGuard'
import ApplicationPinGuard from '@/components/Dashboard/ApplicationPinGuard'
import { Toaster } from 'sonner'

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname()
  const pageTitle = useMemo(() => resolvePageTitle(pathname), [pathname])

  return (
    <MobileBackProvider>
      <SuccessModalProvider>
        <Toaster
          position='top-right'
          offset={16}
          mobileOffset={12}
          closeButton
          visibleToasts={3}
          richColors
          toastOptions={{
            classNames: {
              toast:
                'group rounded-[12px] border border-grey-100 bg-white text-grey-900 shadow-[0px_10px_18px_-2px_#10192812] px-4 py-3',
              title: 'text-sm font-medium leading-[20px] text-blackish',
              description: 'text-xs leading-[18px] text-grey-700',
              closeButton:
                'border border-grey-100 bg-white text-grey-500 hover:bg-grey-50 hover:text-grey-700',
              success: 'border-success-100 bg-success-50/60 text-success-900',
              error: 'border-error-100 bg-error-50/60 text-error-900',
            },
          }}
        />
        <AuthGuard>
          <ApplicationShell pageTitle={pageTitle}>
            <OfflineBanner />
            {children}
          </ApplicationShell>
          <ApplicationPinGuard />
        </AuthGuard>
      </SuccessModalProvider>
    </MobileBackProvider>
  )
}

export default DashboardLayout
