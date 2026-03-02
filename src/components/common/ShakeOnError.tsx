import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type ShakeOnErrorProps = {
  active: boolean
  children: ReactNode
  className?: string
}

export default function ShakeOnError({
  active,
  children,
  className,
}: ShakeOnErrorProps) {
  return (
    <motion.div
      className={cn(className)}
      animate={
        active
          ? { x: [0, -8, 8, -6, 6, -4, 4, 0] }
          : { x: 0 }
      }
      transition={{ duration: 0.32, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
}
