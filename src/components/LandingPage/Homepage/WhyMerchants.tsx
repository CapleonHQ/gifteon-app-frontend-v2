'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const merchantBenefits = [
  'A new channel for real customers',
  'Zero upfront cost',
  'Guaranteed payments',
  'Simple dashboard to manage orders',
  'Boost your brand visibility',
]

const WhyMerchants = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const shouldReduceMotion = useReducedMotion()
  const [isDesktop, setIsDesktop] = useState(false)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })
  const parallaxY = useTransform(scrollYProgress, [0, 1], [-12, 12])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)')
    const updateViewportType = () => setIsDesktop(mediaQuery.matches)

    updateViewportType()
    mediaQuery.addEventListener('change', updateViewportType)

    return () => mediaQuery.removeEventListener('change', updateViewportType)
  }, [])

  return (
    <motion.section
      className='px-4 lg:px-20 py-12 lg:py-20'
      initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div
        ref={containerRef}
        className='relative mx-auto w-full max-w-[1320px] h-[862px] lg:h-auto overflow-hidden rounded-[20px] py-5 lg:py-10 px-3 lg:px-10'
      >
        <motion.div
          className='absolute inset-0'
          style={{ y: shouldReduceMotion || !isDesktop ? 0 : parallaxY }}
        >
          <Image
            src='/assets/images/why-mechant-image.png'
            alt='Merchants dashboard preview'
            fill
            className='object-cover object-bottom lg:object-center'
            sizes='(max-width: 1024px) 100vw, 1320px'
            priority={false}
            quality={100}
          />
        </motion.div>
        <div className='pointer-events-none absolute inset-0 bg-black/12' />

        <motion.div
          className='relative z-10 bg-white/90 backdrop-blur-[2px] lg:mr-auto lg:w-[510px] rounded-[12px] px-3 lg:px-6 py-5 lg:py-6 flex flex-col gap-6'
          initial={shouldReduceMotion ? false : { opacity: 0, y: 10, scale: 0.985 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.36, ease: 'easeOut', delay: 0.12 }}
        >
          <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-1'>
              <span className='h-2 w-2 rounded-[2px] border border-primary-50 bg-[#AEAEFD]' />
              <h4 className='lg:text-xl font-bold leading-7 text-blackish'>
                Why Merchants Join Giftseon
              </h4>
            </div>

            <h5 className='text-[32px] lg:text-[40px] leading-10 lg:leading-[48px] text-grey-800'>
              Gifteon makes every sale seamless
            </h5>

            <motion.ol
              className='mt-1'
              initial='hidden'
              whileInView='show'
              viewport={{ once: true, amount: 0.45 }}
              variants={{
                hidden: {},
                show: {
                  transition: {
                    staggerChildren: shouldReduceMotion ? 0 : 0.06,
                    delayChildren: shouldReduceMotion ? 0 : 0.16,
                  },
                },
              }}
            >
              {merchantBenefits.map((item, index) => (
                <motion.li
                  key={item}
                  className='border-y border-grey-50 flex items-start gap-2 text-base leading-6 text-blackish py-2.5'
                  variants={
                    shouldReduceMotion
                      ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
                      : {
                          hidden: { opacity: 0, x: -8 },
                          show: {
                            opacity: 1,
                            x: 0,
                            transition: { duration: 0.24, ease: 'easeOut' },
                          },
                        }
                  }
                >
                  <span>{index + 1}.</span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </motion.ol>
          </div>
          <motion.div
            animate={
              shouldReduceMotion
                ? {}
                : {
                    boxShadow: [
                      '0 0 0 rgba(26,26,188,0)',
                      '0 6px 18px rgba(26,26,188,0.22)',
                      '0 0 0 rgba(26,26,188,0)',
                    ],
                  }
            }
            transition={
              shouldReduceMotion
                ? undefined
                : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
            }
            whileHover={shouldReduceMotion ? {} : { y: -1 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            className='w-fit rounded-[12px]'
          >
            <Link
              href='/merchant'
              className='inline-flex w-[200px] items-center justify-center rounded-[12px] py-3.5 border border-primary-500 bg-linear-to-b from-primary-400 from-17% to-primary-600 text-base font-medium leading-5 text-white transition-colors duration-300 hover:from-primary-500 hover:to-primary-700'
            >
              Become a Merchant
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default WhyMerchants
