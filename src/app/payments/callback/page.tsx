import type { Metadata } from 'next'
import PaystackRedirectResult from '@/components/Payments/PaystackRedirectResult'

export const metadata: Metadata = {
  title: 'Payment Status',
  robots: {
    index: false,
    follow: false,
  },
}

export default function PaymentCallbackPage() {
  return <PaystackRedirectResult />
}

