import React, { useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  ColorPicker,
  ColorPickerSelection,
  ColorPickerHue,
  ColorPickerAlpha,
  ColorPickerFormat,
  ColorPickerOutput,
} from '@/components/ui/color-picker'
import Color from 'color'

const ColorPickerField = ({
  color,
  onChange,
  label,
}: {
  color: string
  onChange: (color: string) => void
  label: string
}) => {
  const [localColor, setLocalColor] = useState(color)
  const [isOpen, setIsOpen] = useState(false)

  const handleColorChange = (value: Parameters<typeof Color>[0]) => {
    try {
      const newColor = Color(value)
      const hexColor = newColor.hex()
      setLocalColor(hexColor)
    } catch (error) {
      console.error('Color conversion error:', error)
    }
  }

  const handleSelect = () => {
    onChange(localColor)
    setIsOpen(false)
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open) {
      setLocalColor(color)
    }
  }

  return (
    <div>
      <label className='text-sm font-medium text-grey-900 mb-2 block'>
        {label}
      </label>
      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <button
            type='button'
            className='w-full flex items-center gap-2 px-3 py-3 border border-grey-200 rounded-lg hover:bg-grey-50'
          >
            <div
              className='w-6 h-6 rounded border'
              style={{ backgroundColor: color }}
            />
            <span className='text-sm'>{color}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-3' align='start'>
          <ColorPicker defaultValue={color} onChange={handleColorChange}>
            <div className='space-y-3'>
              <ColorPickerSelection className='h-40 w-64' />
              <ColorPickerHue />
              <ColorPickerAlpha />
              <div className='flex items-center gap-2'>
                <ColorPickerFormat />
                <ColorPickerOutput />
              </div>
            </div>
          </ColorPicker>
          <button
            type='button'
            onClick={handleSelect}
            className='w-full mt-3 py-2 px-4 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors'
          >
            Select
          </button>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default ColorPickerField
