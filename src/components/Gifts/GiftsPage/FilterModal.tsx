'use client'

import CloseIcon from '@/assets/icons/CloseIcon'
import DatePickerField from '@/components/Gifts/CreateNewGiftPage/Components/DatePickerField'
import { type GiftsFilterState } from '@/types/Gifts/filters'
import { SearchIcon } from '@/assets/icons'
import { isBefore, startOfDay } from 'date-fns'
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
  onChange: (next: GiftsFilterState) => void
  onClose: () => void
  onReset: () => void
  onApply: () => void
}

const FilterModal = ({
  isOpen,
  values,
  onChange,
  onClose,
  onReset,
  onApply,
}: FilterModalProps) => {
  if (!isOpen) return null

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

  const content = (
    <div className='relative w-full sm:max-w-[460px] rounded-[10px] bg-white shadow-[0px_24px_60px_-20px_#10192852]'>
      <div className='flex items-center justify-between px-5 py-[15px] border-b border-grey-50'>
        <h3 className='text-xl font-semibold text-blackish'>Filter</h3>
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
      <div className='px-5 pt-3 pb-4 space-y-4'>
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
              onValueChange={(value) => update({ status: value })}
            >
              <SelectTrigger className='w-full border-grey-50 rounded-[6px] text-sm text-blackish font-medium h-[56px]! shadow-none!'>
                <SelectValue placeholder='All Status' />
              </SelectTrigger>
              <SelectContent className='rounded-[12px] border-grey-50'>
                <SelectItem value='all'>All Status</SelectItem>
                <SelectItem value='active'>Active</SelectItem>
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
      <div className='flex items-center justify-end gap-5 px-5 py-4 shadow-[0px_-5px_10px_0px_#C2C0C01F]'>
        <button
          type='button'
          onClick={onReset}
          className='w-[130px] py-3 rounded-[12px] border border-grey-200 text-grey-800 font-medium bg-grey-50/70 hover:bg-grey-100/70 transition-colors duration-300'
        >
          Reset
        </button>
        <button
          type='button'
          onClick={onApply}
          className='w-[130px] py-3 rounded-[12px] bg-linear-to-r from-primary-400 to-primary-600 border border-primary-500 text-white font-medium hover:from-primary-500 hover:to-primary-700 transition-colors duration-300'
        >
          Apply
        </button>
      </div>
    </div>
  )

  return (
    <div className='fixed inset-0 z-30 lg:z-50 pointer-events-none lg:pointer-events-auto'>
      <div
        className='absolute inset-0 bg-black/40 hidden lg:block pointer-events-auto'
        onClick={onClose}
      />

      <div className='hidden lg:flex items-center justify-center h-full px-4 pointer-events-auto'>
        {content}
      </div>

      <div className='lg:hidden fixed inset-x-0 bottom-0 top-[72.5px] bg-white flex flex-col pointer-events-auto'>
        <div className='flex items-center justify-between px-4 py-4.5 border-b border-grey-50'>
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
        <div className='flex-1 overflow-y-auto px-4 py-3 space-y-4'>
          <div>
            <div className='relative'>
              <span className='absolute left-3 top-1/2 -translate-y-1/2 text-grey-700 w-4 h-4'>
                <SearchIcon />
              </span>
              <input
                type='text'
                placeholder='Search'
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
                onValueChange={(value) => update({ status: value })}
              >
                <SelectTrigger className='w-full border-grey-50 rounded-[6px] text-sm text-blackish font-medium h-[56px]! shadow-none!'>
                  <SelectValue placeholder='All Status' />
                </SelectTrigger>
                <SelectContent className='rounded-[12px] border-grey-50'>
                  <SelectItem value='all'>All Status</SelectItem>
                  <SelectItem value='active'>Active</SelectItem>
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
        <div className='px-4 py-3 shadow-[0px_-10px_18px_5px_#4040401A] flex items-center gap-3'>
          <button
            type='button'
            onClick={onReset}
            className='flex-1 py-3 rounded-[12px] border border-grey-200 text-grey-800 font-medium bg-grey-50/70 hover:bg-grey-100/70 transition-colors duration-300'
          >
            Reset
          </button>
          <button
            type='button'
            onClick={onApply}
            className='flex-1 py-3 rounded-[12px] bg-linear-to-r from-primary-400 to-primary-600 border border-primary-500 text-white font-medium hover:from-primary-500 hover:to-primary-700 transition-colors duration-300'
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}

export default FilterModal
