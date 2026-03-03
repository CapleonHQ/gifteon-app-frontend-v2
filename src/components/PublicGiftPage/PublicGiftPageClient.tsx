'use client'

import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { renderRenderTemplate } from '@/lib/config/templates/registry'
import type { RenderTemplateProps } from '@/lib/config/templates/types'
import { usePublicPageBySlug } from '@/hooks/tanstack/publicPage'
import {
  normalizePublicPageData,
  resolveTemplateOverrideId,
} from './pageMapper'
import {
  PublicGiftPageErrorView,
  PublicGiftPageLoadingView,
} from './PublicGiftPageStates'
import PublicGiftPageEngagementSection from './PublicGiftPageEngagementSection'

type PublicGiftPageClientProps = {
  slug: string
}

export default function PublicGiftPageClient({
  slug,
}: PublicGiftPageClientProps) {
  const searchParams = useSearchParams()
  const pageQuery = usePublicPageBySlug(slug)

  const pageData = pageQuery.data?.data

  const normalizedPage = useMemo(
    () => normalizePublicPageData(pageData),
    [pageData]
  )
  const templateOverrideId = useMemo(() => {
    return resolveTemplateOverrideId(searchParams.get('template'))
  }, [searchParams])

  if (pageQuery.isLoading) {
    return <PublicGiftPageLoadingView />
  }

  if (pageQuery.isError || !pageData || !normalizedPage) {
    return <PublicGiftPageErrorView />
  }

  const renderProps: RenderTemplateProps = {
    data: {
      ...normalizedPage,
      templateId: templateOverrideId ?? normalizedPage.templateId,
    },
    engagementSection: (
      <PublicGiftPageEngagementSection
        page={pageData}
        pageTitle={normalizedPage.title}
      />
    ),
  }

  return (
    <main className='min-h-screen md:bg-primary-50 md:px-4 md:py-8 lg:py-15'>
      <div className='mx-auto max-w-[924px] border border-white bg-white flex flex-col gap-4 lg:gap-7'>
        {renderRenderTemplate(
          templateOverrideId ?? normalizedPage.templateId,
          renderProps
        )}
      </div>
    </main>
  )
}
