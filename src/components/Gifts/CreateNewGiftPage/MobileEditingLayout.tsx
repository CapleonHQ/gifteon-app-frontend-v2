import EditingSection from './EditingSection'
import type { Step } from './EditingSection'

type MobileEditingLayoutProps = {
  onClose: () => void
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

const MobileEditingLayout = ({
  onClose,
  onSave,
  isSaving,
  errors,
  continueErrors,
  disableContinue,
  step,
  onStepChange,
  customizeValues,
  onContinueAttempt,
  onClearError,
}: MobileEditingLayoutProps) => {
  return (
    <div className='lg:hidden overflow-y-auto'>
      <EditingSection
        onClose={onClose}
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
    </div>
  )
}

export default MobileEditingLayout
