'use client'

import { isBefore, startOfDay } from 'date-fns'
import CloseIcon from '@/assets/icons/CloseIcon'
import DatePickerField from '@/components/Gifts/CreateNewGiftPage/Components/DatePickerField'
import ResponsiveModal from '@/components/common/ResponsiveModal'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type {
  ContributionSortBy,
  ContributionSortOrder,
  ContributionStatus,
  ContributionType,
} from '@/types/Contributions'

type ContributionsFilterState = {
  type: 'all' | ContributionType
  status: 'all' | ContributionStatus
  fromDate?: Date
  toDate?: Date
  sortBy: ContributionSortBy
  sortOrder: ContributionSortOrder
}

type ContributionsFilterModalProps = {
  isOpen: boolean
  values: ContributionsFilterState
  onChange: (next: ContributionsFilterState) => void
  onClose: () => void
  onReset: () => void
  onApply: () => void
}

type SortOptionValue =
  | 'createdAt_DESC'
  | 'createdAt_ASC'
  | 'claimableAmount_DESC'
  | 'claimableAmount_ASC'

const TYPE_OPTIONS: Array<{ label: string; value: 'all' | ContributionType }> = [
  { label: 'All Types', value: 'all' },
  { label: 'Cash', value: 'cash' },
  { label: 'Custom', value: 'custom' },
  { label: 'Wishlist', value: 'wishlist' },
]

const ContributionsFilterModal = ({
  isOpen,
  values,
  onChange,
  onClose,
  onReset,
  onApply,
}: ContributionsFilterModalProps) => {
  const update = (next: Partial<ContributionsFilterState>) =>
    onChange({ ...values, ...next })

  const selectedSortValue: SortOptionValue = `${values.sortBy}_${values.sortOrder}` as SortOptionValue

  const handleFromDateChange = (date?: Date) => {
    if (!date) {
      update({ fromDate: undefined })
      return
    }

    const next: Partial<ContributionsFilterState> = { fromDate: date }
    if (
      values.toDate &&
      isBefore(startOfDay(values.toDate), startOfDay(date))
    ) {
      next.toDate = undefined
    }
    update(next)
  }

  const handleToDateChange = (date?: Date) => {
    if (
      date &&
      values.fromDate &&
      isBefore(startOfDay(date), startOfDay(values.fromDate))
    ) {
      return
    }
    update({ toDate: date })
  }

  const handleSortChange = (value: SortOptionValue) => {
    const [sortBy, sortOrder] = value.split('_') as [
      ContributionSortBy,
      ContributionSortOrder,
    ]
    update({ sortBy, sortOrder })
  }

  const header = (
    <>
      <div className='hidden lg:flex items-center justify-between border-b border-grey-50 px-5 py-[15px] -mx-5 sm:-mx-10'>
        <h3 className='text-xl font-semibold text-blackish ml-5 sm:ml-10'>
          Filter
        </h3>
        <button
          type='button'
          onClick={onClose}
          className='w-9 h-9 rounded-full flex items-center justify-center hover:bg-grey-50'
          aria-label='Close'
        >
          <span className='text-grey-700 w-6 h-6'>
            <CloseIcon />
          </span>
        </button>
      </div>
      <div className='lg:hidden flex items-center justify-between border-b border-grey-50 -mx-4 px-4 pb-4.5'>
        <button
          type='button'
          onClick={onClose}
          className='w-8 h-8 rounded-full flex items-center justify-center text-grey-500 hover:bg-grey-50'
          aria-label='Close'
        >
          <span className='text-grey-700 w-5 h-5'>
            <CloseIcon />
          </span>
        </button>
        <h3 className='text-2xl font-medium text-blackish'>Filter</h3>
        <span className='w-8 h-8' />
      </div>
    </>
  )

  const body = (
    <div className='space-y-4 pt-3 pb-1'>
      <div>
        <p className='text-grey-800 mb-3'>Date Range</p>
        <div className='grid grid-cols-2 gap-4'>
          <DatePickerField
            label='From:'
            value={values.fromDate}
            onChange={handleFromDateChange}
            maxDate={values.toDate}
          />
          <DatePickerField
            label='To'
            value={values.toDate}
            onChange={handleToDateChange}
            minDate={values.fromDate}
          />
        </div>
      </div>

      <div>
        <label className='text-grey-800 mb-3 block'>Type</label>
        <Select
          value={values.type}
          onValueChange={(value: 'all' | ContributionType) =>
            update({ type: value })
          }
        >
          <SelectTrigger className='w-full border-grey-50 rounded-[6px] text-sm text-blackish font-medium h-[56px]! shadow-none!'>
            <SelectValue placeholder='All Types' />
          </SelectTrigger>
          <SelectContent className='rounded-[12px] border-grey-50'>
            {TYPE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className='text-grey-800 mb-3 block'>Status</label>
        <Select
          value={values.status}
          onValueChange={(value: 'all' | ContributionStatus) =>
            update({ status: value })
          }
        >
          <SelectTrigger className='w-full border-grey-50 rounded-[6px] text-sm text-blackish font-medium h-[56px]! shadow-none!'>
            <SelectValue placeholder='All Statuses' />
          </SelectTrigger>
          <SelectContent className='rounded-[12px] border-grey-50'>
            <SelectItem value='all'>All Statuses</SelectItem>
            <SelectItem value='pending'>Pending</SelectItem>
            <SelectItem value='success'>Success</SelectItem>
            <SelectItem value='claimed'>Claimed</SelectItem>
            <SelectItem value='failed'>Failed</SelectItem>
            <SelectItem value='refunded'>Refunded</SelectItem>
            <SelectItem value='surplus'>Surplus</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className='text-grey-800 mb-3 block'>Sort</label>
        <Select value={selectedSortValue} onValueChange={handleSortChange}>
          <SelectTrigger className='w-full border-grey-50 rounded-[6px] text-sm text-blackish font-medium h-[56px]! shadow-none!'>
            <SelectValue placeholder='Sort' />
          </SelectTrigger>
          <SelectContent className='rounded-[12px] border-grey-50'>
            <SelectItem value='createdAt_DESC'>Newest to oldest</SelectItem>
            <SelectItem value='createdAt_ASC'>Oldest to newest</SelectItem>
            <SelectItem value='claimableAmount_DESC'>
              Highest claimable to lowest
            </SelectItem>
            <SelectItem value='claimableAmount_ASC'>
              Lowest claimable to highest
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  const footer = (
    <div className='flex items-center gap-3 lg:justify-end lg:gap-5'>
      <button
        type='button'
        onClick={onReset}
        className='flex-1 lg:flex-none lg:w-[130px] py-3 rounded-[12px] border border-grey-200 text-grey-800 font-medium bg-grey-50/70 hover:bg-grey-100/70 transition-colors duration-300'
      >
        Reset
      </button>
      <button
        type='button'
        onClick={onApply}
        className='flex-1 lg:flex-none lg:w-[130px] py-3 rounded-[12px] bg-linear-to-r from-primary-400 to-primary-600 border border-primary-500 text-white font-medium hover:from-primary-500 hover:to-primary-700 transition-colors duration-300'
      >
        Apply
      </button>
    </div>
  )

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      header={header}
      body={body}
      footer={footer}
      desktopMaxWidthClass='max-w-[460px]'
      desktopPanelClassName='rounded-[10px]'
      contentClassName='px-5 sm:px-5 pb-4'
    />
  )
}

export default ContributionsFilterModal
