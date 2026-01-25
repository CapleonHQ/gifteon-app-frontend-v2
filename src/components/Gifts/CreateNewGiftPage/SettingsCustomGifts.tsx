import type { ChangeEvent } from 'react'
import InputField from './Components/InputField'
import CustomGiftItem from './CustomGiftItem'
import DeleteIcon from '@/assets/icons/DeleteIcon'
import { Plus } from 'lucide-react'
import DocumentIcon from '@/assets/icons/DocumentIcon'

type CustomGiftForm = {
  title: string
  price: string
  imageName: string
  imageUrl?: string
  quantity: string
}

type SettingsCustomGiftsProps = {
  enabled: boolean
  form: CustomGiftForm
  editingIndex: number | null
  customGifts: CustomGiftForm[]
  onChange: (field: keyof CustomGiftForm, value: string) => void
  onImageChange: (event: ChangeEvent<HTMLInputElement>) => void
  onRemoveImage: () => void
  onSave: () => void
  onEdit: (index: number) => void
  onRemove: (index: number) => void
}

const SettingsCustomGifts = ({
  enabled,
  form,
  editingIndex,
  customGifts,
  onChange,
  onImageChange,
  onRemoveImage,
  onSave,
  onEdit,
  onRemove,
}: SettingsCustomGiftsProps) => {
  if (!enabled) return null

  return (
    <div>
      {customGifts.length > 0 && (
        <div className='mb-4'>
          <p className='text-sm text-grey-700 mb-3'>
            Custom Gifts ({customGifts.length})
          </p>
          <div className='space-y-3'>
            {customGifts.map((gift, index) => (
              <CustomGiftItem
                key={`${gift.title}-${index}`}
                title={gift.title}
                price={gift.price}
                imageUrl={gift.imageUrl}
                onEdit={() => onEdit(index)}
                onRemove={() => onRemove(index)}
              />
            ))}
          </div>
        </div>
      )}

      <p className='text-sm text-grey-700 uppercase tracking-wide mb-3'>
        Custom Gifts
      </p>

      <div className='space-y-4'>
        <InputField
          label='Title'
          value={form.title}
          onChange={(value) => onChange('title', value)}
          placeholder='Enter the title or name of this gift'
        />
        <InputField
          label='Price'
          value={form.price}
          onChange={(value) => onChange('price', value)}
          placeholder='Enter the price of this gift'
          formatAsAmount
        />
        <div>
          <label className='text-sm font-medium mb-2 block'>Image</label>
          {form.imageName ? (
            <div className='flex items-center justify-between gap-3 px-4 py-3 rounded-[12px] border border-grey-100 bg-primary-50/30'>
              <p className='text-sm font-medium text-grey-900 truncate'>
                {form.imageName}
              </p>
              <button
                type='button'
                onClick={onRemoveImage}
                className='text-error-400 hover:text-error-600 transition-colors'
                aria-label='Remove image'
              >
                <span className='w-5 h-5'>
                  <DeleteIcon />
                </span>
              </button>
            </div>
          ) : (
            <label className='flex items-center justify-center gap-2 px-4 py-3 rounded-[12px] border border-dashed border-primary-50 bg-primary-50/40 text-primary-400 cursor-pointer hover:bg-primary-50 transition-colors'>
              <span className='w-5 h-5'>
                <DocumentIcon />
              </span>
              <span className='text-sm font-medium'>Upload gift image</span>
              <input
                type='file'
                className='hidden'
                onChange={onImageChange}
                accept='image/*,application/pdf'
              />
            </label>
          )}
        </div>
        <div>
          <label className='text-sm font-medium mb-2 block'>Quantity</label>
          <input
            type='text'
            min='1'
            value={form.quantity}
            onChange={(event) => onChange('quantity', event.target.value)}
            className='w-full px-3 py-3.5 border border-grey-50 rounded-lg outline-hidden focus:outline-hidden focus:ring-1 text-sm text-blackish font-medium focus:ring-primary-500'
          />
        </div>
      </div>

      <div className='flex justify-end mt-4'>
        <button
          type='button'
          onClick={onSave}
          disabled={!form.title.trim() || !form.price.trim()}
          className='flex items-center gap-2 py-2.5 px-5 border border-success-400 rounded-[12px] text-sm font-medium text-success-600 bg-success-50/40 hover:bg-success-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed'
        >
          <Plus className='w-3.5 h-3.5' />
          <span>
            {editingIndex !== null ? 'Update custom gift' : 'Add custom gift'}
          </span>
        </button>
      </div>
    </div>
  )
}

export default SettingsCustomGifts
