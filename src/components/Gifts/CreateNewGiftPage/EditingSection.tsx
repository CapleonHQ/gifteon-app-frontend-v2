import { useEffect } from 'react'
import { useMobileBack } from '@/components/Layout/MobileTitleContext'
import EditingHeader from './EditingHeader'
import EditingFooter from './EditingFooter'
import CustomizeStep from './CustomizeStep'
import SettingsStep from './SettingsStep'

export type Step = 'customize' | 'settings'

interface EditingSectionProps {
  onClose: () => void
  onSave: () => void
  step: Step
  onStepChange: (step: Step) => void
  isSaving?: boolean
  errors?: {
    giftFor?: string
    giftType?: string
    currency?: string
    cashAmount?: string
    minAmount?: string
    targetAmount?: string
    customGifts?: string
    addMusic?: string
    privacy?: string
    receiverName?: string
    receiverEmail?: string
    allowJoinGifting?: string
    joinTargetAmount?: string
    joinMinAmount?: string
    setTimeframe?: string
    giftingEndDate?: string
    giftingEndTime?: string
    recipients?: string
    recipientName?: string
    recipientEmail?: string
  }
  continueErrors?: {
    title?: string
    description?: string
    media?: string
    buttonLabel?: string
  }
  disableContinue?: boolean
  onClearError?: (key: string) => void
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
}

const EditingSection = ({
  onClose,
  onSave,
  step,
  onStepChange,
  isSaving = false,
  errors,
  continueErrors,
  disableContinue = false,
  onClearError,
  customizeValues,
  onContinueAttempt,
}: EditingSectionProps) => {
  const { setOnBack } = useMobileBack()

  const handleNext = () => {
    if (step === 'customize') {
      if (onContinueAttempt && !onContinueAttempt()) return
      onStepChange('settings')
    } else {
      onSave()
    }
  }

  const handleBack = () => {
    if (step === 'settings') {
      onStepChange('customize')
    }
  }

  useEffect(() => {
    setOnBack(() => () => {
      if (step === 'settings') {
        onStepChange('customize')
      } else {
        onClose()
      }
    })

    return () => setOnBack(undefined)
  }, [onClose, onStepChange, setOnBack, step])

  return (
    <div className='h-full relative lg:rounded-t-3xl lg:shadow-[0px_-5px_13px_5px_#1019280F] bg-white flex flex-col overflow-hidden'>
      <EditingHeader step={step} onClose={onClose} />

      {/* Content */}
      <div className='flex-1 overflow-y-auto sm:px-6 sm:py-5'>
        {step === 'customize' && customizeValues ? (
          <CustomizeStep
            errors={continueErrors}
            onTitleCommit={customizeValues.onTitleCommit}
            onDescriptionCommit={customizeValues.onDescriptionCommit}
            onButtonLabelCommit={customizeValues.onButtonLabelCommit}
            onTitleDraftChange={customizeValues.onTitleDraftChange}
            onDescriptionDraftChange={customizeValues.onDescriptionDraftChange}
            onButtonLabelDraftChange={customizeValues.onButtonLabelDraftChange}
            onMediaChange={customizeValues.onMediaChange}
          />
        ) : (
          <SettingsStep errors={errors} onClearError={onClearError} />
        )}
      </div>

      <EditingFooter
        step={step}
        onBack={handleBack}
        onClose={onClose}
        onNext={handleNext}
        isSaving={isSaving}
        disableContinue={disableContinue}
      />
    </div>
  )
}

export default EditingSection
