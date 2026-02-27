import type { ReactNode } from 'react'
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
    <div className={cn(active ? 'animate-shake-x' : '', className)}>
      {children}
    </div>
  )
}
