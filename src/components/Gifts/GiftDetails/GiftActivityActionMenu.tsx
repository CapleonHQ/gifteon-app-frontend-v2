'use client'

import { MoreVertical } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { GiftActivityItem } from '../GiftsPage/types'
import { getGiftActivityActions } from './giftActivityActions'

type GiftActivityActionMenuProps = {
  item: GiftActivityItem
  onAction: (actionId: string, item: GiftActivityItem) => void
}

const GiftActivityActionMenu = ({
  item,
  onAction,
}: GiftActivityActionMenuProps) => {
  const actions = getGiftActivityActions(item.status)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type='button'
          className='w-7 h-7 rounded-md flex items-center justify-center text-grey-500 hover:bg-grey-50'
          aria-label='More options'
        >
          <MoreVertical className='w-4 h-4' />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='rounded-[16px] border border-grey-50 px-2 py-2 shadow-[0px_10px_30px_-10px_#10192833]'
      >
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <DropdownMenuItem
              key={action.id}
              className='flex items-center gap-3 px-3 py-2 text-sm text-grey-700 rounded-[10px] focus:bg-grey-50'
              onClick={() => onAction(action.id, item)}
            >
              <span className='w-4 h-4 text-grey-600'>
                <Icon className='w-full h-full' />
              </span>
              {action.label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default GiftActivityActionMenu
