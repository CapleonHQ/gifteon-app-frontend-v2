'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

type LoginSuccessStepProps = {
  onProceed: () => void
}

const LoginSuccessStep = ({ onProceed }: LoginSuccessStepProps) => {
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  }

  return (
    <motion.div
      key='success'
      variants={pageVariants}
      initial='initial'
      animate='animate'
      exit='exit'
      transition={{ duration: 0.3 }}
      className='flex flex-col gap-4 sm:gap-5 lg:gap-7 items-center w-full'
    >
      <div className='w-[110px] h-[110px]'>
        <Image
          src='/assets/images/success-confetti.svg'
          alt='Success'
          width={150}
          height={150}
          className='w-full h-full'
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className='mb-2 flex flex-col items-center text-center'
      >
        <h2 className='text-[32px] sm:text-[40px] leading-[130%] tracking-[0%] font-semibold text-blackish mb-2'>
          Verification Successful
        </h2>
        <p className='text-grey-600 sm:text-xl sm:leading-[100%]'>
          Your email address has been verified successfully
        </p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={onProceed}
        className='w-full max-w-[450px] py-3.5 border border-primary-500 bg-linear-to-r from-primary-400 to-primary-600 text-white font-medium rounded-xl duration-200 hover:from-primary-500 hover:to-primary-700 transition-colors'
      >
        Go to Dashboard
      </motion.button>
    </motion.div>
  )
}

export default LoginSuccessStep
