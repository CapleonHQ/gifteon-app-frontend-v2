import React from 'react'
import Link from 'next/link'
import Header from '@/components/LandingPage/Layout/Header'
import Footer from '@/components/LandingPage/Layout/Footer'

const LandingPageLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <div className='min-h-screen bg-white flex flex-col'>
      <Header />
      {children}
      <Footer />
    </div>
  )
}

export default LandingPageLayout
