import { format } from 'date-fns'
import type { GiftPageData, Recipient } from '@/types/gifts'
import { type CustomGiftForm } from '@/types/Gifts/index'
import type { GiftSettingsValues } from './validation'
import { hasCashGiftType, hasStoreGiftType, normalizeAmount } from './validation'

type BuildFormDataInput = {
  giftPageData: GiftPageData
  selectedTemplate: string | null
  categoryId: string
  titleFormat: string
  settings: GiftSettingsValues
  customGiftItems: CustomGiftForm[]
  recipients: Recipient[]
  recipientForm: Recipient
}

type SocialProvider = 'instagram' | 'facebook' | 'x' | 'linkedin'

const SOCIAL_PROVIDER_CONFIG = {
  instagram: {
    domains: ['instagram.com', 'www.instagram.com'],
    baseUrl: 'https://www.instagram.com',
    defaultPathPrefix: '',
  },
  facebook: {
    domains: ['facebook.com', 'www.facebook.com', 'fb.com', 'www.fb.com'],
    baseUrl: 'https://www.facebook.com',
    defaultPathPrefix: '',
  },
  x: {
    domains: ['x.com', 'www.x.com', 'twitter.com', 'www.twitter.com'],
    baseUrl: 'https://x.com',
    defaultPathPrefix: '',
  },
  linkedin: {
    domains: ['linkedin.com', 'www.linkedin.com'],
    baseUrl: 'https://www.linkedin.com',
    defaultPathPrefix: 'in',
  },
} satisfies Record<
  SocialProvider,
  {
    domains: string[]
    baseUrl: string
    defaultPathPrefix: string
  }
>

const appendIf = (
  formData: FormData,
  key: string,
  value?: string | Blob | null
) => {
  if (value === undefined || value === null) return
  if (typeof value === 'string' && value.trim() === '') return
  formData.append(key, value)
}

const trimSlashes = (value: string) => value.replace(/^\/+|\/+$/g, '')

const buildStructuredSocialUrl = (
  provider: SocialProvider,
  handleOrPath: string
) => {
  const config = SOCIAL_PROVIDER_CONFIG[provider]
  const normalizedPath = trimSlashes(handleOrPath)
  if (!normalizedPath) return ''

  const encodedSegments = normalizedPath
    .split('/')
    .map((segment) => segment.trim())
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))

  if (encodedSegments.length === 0) return ''

  const finalSegments =
    config.defaultPathPrefix &&
    encodedSegments[0]?.toLowerCase() !== config.defaultPathPrefix
      ? [config.defaultPathPrefix, ...encodedSegments]
      : encodedSegments

  return `${config.baseUrl}/${finalSegments.join('/')}`
}

const normalizeSocialUrl = (provider: SocialProvider, value?: string) => {
  const rawValue = value?.trim()
  if (!rawValue) return ''

  const sanitizedValue = rawValue.replace(/^@+/, '').trim()
  if (!sanitizedValue) return ''

  try {
    const withProtocol = /^[a-z]+:\/\//i.test(sanitizedValue)
      ? sanitizedValue
      : `https://${sanitizedValue}`
    const parsed = new URL(withProtocol)
    const config = SOCIAL_PROVIDER_CONFIG[provider]
    const hostname = parsed.hostname.toLowerCase()

    if (!config.domains.includes(hostname)) {
      return buildStructuredSocialUrl(provider, sanitizedValue)
    }

    const normalizedPath = trimSlashes(decodeURIComponent(parsed.pathname))
    const rebuiltUrl = buildStructuredSocialUrl(provider, normalizedPath)
    if (!rebuiltUrl) return config.baseUrl

    return `${rebuiltUrl}${parsed.search}${parsed.hash}`
  } catch {
    return buildStructuredSocialUrl(provider, sanitizedValue)
  }
}

