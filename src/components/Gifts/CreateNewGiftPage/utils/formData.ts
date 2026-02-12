import { format } from 'date-fns'
import type { GiftPageData, Recipient } from '@/types/gifts'
import type { CustomGiftForm } from '../types'
import type { GiftSettingsValues } from './validation'
import { normalizeAmount } from './validation'

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

const appendIf = (
  formData: FormData,
  key: string,
  value?: string | Blob | null
) => {
  if (value === undefined || value === null) return
  if (typeof value === 'string' && value.trim() === '') return
  formData.append(key, value)
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
  appendIf(
    formData,
    'settings[acceptCashGift]',
    String(settings.giftType === 'cash')
  )
  appendIf(
    formData,
    'settings[hasStoreItems]',
    String(settings.giftType === 'items')
  )
  appendIf(
    formData,
    'settings[allowCustomGifts]',
    String(settings.customGifts === 'yes')
  )
  appendIf(formData, 'settings[hasMusic]', String(settings.addMusic === 'yes'))
  appendIf(formData, 'settings[privacy]', settings.privacy)

  if (settings.giftType === 'cash') {
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
        'settings[cashGift][maximumAmount]',
        normalizeAmount(settings.maxAmount)
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
    appendIf(
      formData,
      `settings[recipients][${index}][name]`,
      recipient.name
    )
    appendIf(
      formData,
      `settings[recipients][${index}][email]`,
      recipient.email
    )
  })

  const socials = [
    { provider: 'instagram', url: giftPageData.socialLinks.instagram },
    { provider: 'x', url: giftPageData.socialLinks.twitter },
    { provider: 'linkedin', url: giftPageData.socialLinks.linkedin },
  ].filter((social) => Boolean(social.url?.trim()))

  socials.forEach((social, index) => {
    appendIf(
      formData,
      `settings[socials][${index}][provider]`,
      social.provider
    )
    appendIf(
      formData,
      `settings[socials][${index}][url]`,
      social.url || ''
    )
  })

  if (settings.receiverName) {
    appendIf(formData, 'settings[receiver][name]', settings.receiverName)
  }
  if (settings.receiverEmail) {
    appendIf(formData, 'settings[receiver][email]', settings.receiverEmail)
  }

  if (settings.giftType === 'cash' && settings.giftFor === 'someone_else') {
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
