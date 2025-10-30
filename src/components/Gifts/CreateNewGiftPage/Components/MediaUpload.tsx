import React from 'react'

import { X } from 'lucide-react'
import { ImageIcon, ReloadIcon } from '@/assets/icons'

const MediaUpload = ({
  media,
  onUpload,
  onRemove,
}: {
  media: { type: 'image' | 'video'; url: string }
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemove: () => void
}) => (
  <div className='mb-5 sm:mb-6'>
    <h4 className='text-lg font-medium text-blackish mb-2'>Media</h4>
    <div className='aspect-video bg-[#F3F2F280] border border-grey-100 rounded-[8px] px-3.5 pt-2 pb-4 overflow-hidden'>
      <div className='relative w-full h-full'>
        {media.url ? (
          <>
            {media.type === 'image' ? (
              <img
                src={media.url}
                alt='Upload'
                className='w-full h-full object-cover rounded-sm'
              />
            ) : (
              <video
                src={media.url}
                className='w-full h-full object-cover rounded-sm'
                controls
              />
            )}
            <button
              type='button'
              className='absolute -top-2 -right-2 bg-error-50 border-[0.75px] border-[#f9f8f7] w-6 h-6 flex items-center justify-center rounded-full'
              onClick={onRemove}
            >
              <span className='bg-error-400 w-4.5 h-4.5 flex items-center justify-center rounded-full'>
                <X className='w-[15px] h-[15px] text-white' />
              </span>
            </button>
            <label
              htmlFor='media-upload'
              className='absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#F5FDFF] hover:bg-primary-50 text-primary-300 px-3 py-[7.5px] rounded-[32px] text-sm font-medium shadow-md transition-colors duration-300 flex gap-1 items-center cursor-pointer'
            >
              <span className='w-2.5 h-2.5 block'>
                <ReloadIcon />
              </span>
              Change
            </label>
          </>
        ) : (
          <div className='absolute inset-0 flex flex-col items-center justify-center'>
            <label
              htmlFor='media-upload'
              className='bg-[#E8E8F866] hover:bg-primary-50 transition-colors duration-300 py-[11px] px-5 flex items-center gap-1.5 rounded-[20px] text-sm text-primary-900 cursor-pointer'
            >
              <span className='w-4 h-4 text-primary-900'>
                <ImageIcon />
              </span>
              Select Media
            </label>
            <span className='text-xs text-grey-700 mt-2'>
              or drag your image here
            </span>
          </div>
        )}
        <input
          id='media-upload'
          type='file'
          accept='image/*,video/*'
          onChange={onUpload}
          className='hidden'
        />
      </div>
    </div>
  </div>
)

export default MediaUpload
