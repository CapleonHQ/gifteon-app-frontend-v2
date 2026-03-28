'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { analytics } from '@/lib/analytics/events'

export const useProfileKycModal = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isLocalKycModalOpen, setIsLocalKycModalOpen] = useState(false)

  const isKycModalOpen =
    isLocalKycModalOpen || searchParams.get('modal') === 'kyc'
  const source = searchParams.get('source') || 'profile'

  const openKycModal = useCallback(() => {
    setIsLocalKycModalOpen(true)
  }, [])

  const closeKycModal = useCallback(() => {
    setIsLocalKycModalOpen(false)
    if (searchParams.get('modal') !== 'kyc') return

    const params = new URLSearchParams(searchParams.toString())
    params.delete('modal')
    params.delete('source')
    const query = params.toString()
    router.replace(`${pathname}${query ? `?${query}` : ''}`)
  }, [pathname, router, searchParams])

  useEffect(() => {
    if (!isKycModalOpen) return
    analytics.trackKycModalOpened({ source })
  }, [isKycModalOpen, source])

  return {
    isKycModalOpen,
    openKycModal,
    closeKycModal,
  }
}
