'use client'

import CloseIcon from '@/assets/icons/CloseIcon'
import DatePickerField from '@/components/Gifts/CreateNewGiftPage/Components/DatePickerField'
import { type GiftsFilterState } from '@/types/Gifts/filters'
import { SearchIcon } from '@/assets/icons'
import { isBefore, startOfDay } from 'date-fns'
import ResponsiveModal from '@/components/common/ResponsiveModal'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type FilterModalProps = {
  isOpen: boolean
  values: GiftsFilterState
  searchValue: string
  onSearchChange: (value: string) => void
  onChange: (next: GiftsFilterState) => void
  onClose: () => void
  onReset: () => void
  onApply: () => void
}

const FilterModal = ({
  isOpen,
  values,
  searchValue,
  onSearchChange,
  onChange,
  onClose,
  onReset,
  onApply,
}: FilterModalProps) => {
  const update = (next: Partial<GiftsFilterState>) =>
    onChange({ ...values, ...next })

  const handleFromDateChange = (date?: Date) => {
    if (!date) {
      update({ fromDate: undefined })
      return
    }

    const next: Partial<GiftsFilterState> = { fromDate: date }
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
      <div className='lg:hidden'>
        <div className='relative'>
          <span className='absolute left-3 top-1/2 -translate-y-1/2 text-grey-700 w-4 h-4'>
            <SearchIcon />
          </span>
          <input
            type='text'
            placeholder='Search'
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            className='w-full pl-9 pr-3 py-3 bg-grey-50/30 border border-grey-50 rounded-[12px] text-grey-700 placeholder:text-grey-700 focus:outline-none focus:bg-white focus:ring-1 focus:ring-primary-300 transition-colors'
          />
        </div>
      </div>

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

      <div className='space-y-4'>
        <div>
          <label className='text-grey-800 mb-3 block'>Status</label>
          <Select
            value={values.status}
            onValueChange={(value: GiftsFilterState['status']) =>
              update({ status: value })
            }
          >
            <SelectTrigger className='w-full border-grey-50 rounded-[6px] text-sm text-blackish font-medium h-[56px]! shadow-none!'>
              <SelectValue placeholder='All Status' />
            </SelectTrigger>
            <SelectContent className='rounded-[12px] border-grey-50'>
              <SelectItem value='all'>All Status</SelectItem>
              <SelectItem value='published'>Published</SelectItem>
              <SelectItem value='archived'>Deactivated</SelectItem>
              <SelectItem value='ended'>Ended</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className='text-grey-800 mb-3 block'>Item Category</label>
          <Select
            value={values.category}
            onValueChange={(value) => update({ category: value })}
          >
            <SelectTrigger className='w-full border-grey-50 rounded-[6px] text-sm text-blackish font-medium h-[56px]! shadow-none!'>
              <SelectValue placeholder='All Categories' />
            </SelectTrigger>
            <SelectContent className='rounded-[12px] border-grey-50'>
              <SelectItem value='all'>All Categories</SelectItem>
              <SelectItem value='birthday'>Birthday</SelectItem>
              <SelectItem value='graduation'>Graduation</SelectItem>
              <SelectItem value='wedding'>Wedding</SelectItem>
              <SelectItem value='anniversary'>Anniversary</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className='text-grey-800 mb-3 block'>Visibility</label>
          <Select
            value={values.visibility}
            onValueChange={(value) => update({ visibility: value })}
          >
            <SelectTrigger className='w-full border-grey-50 rounded-[6px] text-sm text-blackish font-medium h-[56px]! shadow-none!'>
              <SelectValue placeholder='All' />
            </SelectTrigger>
            <SelectContent className='rounded-[12px] border-grey-50'>
              <SelectItem value='all'>All</SelectItem>
              <SelectItem value='public'>Public</SelectItem>
              <SelectItem value='shareable'>Shareable</SelectItem>
              <SelectItem value='private'>Private</SelectItem>
            </SelectContent>
          </Select>
        </div>
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

export default FilterModal
