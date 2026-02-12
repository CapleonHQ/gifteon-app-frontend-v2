'use client'

import { MoreVertical } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import EyeOnIcon from '@/assets/icons/EyeOnIcon'
import EditIcon from '@/assets/icons/EditIcon'
import ShareIcon from '@/assets/icons/ShareIcon'
import CancelHalfCircle from '@/assets/icons/CancelHalfCircle'

type GiftsTableRowActionsProps = {
  onView: () => void
  onDeactivate: () => void
}

const GiftsTableRowActions = ({
  onView,
  onDeactivate,
}: GiftsTableRowActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type='button'
          className='w-7 h-7 rounded-md flex items-center justify-center text-grey-500 hover:bg-grey-50
               focus:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1'
          aria-label='More options'
        >
          <MoreVertical className='w-4 h-4' />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='rounded-[16px] border border-grey-50 px-2 py-2 shadow-[0px_10px_30px_-10px_#10192833]'
      >
        <DropdownMenuItem className='gap-2 cursor-pointer' onClick={onView}>
          <span className='w-5 h-5 text-secondary-800 [&>svg]:size-full! [&_svg]:text-current!'>
            <EyeOnIcon />
          </span>
          View
        </DropdownMenuItem>
        <DropdownMenuSeparator className='bg-grey-50' />
        <DropdownMenuItem className='gap-2 cursor-pointer'>
          <span className='w-5 h-5 text-secondary-800 [&>svg]:size-full! [&_svg]:text-current!'>
            <EditIcon />
          </span>
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator className='bg-grey-50' />
        <DropdownMenuItem className='gap-2 cursor-pointer'>
          <span className='w-5 h-5 text-secondary-800 [&>svg]:size-full! [&_svg]:text-current!'>
            <ShareIcon />
          </span>
          Share
        </DropdownMenuItem>
        <DropdownMenuSeparator className='bg-grey-50' />
        <DropdownMenuItem
          className='gap-2 focus:text-error-500 cursor-pointer'
          onClick={onDeactivate}
        >
          <span className='w-5 h-5 text-error-400 [&>svg]:size-full! [&_svg]:text-current!'>
            <CancelHalfCircle />
          </span>
          Deactivate
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default GiftsTableRowActions
