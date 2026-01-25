import React from 'react'

const formatAmount = (value: string) => {
  if (!value) return ''
  const numeric = value.replace(/\D/g, '')
  if (!numeric) return ''
  return Number(numeric).toLocaleString('en-US')
}

const InputField = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  helper,
  formatAsAmount = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  helper?: string
  formatAsAmount?: boolean
}) => (
  <div>
    <label className='text-sm font-medium mb-2 block'>{label}</label>
    <input
      type={formatAsAmount ? 'text' : type}
      value={formatAsAmount ? formatAmount(value) : value}
      onChange={(e) => {
        if (formatAsAmount) {
          onChange(e.target.value.replace(/\D/g, ''))
          return
        }
        onChange(e.target.value)
      }}
      inputMode={formatAsAmount ? 'numeric' : undefined}
      placeholder={placeholder}
      className='w-full px-3 py-3.5 border border-grey-50 rounded-lg outline-hidden focus:outline-hidden focus:border text-sm text-blackish font-medium focus:border-primary-500'
    />
    {helper && <p className='text-xs text-grey-500 mt-1'>{helper}</p>}
  </div>
)

export default InputField
