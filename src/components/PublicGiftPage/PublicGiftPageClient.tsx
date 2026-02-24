'use client'

import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import {
  ChevronDownIcon,
  InstagramColored,
  LinkedinIcon,
  XTwitterIcon,
} from '@/assets/icons'
import { TEMPLATES } from '@/lib/config/templates/selection'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/utils/currency'
import {
  createPublicPageComment,
  getPublicPageBySlug,
  type PublicPageApiData,
} from '@/api/services/publicPages'

type PublicGiftPageClientProps = {
  slug: string
}

type SocialLinks = {
  instagram?: string
  twitter?: string
  linkedin?: string
}

type PublicTemplateData = {
  id: string
  title: string
  description: string
  mediaUrl: string
  mediaType: 'image' | 'video'
  templateLayout: 'template1' | 'template2' | 'template3' | 'template4'
  buttonLabel: string
  buttonTextColor: string
  buttonBgColor: string
  titleStyle: {
    fontFamily: string
    fontSize: number
    fontWeight: number
    fontStyle: 'normal' | 'italic'
    textDecoration: 'none' | 'underline'
    textAlign: 'left' | 'center' | 'right'
    color: string
  }
  descriptionStyle: {
    fontFamily: string
    fontSize: number
    textAlign: 'left' | 'center' | 'right'
    color: string
  }
  currency: string
  socialLinks: SocialLinks
}

type ActivityListItem = {
  id: string
  label: string
  time: string
}

type CommentListItem = {
  id: string
  fullName: string
  anonymous: boolean
  comment: string
  createdAt: string
}

type InteractionPanelProps = {
  activeTab: 'comments' | 'activities'
  setActiveTab: (tab: 'comments' | 'activities') => void
  comments: CommentListItem[]
  activities: ActivityListItem[]
  isLoading: boolean
  isError: boolean
  commentText: string
  onCommentTextChange: (value: string) => void
  canSubmitComment: boolean
  isSubmittingComment: boolean
  submitCommentError: boolean
  onSubmitComment: () => void
  hideName: boolean
  setHideName: (value: boolean) => void
  ownerOnly: boolean
  setOwnerOnly: (value: boolean) => void
  title: string
}

const DEFAULT_IMAGE = '/assets/images/place-holder-image.jpg'
const FALLBACK_TITLE = "It's my birthday!"
const FALLBACK_DESCRIPTION =
  'You can include the description of the celebration here. You can include the description of the celebration here.'

