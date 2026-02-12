import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import DesktopEditingHeader from './DesktopEditingHeader'
import MobileEditingHeader from './MobileEditingHeader'
import DesktopEditingLayout from './DesktopEditingLayout'
import MobileEditingLayout from './MobileEditingLayout'
import MobilePreviewModal from './MobilePreviewModal'
import {
  CreateGiftProvider,
  useCustomGiftsContext,
  useGiftPageData,
  useGiftSettingsContext,
  useRecipientsContext,
} from './CreateGiftContext'
import { createPage } from '@/api/services/pages'
import { format } from 'date-fns'
import type { Step } from './EditingSection'

interface TemplatingEditingProps {
  handleBack: () => void
  onCreated: (link: string) => void
  selectedTemplate: number | null
}

const TemplatingEditingContent = ({
  handleBack,
  onCreated,
  selectedTemplate,
}: TemplatingEditingProps) => {
  const [customizationOpen, setCustomizationOpen] = useState(true)
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [longSave, setLongSave] = useState(false)
  const [step, setStep] = useState<Step>('customize')
  const { giftPageData, updateTitle, updateDescription, updateButton } =
    useGiftPageData()
  const {
    giftFor,
    giftType,
    currency,
    cashAmount,
    minAmount,
    maxAmount,
    targetAmount,
    customGifts,
    addMusic,
    privacy,
    receiverName,
    receiverEmail,
    allowJoinGifting,
    joinTargetAmount,
    joinMinAmount,
    setTimeframe,
    giftingEndDate,
    giftingEndTime,
  } = useGiftSettingsContext()
  const { recipients, recipientForm } = useRecipientsContext()
  const { customGiftItems } = useCustomGiftsContext()

  const hasGiftMedia = Boolean(giftPageData.media?.file)
  const [continueErrors, setContinueErrors] = useState<Record<string, string>>(
    {}
  )

  const titleDraftRef = useRef(giftPageData.title.text)
  const descriptionDraftRef = useRef(giftPageData.description.text)
  const buttonLabelDraftRef = useRef(giftPageData.button.label)

  useEffect(() => {
    titleDraftRef.current = giftPageData.title.text
  }, [giftPageData.title.text])

  useEffect(() => {
    descriptionDraftRef.current = giftPageData.description.text
  }, [giftPageData.description.text])

  useEffect(() => {
    buttonLabelDraftRef.current = giftPageData.button.label
  }, [giftPageData.button.label])

  const titleFormat = useMemo(() => {
    if (giftPageData.title.bold) return 'bold'
    if (giftPageData.title.italic) return 'italic'
    if (giftPageData.title.underline) return 'underline'
    return 'normal'
  }, [
    giftPageData.title.bold,
    giftPageData.title.italic,
    giftPageData.title.underline,
  ])

  const normalizeAmount = (value: string) => value.replace(/[^\d.]/g, '').trim()

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

  const isValidAmount = (value: string) => {
    const normalized = normalizeAmount(value)
    if (!normalized) return false
    const parsed = Number(normalized)
    return Number.isFinite(parsed) && parsed > 0
  }

  const getValidationErrors = () => {
    const errors: Record<string, string> = {}

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

    if (!giftFor) {
      errors.giftFor = 'Please select who the gift is for.'
    }

    if (!giftType) {
      errors.giftType = 'Please select a gift type.'
    }

    if (!privacy) {
      errors.privacy = 'Please select a privacy level.'
    }

    if (!customGifts) {
      errors.customGifts = 'Please select if you want to add custom gifts.'
    }

    if (!addMusic) {
      errors.addMusic = 'Please select if you want to add music.'
    }

    if (giftType === 'cash') {
      if (!currency) {
        errors.currency = 'Currency is required.'
      }

      if (giftFor === 'someone_else') {
        if (!isValidAmount(cashAmount)) {
          errors.cashAmount = 'Enter a valid cash amount.'
        }
        if (!receiverName.trim()) {
          errors.receiverName = "Receiver's name is required."
        }
        if (!receiverEmail.trim() || !isValidEmail(receiverEmail)) {
          errors.receiverEmail = "Receiver's email is invalid."
        }

        if (allowJoinGifting === 'yes') {
          if (!isValidAmount(joinTargetAmount)) {
            errors.joinTargetAmount = 'Join target amount is required.'
          }
          if (!isValidAmount(joinMinAmount)) {
            errors.joinMinAmount = 'Join minimum amount is required.'
          }
        }

        if (setTimeframe === 'yes') {
          if (!giftingEndDate) {
            errors.giftingEndDate = 'Gifting end date is required.'
          }
          if (!giftingEndTime) {
            errors.giftingEndTime = 'Gifting end time is required.'
          }
        }
      } else if (giftFor === 'for_me') {
        if (!isValidAmount(minAmount)) {
          errors.minAmount = 'Minimum amount is required.'
        }
        if (!isValidAmount(maxAmount)) {
          errors.maxAmount = 'Maximum amount is required.'
        }
        if (!isValidAmount(targetAmount)) {
          errors.targetAmount = 'Target amount is required.'
        }
        const minValue = Number(normalizeAmount(minAmount))
        const maxValue = Number(normalizeAmount(maxAmount))
        if (
          Number.isFinite(minValue) &&
          Number.isFinite(maxValue) &&
          minValue > maxValue
        ) {
          errors.minAmount = 'Minimum amount must be less than maximum amount.'
        }
      }
    }

    if (customGifts === 'yes') {
      if (customGiftItems.length === 0) {
        errors.customGifts = 'Add at least one custom gift.'
      } else {
        customGiftItems.forEach((item, index) => {
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

    if (privacy === 'private') {
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

  const getCustomizeValidationErrors = () => {
    const errors: Record<string, string> = {}
    if (!titleDraftRef.current.trim()) {
      errors.title = 'Title is required.'
    }

    const content = descriptionDraftRef.current.trim()
    if (!content) {
      errors.description = 'Description is required.'
    } else if (content.length < 50 || content.length > 1000) {
      errors.description = 'Description must be between 50 and 1000 characters.'
    }

    if (!giftPageData.media?.file) {
      errors.media = 'Cover image or video is required.'
    }

    if (!buttonLabelDraftRef.current.trim()) {
      errors.buttonLabel = 'Button label is required.'
    }

    return errors
  }

  const commitDrafts = () => {
    if (titleDraftRef.current !== giftPageData.title.text) {
      updateTitle({ ...giftPageData.title, text: titleDraftRef.current })
    }
    if (descriptionDraftRef.current !== giftPageData.description.text) {
      updateDescription({
        ...giftPageData.description,
        text: descriptionDraftRef.current,
      })
    }
    if (buttonLabelDraftRef.current !== giftPageData.button.label) {
      updateButton({
        ...giftPageData.button,
        label: buttonLabelDraftRef.current,
      })
    }
  }

  const clearFieldError = (key: string) => {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const scrollToFirstError = () => {
    if (typeof window === 'undefined') return
    requestAnimationFrame(() => {
      const formError = document.querySelector('[data-form-error=\"true\"]')
      if (formError && 'scrollIntoView' in formError) {
        formError.scrollIntoView({ behavior: 'smooth', block: 'center' })
        return
      }
      const firstError = document.querySelector('[data-error=\"true\"]')
      if (firstError && 'scrollIntoView' in firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    })
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

  const disableContinue = false

  const handleSave = async () => {
    if (isSaving) return
    setIsSaving(true)
    setFieldErrors({})
    setLongSave(false)
    const longSaveTimer = setTimeout(() => {
      setLongSave(true)
    }, 12000)

    try {
      commitDrafts()
      const validationErrors = getValidationErrors()
      if (Object.keys(validationErrors).length > 0) {
        setFieldErrors(validationErrors)
        scrollToFirstError()
        return
      }

      const formData = new FormData()

      appendIf(formData, 'title', giftPageData.title.text)
      appendIf(formData, 'content', giftPageData.description.text)
      appendIf(formData, 'active', 'true')
      appendIf(formData, 'titleFont', giftPageData.title.font)
      appendIf(formData, 'titleColor', giftPageData.title.color)
      appendIf(formData, 'textAlignment', giftPageData.title.alignment)
      appendIf(formData, 'titleFormat', titleFormat)
      appendIf(formData, 'categoryId', 'dummy-category-id')

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

      if (hasGiftMedia && giftPageData.media.file) {
        appendIf(formData, 'coverImage', giftPageData.media.file)
      }

      if (selectedTemplate) {
        appendIf(formData, 'templateId', String(selectedTemplate))
      }

      const whoIsFor = giftFor
      appendIf(formData, 'settings[whoIsFor]', whoIsFor)
      appendIf(
        formData,
        'settings[acceptCashGift]',
        String(giftType === 'cash')
      )
      appendIf(
        formData,
        'settings[hasStoreItems]',
        String(giftType === 'items')
      )
      appendIf(
        formData,
        'settings[allowCustomGifts]',
        String(customGifts === 'yes')
      )
      appendIf(formData, 'settings[hasMusic]', String(addMusic === 'yes'))
      appendIf(formData, 'settings[privacy]', privacy)

      if (giftType === 'cash') {
        appendIf(
          formData,
          'settings[cashGift][currency]',
          currency ? currency.toUpperCase() : ''
        )

        if (giftFor === 'someone_else') {
          const normalizedCashAmount = normalizeAmount(cashAmount)
          appendIf(
            formData,
            'settings[cashGift][targetAmount]',
            normalizedCashAmount
          )
        } else {
          appendIf(
            formData,
            'settings[cashGift][minimumAmount]',
            normalizeAmount(minAmount)
          )
          appendIf(
            formData,
            'settings[cashGift][maximumAmount]',
            normalizeAmount(maxAmount)
          )
          appendIf(
            formData,
            'settings[cashGift][targetAmount]',
            normalizeAmount(targetAmount)
          )
        }
      }

      if (customGifts === 'yes') {
        customGiftItems.forEach((item, index) => {
          appendIf(
            formData,
            `settings[customGifts][${index}][title]`,
            item.title
          )
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
        appendIf(formData, `settings[socials][${index}][url]`, social.url || '')
      })

      if (receiverName) {
        appendIf(formData, 'settings[receiver][name]', receiverName)
      }
      if (receiverEmail) {
        appendIf(formData, 'settings[receiver][email]', receiverEmail)
      }

      if (giftType === 'cash' && giftFor === 'someone_else') {
        appendIf(
          formData,
          'settings[allowJoinGifting]',
          String(allowJoinGifting === 'yes')
        )
        appendIf(
          formData,
          'settings[joinTargetAmount]',
          normalizeAmount(joinTargetAmount)
        )
        appendIf(
          formData,
          'settings[joinMinAmount]',
          normalizeAmount(joinMinAmount)
        )
        appendIf(
          formData,
          'settings[setTimeframe]',
          String(setTimeframe === 'yes')
        )
        if (giftingEndDate) {
          appendIf(
            formData,
            'settings[giftingEndDate]',
            format(giftingEndDate, 'yyyy-MM-dd')
          )
        }
        appendIf(formData, 'settings[giftingEndTime]', giftingEndTime)
      }

      const resp = await createPage(formData)
      const data = resp?.data ?? {}

      let link =
        data.link ||
        data.url ||
        data.pageUrl ||
        data.pageLink ||
        data.slug ||
        ''

      if (!link && data.id) {
        link = String(data.id)
      }

      if (link && !link.startsWith('http')) {
        const origin =
          typeof window !== 'undefined' ? window.location.origin : ''
        link = `${origin}/gifts/${link}`
      }

      onCreated(link)
    } catch (error) {
      console.error('Failed to create gift page:', error)
      setFieldErrors({
        form: 'Failed to create gift page. Please try again.',
      })
      scrollToFirstError()
    } finally {
      clearTimeout(longSaveTimer)
      setIsSaving(false)
    }
  }

  return (
    <motion.div
      key='customize'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='w-full h-full'
    >
      {isSaving && (
        <div
          className='fixed inset-0 z-100 flex items-center justify-center bg-black/35 backdrop-blur-[2px]'
          role='alert'
          aria-busy='true'
          aria-live='assertive'
        >
          <div className='w-[90%] max-w-md h-[90%] max-h-40 flex flex-col items-center justify-center gap-3 rounded-2xl bg-white px-6 py-5 shadow-xl'>
            <div className='h-8 w-8 animate-spin rounded-full border-3 border-primary-200 border-t-primary-600' />
            <p className='text-sm font-medium text-grey-700'>
              Creating gift page...
            </p>
            {longSave && (
              <p className='text-xs text-grey-500'>
                Still working… please keep this page open.
              </p>
            )}
          </div>
        </div>
      )}
      <DesktopEditingHeader
        onBack={handleBack}
        customizationOpen={customizationOpen}
        onOpenCustomization={() => setCustomizationOpen(true)}
      />
      <MobileEditingHeader
        onOpenPreview={() => setMobilePreviewOpen(true)}
        showPreview={true}
      />
      <DesktopEditingLayout
        customizationOpen={customizationOpen}
        selectedTemplate={selectedTemplate}
        onCloseCustomization={() => setCustomizationOpen(false)}
        onSave={handleSave}
        isSaving={isSaving}
        errors={fieldErrors}
        continueErrors={continueErrors}
        disableContinue={disableContinue}
        step={step}
        onStepChange={setStep}
        onClearError={clearFieldError}
        customizeValues={{
          onTitleCommit: (value) =>
            updateTitle({ ...giftPageData.title, text: value }),
          onDescriptionCommit: (value) =>
            updateDescription({ ...giftPageData.description, text: value }),
          onButtonLabelCommit: (value) =>
            updateButton({ ...giftPageData.button, label: value }),
          onTitleDraftChange: (value) => {
            titleDraftRef.current = value
            if (continueErrors.title) {
              setContinueErrors((prev) => ({ ...prev, title: '' }))
            }
          },
          onDescriptionDraftChange: (value) => {
            descriptionDraftRef.current = value
            if (continueErrors.description) {
              setContinueErrors((prev) => ({ ...prev, description: '' }))
            }
          },
          onButtonLabelDraftChange: (value) => {
            buttonLabelDraftRef.current = value
            if (continueErrors.buttonLabel) {
              setContinueErrors((prev) => ({ ...prev, buttonLabel: '' }))
            }
          },
          onMediaChange: () => {
            if (continueErrors.media) {
              setContinueErrors((prev) => ({ ...prev, media: '' }))
            }
          },
        }}
        showPreview={true}
        onContinueAttempt={() => {
          const nextErrors = getCustomizeValidationErrors()
          const hasErrors = Object.values(nextErrors).some((value) => value)
          setContinueErrors(nextErrors)
          if (hasErrors) return false
          commitDrafts()
          return true
        }}
      />
      <MobileEditingLayout
        onClose={handleBack}
        onSave={handleSave}
        isSaving={isSaving}
        errors={fieldErrors}
        continueErrors={continueErrors}
        disableContinue={disableContinue}
        step={step}
        onStepChange={setStep}
        onClearError={clearFieldError}
        customizeValues={{
          onTitleCommit: (value) =>
            updateTitle({ ...giftPageData.title, text: value }),
          onDescriptionCommit: (value) =>
            updateDescription({ ...giftPageData.description, text: value }),
          onButtonLabelCommit: (value) =>
            updateButton({ ...giftPageData.button, label: value }),
          onTitleDraftChange: (value) => {
            titleDraftRef.current = value
            if (continueErrors.title) {
              setContinueErrors((prev) => ({ ...prev, title: '' }))
            }
          },
          onDescriptionDraftChange: (value) => {
            descriptionDraftRef.current = value
            if (continueErrors.description) {
              setContinueErrors((prev) => ({ ...prev, description: '' }))
            }
          },
          onButtonLabelDraftChange: (value) => {
            buttonLabelDraftRef.current = value
            if (continueErrors.buttonLabel) {
              setContinueErrors((prev) => ({ ...prev, buttonLabel: '' }))
            }
          },
          onMediaChange: () => {
            if (continueErrors.media) {
              setContinueErrors((prev) => ({ ...prev, media: '' }))
            }
          },
        }}
        onContinueAttempt={() => {
          const nextErrors = getCustomizeValidationErrors()
          const hasErrors = Object.values(nextErrors).some((value) => value)
          setContinueErrors(nextErrors)
          if (hasErrors) return false
          commitDrafts()
          return true
        }}
      />
      <MobilePreviewModal
        isOpen={mobilePreviewOpen}
        onClose={() => setMobilePreviewOpen(false)}
        selectedTemplate={selectedTemplate}
        showPreview={true}
      />
    </motion.div>
  )
}

const TemplatingEditing = (props: TemplatingEditingProps) => {
  return (
    <CreateGiftProvider>
      <TemplatingEditingContent {...props} />
    </CreateGiftProvider>
  )
}

export default TemplatingEditing
