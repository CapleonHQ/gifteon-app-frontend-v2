import FaqSection from '@/components/LandingPage/Homepage/FaqSection'
import ReviewSection from '@/components/LandingPage/Homepage/ReviewSection'
import WhyMerchants from '@/components/LandingPage/Homepage/WhyMerchants'
import EverythingYouNeed from '@/components/LandingPage/Homepage/EverythingYouNeed'
import Hero from '@/components/LandingPage/Homepage/Hero'
import WhyGiftseon from '@/components/LandingPage/Homepage/WhyGiftseon'
import HowGiftseonWorks from '@/components/LandingPage/Homepage/HowGiftseonWorks'
import HowGiftseonWorksMerchant from '@/components/LandingPage/Homepage/HowGiftseonWorksMerchant'
import PerfectFor from '@/components/LandingPage/Homepage/PerfectFor'

export default function Home() {
  return (
    <>
      <Hero />
      <WhyGiftseon />
      <HowGiftseonWorks />
      <PerfectFor />
      <EverythingYouNeed />
      <HowGiftseonWorksMerchant />
      <WhyMerchants />
      <ReviewSection />
      <FaqSection />
    </>
  )
}
