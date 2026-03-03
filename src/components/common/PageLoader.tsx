import { motion } from 'framer-motion'

type PageLoaderProps = {
  message?: string
  subtext?: string
  minHeightClassName?: string
  compact?: boolean
}

export default function PageLoader({
  message = 'Loading page...',
  subtext,
  minHeightClassName = 'min-h-[320px]',
  compact = false,
}: PageLoaderProps) {
  return (
    <div
      className={`w-full ${minHeightClassName} flex flex-col items-center justify-center px-4 text-center`}
    >
      <div className='flex items-end gap-2'>
        {[0, 1, 2].map((idx) => (
          <motion.span
            key={idx}
            className='h-2.5 w-2.5 rounded-full bg-primary-300'
            animate={{
              y: [0, -6, 0],
              opacity: [0.5, 1, 0.5],
              scale: [0.95, 1.05, 0.95],
            }}
            transition={{
              duration: 0.9,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: idx * 0.14,
            }}
          />
        ))}
      </div>

      <p
        className={`mt-4 text-grey-700 ${
          compact ? 'text-sm font-medium' : 'text-base font-medium'
        }`}
      >
        {message}
      </p>

      {subtext ? <p className='mt-1 text-xs text-grey-500'>{subtext}</p> : null}
    </div>
  )
}
