import React from 'react'

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

const RadioField = ({
  label,
  value,
  onChange,
  options,
  grid = 'grid-cols-2',
  helper,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  grid?: string
  helper?: string
}) => (
  <div>
    <label className='text-sm font-medium mb-1 leading-[145%] block'>
      {label}
    </label>
    <RadioGroup value={value} onValueChange={onChange}>
      <div
        className={`grid ${grid} bg-[#F2F2F326] border border-grey-50 rounded-[12px] overflow-hidden`}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className='flex items-center space-x-2 border-r last:border-r-0 border-grey-50 py-3.5 px-3 cursor-pointer hover:bg-grey-50 transition-colors'
          >
            <RadioGroupItem
              value={option.value}
              id={option.value}
              className='size-5'
            />
            <span className='text-blackish text-sm font-medium leading-[145%]'>
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </RadioGroup>
    {helper && <p className='text-xs text-grey-500 mt-1'>{helper}</p>}
  </div>
)

export default RadioField
