import type { Metadata } from 'next'
import ContactContent from './content'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Giftseon support for account, payment, merchant, and order-related assistance.',
  alternates: {
    canonical: '/contact-us',
  },
  openGraph: {
    title: 'Contact Us | Giftseon',
    description:
      'Reach Giftseon support for help with celebrations, orders, and merchant services.',
    url: 'https://giftseon.com/contact-us',
    type: 'website',
  },
}

export default function ContactPage() {
  return <ContactContent />
}
