'use client'

import { useEffect, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

const AuthGuard = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  const pathname = usePathname()
  const { status } = useAuth()

  useEffect(() => {
    if (status === 'unauthenticated') {
      const currentPath = `${pathname}${window.location.search}`
      const next = encodeURIComponent(currentPath)
      router.replace(`/login?next=${next}`)
    }
  }, [status, router, pathname])

  if (status !== 'authenticated') {
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

export default AuthGuard
