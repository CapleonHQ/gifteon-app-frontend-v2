import { AnimatePresence, motion } from 'framer-motion'
import { useDeferredValue, useEffect, useState } from 'react'
import TemplatePreview from './TemplatePreview'
import EditingSection from './EditingSection'
import { useGiftPageData } from './CreateGiftContext'
import type { Step } from './EditingSection'

type DesktopEditingLayoutProps = {
  customizationOpen: boolean
  selectedTemplate: number | null
  onCloseCustomization: () => void
  onSave: () => void
  isSaving?: boolean
  errors?: Record<string, string>
  continueErrors?: {
    title?: string
    description?: string
    media?: string
    buttonLabel?: string
  }
  disableContinue?: boolean
  step: Step
  onStepChange: (step: Step) => void
  showPreview?: boolean
  customizeValues?: {
    onTitleCommit: (value: string) => void
    onDescriptionCommit: (value: string) => void
    onButtonLabelCommit: (value: string) => void
    onTitleDraftChange: (value: string) => void
    onDescriptionDraftChange: (value: string) => void
    onButtonLabelDraftChange: (value: string) => void
    onMediaChange: () => void
  }
  onContinueAttempt?: () => boolean
  onClearError?: (key: string) => void
}

const DesktopEditingLayout = ({
  customizationOpen,
  selectedTemplate,
  onCloseCustomization,
  onSave,
  isSaving,
  errors,
  continueErrors,
  disableContinue,
  step,
  onStepChange,
  showPreview = true,
  customizeValues,
  onContinueAttempt,
  onClearError,
}: DesktopEditingLayoutProps) => {
  const { giftPageData } = useGiftPageData()
  const deferredGiftPageData = useDeferredValue(giftPageData)
  const [previewData, setPreviewData] = useState(deferredGiftPageData)

  useEffect(() => {
    const timer = setTimeout(() => {
      setPreviewData(deferredGiftPageData)
    }, 250)
    return () => clearTimeout(timer)
  }, [deferredGiftPageData])

  return (
    <div className='hidden lg:block pb-6'>
      <div className='relative'>
        <motion.div
          animate={{
            paddingRight: customizationOpen ? '450px' : '0px',
          }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className='min-h-screen'
        >
          <div className='h-full overflow-y-auto'>
            {showPreview ? (
              <TemplatePreview
                data={previewData}
                templateId={selectedTemplate}
              />
            ) : (
              <div className='h-full flex items-center justify-center text-sm text-grey-500'>
                Preview hidden
              </div>
            )}
          </div>
        </motion.div>

        <AnimatePresence>
          {customizationOpen && (
            <motion.div
              initial={{ x: 450, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 450, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className='w-full max-w-[450px] bg-white fixed top-0 right-0 h-screen z-40'
            >
              <EditingSection
                onClose={onCloseCustomization}
                onSave={onSave}
                step={step}
                onStepChange={onStepChange}
                isSaving={isSaving}
                errors={errors}
                continueErrors={continueErrors}
                disableContinue={disableContinue}
                customizeValues={customizeValues}
                onContinueAttempt={onContinueAttempt}
                onClearError={onClearError}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default DesktopEditingLayout
