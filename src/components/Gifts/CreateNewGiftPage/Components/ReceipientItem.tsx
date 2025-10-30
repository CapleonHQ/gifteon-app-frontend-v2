import React from 'react'
import InputField from './InputField'
import { Recipient } from '@/types/gifts'

const RecipientItem = ({
  recipient,
  index,
  onChange,
  onRemove,
  canRemove,
}: {
  recipient: Recipient
  index: number
  onChange: (index: number, field: keyof Recipient, value: string) => void
  onRemove: (index: number) => void
  canRemove: boolean
}) => (
  <div className='space-y-3 mb-4 rounded-lg'>
    <InputField
      label='Name'
      value={recipient.name}
      onChange={(value) => onChange(index, 'name', value)}
      placeholder='Enter recipient name'
    />
    <InputField
      label='Email Address'
      value={recipient.email}
      onChange={(value) => onChange(index, 'email', value)}
      placeholder='Enter recipient email address'
      type='email'
    />
    {canRemove && (
      <button
        type='button'
        onClick={() => onRemove(index)}
        className='text-sm text-red-600 hover:text-red-700'
      >
        Remove
      </button>
    )}
  </div>
)

export default RecipientItem
