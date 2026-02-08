const InputField = ({
  label,
  defaultValue,
  value,
  onChange,
  placeholder,
  disabled,
  type = 'text',
}: {
  label: string
  defaultValue?: string
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  type?: string
}) => {
  return (
    <div className='space-y-1'>
      <label className='text-sm leading-[145%] font-medium text-grey-900'>
        {label}
      </label>
      <input
        type={type}
        defaultValue={defaultValue}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-3 py-3.5 rounded-[12px] leading-[145%] border text-sm font-medium outline-hidden transition-colors ${
          disabled
            ? 'border-grey-100 bg-grey-50 text-grey-400'
            : 'border-grey-100 bg-grey-50/15 text-blackish focus:border-primary-500'
        }`}
      />
    </div>
  )
}

export default InputField
