import type { ReactNode } from 'react'

const InterestChip = ({
  label,
  icon,
  tone = 'filled',
  onClick,
  suffix,
}: {
  label: string
  icon: string
  tone?: 'filled' | 'outline'
  onClick?: () => void
  suffix?: ReactNode
}) => {
  return (
    <button
      type='button'
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full text-sm leading-[127%] tracking-[-2%] px-3 py-1.5 transition-colors ${
        tone === 'filled'
          ? 'bg-grey-50 text-grey-800'
          : 'bg-white border border-grey-100 text-grey-700 hover:bg-grey-50'
      }`}
    >
      <span>{icon}</span>
      {label}
      {suffix}
    </button>
  )
}

export default InterestChip
