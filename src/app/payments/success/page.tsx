import type { Metadata } from 'next'
import PaystackRedirectResult from '@/components/Payments/PaystackRedirectResult'

export const metadata: Metadata = {
  title: 'Payment Success',
  robots: {
    index: false,
    follow: false,
  },
}

export default function PaymentSuccessPage() {
  return <PaystackRedirectResult status='success' />
}
