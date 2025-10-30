import React from 'react'

const InputField = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  helper,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  helper?: string
}) => (
  <div>
    <label className='text-sm font-medium mb-2 block'>{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className='w-full px-3 py-3.5 border border-grey-50 rounded-lg outline-hidden focus:outline-hidden focus:ring-1 text-sm text-blackish font-medium focus:ring-primary-500'
    />
    {helper && <p className='text-xs text-grey-500 mt-1'>{helper}</p>}
  </div>
)

export default InputField
