'use client'

import { useEffect, useMemo, useState, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import ReviewCard from './ReviewCard'
import Link from 'next/link'

const AUTO_PLAY_MS = 4500
const AUTO_PLAY_RESUME_IDLE_MS = 6000

const reviews = [
  {
    name: 'Tunde Alabi',
    image: '',
    copy: 'Instead of 20 different bank alerts, all my birthday money came in one place with sweet notes too. Loved it!',
  },
  {
    name: 'Adenike Abioye',
    image: '/assets/images/review-author-2.jpg',
    copy: 'Instead of 20 different bank alerts, all my birthday money came in one place with sweet notes too. Loved it!',
  },
  {
    name: 'Chiamaka Okafor',
    image: '',
    copy: 'Instead of 20 different bank alerts, all my birthday money came in one place with sweet notes too. Loved it!',
  },
  {
    name: 'Musa Bello',
    image: '',
    copy: 'Instead of 20 different bank alerts, all my birthday money came in one place with sweet notes too. Loved it!',
  },
]

const ReviewSection = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHoverOrFocusPaused, setIsHoverOrFocusPaused] = useState(false)
  const [isInteractionPaused, setIsInteractionPaused] = useState(false)
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const shouldReduceMotion = useReducedMotion()
  const marqueeItems = useMemo(() => [...reviews, ...reviews], [])
  const isAutoPlayPaused =
    shouldReduceMotion || isHoverOrFocusPaused || isInteractionPaused

  const clearResumeTimeout = () => {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current)
      resumeTimeoutRef.current = null
    }
  }

  const pauseThenResumeAfterIdle = () => {
    setIsInteractionPaused(true)
    clearResumeTimeout()
    resumeTimeoutRef.current = setTimeout(() => {
      setIsInteractionPaused(false)
    }, AUTO_PLAY_RESUME_IDLE_MS)
  }

  useEffect(() => {
    if (isAutoPlayPaused) return

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reviews.length)
    }, AUTO_PLAY_MS)

    return () => clearInterval(interval)
  }, [isAutoPlayPaused])

  useEffect(() => {
    return () => clearResumeTimeout()
  }, [])

  const goToPrev = () => {
    pauseThenResumeAfterIdle()
    setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
  }

  const goToNext = () => {
    pauseThenResumeAfterIdle()
    setActiveIndex((prev) => (prev + 1) % reviews.length)
  }

  return (
    <motion.section
      className='py-15 lg:py-20 bg-white lg:bg-base-bg flex flex-col gap-8 lg:gap-10'
      initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className='flex flex-col gap-2 lg:gap-1 items-center justify-center w-full max-w-[960px] mx-auto'>
        <div className='flex gap-1 items-center'>
          <span className='w-2 h-2 border border-primary-50 bg-[#AEAEFD] rounded-[2px]'></span>
          <h4 className='lg:text-xl leading-6 font-bold'>Reviews</h4>
        </div>
        <h6 className='text-[40px] leading-[48px] text-grey-800 text-center max-lg:text-[32px] max-lg:leading-10'>
          Loved by friends & families everywhere ❤️
        </h6>
      </div>

      <div className='w-full max-w-[1600px] mx-auto hidden lg:block overflow-hidden mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]'>
        <div
          className={`review-marquee-track ${
            shouldReduceMotion ? 'review-marquee-track-paused' : ''
          }`}
        >
          {marqueeItems.map((review, index) => (
            <div key={`${review.name}-${index}`} className='mr-6'>
              <ReviewCard {...review} />
            </div>
          ))}
        </div>
      </div>

      <div
        className='px-4 lg:hidden'
        onMouseEnter={() => setIsHoverOrFocusPaused(true)}
        onMouseLeave={() => {
          setIsHoverOrFocusPaused(false)
          pauseThenResumeAfterIdle()
        }}
        onTouchStart={pauseThenResumeAfterIdle}
      >
        <div className='overflow-hidden'>
          <div
            className='flex will-change-transform transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]'
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {reviews.map((review, index) => (
              <div
                key={review.name}
                className={`w-full shrink-0 transition-opacity duration-500 ${
                  index === activeIndex ? 'opacity-100' : 'opacity-90'
                }`}
              >
                <ReviewCard {...review} />
              </div>
            ))}
          </div>
        </div>

        <div className='mt-4 flex items-center justify-center gap-3'>
          <button
            type='button'
            onClick={goToPrev}
            aria-label='Previous review'
            onFocus={() => setIsHoverOrFocusPaused(true)}
            onBlur={() => {
              setIsHoverOrFocusPaused(false)
              pauseThenResumeAfterIdle()
            }}
            className='inline-flex h-10 w-10 items-center justify-center rounded-full border border-grey-200 text-grey-700 transition-[background-color,transform] duration-150 hover:bg-grey-50 active:scale-[0.97]'
          >
            <ChevronLeft className='h-5 w-5' />
          </button>
          <button
            type='button'
            onClick={goToNext}
            aria-label='Next review'
            onFocus={() => setIsHoverOrFocusPaused(true)}
            onBlur={() => {
              setIsHoverOrFocusPaused(false)
              pauseThenResumeAfterIdle()
            }}
            className='inline-flex h-10 w-10 items-center justify-center rounded-full border border-grey-200 text-grey-700 transition-[background-color,transform] duration-150 hover:bg-grey-50 active:scale-[0.97]'
          >
            <ChevronRight className='h-5 w-5' />
          </button>
        </div>
      </div>
      <div className='px-4 lg:px-0 mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5'>
        <Link
          href='/gifts/create-new'
          className='w-full sm:w-[200px] flex items-center justify-center py-3.5 bg-linear-to-b from-primary-400 from-17% to-primary-600 hover:from-primary-500 hover:to-primary-700 text-white rounded-[12px] border border-primary-500 transition-colors duration-300 font-medium'
        >
          Create a Gift Page
        </Link>
        <Link
          href='https://merchant.giftseon.com/'
          target='_blank'
          rel='noopener noreferrer'
          className='w-full sm:w-[200px] flex items-center justify-center py-3.5 bg-primary-50/70 hover:bg-primary-50 text-primary-500 rounded-[12px] border border-primary-500 transition-colors duration-300 font-medium'
        >
          Become a Merchant
        </Link>
      </div>
    </motion.section>
  )
}

export default ReviewSection
