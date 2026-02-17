'use client'

import React from 'react'
import Link from 'next/link'
import FooterBgSvg from '@/assets/icons/FooterBgSvg'
import Image from 'next/image'
import { MotionConfig, motion, type Variants } from 'framer-motion'

const productLinks = [
  { label: 'Explore Pages', href: '#' },
  { label: 'Celebration Types', href: '#' },
  { label: 'Templates', href: '#' },
  { label: 'Reviews', href: '#' },
]

const supportLinks = [
  { label: 'Privacy', href: '#' },
  { label: 'Help Center', href: '#' },
  { label: 'Contact', href: 'mailto:support@giftseon.com' },
  { label: 'Terms and Conditions', href: '#' },
]

const EASE_OUT = [0.22, 1, 0.36, 1] as const

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: EASE_OUT,
    },
  },
}

const staggerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE_OUT } },
}

const Footer = () => {
  return (
    <MotionConfig reducedMotion='user'>
      <motion.footer
        className='relative w-full overflow-hidden text-grey-200'
        initial='hidden'
        whileInView='show'
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <div
          className='pointer-events-none absolute inset-0 text-[#143535]'
          aria-hidden='true'
        >
          <FooterBgSvg />
        </div>

        <motion.div
          className='relative z-10 mx-auto w-full max-w-[1600px] px-4 pt-5 md:px-10 lg:px-20'
          variants={staggerVariants}
        >
          <div className='flex flex-col gap-8 py-[60px] lg:py-[72px]'>
            <div className='grid gap-8 lg:grid-cols-[2fr_1fr] lg:gap-10'>
              <motion.div
                className='grid gap-8 lg:grid-cols-[1.2fr_1fr_1fr]'
                variants={itemVariants}
              >
                <motion.div
                  className='flex flex-col gap-[15px]'
                  variants={itemVariants}
                >
                  <Link href='/' className='h-10 w-[132px]'>
                    <Image
                      src='/assets/images/logo/logo-white.svg'
                      width={140}
                      height={48}
                      alt='Giftseon'
                    />
                  </Link>
                  <p className='max-w-[32ch] text-secondary-100 italic leading-[24px]'>
                    Making every celebration memorable with beautiful,
                    personalized gift experiences.
                  </p>
                </motion.div>

                <motion.div
                  className='flex flex-col gap-4'
                  variants={itemVariants}
                >
                  <h5 className='text-white text-lg font-semibold'>Product</h5>
                  <ul className='space-y-2'>
                    {productLinks.map((item) => (
                      <motion.li
                        key={item.label}
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.15, ease: EASE_OUT }}
                      >
                        <Link
                          href={item.href}
                          className='text-grey-300 transition-colors hover:text-white'
                        >
                          {item.label}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div
                  className='flex flex-col gap-4'
                  variants={itemVariants}
                >
                  <h5 className='text-white text-lg font-semibold'>Support</h5>
                  <ul className='space-y-2'>
                    {supportLinks.map((item) => (
                      <motion.li
                        key={item.label}
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.15, ease: EASE_OUT }}
                      >
                        <Link
                          href={item.href}
                          className='text-grey-300 transition-colors hover:text-white'
                        >
                          {item.label}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </motion.div>
              <motion.div
                className='flex w-full max-w-[400px] flex-col gap-3'
                variants={itemVariants}
              >
                <div>
                  <h5 className='text-white text-xl font-semibold'>
                    Stay Up to Date
                  </h5>
                  <span className='mt-1 text-grey-300'>
                    Subscribe for Exclusive Giftseon Updates!
                  </span>
                </div>
                <div className='flex w-full gap-3 rounded-[12px] border border-grey-50 bg-white py-1.5 pl-3 pr-2'>
                  <input
                    type='email'
                    className='flex-1 border-none p-0 text-sm leading-[145%] text-blackish placeholder:text-grey-400 outline-0 focus:border-0'
                    placeholder='Enter your email address'
                  />
                  <button
                    className='bg-linear-to-b from-primary-400 from-17% to-primary-600 w-[120px] rounded-[8px] py-[9px] text-sm font-medium text-white transition-colors duration-300 enabled:hover:from-primary-600 enabled:to-primary-800 disabled:opacity-40'
                    disabled
                  >
                    Subscribe
                  </button>
                </div>
              </motion.div>
            </div>
            <motion.div
              className='border-t border-grey-200/10'
              variants={itemVariants}
            />
            <motion.div
              className='flex items-center justify-center'
              variants={itemVariants}
            >
              <span className='text-center'>
                &copy; {new Date().getFullYear()} Gifteon. Made with ❤️ for
                celebrations worldwide.
              </span>
            </motion.div>
          </div>
        </motion.div>
      </motion.footer>
    </MotionConfig>
  )
}

export default Footer
