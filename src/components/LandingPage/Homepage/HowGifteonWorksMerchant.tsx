'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { MerchantSteps, UserSteps } from './HowGiftseonWorks/steps'
import StepCard from './HowGiftseonWorks/StepCard'

const HowGiftseonWorksMerchant = () => {
  const shouldReduceMotion = useReducedMotion()

  const dashLineStyle = {
    borderTopStyle: 'solid',
    borderTopWidth: '1px',
    borderTopColor: 'transparent',
    borderImage:
      'repeating-linear-gradient(to right, currentColor 0 2px, transparent 2px 4px) 1',
  } as const

  const rowsVariants: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
        delayChildren: shouldReduceMotion ? 0 : 0.08,
      },
    },
  }

  const rowVariants: Variants = {
    hidden: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  }

  return (
    <section className='bg-linear-to-b from-[#F2FFFC] to-[#ECECFD] pt-[58px] lg:pt-[68px] pb-[58px] lg:pb-[92px]'>
      <div className='w-full max-w-[1600px] mx-auto px-4 lg:px-20 flex flex-col gap-8 lg:gap-10'>
        <motion.div
          className='flex flex-col gap-2 w-full'
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={
            shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }
          }
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <div className='flex gap-1 items-center'>
            <span className='w-2 h-2 border border-primary-50 bg-[#AEAEFD] rounded-[2px]'></span>
            <h4 className='lg:text-xl leading-6 font-bold'>
              How Giftseon Works For Merchants
            </h4>
          </div>
          <h6 className='text-[32px] lg:text-[40px] leading-10 lg:leading-[48px] text-grey-800'>
            Sell your products to people shopping for gifts
          </h6>
        </motion.div>

        <motion.div
          className='flex flex-col gap-8 lg:gap-4'
          variants={rowsVariants}
          initial={shouldReduceMotion ? false : 'hidden'}
          whileInView='show'
          viewport={{ once: true, amount: 0.2 }}
        >
          {MerchantSteps.map((step, index) => {
            return (
              <motion.div
                key={step.number}
                className='lg:grid lg:grid-cols-3 lg:gap-3 items-start'
                variants={rowVariants}
              >
                {index > 0 ? (
                  <div
                    className={`hidden lg:flex items-center mt-8 ${
                      index === 2 ? 'col-span-2' : ''
                    }`}
                  >
                    <motion.span
                      className='h-0 flex-1 text-primary-300'
                      style={{
                        ...dashLineStyle,
                        transformOrigin: 'left center',
                      }}
                      initial={shouldReduceMotion ? false : { scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true, amount: 0.9 }}
                      transition={{
                        duration: 0.35,
                        ease: 'easeOut',
                        delay: 0.05,
                      }}
                    />
                    <motion.svg
                      viewBox='0 0 8 8'
                      className='ml-1 h-2 w-2 shrink-0 text-primary-400'
                      aria-hidden='true'
                      initial={shouldReduceMotion ? false : { opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true, amount: 0.9 }}
                      transition={{
                        duration: 0.15,
                        ease: 'linear',
                        delay: 0.32,
                      }}
                    >
                      <path d='M0 0L8 4L0 8V0Z' fill='currentColor' />
                    </motion.svg>
                  </div>
                ) : null}

                <div
                  className={
                    index === 0
                      ? 'lg:col-start-1'
                      : index === 1
                      ? 'lg:col-start-2'
                      : 'lg:col-start-3'
                  }
                >
                  <StepCard step={step} />
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

export default HowGiftseonWorksMerchant
