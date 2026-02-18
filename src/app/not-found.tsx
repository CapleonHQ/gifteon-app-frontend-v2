'use client'

import Footer from '@/components/LandingPage/Layout/Footer'
import Header from '@/components/LandingPage/Layout/Header'
import Link from 'next/link'
import { motion, useReducedMotion, type Variants } from 'framer-motion'

export default function NotFound() {
  const shouldReduceMotion = useReducedMotion()

  const contentVariants: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
        delayChildren: shouldReduceMotion ? 0 : 0.04,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.32, ease: 'easeOut' },
    },
  }

  return (
    <>
      <Header />
      <main className='min-h-screen bg-linear-to-b from-[#F2FFFC] to-[#ECECFD] px-4 py-10 sm:px-6 lg:px-10'>
        <motion.section
          className='mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-[960px] flex-col items-center justify-center rounded-[20px] p-6 text-center shadow-[0px_20px_40px_-24px_#1019282E] backdrop-blur-[2px] sm:p-10'
          variants={contentVariants}
          initial={shouldReduceMotion ? false : 'hidden'}
          animate='show'
        >
          <motion.div
            className='relative mt-1 select-none'
            variants={itemVariants}
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    y: [0, -2, 0],
                  }
            }
            transition={
              shouldReduceMotion
                ? undefined
                : {
                    duration: 3.6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }
            }
          >
            <motion.p
              aria-hidden='true'
              className='pointer-events-none absolute left-1/2 top-1 -z-10 -translate-x-1/2 text-[92px] font-black leading-none text-primary-200/35 blur-[1px] sm:text-[128px]'
              animate={
                shouldReduceMotion ? undefined : { opacity: [0.25, 0.45, 0.25] }
              }
              transition={
                shouldReduceMotion
                  ? undefined
                  : { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }
              }
            >
              404
            </motion.p>
            <p className='bg-linear-to-b from-primary-300 to-primary-700 bg-clip-text text-[92px] font-black leading-none text-transparent sm:text-[128px]'>
              404
            </p>
          </motion.div>
          <motion.h1
            variants={itemVariants}
            className='mt-2 text-[34px] font-bold leading-10 text-blackish sm:text-[48px] sm:leading-[56px]'
          >
            Page Not Found
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className='mt-3 max-w-[44ch] text-base leading-7 text-grey-700 sm:text-lg'
          >
            The page you are looking for does not exist or may have been moved.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className='mt-8 flex w-full max-w-[420px] flex-col gap-3 sm:flex-row sm:justify-center'
          >
            <motion.div whileHover={shouldReduceMotion ? {} : { y: -1 }}>
              <Link
                href='/'
                className='inline-flex h-[54px] items-center justify-center rounded-[12px] border border-primary-500 bg-linear-to-b from-primary-400 from-17% to-primary-600 px-5 text-base font-medium text-white transition-colors duration-300 hover:from-primary-500 hover:to-primary-700 sm:w-[200px]'
              >
                Go Home
              </Link>
            </motion.div>
            <motion.div whileHover={shouldReduceMotion ? {} : { y: -1 }}>
              <Link
                href='/gifts/create-new'
                className='inline-flex h-[54px] items-center justify-center rounded-[12px] border border-primary-500 bg-primary-50/70 px-5 text-base font-medium text-primary-500 transition-colors duration-300 hover:bg-primary-50 sm:w-[200px]'
              >
                Create Gift Page
              </Link>
            </motion.div>
          </motion.div>
        </motion.section>
      </main>
      <Footer />
    </>
  )
}
