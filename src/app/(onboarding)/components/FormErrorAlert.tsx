'use client'

import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'

type FormErrorAlertProps = {
  title: string
  message: string
  onDismiss: () => void
}

const FormErrorAlert = ({
  title,
  message,
  onDismiss,
}: FormErrorAlertProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className='flex items-start space-x-3 p-4 bg-error-50 border-l-4 border-error-500 rounded-r-lg overflow-hidden'
    >
      <AlertCircle className='w-5 h-5 text-error-500 shrink-0 mt-0.5' />
      <div className='flex-1'>
        <p className='text-error-800 text-sm font-medium'>{title}</p>
        <p className='text-error-700 text-sm mt-1'>{message}</p>
      </div>
      <button
        onClick={onDismiss}
        className='text-error-400 hover:text-error-600 transition-colors'
        aria-label='Dismiss error'
        type='button'
      >
        <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
          <path
            fillRule='evenodd'
            d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
            clipRule='evenodd'
          />
        </svg>
      </button>
    </motion.div>
  )
}

export default FormErrorAlert
