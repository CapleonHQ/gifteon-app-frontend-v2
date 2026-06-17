import { getStatusMeta } from '@/components/Giveaways/utils'
import type { GiveawayStatus } from '@/types/Giveaways'

type GiveawayStatusPillProps = {
  status: GiveawayStatus
  className?: string
}

const GiveawayStatusPill = ({ status, className = '' }: GiveawayStatusPillProps) => {
  const meta = getStatusMeta(status)
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${meta.tone} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${meta.dot} ${
          status === 'active' ? 'animate-pulse' : ''
        }`}
      />
      {meta.label}
    </span>
  )
}

export default GiveawayStatusPill
