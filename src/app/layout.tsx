import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import degular from '@/assets/fonts/degular'
import georgia from '@/assets/fonts/georgia'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: "Giftseon - Celebrating Life's Special Moments",
    template: '%s | Giftseon',
  },
  description:
    'Make every celebration unforgettable with Giftseon. Create elegant gift collections, gather meaningful contributions, and unite loved ones for birthdays, weddings, graduations and more. Trusted by 200K+ users worldwide.',
  keywords: [
    'gift collection',
    'birthday celebration',
    'wedding gifts',
    'graduation gifts',
    'celebration platform',
    'group gifts',
    'Nigeria gifts',
    'online celebration',
    'gift registry',
    'crowdfunding gifts',
    'special occasions',
    'party planning',
  ],
  authors: [{ name: 'Giftseon Team' }],
  creator: 'Giftseon',
  publisher: 'Giftseon',
  metadataBase: new URL('https://giftseon.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://giftseon.com',
    siteName: 'Giftseon',
    title: "Giftseon - Celebrating Life's Special Moments",
    description:
      'Make every celebration unforgettable. Create beautiful gift collections and unite loved ones for birthdays, weddings, graduations and more. Join 200K+ happy users.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Giftseon - Make Every Celebration Unforgettable',
        type: 'image/jpeg',
      },
      {
        url: '/og-image-square.jpg',
        width: 400,
        height: 400,
        alt: 'Giftseon Logo',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Giftseon - Celebrating Life's Special Moments",
    description:
      'Make every celebration unforgettable. Create beautiful gift collections and unite loved ones for special moments.',
    images: ['/twitter-image.jpg'],
    creator: '@giftseon',
    site: '@giftseon',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  category: 'technology',
  classification: 'Gift Collection Platform',
  other: {
    'theme-color': '[#F97316]',
    'color-scheme': 'light dark',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Giftseon',
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#F97316',
    'msapplication-config': '/browserconfig.xml',
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  formatDetection: {
    telephone: false,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${degular.variable} ${georgia.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
