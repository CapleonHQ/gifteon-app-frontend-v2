'use client'

import { motion } from 'framer-motion'

const MagicLinkLoading = () => {
  return (
    <motion.div
      key='loading'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className='flex flex-col gap-6 items-center w-full max-w-[450px] mx-auto'
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className='w-16 h-16 border-4 border-primary-100 border-t-primary-500 rounded-full'
      />

      <div className='flex flex-col items-center text-center'>
        <h2 className='text-[32px] sm:text-[40px] leading-[130%] tracking-[0%] font-semibold text-blackish mb-2'>
          Verifying
        </h2>
        <p className='text-grey-600 sm:text-xl sm:leading-[140%]'>
          Please wait while we verify...
        </p>
      </div>
    </motion.div>
  )
}

export default MagicLinkLoading
