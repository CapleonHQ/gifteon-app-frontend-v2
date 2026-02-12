'use client'

import type { GiftActivityItem } from '../GiftsPage/types'
import { getGiftActivityActions } from './giftActivityActions'

type GiftActivityActionButtonsProps = {
  item: GiftActivityItem
  onAction: (actionId: string, item: GiftActivityItem) => void
}

const GiftActivityActionButtons = ({
  item,
  onAction,
}: GiftActivityActionButtonsProps) => {
  const actions = getGiftActivityActions(item.status)

  return (
    <div className='grid grid-cols-1 gap-3'>
      {actions.map((action) => {
        const Icon = action.icon
        const base =
          'flex items-center justify-center gap-2 w-full py-3 rounded-[8px] text-sm font-medium transition-colors duration-300'
        const styles =
          action.tone === 'primary'
            ? 'bg-primary-400 hover:bg-primary-500 text-white'
            : 'border border-grey-200 bg-grey-50/70 hover:bg-grey-100/70 text-grey-800'
        return (
          <button
            key={action.id}
            type='button'
            className={`${base} ${styles}`}
            onClick={() => onAction(action.id, item)}
          >
            <span className='w-3.5 h-3.5 text-current'>
              <Icon className='w-full h-full' />
            </span>
            <span>{action.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export default GiftActivityActionButtons
