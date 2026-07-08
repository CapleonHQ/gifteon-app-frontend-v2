type EditingFooterProps = {
  step: 'customize' | 'settings'
  onBack: () => void
  onClose: () => void
  onNext: () => void
  isSaving?: boolean
  disableContinue?: boolean
}

const EditingFooter = ({
  step,
  onBack,
  onClose,
  onNext,
  isSaving = false,
  disableContinue = false,
}: EditingFooterProps) => {
  const isCreateStep = step === 'settings'
  const isDisabled = isCreateStep ? isSaving : disableContinue

  return (
    <div className='flex gap-3 py-4 lg:px-6 lg:shadow-[0px_-10px_18px_5px_#4040401A] bg-white'>
      <button
        type='button'
        onClick={step === 'settings' ? onBack : onClose}
        className='hidden lg:block flex-1 py-3 px-4 border border-grey-300 rounded-lg font-medium text-grey-700 hover:bg-grey-50 transition-colors'
      >
        {step === 'settings' ? 'Back' : 'Cancel'}
      </button>
      <button
        type='button'
        onClick={onNext}
        disabled={isDisabled}
        className='flex-1 py-3 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed'
      >
        {step === 'customize'
          ? 'Continue'
          : isSaving
            ? 'Creating gift page...'
            : 'Create gift page'}
      </button>
    </div>
  )
}

export default EditingFooter
