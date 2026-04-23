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
        <main className='bg-base-bg px-4 py-10 sm:px-6 lg:px-10'>
          <section className='mx-auto flex min-h-[calc(100vh-220px)] w-full max-w-[900px] flex-col items-center justify-center rounded-[20px] border border-grey-100 bg-white/80 p-6 text-center shadow-[0px_20px_40px_-24px_#1019282E] backdrop-blur-[2px] sm:p-10'>
            <span className='inline-flex h-24 w-24 animate-spin rounded-full border-4 border-primary-200 border-t-primary-500 sm:h-28 sm:w-28' />
            <p className='mt-6 text-base leading-7 text-grey-700 sm:text-lg'>
              Loading payment details...
            </p>
          </section>
        </main>
      }
    >
      <PaystackRedirectResult />
    </Suspense>
  )
}
