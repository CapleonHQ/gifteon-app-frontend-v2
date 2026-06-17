import { LucideIcon } from 'lucide-react'

const GiveawaySummaryCard = ({
  icon: Icon,
  label,
  value,
  hint,
  children,
}: {
  icon: LucideIcon
  label: string
  value: React.ReactNode
  hint?: React.ReactNode
  children?: React.ReactNode
}) => (
  <div className='rounded-[14px] bg-white border border-grey-50 shadow-[0px_10px_30px_-12px_#1019281F] p-4 flex flex-col gap-2'>
    <div className='flex items-center gap-2 text-grey-500'>
      <Icon className='h-4 w-4' />
      <span className='text-xs'>{label}</span>
    </div>
    <span className='text-lg font-semibold text-grey-900 leading-snug'>
      {value}
    </span>
    {children}
    {hint ? <span className='text-xs text-grey-500'>{hint}</span> : null}
  </div>
)

export default GiveawaySummaryCard
