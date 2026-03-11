import { useState } from 'react'
import { format, isAfter, isBefore, startOfDay } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import CalendarIcon from '@/assets/icons/CalendarIcon'

type DatePickerFieldProps = {
  label: string
  value?: Date
  onChange: (date?: Date) => void
  placeholder?: string
  disabled?: boolean
  displayFormat?: string
  minDate?: Date
  maxDate?: Date
}

const DatePickerField = ({
  label,
  value,
  onChange,
  placeholder = 'Select date',
  disabled = false,
  displayFormat = 'dd-MM-yyyy',
  minDate,
  maxDate,
}: DatePickerFieldProps) => {
  const [open, setOpen] = useState(false)
  const minDay = minDate ? startOfDay(minDate) : undefined
  const maxDay = maxDate ? startOfDay(maxDate) : undefined
  const today = startOfDay(new Date())
  const startMonth =
    minDay ?? startOfDay(new Date(today.getFullYear() - 100, 0, 1))
  const endMonth = maxDay ?? today

  return (
    <div>
      <label className='text-sm font-medium mb-2 block'>{label}</label>
      <Popover
        open={open}
        onOpenChange={(nextOpen) => {
          if (disabled) return
          setOpen(nextOpen)
        }}
      >
        <PopoverTrigger asChild>
          <button
            type='button'
            disabled={disabled}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3.5 rounded-lg border text-sm font-medium bg-white',
              disabled
                ? 'border-grey-100 bg-grey-50 text-grey-500'
                : 'border-grey-50 text-grey-900',
              !value && !disabled && 'text-grey-400'
            )}
          >
            <span
              className={cn(
                'w-5 h-5 transition-colors',
                disabled
                  ? 'text-grey-300'
                  : 'text-primary-200 hover:text-primary-400'
              )}
            >
              <CalendarIcon />
            </span>
            <span>{value ? format(value, displayFormat) : placeholder}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent className='w-auto overflow-hidden p-0' align='start'>
          <Calendar
            mode='single'
            selected={value}
            defaultMonth={value ?? endMonth}
            captionLayout='dropdown'
            startMonth={startMonth}
            endMonth={endMonth}
            onSelect={(date) => {
              onChange(date)
              setOpen(false)
            }}
            disabled={(date) => {
              const day = startOfDay(date)
              if (minDay && isBefore(day, minDay)) return true
              if (maxDay && isAfter(day, maxDay)) return true
              return false
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default DatePickerField
