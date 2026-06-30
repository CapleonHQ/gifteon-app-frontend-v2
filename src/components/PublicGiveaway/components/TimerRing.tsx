'use client'

import { motion } from 'framer-motion'

type TimerRingProps = {
  remaining: number
  total: number
  size?: number
}

const TimerRing = ({ remaining, total, size = 64 }: TimerRingProps) => {
  const radius = (size - 8) / 2
  const circumference = 2 * Math.PI * radius
  const ratio = total > 0 ? Math.max(0, Math.min(1, remaining / total)) : 0
  const offset = circumference * (1 - ratio)

  const stroke =
    ratio > 0.5 ? '#099137' : ratio > 0.2 ? '#dd900d' : '#cb1a14'
  const urgent = remaining <= 5

  return (
    <motion.div
      animate={urgent ? { scale: [1, 1.08, 1] } : { scale: 1 }}
      transition={urgent ? { duration: 1, repeat: Infinity } : { duration: 0.2 }}
      className='relative flex items-center justify-center'
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className='-rotate-90'>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill='none'
          stroke='#dad8d7'
          strokeWidth={4}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill='none'
          stroke={stroke}
          strokeWidth={4}
          strokeLinecap='round'
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.4s' }}
        />
      </svg>
      <span
        className='absolute text-sm font-semibold tabular-nums'
        style={{ color: stroke }}
      >
        {Math.max(0, Math.ceil(remaining))}
      </span>
    </motion.div>
  )
}

export default TimerRing
