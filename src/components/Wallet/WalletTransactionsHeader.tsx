'use client'

import { SearchIcon } from '@/assets/icons'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type WalletTransactionsHeaderProps = {
  searchQuery: string
  typeFilter: string
  statusFilter: string
  onSearchChange: (value: string) => void
  onTypeChange: (value: string) => void
  onStatusChange: (value: string) => void
}

const WalletTransactionsHeader = ({
  searchQuery,
  typeFilter,
  statusFilter,
  onSearchChange,
  onTypeChange,
  onStatusChange,
}: WalletTransactionsHeaderProps) => {
  return (
    <div className='flex flex-col py-3 px-4 gap-2 lg:gap-3 lg:flex-row lg:items-center lg:justify-between'>
      <h3 className='text-xl leading-7 font-medium text-blackish'>
        Transaction History
      </h3>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center lg:gap-3 xl:gap-6'>
        <div className='relative w-full lg:w-[250px]'>
          <span className='absolute left-3 top-1/2 -translate-y-1/2 text-grey-700 w-4 h-4'>
            <SearchIcon />
          </span>
          <input
            type='text'
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder='Search'
            className='w-full pl-9 pr-3 py-[7px] bg-grey-50/30 border border-grey-50 rounded-[12px] text-grey-700 placeholder:text-grey-600 focus:outline-none focus:bg-white focus:ring-1 focus:ring-primary-300 transition-colors text-sm'
          />
        </div>
        <div className='flex gap-2 lg:gap-3 xl:gap-6 justify-end lg:justify-normal'>
          <Select value={typeFilter} onValueChange={onTypeChange}>
            <SelectTrigger className='w-[108px] md:w-[112px] border-grey-50 rounded-[12px] text-sm text-grey-700 font-medium h-[38px]! shadow-none! bg-grey/20'>
              <SelectValue placeholder='All Types' />
            </SelectTrigger>
            <SelectContent className='rounded-[12px] border-grey-50'>
              <SelectItem value='all'>All Types</SelectItem>
              <SelectItem value='credit'>Credit</SelectItem>
              <SelectItem value='debit'>Debit</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger className='w-[108px] md:w-[112px] border-grey-50 rounded-[12px] text-sm text-grey-700 font-medium h-[38px]! shadow-none! bg-grey/20'>
              <SelectValue placeholder='All Status' />
            </SelectTrigger>
            <SelectContent className='rounded-[12px] border-grey-50'>
              <SelectItem value='all'>All Status</SelectItem>
              <SelectItem value='completed'>Completed</SelectItem>
              <SelectItem value='pending'>Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

export default WalletTransactionsHeader
