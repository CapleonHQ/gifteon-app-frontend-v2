import BackLeftIcon from '@/assets/icons/BackLeftIcon'
import { PRIMARY_BTN_CLASS, SECONDARY_BTN_CLASS } from './constants'
import type { KycStep } from './types'

type StepFooterProps = {
  step: KycStep
  canContinue: boolean
  isSubmitting: boolean
  onClose: () => void
  onNext: () => void
  onBack: () => void
  onStartScan: () => void
}

const StepFooter = ({
  step,
  canContinue,
  isSubmitting,
  onClose,
  onNext,
  onBack,
  onStartScan,
}: StepFooterProps) => {
  if (step === 0) {
    return (
      <div className='flex items-center gap-3'>
        <button type='button' onClick={onClose} className={SECONDARY_BTN_CLASS}>
          Cancel
        </button>
        <button type='button' onClick={onNext} className={PRIMARY_BTN_CLASS}>
          Start KYC
        </button>
      </div>
    )
  }

  if (step === 1) {
    return (
      <div className='flex items-center gap-3'>
        <button type='button' onClick={onClose} className={SECONDARY_BTN_CLASS}>
          Cancel
        </button>
        <button
          type='button'
          onClick={onNext}
          disabled={!canContinue}
          className={`${PRIMARY_BTN_CLASS} disabled:opacity-30`}
        >
          Continue
        </button>
      </div>
    )
  }

  return (
    <div className='flex items-center gap-3'>
      <button
        type='button'
        onClick={onBack}
        className={`${SECONDARY_BTN_CLASS} flex items-center justify-center gap-2`}
      >
        <span className='w-5 h-5'>
          <span className='flex'>
            <BackLeftIcon />
          </span>
        </span>
        Go Back
      </button>
      <button
        type='button'
        onClick={onStartScan}
        disabled={isSubmitting}
        className='flex-1 py-3 rounded-[12px] bg-linear-to-r from-primary-400 to-primary-600 border border-primary-500 text-white font-medium hover:from-primary-500 hover:to-primary-700 transition-colors disabled:opacity-60'
      >
        {isSubmitting ? (
          <span className='flex items-center justify-center gap-2'>
            <svg className='animate-spin h-4 w-4' viewBox='0 0 24 24'>
              <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
                fill='none'
              />
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              />
            </svg>
            Verifying...
          </span>
        ) : (
          'Start Scan'
        )}
      </button>
    </div>
  )
}

export default StepFooter
