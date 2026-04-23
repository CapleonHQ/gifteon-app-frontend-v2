import type { ReactNode } from 'react'

type FeedStatusProps = {
  title: string
  message: string
  tone?: 'neutral' | 'error'
  action?: ReactNode
}

export default function FeedStatus({
  title,
  message,
  tone = 'neutral',
  action,
}: FeedStatusProps) {
  return (
    <div
      className={`w-full flex justify-center px-4 pt-4 min-h-[160px] rounded-md ${
        tone === 'error' ? 'border-error-100 bg-error-50/30' : ''
      }`}
    >
      <div className='w-full max-w-[420px] px-4 py-3 text-center'>
        <p
          className={`text-sm font-medium ${
            tone === 'error' ? 'text-error-500' : 'text-grey-700'
          }`}
        >
          {title}
        </p>
        <p className='mt-0.5 text-xs text-grey-500'>{message}</p>
        {action ? <div className='mt-3'>{action}</div> : null}
      </div>
    </div>
  )
}
