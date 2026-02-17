'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const Hero = () => {
  const shouldReduceMotion = useReducedMotion()
  const imageWrapRef = useRef<HTMLDivElement | null>(null)
  const [isDesktop, setIsDesktop] = useState(false)

  const { scrollYProgress } = useScroll({
    target: imageWrapRef,
    offset: ['start end', 'end start'],
  })
  const imageY = useTransform(scrollYProgress, [0, 1], [-10, 10])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)')
    const updateViewportType = () => setIsDesktop(mediaQuery.matches)

    updateViewportType()
    mediaQuery.addEventListener('change', updateViewportType)

    return () => mediaQuery.removeEventListener('change', updateViewportType)
  }, [])

  return (
    <motion.section
      className='py-8 lg:px-20 lg:py-15'
      initial={shouldReduceMotion ? false : 'hidden'}
      animate='show'
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.06,
          },
        },
      }}
    >
      <div className='mx-auto grid w-full max-w-[1320px] items-center gap-8 lg:grid-cols-[601fr_639fr] lg:gap-8'>
        <motion.div
          className='px-4 lg:flex lg:flex-col lg:justify-center'
          variants={{
            hidden: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 },
            show: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.45, ease: 'easeOut' },
            },
          }}
        >
          <motion.h1
            className='text-[40px] sm:text-[50px] xl:text-[60px] font-bold leading-[52px] sm:leading-[60px] xl:leading-[68px] text-blackish sm:text-center lg:text-left'
            variants={{
              hidden: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.4, ease: 'easeOut' },
              },
            }}
          >
            Make Gifting Easy.
            <br />
            Make Selling Simple.
          </motion.h1>

          <motion.p
            className='mt-2 lg:mt-5 max-w-[600px] sm:mx-auto lg:mx-0 text-sm sm:text-lg lg:text-xl leading-[22px] sm:leading-6 lg:leading-8 tracking-[2%] text-grey-600 sm:text-center lg:text-left'
            variants={{
              hidden: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.42, ease: 'easeOut', delay: 0.05 },
              },
            }}
          >
            Create a gift page in minutes, invite friends to contribute, and
            make any celebration special or list your products as a merchant and
            reach people buying gifts every day.
          </motion.p>

          <motion.div
            className='mt-5 lg:mt-8 flex gap-5 sm:justify-center lg:justify-normal'
            variants={{
              hidden: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.4, ease: 'easeOut', delay: 0.12 },
              },
            }}
          >
            <Link
              href='/gifts/create-new'
              className='w-full sm:w-[200px] flex items-center justify-center py-3.5 bg-linear-to-b from-primary-400 from-17% to-primary-600 hover:from-primary-500 hover:to-primary-700 text-white rounded-[12px] border border-primary-500 transition-colors duration-300 font-medium'
            >
              Create a Gift Page
            </Link>
            <Link
              href='/merchant'
              className='w-full sm:w-[200px] flex items-center justify-center py-3.5 bg-primary-50/70 hover:bg-primary-50 text-primary-500 rounded-[12px] border border-primary-500 transition-colors duration-300 font-medium'
            >
              Become a Merchant
            </Link>
          </motion.div>
        </motion.div>
        <motion.div
          className='pl-4 lg:pl-0'
          variants={{
            hidden: shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 0, scale: 0.98, y: 12 },
            show: {
              opacity: 1,
              scale: 1,
              y: 0,
              transition: { duration: 0.55, ease: 'easeOut', delay: 0.16 },
            },
          }}
        >
          <motion.div
            ref={imageWrapRef}
            className='w-full overflow-hidden rounded-l-[60px] lg:rounded-l-[120px] rounded-r-[6px] lg:rounded-r-[12px] border border-[#C7D1D9] lg:h-[502px]'
            style={{ y: shouldReduceMotion || !isDesktop ? 0 : imageY }}
          >
            <Image
              src='/assets/images/hero-image.jpg'
              alt='Friends exchanging gifts'
              width={1320}
              height={862}
              className='h-[360px] w-full object-cover sm:h-[400px] md:h-[460px] lg:h-full'
              priority
              quality={100}
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default Hero
