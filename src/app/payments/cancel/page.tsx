import type { Metadata } from 'next'
import PaystackRedirectResult from '@/components/Payments/PaystackRedirectResult'

export const metadata: Metadata = {
  title: 'Payment Canceled',
  robots: {
    index: false,
    follow: false,
  },
}

export default function PaymentCancelPage() {
  return <PaystackRedirectResult status='cancel' />
}
