import React from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FONTS } from '@/lib/config/create-gift'
import ColorPickerField from './ColorPickerField'
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Underline,
} from 'lucide-react'

const TextStyleEditor = ({
  label,
  value,
  onChange,
}: {
  label: string
  value: {
    text: string
    font: string
    color: string
    alignment: 'left' | 'center' | 'right'
    size: string
    bold: boolean
    italic: boolean
    underline: boolean
  }
  onChange: (value: any) => void
}) => (
  <div className='mb-5 sm:mb-6'>
    <h4 className='text-lg font-medium text-blackish mb-2'>{label}</h4>

    <div className='mb-4'>
      <label className='text-sm font-medium text-grey-900 mb-2 block'>
        {label === 'Title Settings' ? 'Title Text' : 'Label'}
      </label>
      {label === 'Celebratory Message' ? (
        <textarea
          value={value.text}
          onChange={(e) => onChange({ ...value, text: e.target.value })}
          className='w-full px-3 py-3.5 border border-grey-50 rounded-lg outline-hidden focus:outline-hidden focus:ring-1 text-sm text-blackish font-medium focus:ring-primary-500 resize-none'
          rows={3}
        />
      ) : (
        <input
          type='text'
          value={value.text}
          onChange={(e) => onChange({ ...value, text: e.target.value })}
          className='w-full px-3 py-3.5 border border-grey-50 rounded-lg outline-hidden focus:outline-hidden focus:ring-1 text-sm text-blackish font-medium focus:ring-primary-500'
        />
      )}
    </div>

    <div className='grid grid-cols-2 gap-4 mb-4'>
      <div>
        <label className='text-sm font-medium text-grey-900 mb-2 block'>
          Font
        </label>
        <Select
          value={value.font}
          onValueChange={(font) => onChange({ ...value, font })}
        >
          <SelectTrigger className='w-full px-3 py-3.5 border border-grey-50 rounded-lg outline-hidden focus:outline-hidden text-sm text-blackish font-medium h-auto!'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FONTS.map((font) => (
              <SelectItem key={font} value={font}>
                {font}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ColorPickerField
        label='Text Color'
        color={value.color}
        onChange={(color) => onChange({ ...value, color })}
      />
    </div>

    <div className='flex gap-4 flex-col sm:flex-row flex-1'>
      <div className='flex gap-4 flex-1 sm:flex-2'>
        <div className='w-full'>
          <label className='text-sm font-medium text-grey-900 mb-2 block'>
            Alignment
          </label>
          <div className='flex w-full rounded-[4px] bg-[#F2F2F399] overflow-hidden'>
            <button
              type='button'
              onClick={() => onChange({ ...value, alignment: 'left' })}
              className={`flex-1 py-4 ${
                value.alignment === 'left'
                  ? 'bg-white text-grey-700 border border-grey-50 rounded-[5px]'
                  : 'text-grey-700 border border-transparent hover:bg-white-100'
              }`}
            >
              <AlignLeft className='w-4 h-4 mx-auto' />
            </button>
            <button
              type='button'
              onClick={() => onChange({ ...value, alignment: 'center' })}
              className={`flex-1 py-3 ${
                value.alignment === 'center'
                  ? 'bg-white text-grey-700 border border-grey-50 rounded-[5px]'
                  : 'text-grey-700 border border-transparent hover:bg-white-100'
              }`}
            >
              <AlignCenter className='w-4 h-4 mx-auto' />
            </button>
            <button
              type='button'
              onClick={() => onChange({ ...value, alignment: 'right' })}
              className={`flex-1 py-3 ${
                value.alignment === 'right'
                  ? 'bg-white text-grey-700 border border-grey-50 rounded-[5px]'
                  : 'text-grey-700 border border-transparent hover:bg-white-100'
              }`}
            >
              <AlignRight className='w-4 h-4 mx-auto' />
            </button>
          </div>
        </div>
        <div className='w-full'>
          <label className='text-sm font-medium text-grey-900 mb-2 block'>
            Format
          </label>
          <div className='flex w-full rounded-[4px] bg-[#F2F2F399] overflow-hidden'>
            <button
              type='button'
              onClick={() => onChange({ ...value, bold: !value.bold })}
              className={`flex-1 py-4 ${
                value.bold
                  ? 'bg-white text-grey-700 border border-grey-50 rounded-[5px]'
                  : 'text-grey-700 border border-transparent hover:bg-white-100'
              }`}
            >
              <Bold className='w-4 h-4 mx-auto' />
            </button>
            <button
              type='button'
              onClick={() => onChange({ ...value, italic: !value.italic })}
              className={`flex-1 py-4 ${
                value.italic
                  ? 'bg-white text-grey-700 border border-grey-50 rounded-[5px]'
                  : 'text-grey-700 border border-transparent hover:bg-white-100'
              }`}
            >
              <Italic className='w-4 h-4 mx-auto' />
            </button>
            <button
              type='button'
              onClick={() =>
                onChange({ ...value, underline: !value.underline })
              }
              className={`flex-1 py-4 ${
                value.underline
                  ? 'bg-white text-grey-700 border border-grey-50 rounded-[5px]'
                  : 'text-grey-700 border border-transparent hover:bg-white-100'
              }`}
            >
              <Underline className='w-4 h-4 mx-auto' />
            </button>
          </div>
        </div>
      </div>

      <div className='flex-1'>
        <label className='text-sm font-medium text-grey-900 mb-2 block'>
          Size
        </label>
        <Select
          value={value.size}
          onValueChange={(size) => onChange({ ...value, size })}
        >
          <SelectTrigger className='w-full px-3 py-3.5 border border-grey-50 rounded-lg outline-hidden focus:outline-hidden text-sm text-blackish font-medium h-auto!'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='12px'>12px</SelectItem>
            <SelectItem value='14px'>14px</SelectItem>
            <SelectItem value='16px'>16px</SelectItem>
            <SelectItem value='20px'>20px</SelectItem>
            <SelectItem value='24px'>24px</SelectItem>
            <SelectItem value='28px'>28px</SelectItem>
            <SelectItem value='32px'>32px</SelectItem>
            <SelectItem value='36px'>36px</SelectItem>
            <SelectItem value='40px'>40px</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  </div>
)

export default TextStyleEditor