export const buildCreatePageFormData = ({
  giftPageData,
  selectedTemplate,
  categoryId,
  titleFormat,
  settings,
  customGiftItems,
  recipients,
  recipientForm,
}: BuildFormDataInput) => {
  const formData = new FormData()

  appendIf(formData, 'title', giftPageData.title.text)
  appendIf(formData, 'content', giftPageData.description.text)
  appendIf(formData, 'active', 'true')
  appendIf(formData, 'titleFont', giftPageData.title.font)
  appendIf(formData, 'titleColor', giftPageData.title.color)
  appendIf(formData, 'textAlignment', giftPageData.title.alignment)
  appendIf(formData, 'titleFormat', titleFormat)

  const titleSize = parseInt(giftPageData.title.size, 10)
  if (!Number.isNaN(titleSize)) {
    appendIf(formData, 'titleSize', String(titleSize))
  }

  appendIf(formData, 'buttonLabel', giftPageData.button.label)
  appendIf(formData, 'buttonTextColor', giftPageData.button.textColor)
  appendIf(
    formData,
    'buttonBackgroundColor',
    giftPageData.button.backgroundColor
  )

  appendIf(formData, 'contentFont', giftPageData.description.font)
  appendIf(formData, 'contentColor', giftPageData.description.color)
  const contentSize = parseInt(giftPageData.description.size, 10)
  if (!Number.isNaN(contentSize)) {
    appendIf(formData, 'contentSize', String(contentSize))
  }

  if (giftPageData.media?.file) {
    appendIf(formData, 'coverImage', giftPageData.media.file)
  }

  if (selectedTemplate) {
    appendIf(formData, 'templateId', selectedTemplate)
  }

  appendIf(formData, 'categoryId', categoryId)

  appendIf(formData, 'settings[whoIsFor]', settings.giftFor)
  const hasCashGift = hasCashGiftType(settings.giftType)
  const hasStoreItems = hasStoreGiftType(settings.giftType)

  appendIf(
    formData,
    'settings[acceptCashGift]',
    String(hasCashGift)
  )
  appendIf(
    formData,
    'settings[hasStoreItems]',
    String(hasStoreItems)
  )
  appendIf(
    formData,
    'settings[allowCustomGifts]',
    String(settings.customGifts === 'yes')
  )
  appendIf(formData, 'settings[hasMusic]', String(settings.addMusic === 'yes'))
  appendIf(formData, 'settings[privacy]', settings.privacy)

  if (hasCashGift) {
    appendIf(
      formData,
      'settings[cashGift][currency]',
      settings.currency ? settings.currency.toUpperCase() : ''
    )

    if (settings.giftFor === 'someone_else') {
      appendIf(
        formData,
        'settings[cashGift][targetAmount]',
        normalizeAmount(settings.cashAmount)
      )
    } else {
      appendIf(
        formData,
        'settings[cashGift][minimumAmount]',
        normalizeAmount(settings.minAmount)
      )
      appendIf(
        formData,
        'settings[cashGift][targetAmount]',
        normalizeAmount(settings.targetAmount)
      )
    }
  }

  if (settings.customGifts === 'yes') {
    customGiftItems.forEach((item, index) => {
      appendIf(formData, `settings[customGifts][${index}][title]`, item.title)
      appendIf(
        formData,
        `settings[customGifts][${index}][quantity]`,
        item.quantity
      )
      appendIf(
        formData,
        `settings[customGifts][${index}][unitPrice]`,
        normalizeAmount(item.price)
      )
      if (item.imageFile) {
        appendIf(
          formData,
          `settings[customGifts][${index}][image]`,
          item.imageFile
        )
      }
    })
  }

  const effectiveRecipients =
    recipients.length > 0
      ? recipients
      : recipientForm.name.trim() && recipientForm.email.trim()
      ? [
          {
            name: recipientForm.name.trim(),
            email: recipientForm.email.trim(),
          },
        ]
      : []

  effectiveRecipients.forEach((recipient, index) => {
    appendIf(formData, `settings[recipients][${index}][name]`, recipient.name)
    appendIf(formData, `settings[recipients][${index}][email]`, recipient.email)
  })

  const socialSources = [
    { provider: 'instagram', url: giftPageData.socialLinks.instagram },
    { provider: 'facebook', url: giftPageData.socialLinks.facebook },
    { provider: 'x', url: giftPageData.socialLinks.twitter },
    { provider: 'linkedin', url: giftPageData.socialLinks.linkedin },
  ] satisfies Array<{ provider: SocialProvider; url?: string }>

  const socials = socialSources
    .map((social) => ({
      provider: social.provider,
      url: normalizeSocialUrl(social.provider, social.url),
    }))
    .filter((social) => Boolean(social.url))

  socials.forEach((social, index) => {
    appendIf(formData, `settings[socials][${index}][provider]`, social.provider)
    appendIf(formData, `settings[socials][${index}][url]`, social.url || '')
  })

  if (settings.receiverName) {
    appendIf(formData, 'settings[receiver][name]', settings.receiverName)
  }
  if (settings.receiverEmail) {
    appendIf(formData, 'settings[receiver][email]', settings.receiverEmail)
  }

  if (hasCashGift && settings.giftFor === 'someone_else') {
    appendIf(
      formData,
      'settings[allowJoinGifting]',
      String(settings.allowJoinGifting === 'yes')
    )
    appendIf(
      formData,
      'settings[joinTargetAmount]',
      normalizeAmount(settings.joinTargetAmount)
    )
    appendIf(
      formData,
      'settings[joinMinAmount]',
      normalizeAmount(settings.joinMinAmount)
    )
    appendIf(
      formData,
      'settings[setTimeframe]',
      String(settings.setTimeframe === 'yes')
    )
    if (settings.giftingEndDate) {
      appendIf(
        formData,
        'settings[giftingEndDate]',
        format(settings.giftingEndDate, 'yyyy-MM-dd')
      )
    }
    appendIf(formData, 'settings[giftingEndTime]', settings.giftingEndTime)
  }

  return formData
}
