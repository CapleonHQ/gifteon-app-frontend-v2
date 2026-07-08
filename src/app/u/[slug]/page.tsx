import type { Metadata } from 'next'
import PublicGiftPageClient from '@/components/PublicGiftPage/PublicGiftPageClient'
import type { PublicPageApiData } from '@/types/PublicPages'

type PublicGiftPageProps = {
  params: Promise<{ slug: string }>
}

const FALLBACK_TITLE = 'Gift Page'
const FALLBACK_DESCRIPTION =
  'Celebrate special moments on Giftseon. View this gift page, send wishes, and contribute to the celebration.'
const APP_API_BASE_URL =
  process.env.NEXT_PUBLIC_APPLICATION_API_BASE_URL ??
  process.env.NEXT_PUBLIC_APP_API_BASE_URL ??
  ''

const cleanText = (value?: string | null): string => {
  if (!value) return ''
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

const buildDescription = (page?: PublicPageApiData | null): string => {
  const raw = cleanText(page?.content)
  if (!raw) return FALLBACK_DESCRIPTION
  return raw.length > 160 ? `${raw.slice(0, 157)}...` : raw
}

const fetchPublicPageBySlug = async (
  slug: string
): Promise<PublicPageApiData | null> => {
  if (!APP_API_BASE_URL) return null

  const base = APP_API_BASE_URL.endsWith('/')
    ? APP_API_BASE_URL.slice(0, -1)
    : APP_API_BASE_URL
  const response = await fetch(`${base}/pages/${slug}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      ...(process.env.NEXT_PUBLIC_API_KEY
        ? { 'X-API-Key': process.env.NEXT_PUBLIC_API_KEY }
        : {}),
    },
    next: { revalidate: 60 },
  })

  if (!response.ok) return null

  const payload = (await response.json()) as { data?: PublicPageApiData }
  return payload.data ?? null
}

export async function generateMetadata({
  params,
}: PublicGiftPageProps): Promise<Metadata> {
  const { slug } = await params
  const canonicalPath = `/u/${slug}`

  try {
    const page = await fetchPublicPageBySlug(slug)

    const pageTitle = page?.title?.trim() || FALLBACK_TITLE
    const title = pageTitle
    const description = buildDescription(page)
    const imageUrl = page?.coverImageUrl || page?.media?.[0]?.url || '/og-image.jpg'
    const isIndexable =
      page?.active !== false &&
      page?.deletedAt == null &&
      page?.settings?.privacy !== 'private'

    return {
      title,
      description,
      alternates: {
        canonical: canonicalPath,
      },
      openGraph: {
        type: 'website',
        url: canonicalPath,
        title: `${pageTitle} | Giftseon`,
        description,
        siteName: 'Giftseon',
        images: [
          {
            url: imageUrl,
            alt: `${pageTitle} on Giftseon`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${pageTitle} | Giftseon`,
        description,
        images: [imageUrl],
      },
      robots: {
        index: isIndexable,
        follow: isIndexable,
      },
    }
  } catch {
    return {
      title: FALLBACK_TITLE,
      description: FALLBACK_DESCRIPTION,
      alternates: {
        canonical: canonicalPath,
      },
      openGraph: {
        type: 'website',
        url: canonicalPath,
        title: `${FALLBACK_TITLE} | Giftseon`,
        description: FALLBACK_DESCRIPTION,
        siteName: 'Giftseon',
        images: [{ url: '/og-image.jpg', alt: 'Gift page on Giftseon' }],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${FALLBACK_TITLE} | Giftseon`,
        description: FALLBACK_DESCRIPTION,
        images: ['/og-image.jpg'],
      },
      robots: {
        index: false,
        follow: false,
      },
    }
  }
}

export default async function PublicGiftPage({ params }: PublicGiftPageProps) {
  const { slug } = await params
  return <PublicGiftPageClient slug={slug} />
}
