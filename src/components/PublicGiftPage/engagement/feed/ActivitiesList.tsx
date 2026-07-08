import type { PublicActivityItem } from '../types'

type ActivitiesListProps = {
  activities: PublicActivityItem[]
}

export default function ActivitiesList({ activities }: ActivitiesListProps) {
  return (
    <div className='flex flex-col gap-3'>
      {activities.map((item) => (
        <div
          key={item.id}
          className='flex items-start justify-between gap-4 border-b border-grey-50 px-4 py-3 last:border-b-0'
        >
          <p className='text-sm text-grey-700'>{item.label}</p>
          <span className='shrink-0 text-xs text-grey-400'>{item.time}</span>
        </div>
      ))}
    </div>
  )
}
