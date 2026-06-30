import FaqSection from '@/components/LandingPage/Homepage/FaqSection'
import ReviewSection from '@/components/LandingPage/Homepage/ReviewSection'
import WhyMerchants from '@/components/LandingPage/Homepage/WhyMerchants'
import EverythingYouNeed from '@/components/LandingPage/Homepage/EverythingYouNeed'
import Hero from '@/components/LandingPage/Homepage/Hero'
import WhyGifteon from '@/components/LandingPage/Homepage/WhyGifteon'
import HowGiftseonWorks from '@/components/LandingPage/Homepage/HowGiftseonWorks'
import HowGiftseonWorksMerchant from '@/components/LandingPage/Homepage/HowGifteonWorksMerchant'
import PerfectFor from '@/components/LandingPage/Homepage/PerfectFor'

export default function Home() {
  return (
    <>
      <Hero />
      <WhyGifteon />
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
