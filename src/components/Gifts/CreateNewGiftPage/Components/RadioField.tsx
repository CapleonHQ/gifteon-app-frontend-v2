import React from 'react'

import { RadioGroup, SuccessRadioGroupItem } from '@/components/ui/radio-group'

const RadioField = ({
  label,
  value,
  onChange,
  options,
  grid = 'grid-cols-2',
  helper,
  error,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string; disabled?: boolean }[]
  grid?: string
  helper?: string
  error?: string
}) => (
  <div data-error={error ? 'true' : undefined}>
    <label className='text-sm font-medium mb-1 leading-[145%] block'>
      {label}
    </label>
    <RadioGroup value={value} onValueChange={onChange}>
      <div
        className={`grid ${grid} bg-[#F2F2F326] border border-grey-50 rounded-[12px] overflow-hidden`}
      >
        {options.map((option) => {
          const isDisabled = Boolean(option.disabled)
          return (
          <label
            key={option.value}
            className={`flex items-center space-x-2 border-r last:border-r-0 border-grey-50 py-3.5 px-3 transition-colors ${
              isDisabled
                ? 'cursor-not-allowed opacity-60'
                : 'cursor-pointer hover:bg-grey-50'
            }`}
          >
            <SuccessRadioGroupItem
              value={option.value}
              id={option.value}
              className='size-5'
              disabled={isDisabled}
            />
            <span className='text-blackish text-sm font-medium leading-[145%]'>
              {option.label}
            </span>
          </label>
        )})}
      </div>
    </RadioGroup>
    {error && <p className='text-xs text-error-600 mt-1'>{error}</p>}
    {helper && <p className='text-xs text-grey-500 mt-1'>{helper}</p>}
  </div>
)

export default RadioField
