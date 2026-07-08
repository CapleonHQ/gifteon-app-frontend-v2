import { useMemo } from 'react'
import ClockIcon from '@/assets/icons/ClockIcon'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type BillsTimePickerFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const HOURS = Array.from({ length: 24 }, (_, index) =>
  String(index).padStart(2, '0')
)
const MINUTES = Array.from({ length: 60 }, (_, index) =>
  String(index).padStart(2, '0')
)

const parseValue = (value: string) => {
  const [hourRaw, minuteRaw] = value.split(':')
  const hour = Number(hourRaw)
  const minute = Number(minuteRaw)

  if (
    Number.isNaN(hour) ||
    Number.isNaN(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return null
  }

  return {
    hour: String(hour).padStart(2, '0'),
    minute: String(minute).padStart(2, '0'),
  }
}

const to24HourValue = (hour: string, minute: string) => {
  const hourNumber = Number(hour)
  const minuteNumber = Number(minute)
  if (Number.isNaN(hourNumber) || Number.isNaN(minuteNumber)) return ''
  if (
    hourNumber < 0 ||
    hourNumber > 23 ||
    minuteNumber < 0 ||
    minuteNumber > 59
  )
    return ''

  return `${String(hourNumber).padStart(2, '0')}:${String(
    minuteNumber
  ).padStart(2, '0')}`
}

const BillsTimePickerField = ({
  label,
  value,
  onChange,
  placeholder = '00:00',
}: BillsTimePickerFieldProps) => {
  const current = useMemo(() => {
    const current = parseValue(value)
    if (current) return current
    return { hour: '00', minute: '00' }
  }, [value])

  const applyHour = (hour: string) => {
    const nextValue = to24HourValue(hour, current.minute)
    if (!nextValue) return
    onChange(nextValue)
  }

  const applyMinute = (minute: string) => {
    const nextValue = to24HourValue(current.hour, minute)
    if (!nextValue) return
    onChange(nextValue)
  }

  return (
    <div>
      <span className='text-sm font-medium mb-2 block'>{label}</span>
      <div className='w-full flex items-center gap-1.5 px-2.5 py-2 rounded-lg border border-grey-50 bg-white'>
        <span className='w-5 h-5 text-primary-200 flex items-center justify-center shrink-0'>
          <ClockIcon />
        </span>
        <div className='flex items-center gap-1 text-sm font-medium text-grey-900'>
          <Select value={current.hour} onValueChange={applyHour}>
            <SelectTrigger className='w-[68px] h-8!'>
              <SelectValue placeholder={placeholder.slice(0, 2)} />
            </SelectTrigger>
            <SelectContent className='max-h-64'>
              {HOURS.map((hour) => (
                <SelectItem key={hour} value={hour}>
                  {hour}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className='text-grey-600'>:</span>
          <Select value={current.minute} onValueChange={applyMinute}>
            <SelectTrigger className='w-[68px] h-8!'>
              <SelectValue placeholder={placeholder.slice(3, 5)} />
            </SelectTrigger>
            <SelectContent className='max-h-64'>
              {MINUTES.map((minute) => (
                <SelectItem key={minute} value={minute}>
                  {minute}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

export default BillsTimePickerField
