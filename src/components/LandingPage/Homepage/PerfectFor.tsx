'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import EmojiWrappedGift from '@/assets/icons/EmojiWrappedGift'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { GIFT_CATEGORY_META } from '@/lib/constants/giftCategories'

const celebrationItems = GIFT_CATEGORY_META.map((item, index) => ({
  ...item,
  align: index % 2 === 0 ? 'left' : 'right',
}))

const PerfectFor = () => {
  const shouldReduceMotion = useReducedMotion()

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
    hidden: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.32, ease: 'easeOut' },
    },
  }

  const rowInnerVariants: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
      },
    },
  }

  const blockVariants: Variants = {
    hidden: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.28, ease: 'easeOut' },
    },
  }

  return (
    <section className='px-4 lg:px-15 py-15 lg:py-20 flex flex-col gap-10 w-full max-w-[960px] mx-auto'>
      <motion.div
        className='flex flex-col gap-2 items-center justify-center w-full'
        initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
        whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className='flex gap-1 items-center'>
          <span className='w-2 h-2 border border-primary-50 bg-[#AEAEFD] rounded-[2px]'></span>
          <h4 className='lg:text-xl leading-6 font-bold'>
            Perfect for Every Celebration
          </h4>
        </div>
        <h6 className='text-[32px] lg:text-[40px] leading-10 lg:leading-[48px] text-grey-800 text-center'>
          Giftseon makes every moment special
        </h6>
      </motion.div>

      <motion.div
        className='w-full flex flex-col gap-8 lg:gap-15'
        variants={rowsVariants}
        initial={shouldReduceMotion ? false : 'hidden'}
        whileInView='show'
        viewport={{ once: true, amount: 0.2 }}
      >
        {celebrationItems.map((item, index) => {
          const imageIsLeft = item.align === 'left'
          const shouldShiftRight = index % 2 === 1

          return (
            <motion.article
              key={item.title}
              className={`grid items-center gap-6 lg:gap-10 ${
                imageIsLeft
                  ? 'lg:grid-cols-[410fr_342fr]'
                  : 'lg:grid-cols-[342fr_410fr]'
              } ${shouldShiftRight ? 'lg:w-[88%] lg:ml-auto' : 'lg:w-[88%]'}`}
              variants={rowVariants}
            >
              <motion.div
                className={`relative ${imageIsLeft ? '' : 'lg:order-2'}`}
                variants={rowInnerVariants}
              >
                <div className='rounded-[12px] overflow-hidden'>
                  <motion.div variants={blockVariants}>
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={560}
                      height={350}
                      className='h-[210px] w-full object-cover sm:h-[300px] lg:h-[350px]'
                    />
                  </motion.div>
                </div>

                <motion.div
                  className={`absolute bottom-2 left-1/2 -translate-x-1/2 sm:left-auto sm:right-7 sm:translate-x-0 lg:bottom-[75px] inline-flex items-center gap-2 rounded-full border border-base-bg bg-[#FFF8F2CC] px-2.5 py-2 shadow-[0px_10px_18px_-2px_#10192812] ${
                    imageIsLeft
                      ? 'lg:left-[-77px] lg:right-auto'
                      : 'lg:right-[-75px]'
                  }`}
                  variants={blockVariants}
                >
                  <span className='inline-flex h-9 w-9 items-center justify-center rounded-full bg-white'>
                    <span className='w-5 h-5'>
                      <EmojiWrappedGift />
                    </span>
                  </span>
                  <span className='whitespace-nowrap text-sm leading-6 text-grey-900'>
                    Adenike has bought a gift for you!
                  </span>
                </motion.div>
              </motion.div>

              <motion.div
                className={`${
                  imageIsLeft ? '' : 'lg:order-1'
                } lg:max-w-[420px]`}
                variants={blockVariants}
              >
                <h5 className='text-xl leading-7 font-bold text-blackish'>
                  {item.title}
                </h5>
                <p className='mt-1 lg:mt-2 text-base leading-6 text-grey-700'>
                  {item.description}
                </p>
                <Link
                  href={`/gifts/create-new?category=${item.slug}`}
                  className='mt-4 inline-flex py-3.5 w-full items-center justify-center rounded-[12px] border border-primary-500 bg-linear-to-b from-primary-400 from-17% to-primary-600 text-sm font-medium text-white transition-colors duration-300 hover:from-primary-500 hover:to-primary-700 sm:w-[200px]'
                >
                  Create a Gift Page
                </Link>
              </motion.div>
            </motion.article>
          )
        })}
      </motion.div>
    </section>
  )
}

export default PerfectFor
