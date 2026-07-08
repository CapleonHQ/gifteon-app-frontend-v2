import ShakeOnError from '@/components/common/ShakeOnError'

type ComposerErrorMessageProps = {
  visible: boolean
  message?: string
}

export default function ComposerErrorMessage({
  visible,
  message,
}: ComposerErrorMessageProps) {
  if (!visible) return null

  return (
    <ShakeOnError active={visible} className='mt-3'>
      <p className='text-sm text-error-500'>
        {message ?? 'We could not send your comment. Please try again.'}
      </p>
    </ShakeOnError>
  )
}
