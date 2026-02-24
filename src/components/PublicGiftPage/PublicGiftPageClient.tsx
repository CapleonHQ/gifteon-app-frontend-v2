'use client'

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { renderRenderTemplate } from '@/lib/config/templates/registry'
import type {
  RenderTemplateData,
  RenderTemplateProps,
} from '@/lib/config/templates/types'
import {
  getPublicPageBySlug,
  type PublicPageApiData,
} from '@/api/services/publicPages'

type PublicGiftPageClientProps = {
  slug: string
}

const DEFAULT_IMAGE = '/assets/images/place-holder-image.jpg'
const FALLBACK_TITLE = "It's my birthday!"
const FALLBACK_DESCRIPTION =
  'You can include the description of the celebration here. You can include the description of the celebration here.'

const toCssAlign = (
  alignment: PublicPageApiData['textAlignment']
): 'left' | 'middle' | 'right' => {
  if (alignment === 'middle') return 'middle'
  if (alignment === 'right') return 'right'
  return 'left'
}

const parseTitleFormat = (titleFormat?: string | null) => {
  const value = (titleFormat || '').toLowerCase()
  return {
    bold: value.includes('bold'),
    italic: value.includes('italic'),
    underline: value.includes('underline'),
  }
}

const extractSocialLinks = (
  page?: PublicPageApiData
): RenderTemplateData['socialLinks'] => {
  const socials = page?.settings?.socials ?? []
  const links: RenderTemplateData['socialLinks'] = {}
  for (const item of socials) {
    const provider = String(item.provider || '').toLowerCase()
    const url = String(item.url || '').trim()
    if (!url) continue
    if (provider.includes('instagram')) links.instagram = url
    if (provider === 'x' || provider.includes('twitter')) links.twitter = url
    if (provider.includes('linkedin')) links.linkedin = url
  }
  return links
}

const normalizePageData = (
  page?: PublicPageApiData
): RenderTemplateData | null => {
  if (!page?.id) return null

  const firstMedia = page.media?.[0]
  const mediaUrl = String(
    firstMedia?.url || page.coverImageUrl || DEFAULT_IMAGE
  )
  const mediaType = String(firstMedia?.mediaType || '')
    .toLowerCase()
    .includes('video')
    ? 'video'
    : 'image'
  const titleFormat = parseTitleFormat(page.titleFormat)
  const resolvedTemplateId = page.templateId || page.template?.id || ''

  return {
    id: page.id,
    templateId: resolvedTemplateId,
    title: page.title?.trim() || FALLBACK_TITLE,
    description: page.content?.trim() || FALLBACK_DESCRIPTION,
    mediaUrl,
    mediaType,
    buttonLabel: page.buttonLabel?.trim() || 'Say something nice',
    buttonTextColor: page.buttonTextColor || '#121212',
    buttonBackgroundColor: page.buttonBackgroundColor || '#F3F2F2',
    titleStyle: {
      fontFamily: page.titleFont || 'var(--font-degular)',
      color: page.titleColor || '#121212',
      size: Number(page.titleSize) > 0 ? Number(page.titleSize) : 32,
      alignment: toCssAlign(page.textAlignment),
      bold: titleFormat.bold,
      italic: titleFormat.italic,
      underline: titleFormat.underline,
    },
    descriptionStyle: {
      fontFamily: page.contentFont || 'var(--font-degular)',
      color: page.contentColor || '#4B5563',
      size: Number(page.contentSize) > 0 ? Number(page.contentSize) : 14,
      alignment: toCssAlign(page.textAlignment),
    },
    socialLinks: extractSocialLinks(page),
  }
}

export default function PublicGiftPageClient({
  slug,
}: PublicGiftPageClientProps) {
  const pageQuery = useQuery({
    queryKey: ['public-page', slug],
    queryFn: () => getPublicPageBySlug(slug),
    enabled: slug.length > 0,
  })

  const pageData = pageQuery.data?.data

  const normalizedPage = useMemo(() => normalizePageData(pageData), [pageData])

  if (pageQuery.isLoading) {
    return (
      <main className='min-h-screen bg-primary-50 px-4 py-6'>
        <div className='mx-auto max-w-[924px] bg-white p-6'>
          <div className='h-12 w-52 animate-pulse rounded bg-grey-100' />
          <div className='mt-4 h-[420px] animate-pulse rounded bg-grey-100' />
        </div>
      </main>
    )
  }

  if (pageQuery.isError || !normalizedPage) {
    return (
      <main className='min-h-screen bg-primary-50 px-4 py-6'>
        <div className='mx-auto max-w-[760px] bg-white p-8 text-center'>
          <p className='text-xl font-semibold text-blackish'>
            Gift page unavailable
          </p>
          <p className='mt-2 text-grey-700'>
            This link may be invalid, private, or no longer active.
          </p>
        </div>
      </main>
    )
  }

  const renderProps: RenderTemplateProps = {
    data: normalizedPage,
  }

  return (
    <main className='min-h-screen bg-primary-50 px-4 py-4 lg:py-15'>
      <div className='mx-auto max-w-[924px] border border-white bg-white flex flex-col gap-4 lg:gap-7'>
        {renderRenderTemplate(normalizedPage.templateId, renderProps)}
      </div>
    </main>
  )
}
