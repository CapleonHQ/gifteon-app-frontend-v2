'use client'

import AddReactionIcon from '@/assets/icons/AddReactionIcon'
import GlobeReachIcon from '@/assets/icons/GlobeReachIcon'
import HighlightTextIcon from '@/assets/icons/HighlightTextIcon'
import ShareReviewsIcon from '@/assets/icons/ShareReviewsIcon'
import ShieldLockIcon from '@/assets/icons/ShieldLockIcon'
import { motion, useReducedMotion, type Variants } from 'framer-motion'

const features = [
  {
    title: 'Easy Celebration Setup',
    description:
      'Create beautiful, personalized celebration pages in minutes with our intuitive templates',
    icon: AddReactionIcon,
  },
  {
    title: 'Social Sharing',
    description:
      'Share your celebration across all platforms with QR codes and optimized social links',
    icon: ShareReviewsIcon,
  },
  {
    title: 'Secure Payments',
    description:
      'Safe, fast payment processing with multiple options for contributors worldwide',
    icon: ShieldLockIcon,
  },
  {
    title: 'Personal Messages',
    description:
      'Collect heartfelt messages, photos, and videos from friends and family',
    icon: HighlightTextIcon,
  },
  {
    title: 'Mobile-First Design',
    description:
      'Perfectly optimized experience across all devices and screen sizes',
    icon: ShieldLockIcon,
  },
  {
    title: 'Global Reach',
    description:
      'Connect with friends and family anywhere in the world, regardless of location',
    icon: GlobeReachIcon,
  },
]

const EverythingYouNeed = () => {
  const shouldReduceMotion = useReducedMotion()

  const headingVariants: Variants = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  }

  const gridVariants: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.06,
        delayChildren: shouldReduceMotion ? 0 : 0.08,
      },
    },
  }

  const cardVariants: Variants = {
    hidden: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.28, ease: 'easeOut' },
    },
  }

  return (
    <motion.section
      className='bg-base-bg py-15 lg:py-20'
      initial={shouldReduceMotion ? false : 'hidden'}
      whileInView='show'
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className='px-4 lg:px-20'>
        <motion.div
          className='mx-auto flex w-full max-w-[960px] flex-col items-center justify-center gap-2 lg:gap-1'
          variants={headingVariants}
        >
          <div className='flex items-center gap-1'>
            <span className='h-2 w-2 rounded-[2px] border border-primary-50 bg-[#AEAEFD]' />
            <h4 className='font-bold lg:text-xl lg:leading-6'>
              Everything You Need to Celebrate
            </h4>
          </div>
          <h6 className='text-center text-[32px] leading-10 text-grey-800 lg:text-[40px] lg:leading-[48px]'>
            Effortlessly create memories and receive gifts.
          </h6>
        </motion.div>
      </div>

      <div className='mt-8 px-4 lg:mt-10 lg:px-20'>
        <div className='mx-auto w-full max-w-[1600px] overflow-hidden rounded-[16px] border border-grey-100 bg-transparent'>
          <motion.div
            className='grid gap-px bg-grey-100 md:grid-cols-2 lg:grid-cols-3'
            variants={gridVariants}
          >
            {features.map((feature) => {
              const Icon = feature.icon

              return (
                <motion.article
                  key={feature.title}
                  className='bg-base-bg px-4 py-4 transition-[background-color,box-shadow,transform] duration-200 hover:bg-secondary-50/50 hover:shadow-[inset_0_0_0_1px_rgba(184,184,234,0.45)] lg:px-7 lg:py-7'
                  variants={cardVariants}
                  whileHover={shouldReduceMotion ? {} : { y: -2 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.995 }}
                >
                  <motion.div
                    className='mb-5 inline-flex h-20 w-20 items-center justify-center rounded-full bg-[#EDEDFF]'
                    animate={
                      shouldReduceMotion
                        ? {}
                        : {
                            y: [0, -2, 0],
                            scale: [1, 1.02, 1],
                          }
                    }
                    transition={
                      shouldReduceMotion
                        ? undefined
                        : {
                            duration: 3,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }
                    }
                  >
                    <Icon />
                  </motion.div>
                  <h5 className='font-bold text-blackish text-xl leading-7'>
                    {feature.title}
                  </h5>
                  <p className='mt-2 max-w-[52ch] text-grey-700 text-base leading-6'>
                    {feature.description}
                  </p>
                </motion.article>
              )
            })}
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

export default EverythingYouNeed
