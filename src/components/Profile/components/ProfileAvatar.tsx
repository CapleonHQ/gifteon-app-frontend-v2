'use client'

import { useRef } from 'react'
import EditIcon from '@/assets/icons/EditIcon'

type ProfileAvatarProps = {
  imageUrl?: string
  initials: string
  isUploading?: boolean
  onSelectFile: (file: File) => void
}

const ProfileAvatar = ({
  imageUrl,
  initials,
  isUploading = false,
  onSelectFile,
}: ProfileAvatarProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  return (
    <div className='flex flex-col items-center md:items-start gap-2 w-full md:w-auto'>
      <div className='group relative w-[100px] md:w-[140px] h-[100px] md:h-[140px] rounded-full border-2 border-white bg-primary-50 shadow-[0px_10px_18px_-2px_#10192812] flex items-center justify-center overflow-hidden'>
        <div className='absolute inset-0 bg-primary-100 text-primary-600 text-lg md:text-2xl font-semibold flex items-center justify-center'>
          {initials}
        </div>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt='Profile avatar'
            className='relative z-1 w-full h-full object-cover'
            onError={(event) => {
              event.currentTarget.style.display = 'none'
            }}
          />
        ) : null}
        {isUploading ? (
          <div className='absolute inset-0 z-2 flex flex-col items-center justify-center gap-1.5 rounded-full bg-black/55 text-white'>
            <span className='inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/45 border-t-white' />
            <span className='text-xs font-medium'>Uploading...</span>
          </div>
        ) : (
          <button
            type='button'
            onClick={() => fileInputRef.current?.click()}
            className='hidden md:flex absolute inset-0 z-2 items-center justify-center gap-1.5 rounded-full bg-black/55 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200'
          >
            <span className='w-3.5 h-3.5'>
              <EditIcon />
            </span>
            Change
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        className='hidden'
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) onSelectFile(file)
          event.target.value = ''
        }}
      />

      <button
        type='button'
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className='md:hidden inline-flex items-center gap-1.5 rounded-[8px] bg-primary-50 text-primary-600 px-3 py-1.5 text-xs leading-[18px] hover:bg-primary-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed'
      >
        <span className='w-3.5 h-3.5'>
          <EditIcon />
        </span>
        Change photo
      </button>
    </div>
  )
}

export default ProfileAvatar
