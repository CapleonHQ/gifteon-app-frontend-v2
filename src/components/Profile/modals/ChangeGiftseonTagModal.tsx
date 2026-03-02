import CloseIcon from '@/assets/icons/CloseIcon'
import BackLeftIcon from '@/assets/icons/BackLeftIcon'
import ResponsiveModal from '@/components/common/ResponsiveModal'
import ShakeOnError from '@/components/common/ShakeOnError'

type ChangeGiftseonTagModalProps = {
  isOpen: boolean
  onClose: () => void
  tag: string
  onTagChange: (value: string) => void
  onSave: () => void
  canSave: boolean
  isSaving?: boolean
  isChecking?: boolean
  message: string
  hasError?: boolean
}

const ChangeGiftseonTagModal = ({
  isOpen,
  onClose,
  tag,
  onTagChange,
  onSave,
  canSave,
  isSaving = false,
  isChecking = false,
  message,
  hasError = false,
}: ChangeGiftseonTagModalProps) => {
  const oneTimeWarning = 'You can only change your tag once. Choose carefully.'
  const isDefaultOneTimeMessage =
    /only once/i.test(message) &&
    !hasError
  const helperMessage =
    isDefaultOneTimeMessage
      ? 'We will check tag availability as you type.'
      : message

  const header = (
    <div className='relative'>
      <button
        type='button'
        onClick={onClose}
        className='absolute -right-5 -top-5 w-9 h-9 rounded-full hidden lg:flex items-center justify-center hover:bg-grey-50'
        aria-label='Close'
      >
        <span className='text-grey-700 w-5 h-5'>
          <CloseIcon />
        </span>
      </button>
      <div className='lg:hidden flex items-center gap-2'>
        <button
          type='button'
          onClick={onClose}
          className='w-6 h-6'
          aria-label='Go back'
        >
          <span className='text-blackish flex'>
            <BackLeftIcon />
          </span>
        </button>
      </div>

      <div className='text-center mt-3 lg:mt-0'>
        <h3 className='text-2xl font-semibold text-blackish'>Change Giftseon Tag</h3>
        <p className='text-sm text-grey-600 mt-1'>
          {oneTimeWarning}
        </p>
      </div>
    </div>
  )

  const body = (
    <div className='space-y-3'>
      <div className='space-y-1'>
        <label className='text-sm leading-[145%] font-medium text-grey-900'>
          New Tag
        </label>
        <div
          className={`w-full px-3 py-3.5 rounded-[12px] leading-[145%] border text-sm font-medium transition-colors flex items-center gap-2 ${
            hasError
              ? 'border-error-300 bg-error-50/20 text-blackish'
              : 'border-grey-100 bg-grey-50/15 text-blackish focus-within:border-primary-500'
          }`}
        >
          <span className='text-grey-700'>@</span>
          <input
            type='text'
            value={tag}
            onChange={(event) => onTagChange(event.target.value)}
            placeholder='your-tag'
            className='w-full bg-transparent outline-hidden text-sm font-medium placeholder:text-grey-400'
          />
          {isChecking ? (
            <div className='h-4 w-4 shrink-0 rounded-full border-2 border-primary-200 border-t-primary-500 animate-spin [transform-origin:center]' />
          ) : null}
        </div>
      </div>

      <ShakeOnError active={hasError}>
        <p className={`text-xs leading-[18px] ${hasError ? 'text-error-500' : 'text-grey-600'}`}>
          {helperMessage}
        </p>
      </ShakeOnError>
    </div>
  )

  const footer = (
    <div className='flex items-center gap-3'>
      <button
        type='button'
        onClick={onClose}
        disabled={isSaving}
        className='flex-1 py-3 rounded-[12px] border border-grey-200 text-grey-700 font-medium bg-grey-50/70 disabled:opacity-60 disabled:cursor-not-allowed'
      >
        Cancel
      </button>
      <button
        type='button'
        onClick={onSave}
        disabled={!canSave || isSaving}
        className='flex-1 py-3 rounded-[12px] bg-linear-to-r from-primary-400 to-primary-600 border border-primary-500 text-white font-medium disabled:opacity-60 disabled:cursor-not-allowed'
      >
        {isSaving ? 'Saving...' : 'Confirm Tag'}
      </button>
    </div>
  )

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      desktopMaxWidthClass='max-w-[500px]'
      header={header}
      body={body}
      footer={footer}
    />
  )
}

export default ChangeGiftseonTagModal
