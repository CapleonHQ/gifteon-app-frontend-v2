import { Suspense } from 'react'
import type { Metadata } from 'next'
import ExplorePage from '@/components/LandingPage/Explore/ExplorePage'
import { CATEGORY_TABS, PAGE_SIZE } from '@/components/LandingPage/Explore/constants'
import { normalizeCategoryQuery } from '@/components/LandingPage/Explore/utils'
import type {
  PublicPagesListApiData,
  PublicPagesQueryParams,
} from '@/api/services/publicPages'
import type { ApiResponse } from '@/types/Common'

export const metadata: Metadata = {
  title: 'Explore Gift Pages',
  description:
    'Discover public Giftseon pages, open stories, and support moments shared with the world.',
}

type ExploreRouteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

const APP_API_BASE_URL = process.env.NEXT_PUBLIC_APPLICATION_API_BASE_URL

const fetchInitialPublicPages = async (
  params: PublicPagesQueryParams
): Promise<ApiResponse<PublicPagesListApiData> | null> => {
  if (!APP_API_BASE_URL) return null

  const base = APP_API_BASE_URL.endsWith('/')
    ? APP_API_BASE_URL.slice(0, -1)
    : APP_API_BASE_URL
  const query = new URLSearchParams(
    Object.entries(params).reduce<Record<string, string>>((acc, [key, value]) => {
      if (value === undefined || value === null || value === '') return acc
      acc[key] = String(value)
      return acc
    }, {})
  )

  try {
    const response = await fetch(`${base}/pages/public?${query.toString()}`, {
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
    const payload = (await response.json()) as ApiResponse<PublicPagesListApiData>
    return payload
  } catch {
    return null
  }
}

export default async function ExploreRoute({ searchParams }: ExploreRouteProps) {
  const query = await searchParams
  const rawCategory = Array.isArray(query.category)
    ? query.category[0]
    : query.category ?? null
  const initialCategory = normalizeCategoryQuery(rawCategory)
  const activeTab = CATEGORY_TABS.find((tab) => tab.id === initialCategory)
  const initialPagesData = await fetchInitialPublicPages({
    limit: PAGE_SIZE,
    offset: 0,
    ...(activeTab?.apiCategory ? { category: activeTab.apiCategory } : {}),
  })

  return (
    <Suspense fallback={null}>
      <ExplorePage
        initialCategory={initialCategory}
        initialPagesData={initialPagesData}
      />
    </Suspense>
  )
}
