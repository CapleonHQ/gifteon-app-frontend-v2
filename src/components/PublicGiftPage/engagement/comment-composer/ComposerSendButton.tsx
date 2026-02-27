import type { SendButtonProps } from './types'

export default function ComposerSendButton({
  disabled,
  isPending,
  onClick,
}: SendButtonProps) {
  return (
    <button
      type='button'
      onClick={onClick}
      disabled={disabled}
      className='h-9 w-[140px] rounded-[12px] bg-linear-to-b from-17% from-primary-400 to-primary-600 px-5 text-sm font-medium text-white enabled:hover:from-primary-500 enabled:hover:to-primary-700 disabled:cursor-not-allowed disabled:opacity-50 border border-primary-500 transition-colors'
    >
      {isPending ? (
        <span className='inline-flex items-center gap-2'>
          <span className='h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/50 border-t-white' />
          Sending...
        </span>
      ) : (
        'Send Wishes'
      )}
    </button>
  )
}
