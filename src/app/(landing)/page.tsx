import Image from 'next/image'
import FaqSection from '@/components/LandingPage/Homepage/FaqSection'
import ReviewSection from '@/components/LandingPage/Homepage/ReviewSection'
import WhyMerchants from '@/components/LandingPage/Homepage/WhyMerchants'

export default function Home() {
  return (
    <>
      <WhyMerchants />
      <ReviewSection />
      <FaqSection />
    </>
  )
}
