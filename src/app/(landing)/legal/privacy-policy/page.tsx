import type { Metadata } from 'next'
import PrivacyContent from './content'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Read how Giftseon collects, uses, shares, and protects your personal information.',
  alternates: {
    canonical: '/legal/privacy-policy',
  },
  openGraph: {
    title: 'Privacy Policy | Giftseon',
    description:
      'Understand how Giftseon handles personal data and privacy rights.',
    url: 'https://giftseon.com/legal/privacy-policy',
    type: 'website',
  },
}

export default function PrivacyPage() {
  return <PrivacyContent />
}
