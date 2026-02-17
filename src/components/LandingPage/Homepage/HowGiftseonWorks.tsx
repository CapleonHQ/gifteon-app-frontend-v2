'use client'

import CollectAndCelebrateIcon from '@/assets/icons/diagrams/CollectAndCelebrateIcon'
import CreateYourPageIcon from '@/assets/icons/diagrams/CreateYourPageIcon'
import ShareAndInviteIcon from '@/assets/icons/diagrams/ShareAndInviteIcon'
import { motion, useReducedMotion, type Variants } from 'framer-motion'

const steps = [
  {
    number: '1',
    title: 'Create Your Page',
    description:
      'Choose from beautiful templates and personalize with photos, stories, and gift preferences. Set up takes just minutes.',
    icon: CreateYourPageIcon,
  },
  {
    number: '2',
    title: 'Share & Invite',
    description:
      'Share your celebration page across social media, messaging apps, or generate QR codes for easy access.',
    icon: ShareAndInviteIcon,
  },
  {
    number: '3',
    title: 'Collect & Celebrate',
    description:
      'Receive gifts, messages, and well-wishes in real-time. Track progress and thank contributors personally.',
    icon: CollectAndCelebrateIcon,
  },
]

const StepCard = ({ step }: { step: (typeof steps)[number] }) => {
  const Icon = step.icon

  return (
    <article className='w-full lg:max-w-[400px] flex flex-col gap-5 relative'>
      <div className='absolute top-5 lg:top-6 right-[7px] lg:right-6'>
        <Icon />
      </div>
      <span className='inline-flex h-15 w-15 items-center justify-center rounded-full bg-white shadow-[0px_10px_18px_-2px_#10192812] text-2xl font-medium leading-8 text-primary-900'>
        {step.number}
      </span>
      <div>
        <h5 className='text-primary-900 text-xl lg:text-2xl leading-7 lg:leading-8 font-medium'>
          {step.title}
        </h5>
        <p className='text-sm lg:text-base mt-1.5 text-grey-700 leading-[22px] lg:leading-6'>
          {step.description}
        </p>
      </div>
    </article>
  )
}

const HowGiftseonWorks = () => {
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
          whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <div className='flex gap-1 items-center'>
            <span className='w-2 h-2 border border-primary-50 bg-[#AEAEFD] rounded-[2px]'></span>
            <h4 className='lg:text-xl leading-6 font-bold'>
              How Gifteon Works For Gifters & Receivers
            </h4>
          </div>
          <h6 className='text-[32px] lg:text-[40px] leading-10 lg:leading-[48px] text-grey-800'>
            Create a gift page that brings people together
          </h6>
        </motion.div>

        <motion.div
          className='flex flex-col gap-8 lg:gap-4'
          variants={rowsVariants}
          initial={shouldReduceMotion ? false : 'hidden'}
          whileInView='show'
          viewport={{ once: true, amount: 0.2 }}
        >
          {steps.map((step, index) => {
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
                      transition={{ duration: 0.35, ease: 'easeOut', delay: 0.05 }}
                    />
                    <motion.svg
                      viewBox='0 0 8 8'
                      className='ml-1 h-2 w-2 shrink-0 text-primary-400'
                      aria-hidden='true'
                      initial={shouldReduceMotion ? false : { opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true, amount: 0.9 }}
                      transition={{ duration: 0.15, ease: 'linear', delay: 0.32 }}
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

export default HowGiftseonWorks
