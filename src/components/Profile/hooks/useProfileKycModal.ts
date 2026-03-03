'use client'

import { useCallback, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export const useProfileKycModal = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isLocalKycModalOpen, setIsLocalKycModalOpen] = useState(false)

  const isKycModalOpen =
    isLocalKycModalOpen || searchParams.get('modal') === 'kyc'

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

  return {
    isKycModalOpen,
    openKycModal,
    closeKycModal,
  }
}
