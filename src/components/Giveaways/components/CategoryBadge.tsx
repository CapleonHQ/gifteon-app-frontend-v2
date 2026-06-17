import { CATEGORY_META } from '@/components/Giveaways/utils'
import type { GiveawayCategory } from '@/types/Giveaways'

type CategoryBadgeProps = {
  category: GiveawayCategory
  className?: string
}

const CategoryBadge = ({ category, className = '' }: CategoryBadgeProps) => {
  const meta = CATEGORY_META[category]
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${meta.badge} ${className}`}
    >
      {meta.label}
    </span>
  )
}

export default CategoryBadge
