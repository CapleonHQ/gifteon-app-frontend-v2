import { useState } from 'react'
import { format } from 'date-fns'
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
}

const DatePickerField = ({
  label,
  value,
  onChange,
  placeholder = 'Select date',
}: DatePickerFieldProps) => {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <label className='text-sm font-medium mb-2 block'>{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type='button'
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3.5 rounded-lg border border-grey-50 text-sm font-medium text-grey-900 bg-white',
              !value && 'text-grey-400'
            )}
          >
            <span className='w-5 h-5 text-primary-200 hover:text-primary-400 transition-colors'>
              <CalendarIcon />
            </span>
            <span>{value ? format(value, 'dd-MM-yyyy') : placeholder}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <Calendar
            mode='single'
            selected={value}
            onSelect={(date) => {
              onChange(date)
              setOpen(false)
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default DatePickerField
