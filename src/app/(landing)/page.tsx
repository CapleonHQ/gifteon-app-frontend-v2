import Image from 'next/image'
import FaqSection from '@/components/LandingPage/Homepage/FaqSection'
import ReviewSection from '@/components/LandingPage/Homepage/ReviewSection'

export default function Home() {
  return (
    <>
      <ReviewSection />
      <FaqSection />
    </>
  )
}