const toCssAlign = (
  alignment: PublicPageApiData['textAlignment']
): 'left' | 'center' | 'right' => {
  if (alignment === 'middle') return 'center'
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

const toRelativeTime = (value: unknown): string => {
  if (typeof value !== 'string') return 'Recently'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return 'Recently'
  return formatDistanceToNow(parsed, { addSuffix: true }).replace('about ', '')
}

const extractSocialLinks = (page?: PublicPageApiData): SocialLinks => {
  const socials = page?.settings?.socials ?? []
  const links: SocialLinks = {}
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
): PublicTemplateData | null => {
  if (!page?.id) return null

  const firstMedia = page.media?.[0]
  const mediaUrl = String(firstMedia?.url || page.coverImageUrl || DEFAULT_IMAGE)
  const mediaType = String(firstMedia?.mediaType || '').toLowerCase().includes('video')
    ? 'video'
    : 'image'
  const titleFormat = parseTitleFormat(page.titleFormat)
  const resolvedTemplateId = page.templateId || page.template?.id || ''
  const templateLayout =
    (TEMPLATES.find((item) => item.id === resolvedTemplateId)
      ?.layout as PublicTemplateData['templateLayout']) || 'template1'

  return {
    id: page.id,
    title: page.title?.trim() || FALLBACK_TITLE,
    description: page.content?.trim() || FALLBACK_DESCRIPTION,
    mediaUrl,
    mediaType,
    templateLayout,
    buttonLabel: page.buttonLabel?.trim() || 'Say something nice',
    buttonTextColor: page.buttonTextColor || '#121212',
    buttonBgColor: page.buttonBackgroundColor || '#F3F2F2',
    titleStyle: {
      fontFamily: page.titleFont || 'var(--font-degular)',
      fontSize: Number(page.titleSize) > 0 ? Number(page.titleSize) : 32,
      fontWeight: titleFormat.bold ? 700 : 600,
      fontStyle: titleFormat.italic ? 'italic' : 'normal',
      textDecoration: titleFormat.underline ? 'underline' : 'none',
      textAlign: toCssAlign(page.textAlignment),
      color: page.titleColor || '#121212',
    },
    descriptionStyle: {
      fontFamily: page.contentFont || 'var(--font-degular)',
      fontSize: Number(page.contentSize) > 0 ? Number(page.contentSize) : 14,
      textAlign: toCssAlign(page.textAlignment),
      color: page.contentColor || '#4B5563',
    },
    socialLinks: extractSocialLinks(page),
    currency: (page.settings?.currency || 'NGN').toUpperCase(),
  }
}

const extractComments = (data: unknown): CommentListItem[] => {
  if (!Array.isArray(data)) return []
  return data.map((item, index) => {
    const record = item as Record<string, unknown>
    const rawName = record.fullName ?? record.name ?? 'Anonymous'
    const fullName =
      typeof rawName === 'string' && rawName.trim().length > 0
        ? rawName.trim()
        : 'Anonymous'
    const rawComment = record.comment ?? record.message ?? ''

    return {
      id: String(record.id ?? `comment-${index}`),
      fullName,
      anonymous: Boolean(record.anonymous),
      comment: typeof rawComment === 'string' ? rawComment : '',
      createdAt: String(record.createdAt ?? record.updatedAt ?? ''),
    }
  })
}

const extractActivities = (data: unknown, currency: string): ActivityListItem[] => {
  if (!Array.isArray(data)) return []

  return data.map((item, index) => {
    const record = item as Record<string, unknown>
    const amountRaw = Number(record.amount ?? record.value ?? record.worth ?? 0)
    const amount =
      amountRaw > 0
        ? formatCurrency(amountRaw, {
            currency,
            maximumFractionDigits: 0,
          })
        : ''
    const actor = String(record.sender ?? record.fullName ?? record.name ?? 'Someone')
    const action = String(
      record.action ?? record.activity ?? record.type ?? 'made a contribution'
    )
    const gift = String(record.gift ?? record.itemName ?? record.title ?? '').trim()
    const detail = amount || gift ? ` ${amount}${amount && gift ? ' for ' : ''}${gift}` : ''
    const label = `${actor} ${action}${detail}`.replace(/\s+/g, ' ').trim()

    return {
      id: String(record.id ?? `activity-${index}`),
      label,
      time: toRelativeTime(record.createdAt ?? record.updatedAt),
    }
  })
}

const ContentImage = ({ data }: { data: PublicTemplateData }) => {
  if (data.mediaType === 'video') {
    return <video className='h-full w-full object-cover' src={data.mediaUrl} controls />
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={data.mediaUrl || DEFAULT_IMAGE} alt={data.title} className='h-full w-full object-cover' />
  )
}

const SocialLinksRow = ({ links }: { links: SocialLinks }) => (
  <div className='flex items-center gap-4'>
    {links.instagram && (
      <a href={links.instagram} target='_blank' rel='noopener noreferrer' aria-label='Instagram'>
        <span className='block h-4 w-4'>
          <InstagramColored />
        </span>
      </a>
    )}
    {links.twitter && (
      <a href={links.twitter} target='_blank' rel='noopener noreferrer' aria-label='X'>
        <span className='block h-4 w-4'>
          <XTwitterIcon />
        </span>
      </a>
    )}
    {links.linkedin && (
      <a href={links.linkedin} target='_blank' rel='noopener noreferrer' aria-label='LinkedIn'>
        <span className='block h-4 w-4'>
          <LinkedinIcon />
        </span>
      </a>
    )}
  </div>
)

const InteractionPanel = ({
  activeTab,
  setActiveTab,
  comments,
  activities,
  isLoading,
  isError,
  commentText,
  onCommentTextChange,
  canSubmitComment,
  isSubmittingComment,
  submitCommentError,
  onSubmitComment,
  hideName,
  setHideName,
  ownerOnly,
  setOwnerOnly,
  title,
}: InteractionPanelProps) => {
  return (
    <>
      <section className='mt-6 rounded-xl border border-primary-100 p-1'>
        <div className='grid grid-cols-2 gap-1'>
          <button
            onClick={() => setActiveTab('comments')}
            type='button'
            className={cn(
              'rounded-lg py-2 text-sm font-medium transition-colors',
              activeTab === 'comments' ? 'bg-primary-300 text-white' : 'text-grey-600'
            )}
          >
            Comments ({comments.length})
          </button>
          <button
            onClick={() => setActiveTab('activities')}
            type='button'
            className={cn(
              'rounded-lg py-2 text-sm font-medium transition-colors',
              activeTab === 'activities' ? 'bg-primary-300 text-white' : 'text-grey-600'
            )}
          >
            Activities
          </button>
        </div>
      </section>

      <section className='mt-4'>
        <div className='mb-3 flex items-center justify-between'>
          <h2 className='text-lg font-semibold text-blackish'>
            {activeTab === 'comments' ? 'Wishes from friends and family' : 'Activities'}
          </h2>
          <div className='flex items-center gap-1 text-xs text-grey-600'>
            <span>{activeTab === 'comments' ? 'Most recent' : 'Latest'}</span>
            <span className='h-3 w-3'>
              <ChevronDownIcon />
            </span>
          </div>
        </div>

        {activeTab === 'comments' ? (
          <div className='space-y-3'>
            {isLoading && <p className='text-sm text-grey-600'>Loading comments...</p>}
            {isError && <p className='text-sm text-error-500'>Unable to load comments right now.</p>}
            {!isLoading && !isError && comments.length === 0 && (
              <p className='text-sm text-grey-600'>No comments yet. Be the first to leave a wish.</p>
            )}
            {comments.map((item) => {
              const displayName = item.anonymous ? 'Anonymous' : item.fullName
              const avatarText = displayName.charAt(0).toUpperCase()

              return (
                <article
                  key={item.id}
                  className='flex items-start justify-between gap-3 border-b border-grey-50 pb-3'
                >
                  <div className='flex min-w-0 items-start gap-3'>
                    <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-warning-50 text-xs font-semibold text-warning-400'>
                      {avatarText}
                    </div>
                    <div>
                      <p className='text-sm font-semibold text-blackish'>{displayName}</p>
                      <p className='mt-1 text-sm text-grey-700'>{item.comment}</p>
                    </div>
                  </div>
                  <p className='shrink-0 text-xs text-grey-500'>{toRelativeTime(item.createdAt)}</p>
                </article>
              )
            })}
          </div>
        ) : (
          <div className='space-y-2'>
            {isLoading && <p className='text-sm text-grey-600'>Loading activities...</p>}
            {isError && <p className='text-sm text-error-500'>Unable to load activities right now.</p>}
            {!isLoading && !isError && activities.length === 0 && (
              <p className='text-sm text-grey-600'>No activities yet.</p>
            )}
            {activities.map((activity) => (
              <article
                key={activity.id}
                className='flex items-start justify-between gap-3 border-b border-grey-50 pb-2 text-sm'
              >
                <p className='text-grey-900'>{activity.label}</p>
                <p className='shrink-0 text-xs text-grey-500'>{activity.time}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className='mt-6'>
        <h3 className='text-3xl font-semibold text-blackish'>Drop a Comment</h3>
        <textarea
          value={commentText}
          onChange={(event) => onCommentTextChange(event.target.value)}
          placeholder={`Write a sweet wish for ${title}`}
          className='mt-3 min-h-[132px] w-full rounded-xl border border-grey-50 bg-[#F7F7FA] p-4 text-sm text-grey-900 outline-none transition-colors placeholder:text-grey-500 focus:border-primary-200'
        />
        <div className='mt-2 text-right text-xs text-grey-500'>{commentText.length}/500</div>

        <div className='mt-3 flex justify-end'>
          <button
            type='button'
            onClick={onSubmitComment}
            disabled={!canSubmitComment}
            className={cn(
              'rounded-lg px-6 py-2 text-sm font-medium text-white transition-opacity',
              canSubmitComment
                ? 'bg-linear-to-r from-primary-400 to-primary-600'
                : 'cursor-not-allowed bg-primary-100'
            )}
          >
            {isSubmittingComment ? 'Sending...' : 'Send Wishes'}
          </button>
        </div>

        <div className='mt-4 rounded-lg border border-warning-50 bg-warning-50/15 p-3'>
          <label className='flex items-center justify-between gap-3 text-sm text-grey-800'>
            Hide your name from other visitors
            <input
              checked={hideName}
              onChange={() => setHideName(!hideName)}
              type='checkbox'
              className='h-5 w-5 accent-success-300'
            />
          </label>
          <label className='mt-2 flex items-center justify-between gap-3 text-sm text-grey-800'>
            My comment should only be visible to the owner
            <input
              checked={ownerOnly}
              onChange={() => setOwnerOnly(!ownerOnly)}
              type='checkbox'
              className='h-5 w-5 accent-success-300'
            />
          </label>
        </div>

        {submitCommentError && (
          <p className='mt-3 text-sm text-error-500'>
            We could not submit your comment right now. Please try again.
          </p>
        )}
      </section>
    </>
  )
}

const TemplateScaffold = ({
  page,
  panel,
}: {
  page: PublicTemplateData
  panel: InteractionPanelProps
}) => {
  const titleStyle = {
    fontFamily: page.titleStyle.fontFamily,
    fontSize: `${Math.max(30, page.titleStyle.fontSize)}px`,
    fontWeight: page.titleStyle.fontWeight,
    fontStyle: page.titleStyle.fontStyle,
    textDecoration: page.titleStyle.textDecoration,
    textAlign: page.titleStyle.textAlign,
    color: page.titleStyle.color,
  } as const

  const descriptionStyle = {
    fontFamily: page.descriptionStyle.fontFamily,
    fontSize: `${Math.max(14, page.descriptionStyle.fontSize)}px`,
    textAlign: page.descriptionStyle.textAlign,
    color: page.descriptionStyle.color,
  } as const

  if (page.templateLayout === 'template2') {
    return (
      <div className='bg-white p-4 sm:p-8'>
        <div className='relative mb-6'>
          <div className='absolute left-0 top-0 h-24 w-full bg-warning-50' />
          <div className='relative pt-6'>
            <div className='mb-5 flex items-end justify-between'>
              <div className='h-24 w-24 overflow-hidden rounded-full border border-grey-50 shadow-[0px_0px_0px_6px_#FFFFFF] sm:h-32 sm:w-32'>
                <ContentImage data={page} />
              </div>
              <div className='flex flex-col items-end gap-3'>
                <SocialLinksRow links={page.socialLinks} />
                <button
                  type='button'
                  className='rounded-full px-4 py-2 text-sm font-medium'
                  style={{
                    backgroundColor: page.buttonBgColor,
                    color: page.buttonTextColor,
                  }}
                >
                  {page.buttonLabel}
                </button>
              </div>
            </div>
            <h1 style={titleStyle}>{page.title}</h1>
            <p className='mt-2 leading-7' style={descriptionStyle}>
              {page.description}
            </p>
          </div>
        </div>
        <InteractionPanel {...panel} />
      </div>
    )
  }

  if (page.templateLayout === 'template3') {
    return (
      <div className='bg-white p-4 sm:p-8'>
        <div className='relative mb-6'>
          <div className='absolute left-0 top-0 h-20 w-full rounded-full bg-secondary-100/60 blur-[22px]' />
          <div className='relative grid gap-5 md:grid-cols-2 md:items-center'>
            <div>
              <h1 style={titleStyle}>{page.title}</h1>
              <p className='mt-3 leading-7' style={descriptionStyle}>
                {page.description}
              </p>
              <div className='mt-4 flex items-center gap-3'>
                <button
                  type='button'
                  className='rounded-full px-4 py-2 text-sm font-medium'
                  style={{
                    backgroundColor: page.buttonBgColor,
                    color: page.buttonTextColor,
                  }}
                >
                  {page.buttonLabel}
                </button>
                <SocialLinksRow links={page.socialLinks} />
              </div>
            </div>
            <div className='overflow-hidden rounded-2xl shadow-[3px_3px_0px_0px_#143535]'>
              <ContentImage data={page} />
            </div>
          </div>
        </div>
        <InteractionPanel {...panel} />
      </div>
    )
  }

  if (page.templateLayout === 'template4') {
    return (
      <div className='bg-white p-4 sm:p-8'>
        <div className='relative mb-6'>
          <div className='absolute left-0 top-0 h-full w-1/2 rounded-br-[120px] bg-secondary-50/70 blur-[24px]' />
          <div className='relative grid gap-6 md:grid-cols-[1.1fr_1fr]'>
            <div>
              <div className='overflow-hidden rounded-2xl shadow-[3px_3px_0px_0px_#143535]'>
                <ContentImage data={page} />
              </div>
              <h1 className='mt-4' style={titleStyle}>
                {page.title}
              </h1>
              <div className='mt-3'>
                <SocialLinksRow links={page.socialLinks} />
              </div>
              <p className='mt-3 leading-7' style={descriptionStyle}>
                {page.description}
              </p>
            </div>
            <div>
              <div className='mb-4 flex justify-end'>
                <button
                  type='button'
                  className='rounded-full px-4 py-2 text-sm font-medium'
                  style={{
                    backgroundColor: page.buttonBgColor,
                    color: page.buttonTextColor,
                  }}
                >
                  {page.buttonLabel}
                </button>
              </div>
              <InteractionPanel {...panel} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='bg-white p-4 sm:p-8'>
      <div className='relative mb-6'>
        <div className='absolute left-0 top-0 h-36 w-full bg-warning-50' />
        <div className='relative pt-6'>
          <h1 style={titleStyle}>{page.title}</h1>
          <div className='mt-4 grid gap-6 md:grid-cols-2 md:items-center'>
            <div className='overflow-hidden rounded-2xl shadow-[3px_3px_0px_0px_#143535]'>
              <ContentImage data={page} />
            </div>
            <div>
              <p className='leading-7' style={descriptionStyle}>
                {page.description}
              </p>
              <div className='mt-4'>
                <button
                  type='button'
                  className='rounded-full px-4 py-2 text-sm font-medium'
                  style={{
                    backgroundColor: page.buttonBgColor,
                    color: page.buttonTextColor,
                  }}
                >
                  {page.buttonLabel}
                </button>
              </div>
              <div className='mt-4'>
                <SocialLinksRow links={page.socialLinks} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <InteractionPanel {...panel} />
    </div>
  )
}

export default function PublicGiftPageClient({ slug }: PublicGiftPageClientProps) {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<'comments' | 'activities'>('comments')
  const [commentText, setCommentText] = useState('')
  const [hideName, setHideName] = useState(false)
  const [ownerOnly, setOwnerOnly] = useState(false)

  const pageQuery = useQuery({
    queryKey: ['public-page', slug],
    queryFn: () => getPublicPageBySlug(slug),
    enabled: slug.length > 0,
  })

  const normalizedPage = useMemo(
    () => normalizePageData(pageQuery.data?.data),
    [pageQuery.data?.data]
  )

  const pageId = normalizedPage?.id || ''

  const submitComment = useMutation({
    mutationFn: () =>
      createPublicPageComment(pageId, {
        comment: commentText.trim(),
      }),
    onSuccess: async () => {
      setCommentText('')
      await queryClient.invalidateQueries({ queryKey: ['public-page', slug] })
    },
  })

  const comments = useMemo(
    () => extractComments(pageQuery.data?.data?.comments),
    [pageQuery.data?.data?.comments]
  )

  const activities = useMemo(
    () => extractActivities(pageQuery.data?.data?.activities, normalizedPage?.currency || 'NGN'),
    [pageQuery.data?.data?.activities, normalizedPage?.currency]
  )

  const canSubmitComment = commentText.trim().length > 0 && pageId.length > 0 && !submitComment.isPending

  if (pageQuery.isLoading) {
    return (
      <main className='min-h-screen bg-[#EDECFB] px-4 py-6'>
        <div className='mx-auto max-w-[924px] bg-white p-6'>
          <div className='h-12 w-52 animate-pulse rounded bg-grey-100' />
          <div className='mt-4 h-[420px] animate-pulse rounded bg-grey-100' />
        </div>
      </main>
    )
  }

  if (pageQuery.isError || !normalizedPage) {
    return (
      <main className='min-h-screen bg-[#EDECFB] px-4 py-6'>
        <div className='mx-auto max-w-[760px] bg-white p-8 text-center'>
          <p className='text-xl font-semibold text-blackish'>Gift page unavailable</p>
          <p className='mt-2 text-grey-700'>
            This link may be invalid, private, or no longer active.
          </p>
        </div>
      </main>
    )
  }

  const panelProps: InteractionPanelProps = {
    activeTab,
    setActiveTab,
    comments,
    activities,
    isLoading: pageQuery.isLoading,
    isError: pageQuery.isError,
    commentText,
    onCommentTextChange: setCommentText,
    canSubmitComment,
    isSubmittingComment: submitComment.isPending,
    submitCommentError: submitComment.isError,
    onSubmitComment: () => submitComment.mutate(),
    hideName,
    setHideName,
    ownerOnly,
    setOwnerOnly,
    title: normalizedPage.title,
  }

  return (
    <main className='min-h-screen bg-primary-50 px-4 py-4 sm:py-6'>
      <div className='mx-auto max-w-[924px] border border-white'>
        <TemplateScaffold page={normalizedPage} panel={panelProps} />
      </div>
    </main>
  )
}
