import type { Metadata } from 'next'
import { Suspense } from 'react'
import PaystackRedirectResult from '@/components/Payments/PaystackRedirectResult'

export const metadata: Metadata = {
  title: 'Payment Status',
  robots: {
    index: false,
    follow: false,
  },
}

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className='w-full min-h-[60vh] flex items-center justify-center'>
          <div className='h-10 w-10 animate-spin rounded-full border-2 border-primary-200 border-t-primary-500' />
        </div>
      }
    >
      <PaystackRedirectResult />
    </Suspense>
  )
}
