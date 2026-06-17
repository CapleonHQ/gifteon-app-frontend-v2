'use client'

import { useParams } from 'next/navigation'
import GiveawayDetailPageClient from '@/components/Giveaways/GiveawayDetailPageClient'

const GiveawayDetailPage = () => {
  const params = useParams()
  const id = typeof params.id === 'string' ? params.id : ''
  return <GiveawayDetailPageClient giveawayId={id} />
}

export default GiveawayDetailPage
