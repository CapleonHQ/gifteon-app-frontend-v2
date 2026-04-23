'use client'

import { useEffect, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import { analytics } from '@/lib/analytics/events'

const PostHogAuthBridge = () => {
  const { status, user } = useAuth()
  const identifiedUserIdRef = useRef<string | null>(null)

  useEffect(() => {
    if (status === 'authenticated' && user) {
      if (identifiedUserIdRef.current !== user.id) {
        analytics.identifyUser(user)
        identifiedUserIdRef.current = user.id
      }
      return
    }

    if (status === 'unauthenticated' && identifiedUserIdRef.current) {
      analytics.resetUser()
      identifiedUserIdRef.current = null
    }
  }, [status, user])

  return null
}

export default PostHogAuthBridge
