import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

import { X } from 'lucide-react'
import { ImageIcon, ReloadIcon } from '@/assets/icons'

const MediaUpload = ({
  media,
  onUpload,
  onRemove,
  error,
}: {
  media: { type: 'image' | 'video'; url: string }
  onUpload: (file: File) => void
  onRemove: () => void
  error?: string
}) => {
  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return
      onUpload(file)
    },
    [onUpload]
  )

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: handleDrop,
    accept: {
      'image/*': [],
      'video/*': [],
    },
    multiple: false,
    noClick: true,
    noKeyboard: true,
  })

  return (
    <div className='mb-5 sm:mb-6' data-error={error ? 'true' : undefined}>
      <h4 className='text-lg font-medium text-blackish mb-2'>Media</h4>
      <div
        {...getRootProps({
          className: `aspect-video bg-[#F3F2F280] border border-grey-100 rounded-[8px] px-3.5 pt-2 pb-4 overflow-hidden transition-colors duration-200 ${
            isDragActive ? 'border-primary-300 bg-primary-50/40' : ''
          }`,
        })}
      >
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
              <button
                type='button'
                onClick={open}
                className='absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#F5FDFF] hover:bg-primary-50 text-primary-300 px-3 py-[7.5px] rounded-[32px] text-sm font-medium shadow-md transition-colors duration-300 flex gap-1 items-center cursor-pointer'
              >
                <span className='w-2.5 h-2.5 block'>
                  <ReloadIcon />
                </span>
                Change
              </button>
            </>
          ) : (
            <div className='absolute inset-0 flex flex-col items-center justify-center'>
              <button
                type='button'
                onClick={open}
                className='bg-[#E8E8F866] hover:bg-primary-50 transition-colors duration-300 py-[11px] px-5 flex items-center gap-1.5 rounded-[20px] text-sm text-primary-900 cursor-pointer'
              >
                <span className='w-4 h-4 text-primary-900'>
                  <ImageIcon />
                </span>
                Select Media
              </button>
              <span className='text-xs text-grey-700 mt-2'>
                or drag your image here
              </span>
            </div>
          )}
          <input {...getInputProps({ id: 'media-upload' })} />
        </div>
      </div>
      {error && <p className='text-xs text-error-600 mt-2'>{error}</p>}
    </div>
  )
}

export default MediaUpload
