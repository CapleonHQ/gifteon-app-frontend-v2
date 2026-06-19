'use client'

import { Sparkles } from 'lucide-react'

type AiCreditsPillProps = {
  credits?: number
  isLoading?: boolean
  className?: string
}

const AiCreditsPill = ({
  credits,
  isLoading = false,
  className = '',
}: AiCreditsPillProps) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700 ${className}`}
  >
    <Sparkles className='h-3.5 w-3.5' />
    {isLoading ? '…' : `${(credits ?? 0).toLocaleString()} credits`}
  </span>
)

export default AiCreditsPill
