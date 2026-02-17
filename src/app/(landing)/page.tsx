import FaqSection from '@/components/LandingPage/Homepage/FaqSection'
import ReviewSection from '@/components/LandingPage/Homepage/ReviewSection'
import WhyMerchants from '@/components/LandingPage/Homepage/WhyMerchants'
import EverythingYouNeed from '@/components/LandingPage/Homepage/EverythingYouNeed'
import Hero from '@/components/LandingPage/Homepage/Hero'
import WhyGifteon from '@/components/LandingPage/Homepage/WhyGifteon'

export default function Home() {
  return (
    <>
      <Hero />
      <WhyGifteon />
      <EverythingYouNeed />
      <WhyMerchants />
      <ReviewSection />
      <FaqSection />
    </>
  )
}
