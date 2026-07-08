import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import ClockIcon from '@/assets/icons/ClockIcon'

type TimePickerFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const TimePickerField = ({
  label,
  value,
  onChange,
  placeholder = 'Select time',
}: TimePickerFieldProps) => {
  return (
    <div>
      <span className='text-sm font-medium mb-2 block'>{label}</span>
      <div className='relative'>
        <label
          htmlFor='clock-value'
          className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-200 flex items-center justify-center'
        >
          <ClockIcon />
        </label>
        <Input
          id='clock-value'
          type='time'
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={cn(
            'w-full h-[49.1px] pl-11 pr-4 py-3.5 rounded-lg border border-grey-50 shadow-none text-sm font-medium bg-white outline-0 focus-visible:ring-0 focus-visible:border focus-visible:border-primary-500',
            !value && 'text-grey-400',
            'appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
          )}
          placeholder={placeholder}
        />
      </div>
    </div>
  )
}

export default TimePickerField
