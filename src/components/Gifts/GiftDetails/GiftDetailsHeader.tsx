'use client'

import BackLeftIcon from '@/assets/icons/BackLeftIcon'
import CancelHalfCircle from '@/assets/icons/CancelHalfCircle'
import CheckmarkStyledIcon from '@/assets/icons/CheckmarkStyledIcon'
import EditIcon from '@/assets/icons/EditIcon'
import EyeOnIcon from '@/assets/icons/EyeOnIcon'
import ReloadIcon from '@/assets/icons/ReloadIcon'
import ShareIcon from '@/assets/icons/ShareIcon'
import { Power } from 'lucide-react'

type GiftDetailsHeaderProps = {
  title: string
  isActive: boolean
  onBack: () => void
  onView: () => void
  onEdit: () => void
  onShare: () => void
  onToggleActive: () => void
}

const GiftDetailsHeader = ({
  title,
  isActive,
  onBack,
  onView,
  onEdit,
  onShare,
  onToggleActive,
}: GiftDetailsHeaderProps) => {
  return (
    <div className='flex flex-col lg:flex-row justify-between gap-4'>
      <div className='flex gap-10 items-end lg:items-center justify-between lg:justify-normal'>
        <div className='flex gap-3'>
          <button
            type='button'
            onClick={onBack}
            className='hidden lg:block w-6 h-6'
            aria-label='Go back'
          >
            <span className='text-blackish hover:text-black/70 flex'>
              <BackLeftIcon />
            </span>
          </button>
          <div className='flex flex-col gap-1'>
            <h1 className='text-xl lg:text-2xl font-medium text-blackish leading-[127%]'>
              {title}
            </h1>
            <p className='text-sm lg:text-base text-grey-700 leading-[127%]'>
              Overview and performance of this giftpage
            </p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full shadow-[0px_5px_13px_-5px_#1019280D] text-sm font-medium ${
            isActive
              ? 'bg-success-50 text-success-500'
              : 'bg-grey-50 text-grey-600'
          }`}
        >
          {isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className='flex items-center gap-3'>
        {[
          {
            id: 'view',
            icon: EyeOnIcon,
            label: 'View Public Page',
            onClick: onView,
          },
          {
            id: 'edit',
            icon: EditIcon,
            label: 'Edit Page',
            onClick: onEdit,
          },
          {
            id: 'share',
            icon: ShareIcon,
            label: 'Share Page',
            onClick: onShare,
          },
        ].map(({ id, icon: Icon, label, onClick }) => (
          <button
            key={id}
            type='button'
            onClick={onClick}
            className='w-12 h-12 rounded-[12px] border border-grey-50 bg-white flex items-center justify-center text-grey-800 hover:bg-white-70 hover:text-blackish transition-colors'
            aria-label={label}
          >
            <span className='w-5 h-5'>
              <Icon />
            </span>
          </button>
        ))}
        <button
          type='button'
          onClick={onToggleActive}
          className={`w-12 h-12 rounded-[12px] border border-grey-50 bg-white flex items-center justify-center transition-colors ${
            isActive
              ? 'text-error-400 hover:text-error-600'
              : 'text-success-400 hover:text-success-600'
          }`}
          aria-label={isActive ? 'Deactivate Page' : 'Reactivate Page'}
        >
          <span className='w-5 h-5'>
            {isActive ? <CancelHalfCircle /> : <CheckmarkStyledIcon />}
          </span>
        </button>
      </div>
    </div>
  )
}

export default GiftDetailsHeader
