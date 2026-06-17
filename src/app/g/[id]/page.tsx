import { Suspense } from 'react'
import type { Metadata } from 'next'
import PublicGiveawayClient from '@/components/PublicGiveaway/PublicGiveawayClient'
import { PublicGiveawayLoadingView } from '@/components/PublicGiveaway/PublicGiveawayStates'
import { CATEGORY_META, formatPrize } from '@/components/Giveaways/utils'
import { getGiveawayDetail } from '@/api/services/giveaways'

type PublicGiveawayPageProps = {
  params: Promise<{ id: string }>
}

const FALLBACK_TITLE = 'Giveaway'
const FALLBACK_DESCRIPTION =
  'Enter this giveaway on Giftseon for a chance to win. Free to enter — every entry counts.'

export async function generateMetadata({
  params,
}: PublicGiveawayPageProps): Promise<Metadata> {
  const { id } = await params
  const canonicalPath = `/g/${id}`

  try {
    const detail = await getGiveawayDetail(id)
    const giveaway = detail.data?.giveaway

    if (!giveaway) {
      return {
        title: FALLBACK_TITLE,
        description: FALLBACK_DESCRIPTION,
        alternates: { canonical: canonicalPath },
        robots: { index: false, follow: false },
      }
    }

    const prize = formatPrize(giveaway)
    const meta = CATEGORY_META[giveaway.category]
    const pageTitle = giveaway.title?.trim() || FALLBACK_TITLE
    const title = `Win ${prize} — ${pageTitle}`
    const winners = `${giveaway.winnerCount} winner${
      giveaway.winnerCount > 1 ? 's' : ''
    }`
    const description = `${meta.label} giveaway on Giftseon — win ${prize}. ${winners}. Free to enter, every entry counts.`
    const imageUrl = '/og-image.jpg'
    const isIndexable =
      giveaway.status !== 'pending' && giveaway.status !== 'cancelled'

    return {
      title,
      description,
      alternates: { canonical: canonicalPath },
      openGraph: {
        type: 'website',
        url: canonicalPath,
        title: `${title} | Giftseon`,
        description,
        siteName: 'Giftseon',
        images: [{ url: imageUrl, alt: `${pageTitle} on Giftseon` }],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${title} | Giftseon`,
        description,
        images: [imageUrl],
      },
      robots: { index: isIndexable, follow: isIndexable },
    }
  } catch {
    return {
      title: FALLBACK_TITLE,
      description: FALLBACK_DESCRIPTION,
      alternates: { canonical: canonicalPath },
      openGraph: {
        type: 'website',
        url: canonicalPath,
        title: `${FALLBACK_TITLE} | Giftseon`,
        description: FALLBACK_DESCRIPTION,
        siteName: 'Giftseon',
        images: [{ url: '/og-image.jpg', alt: 'Giveaway on Giftseon' }],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${FALLBACK_TITLE} | Giftseon`,
        description: FALLBACK_DESCRIPTION,
        images: ['/og-image.jpg'],
      },
      robots: { index: false, follow: false },
    }
  }
}

export default async function PublicGiveawayPage({
  params,
}: PublicGiveawayPageProps) {
  const { id } = await params

  return (
    <Suspense fallback={<PublicGiveawayLoadingView />}>
      <PublicGiveawayClient giveawayId={id} />
    </Suspense>
  )
}
