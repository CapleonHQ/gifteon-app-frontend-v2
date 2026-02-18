import type { Metadata } from 'next'
import HelpCenterContent from './content'

export const metadata: Metadata = {
  title: 'Help Center',
  description:
    'Find answers for account setup, payments, orders, refunds, and merchant support on Giftseon.',
  alternates: {
    canonical: '/help-center',
  },
  openGraph: {
    title: 'Help Center | Giftseon',
    description:
      'Get support guidance and quick answers for using Giftseon services.',
    url: 'https://giftseon.com/help-center',
    type: 'website',
  },
}

export default function HelpCenterPage() {
  return <HelpCenterContent />
}
