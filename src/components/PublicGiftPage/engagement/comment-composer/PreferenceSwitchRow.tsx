import { Switch } from '@/components/ui/switch'
import type { PreferenceSwitchRowProps } from './types'

export default function PreferenceSwitchRow({
  value,
  label,
  onChange,
}: PreferenceSwitchRowProps) {
  return (
    <label className='flex items-center justify-between gap-6'>
      <span className='text-sm md:text-base leading-[134%] md:leading-[140%] text-grey-800'>
        {label}
      </span>
      <Switch
        checked={value}
        onCheckedChange={onChange}
        aria-label={label}
        className='data-[state=checked]:bg-success-300 data-[state=unchecked]:bg-grey-200'
      />
    </label>
  )
}
