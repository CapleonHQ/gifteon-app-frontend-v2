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
import type { Step } from './EditingSection'
import { validateCreateGift, validateCustomizeDraft } from './utils/validation'
import { buildCreatePageFormData } from './utils/formData'
import { useCreateGiftPage } from './hooks/useCreateGiftPage'

interface TemplatingEditingProps {
  handleBack: () => void
  onCreated: (link: string) => void
  selectedTemplate: string | null
}

const TemplatingEditingContent = ({
  handleBack,
  onCreated,
  selectedTemplate,
}: TemplatingEditingProps) => {
  const [customizationOpen, setCustomizationOpen] = useState(true)
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false)
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
    const formats = []
    if (giftPageData.title.bold) formats.push('bold')
    if (giftPageData.title.italic) formats.push('italics')
    if (giftPageData.title.underline) formats.push('underline')
    return formats.length > 0 ? formats.join(':') : 'none'
  }, [
    giftPageData.title.bold,
    giftPageData.title.italic,
    giftPageData.title.underline,
  ])

  const settings = useMemo(
    () => ({
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
    }),
    [
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
    ]
  )

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
      const formError = document.querySelector('[data-form-error="true"]')
      if (formError && 'scrollIntoView' in formError) {
        formError.scrollIntoView({ behavior: 'smooth', block: 'center' })
        return
      }
      const firstError = document.querySelector('[data-error="true"]')
      if (firstError && 'scrollIntoView' in firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    })
  }

  const disableContinue = false

  const createPageMutation = useCreateGiftPage({
    onSuccess: (link) => {
      onCreated(link)
    },
    onError: (error) => {
      console.error('Failed to create gift page:', error)
      setFieldErrors({
        form: 'Failed to create gift page. Please try again.',
      })
      scrollToFirstError()
    },
  })

  const isSaving = createPageMutation.isPending

  const handleSave = async () => {
    if (isSaving) return
    setFieldErrors({})
    setLongSave(false)
    const longSaveTimer = setTimeout(() => {
      setLongSave(true)
    }, 12000)

    try {
      commitDrafts()
      const validationErrors = validateCreateGift({
        giftPageData,
        selectedTemplate,
        settings,
        recipients,
        recipientForm,
        customGiftItems,
      })
      if (Object.keys(validationErrors).length > 0) {
        setFieldErrors(validationErrors)
        scrollToFirstError()
        return
      }

      const formData = buildCreatePageFormData({
        giftPageData,
        selectedTemplate,
        categoryId: '8fc7b8c1-5468-46dd-b2c8-e3f09bbdd60d',
        titleFormat,
        settings,
        customGiftItems,
        recipients,
        recipientForm,
      })

      await createPageMutation.mutateAsync(formData)
    } catch {
      // Errors are handled in mutation onError.
    } finally {
      clearTimeout(longSaveTimer)
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
          const nextErrors = validateCustomizeDraft({
            title: titleDraftRef.current,
            description: descriptionDraftRef.current,
            buttonLabel: buttonLabelDraftRef.current,
            hasMedia: Boolean(giftPageData.media?.file),
          })
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
          const nextErrors = validateCustomizeDraft({
            title: titleDraftRef.current,
            description: descriptionDraftRef.current,
            buttonLabel: buttonLabelDraftRef.current,
            hasMedia: Boolean(giftPageData.media?.file),
          })
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
