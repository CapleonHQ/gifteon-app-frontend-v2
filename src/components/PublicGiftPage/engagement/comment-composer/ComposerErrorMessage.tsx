import ShakeOnError from '@/components/common/ShakeOnError'

type ComposerErrorMessageProps = {
  visible: boolean
}

export default function ComposerErrorMessage({ visible }: ComposerErrorMessageProps) {
  if (!visible) return null

  return (
    <ShakeOnError active={visible} className='mt-3'>
      <p className='text-sm text-error-500'>
        We could not send your comment. Please try again.
      </p>
    </ShakeOnError>
  )
}
