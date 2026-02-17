import FaqSection from '@/components/LandingPage/Homepage/FaqSection'
import ReviewSection from '@/components/LandingPage/Homepage/ReviewSection'
import WhyMerchants from '@/components/LandingPage/Homepage/WhyMerchants'
import EverythingYouNeed from '@/components/LandingPage/Homepage/EverythingYouNeed'
import Hero from '@/components/LandingPage/Homepage/Hero'

export default function Home() {
  return (
    <>
      <Hero />
      <EverythingYouNeed />
      <WhyMerchants />
      <ReviewSection />
      <FaqSection />
    </>
  )
}
