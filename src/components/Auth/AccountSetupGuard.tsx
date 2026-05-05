'use client'

import { useEffect, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

const ACCOUNT_SETUP_PATH = '/account-setup'

const AccountSetupGuard = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return
    const needsSetup = !user.pinActivated
    if (!needsSetup || pathname === ACCOUNT_SETUP_PATH) return
    router.replace(ACCOUNT_SETUP_PATH)
  }, [pathname, router, user])

  if (!user) return <>{children}</>

  const needsSetup = !user.pinActivated
  if (needsSetup && pathname !== ACCOUNT_SETUP_PATH) {
    return (
      <div className='w-full h-screen flex items-center justify-center bg-grey-50'>
        <div className='flex items-center gap-3 text-grey-600'>
          <div className='w-10 h-10 lg:w-14 lg:h-14 border-2 border-primary-500 border-t-transparent rounded-full animate-spin'></div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default AccountSetupGuard
