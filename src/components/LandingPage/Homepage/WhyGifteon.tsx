'use client'

import Image from 'next/image'
import { motion, useReducedMotion, type Variants } from 'framer-motion'

const occasions = [
  {
    title: 'Birthdays',
    image: '/assets/images/happy-birthday.svg',
    tone: 'bg-secondary-100',
  },
  {
    title: 'Weddings',
    image: '/assets/images/wedding-image.svg',
    tone: 'bg-primary-50',
  },
  {
    title: 'Anniversaries',
    image: '/assets/images/anniversary-image.svg',
    tone: 'bg-success-50',
  },
  {
    title: 'Graduations',
    image: '/assets/images/graduation-image.svg',
    tone: 'bg-warning-50',
  },
  {
    title: 'Perpetual/\nDonation',
    image: '/assets/images/donation-image.svg',
    tone: 'bg-[#FFEBFC]',
  },
]

const WhyGifteon = () => {
  const shouldReduceMotion = useReducedMotion()

  const cardsWrapVariants: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.07,
        delayChildren: shouldReduceMotion ? 0 : 0.08,
      },
    },
  }

  const cardVariants: Variants = {
    hidden: shouldReduceMotion
      ? { opacity: 1 }
      : { opacity: 0, y: 12, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  }

  return (
    <motion.section
      className='bg-secondary-50 py-12 lg:py-20'
      initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <div className='px-4 lg:px-20'>
        <div className='mx-auto flex w-full max-w-[778px] flex-col items-center justify-center gap-2'>
          <h4 className='text-[48px] lg:text-[60px] leading-[60px] lg:leading-[68px] font-bold text-center'>
            Giftseon is <span className='text-[#099BC2] italic'>Perfect</span>{' '}
            for every occasion
          </h4>

          <h6 className='lg:text-2xl leading-8 text-grey-600 text-center'>
            Select a category that suits what you need
          </h6>
        </div>

        <motion.div
          className='mx-auto mt-8 flex w-full max-w-[1600px] flex-wrap items-stretch justify-center gap-x-4 gap-y-5 sm:gap-x-6 lg:mt-12 lg:gap-8'
          variants={cardsWrapVariants}
          initial={shouldReduceMotion ? false : 'hidden'}
          whileInView='show'
          viewport={{ once: true, amount: 0.2 }}
        >
          {occasions.map((occasion) => {
            return (
              <motion.article
                key={occasion.title}
                className='group flex h-[190px] w-[160px] flex-col items-center rounded-[28px] border border-[#E5E9F0] bg-white px-3 pt-5 text-center shadow-[0_14px_30px_-20px_rgba(16,24,40,0.35)] sm:h-[208px] sm:w-[172px] sm:rounded-[32px] lg:h-[276px] lg:w-[228px] lg:rounded-[40px] lg:pt-7'
                variants={cardVariants}
              >
                <motion.div
                  className={`mb-4 flex h-[82px] w-[82px] items-center justify-center rounded-[24px] ring-1 ring-[#E7EDF3] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] sm:h-[90px] sm:w-[90px] lg:mb-6 lg:h-[126px] lg:w-[126px] lg:rounded-[32px] ${occasion.tone}`}
                >
                  <Image
                    src={occasion.image}
                    alt=''
                    width={96}
                    height={96}
                    className='h-[42px] w-[42px] object-contain lg:h-[72px] lg:w-[72px]'
                    aria-hidden='true'
                  />
                </motion.div>
                <h5 className='mt-auto max-w-[132px] whitespace-pre-line text-[18px] leading-[22px] font-semibold text-secondary-900 sm:max-w-[142px] lg:max-w-[172px] lg:text-[30px] lg:leading-[34px]'>
                  {occasion.title}
                </h5>
                <span className='mt-3 h-[3px] w-8 rounded-full bg-grey-100 lg:mt-5 lg:w-10' />
              </motion.article>
            )
          })}
        </motion.div>
      </div>
    </motion.section>
  )
}

export default WhyGifteon
