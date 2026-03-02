import { PRIMARY_BTN_CLASS, SECONDARY_BTN_CLASS } from './constants'
import type { KycStep } from './types'

type StepFooterProps = {
  step: KycStep
  canSubmit: boolean
  isSubmitting: boolean
  isRefreshingStatus?: boolean
  primaryLabel: string
  onClose: () => void
  onNext: () => void
  onBack: () => void
  onSubmit: () => void
}

const StepFooter = ({
  step,
  canSubmit,
  isSubmitting,
  isRefreshingStatus = false,
  primaryLabel,
  onClose,
  onNext,
  onBack,
  onSubmit,
}: StepFooterProps) => {
  if (step === 0) {
    return (
      <div className='flex items-center gap-3'>
        <button type='button' onClick={onClose} className={SECONDARY_BTN_CLASS}>
          Cancel
        </button>
        <button type='button' onClick={onNext} className={PRIMARY_BTN_CLASS}>
          Continue
        </button>
      </div>
    )
  }

  if (step === 1) {
    return (
      <div className='flex items-center gap-3'>
        <button type='button' onClick={onBack} className={SECONDARY_BTN_CLASS}>
          Go Back
        </button>
        <button
          type='button'
          onClick={onSubmit}
          disabled={!canSubmit || isSubmitting || isRefreshingStatus}
          className={`${PRIMARY_BTN_CLASS} disabled:opacity-30`}
        >
          {isSubmitting || isRefreshingStatus ? (
            <span className='flex items-center justify-center gap-2'>
              <span className='h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin' />
              {isRefreshingStatus ? 'Refreshing...' : 'Submitting...'}
            </span>
          ) : (
            primaryLabel
          )}
        </button>
      </div>
    )
  }
  return null
}

export default StepFooter
