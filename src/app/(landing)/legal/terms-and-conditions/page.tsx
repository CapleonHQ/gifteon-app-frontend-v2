import type { Metadata } from 'next'
import TermsContent from './content'

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description:
    'Read Giftseon terms governing account use, payments, merchant services, and platform responsibilities.',
  alternates: {
    canonical: '/legal/terms-and-conditions',
  },
  openGraph: {
    title: 'Terms and Conditions | Giftseon',
    description:
      'Understand the legal terms and conditions for using Giftseon services.',
    url: 'https://giftseon.com/legal/terms-and-conditions',
    type: 'website',
  },
}

export default function TermsPage() {
  return <TermsContent />
}
