import Image from 'next/image'
import FaqSection from '@/components/LandingPage/Homepage/FaqSection'
import ReviewSection from '@/components/LandingPage/Homepage/ReviewSection'
import WhyMerchants from '@/components/LandingPage/Homepage/WhyMerchants'
import EverythingYouNeed from '@/components/LandingPage/Homepage/EverythingYouNeed'

export default function Home() {
  return (
    <>
      <EverythingYouNeed />
      <WhyMerchants />
      <ReviewSection />
      <FaqSection />
    </>
  )
}
