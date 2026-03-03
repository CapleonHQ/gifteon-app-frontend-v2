import { MoreVertical } from 'lucide-react'
import DeleteIcon from '@/assets/icons/DeleteIcon'
import Tick01Icon from '@/assets/icons/Tick01Icon'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { PaymentMethod } from '@/types/Profile/payment'

type PaymentMethodCardProps = {
  method: PaymentMethod
  onDelete: (method: PaymentMethod) => void
  onSetDefault: (method: PaymentMethod) => void
  isSettingDefault?: boolean
  disableActions?: boolean
}

const PaymentMethodCard = ({
  method,
  onDelete,
  onSetDefault,
  isSettingDefault = false,
  disableActions = false,
}: PaymentMethodCardProps) => {
  return (
    <div className='flex items-center justify-between gap-4 rounded-[10px] border border-grey-50 bg-white p-3'>
      <div className='flex items-center gap-2 min-w-0 flex-1'>
        <div className='w-10 h-7 rounded-md border-[0.57px] border-[#D9D9D9] flex items-center justify-center'>
          <div className='flex items-center gap-1'>
            <span className='w-4 h-4 rounded-full bg-[#ED0006]' />
            <span className='w-4 h-4 rounded-full bg-[#F9A000] -ml-2.5' />
          </div>
        </div>
        <div className='min-w-0'>
          <p className='leading-5 font-medium text-blackish truncate'>
            {method.bank}
          </p>
          <p className='text-sm text-grey-800'>{method.account}</p>
        </div>
      </div>
      <div className='flex items-center gap-2'>
        {method.isDefault && (
          <div className='xl:w-[100px]'>
            <span className='inline-flex items-center rounded-full bg-success-50 text-success-500 text-sm font-medium px-3 py-1'>
              Default
            </span>
          </div>
        )}
        {isSettingDefault && (
          <div className='xl:w-[100px]'>
            <span className='inline-flex items-center rounded-full bg-primary-50 text-primary-500 text-sm font-medium px-3 py-1'>
              Updating...
            </span>
          </div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type='button'
              disabled={disableActions}
              className='w-8 h-8 rounded-full flex items-center justify-center text-grey-500 hover:bg-grey-50 disabled:opacity-50 disabled:cursor-not-allowed'
              aria-label='More options'
            >
              <MoreVertical className='w-4 h-4' />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align='end'
            className='rounded-[16px] border border-grey-50 px-2 py-2 shadow-[0px_10px_30px_-10px_#10192833]'
          >
            {!method.isDefault ? (
              <DropdownMenuItem
                disabled={disableActions}
                className='gap-2 cursor-pointer disabled:cursor-not-allowed'
                onClick={() => onSetDefault(method)}
              >
                <span className='w-5 h-5 text-success-500 [&>svg]:size-full! [&_svg]:text-current!'>
                  <Tick01Icon />
                </span>
                {isSettingDefault ? 'Setting as Default...' : 'Set as Default'}
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuItem
              disabled={disableActions}
              className='gap-2 cursor-pointer text-error-500 focus:text-error-500 disabled:cursor-not-allowed'
              onClick={() => onDelete(method)}
            >
              <span className='w-5 h-5 text-error-400 [&>svg]:size-full! [&_svg]:text-current!'>
                <DeleteIcon />
              </span>
              Delete Payment Method
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default PaymentMethodCard
