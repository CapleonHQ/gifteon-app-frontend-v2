import React from 'react'
import ColorPickerField from './ColorPickerField'

const ButtonSettings = ({
  button,
  onChange,
}: {
  button: { label: string; backgroundColor: string; textColor: string }
  onChange: (button: any) => void
}) => (
  <div className='mb-5 sm:mb-6'>
    <h4 className='text-lg font-medium text-blackish mb-2'>Button</h4>
    <div className='mb-4'>
      <label className='text-sm font-medium text-grey-900 mb-2 block'>
        Button Label
      </label>
      <input
        type='text'
        value={button.label}
        onChange={(e) => onChange({ ...button, label: e.target.value })}
        className='w-full px-3 py-3.5 border border-grey-50 rounded-lg outline-hidden focus:outline-hidden focus:ring-1 text-sm text-blackish font-medium focus:ring-primary-500'
      />
    </div>
    <div className='grid grid-cols-2 gap-4'>
      <ColorPickerField
        label='Background'
        color={button.backgroundColor}
        onChange={(color) => onChange({ ...button, backgroundColor: color })}
      />
      <ColorPickerField
        label='Text Color'
        color={button.textColor}
        onChange={(color) => onChange({ ...button, textColor: color })}
      />
    </div>
  </div>
)

export default ButtonSettings
