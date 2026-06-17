'use client'

import { Suspense } from 'react'
import { useParams } from 'next/navigation'
import PublicGiveawayClient from '@/components/PublicGiveaway/PublicGiveawayClient'

const PublicGiveawayPage = () => {
  const params = useParams()
  const id = typeof params.id === 'string' ? params.id : ''

  return (
    <Suspense
      fallback={
        <div className='min-h-screen bg-base-bg flex items-center justify-center'>
          <div className='w-8 h-8 rounded-full border-2 border-primary-200 border-t-primary-500 animate-spin' />
        </div>
      }
    >
      <PublicGiveawayClient giveawayId={id} />
    </Suspense>
  )
}

export default PublicGiveawayPage
