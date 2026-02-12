'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

type MagicLinkErrorProps = {
  message: string
}

const MagicLinkError = ({ message }: MagicLinkErrorProps) => {
  return (
    <motion.div
      key='error'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className='flex flex-col gap-6 items-center w-full max-w-[450px] mx-auto'
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className='w-[110px] h-[110px]'
      >
        <svg
          viewBox='0 0 110 110'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <circle cx='55' cy='55' r='55' fill='#EF4444' opacity='0.1' />
          <circle cx='55' cy='55' r='40' fill='#EF4444' />
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            d='M40 40L70 70M70 40L40 70'
            stroke='white'
            strokeWidth='4'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className='flex flex-col items-center text-center'
      >
        <h2 className='text-[32px] sm:text-[40px] leading-[130%] tracking-[0%] font-semibold text-blackish mb-2'>
          Verification Failed
        </h2>
        <p className='text-grey-600 sm:text-xl sm:leading-[140%] mb-4'>
          {message}
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className='w-full'
        >
          <Link href='/'>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className='w-full py-3.5 border border-primary-500 bg-linear-to-r from-primary-400 to-primary-600 text-white font-medium rounded-xl duration-200 hover:from-primary-500 hover:to-primary-700 transition-colors'
            >
              Back to Home
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default MagicLinkError
