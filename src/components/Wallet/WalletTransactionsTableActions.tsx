'use client'

import { Eye, MoreVertical } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import FlagIcon from '@/assets/icons/FlagIcon'

type WalletTransactionsTableActionsProps = {
  onView: () => void
  onReport: () => void
}

const WalletTransactionsTableActions = ({
  onView,
  onReport,
}: WalletTransactionsTableActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type='button'
          className='w-7 h-7 rounded-md flex items-center justify-center text-grey-500 hover:bg-grey-50 focus:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1'
          aria-label='More options'
        >
          <MoreVertical className='w-4 h-4' />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='rounded-[14px] border border-grey-50 px-2 py-2 shadow-[0px_10px_30px_-10px_#10192833]'
      >
        <DropdownMenuItem className='gap-2 cursor-pointer' onClick={onView}>
          <Eye className='w-4 h-4' />
          View details
        </DropdownMenuItem>
        <DropdownMenuSeparator className='bg-grey-50' />
        <DropdownMenuItem className='gap-2 cursor-pointer' onClick={onReport}>
          <span className='w-5 h-5 text-secondary-800 [&>svg]:size-full! [&_svg]:text-current!'>
            <FlagIcon />
          </span>
          Report Transaction Issue
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default WalletTransactionsTableActions
