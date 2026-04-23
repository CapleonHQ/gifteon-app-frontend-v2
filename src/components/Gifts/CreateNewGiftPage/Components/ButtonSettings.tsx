import React, { useEffect, useState } from 'react'
import ColorPickerField from './ColorPickerField'

const ButtonSettings = ({
  button,
  onChange,
  onCommitLabel,
  onDraftLabelChange,
  error,
}: {
  button: { label: string; backgroundColor: string; textColor: string }
  onChange?: (button: any) => void
  onCommitLabel: (value: string) => void
  onDraftLabelChange?: (value: string) => void
  error?: string
}) => {
  const [localLabel, setLocalLabel] = useState(button.label)

  useEffect(() => {
    setLocalLabel(button.label)
  }, [button.label])

  return (
    <div className='mb-5 sm:mb-6' data-error={error ? 'true' : undefined}>
      <h4 className='text-lg font-medium text-blackish mb-2'>Button</h4>
      <div className='mb-4'>
        <label className='text-sm font-medium text-grey-900 mb-2 block'>
          Button Label
        </label>
        <input
          type='text'
          value={localLabel}
          onChange={(e) => {
            const nextValue = e.target.value
            setLocalLabel(nextValue)
            onDraftLabelChange?.(nextValue)
          }}
          onBlur={() => onCommitLabel(localLabel)}
          className={`w-full px-3 py-3.5 border rounded-lg outline-hidden focus:outline-hidden focus:ring-1 text-sm text-blackish font-medium ${
            error
              ? 'border-error-300 focus:border-error-400 focus:ring-error-100'
              : 'border-grey-50 focus:border-primary-500 focus:ring-primary-100'
          }`}
        />
        {error && <p className='text-xs text-error-600 mt-1'>{error}</p>}
      </div>
      <div className='grid grid-cols-2 gap-4'>
        <ColorPickerField
          label='Background'
          color={button.backgroundColor}
          onChange={(color) =>
            onChange?.({ ...button, label: localLabel, backgroundColor: color })
          }
        />
        <ColorPickerField
          label='Text Color'
          color={button.textColor}
          onChange={(color) =>
            onChange?.({ ...button, label: localLabel, textColor: color })
          }
        />
      </div>
    </div>
  )
}

export default ButtonSettings
