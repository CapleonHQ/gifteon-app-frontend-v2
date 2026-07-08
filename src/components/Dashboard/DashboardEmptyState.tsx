'use client'

import type { ReactNode } from 'react'

type DashboardEmptyStateProps = {
  message: string
  className?: string
  icon?: ReactNode
}

const DashboardEmptyState = ({
  message,
  className,
  icon,
}: DashboardEmptyStateProps) => {
  return (
    <div
      className={`max-w-[420px] mx-auto text-center flex flex-col items-center gap-4 ${
        className || ''
      }`}
    >
      {icon ? (
        <span className='text-grey-400 w-12 h-12 opacity-80'>{icon}</span>
      ) : null}
      <div className='flex flex-col gap-2'>
        <h3 className='text-sm text-grey-500 font-medium'>{message}</h3>
      </div>
    </div>
  )
}

export default DashboardEmptyState
