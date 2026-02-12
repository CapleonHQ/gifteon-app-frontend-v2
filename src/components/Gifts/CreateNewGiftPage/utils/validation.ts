import type { GiftPageData, Recipient } from '@/types/gifts'
import type { CustomGiftForm } from '../types'

export type CustomizeDraft = {
  title: string
  description: string
  buttonLabel: string
  hasMedia: boolean
}

export type GiftSettingsValues = {
  giftFor: 'for_me' | 'someone_else' | ''
  giftType: 'cash' | 'items' | ''
  currency: string
  cashAmount: string
  minAmount: string
  maxAmount: string
  targetAmount: string
  customGifts: 'yes' | 'no' | ''
  addMusic: 'yes' | 'no' | ''
  privacy: 'public' | 'shareable' | 'private' | ''
  receiverName: string
  receiverEmail: string
  allowJoinGifting: 'yes' | 'no' | ''
  joinTargetAmount: string
  joinMinAmount: string
  setTimeframe: 'yes' | 'no' | ''
  giftingEndDate: Date | undefined
  giftingEndTime: string
}

export type CreateGiftValidationInput = {
  giftPageData: GiftPageData
  selectedTemplate: number | null
  settings: GiftSettingsValues
  recipients: Recipient[]
  recipientForm: Recipient
  customGiftItems: CustomGiftForm[]
}

export const normalizeAmount = (value: string) =>
  value.replace(/[^\d.]/g, '').trim()

export const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export const isValidAmount = (value: string) => {
  const normalized = normalizeAmount(value)
  if (!normalized) return false
  const parsed = Number(normalized)
  return Number.isFinite(parsed) && parsed > 0
}

export const validateCustomizeDraft = (draft: CustomizeDraft) => {
  const errors: Record<string, string> = {}

  if (!draft.title.trim()) {
    errors.title = 'Title is required.'
  }

  const content = draft.description.trim()
  if (!content) {
    errors.description = 'Description is required.'
  } else if (content.length < 50 || content.length > 1000) {
    errors.description = 'Description must be between 50 and 1000 characters.'
  }

  if (!draft.hasMedia) {
    errors.media = 'Cover image or video is required.'
  }

  if (!draft.buttonLabel.trim()) {
    errors.buttonLabel = 'Button label is required.'
  }

  return errors
}

export const validateCreateGift = (input: CreateGiftValidationInput) => {
  const errors: Record<string, string> = {}
  const { giftPageData, selectedTemplate, settings, recipients, recipientForm } =
    input

  if (!giftPageData.title.text.trim()) {
    errors.title = 'Title is required.'
  }

  const content = giftPageData.description.text.trim()
  if (!content) {
    errors.description = 'Description is required.'
  } else if (content.length < 50 || content.length > 1000) {
    errors.description = 'Description must be between 50 and 1000 characters.'
  }

  if (!selectedTemplate) {
    errors.template = 'Please select a template.'
  }

  if (!giftPageData.media?.file) {
    errors.media = 'Cover image or video is required.'
  }

  if (!settings.giftFor) {
    errors.giftFor = 'Please select who the gift is for.'
  }

  if (!settings.giftType) {
    errors.giftType = 'Please select a gift type.'
  }

  if (!settings.privacy) {
    errors.privacy = 'Please select a privacy level.'
  }

  if (!settings.customGifts) {
    errors.customGifts = 'Please select if you want to add custom gifts.'
  }

  if (!settings.addMusic) {
    errors.addMusic = 'Please select if you want to add music.'
  }

  if (settings.giftType === 'cash') {
    if (!settings.currency) {
      errors.currency = 'Currency is required.'
    }

    if (settings.giftFor === 'someone_else') {
      if (!isValidAmount(settings.cashAmount)) {
        errors.cashAmount = 'Enter a valid cash amount.'
      }
      if (!settings.receiverName.trim()) {
        errors.receiverName = "Receiver's name is required."
      }
      if (
        !settings.receiverEmail.trim() ||
        !isValidEmail(settings.receiverEmail)
      ) {
        errors.receiverEmail = "Receiver's email is invalid."
      }

      if (settings.allowJoinGifting === 'yes') {
        if (!isValidAmount(settings.joinTargetAmount)) {
          errors.joinTargetAmount = 'Join target amount is required.'
        }
        if (!isValidAmount(settings.joinMinAmount)) {
          errors.joinMinAmount = 'Join minimum amount is required.'
        }
      }

      if (settings.setTimeframe === 'yes') {
        if (!settings.giftingEndDate) {
          errors.giftingEndDate = 'Gifting end date is required.'
        }
        if (!settings.giftingEndTime) {
          errors.giftingEndTime = 'Gifting end time is required.'
        }
      }
    } else if (settings.giftFor === 'for_me') {
      if (!isValidAmount(settings.minAmount)) {
        errors.minAmount = 'Minimum amount is required.'
      }
      if (!isValidAmount(settings.maxAmount)) {
        errors.maxAmount = 'Maximum amount is required.'
      }
      if (!isValidAmount(settings.targetAmount)) {
        errors.targetAmount = 'Target amount is required.'
      }
      const minValue = Number(normalizeAmount(settings.minAmount))
      const maxValue = Number(normalizeAmount(settings.maxAmount))
      if (
        Number.isFinite(minValue) &&
        Number.isFinite(maxValue) &&
        minValue > maxValue
      ) {
        errors.minAmount = 'Minimum amount must be less than maximum amount.'
      }
    }
  }

  if (settings.customGifts === 'yes') {
    if (input.customGiftItems.length === 0) {
      errors.customGifts = 'Add at least one custom gift.'
    } else {
      input.customGiftItems.forEach((item, index) => {
        if (!item.title.trim()) {
          errors.customGifts = `Custom gift #${index + 1} title is required.`
        }
        if (!isValidAmount(item.price)) {
          errors.customGifts = `Custom gift #${index + 1} price is required.`
        }
        const qty = Number(item.quantity)
        if (!Number.isFinite(qty) || qty <= 0) {
          errors.customGifts = `Custom gift #${
            index + 1
          } quantity is invalid.`
        }
      })
    }
  }

  if (settings.privacy === 'private') {
    if (recipients.length === 0) {
      const draftName = recipientForm.name.trim()
      const draftEmail = recipientForm.email.trim()
      if (!draftName && !draftEmail) {
        errors.recipients = 'Add at least one recipient for private pages.'
      } else {
        if (!draftName) {
          errors.recipientName = 'Recipient name is required.'
        }
        if (!draftEmail) {
          errors.recipientEmail = 'Recipient email is required.'
        } else if (!isValidEmail(draftEmail)) {
          errors.recipientEmail = 'Enter a valid recipient email address.'
        }
      }
    } else {
      const missingName = recipients.find(
        (recipient) => !recipient.name.trim()
      )
      if (missingName) {
        errors.recipients = 'Recipient name is required.'
      } else {
        const missingEmail = recipients.find(
          (recipient) => !recipient.email.trim()
        )
        if (missingEmail) {
          errors.recipients = 'Recipient email is required.'
        } else {
          const invalidEmail = recipients.find(
            (recipient) => !isValidEmail(recipient.email)
          )
          if (invalidEmail) {
            errors.recipients = 'Enter a valid recipient email address.'
          }
        }
      }
    }
  }

  return errors
}
