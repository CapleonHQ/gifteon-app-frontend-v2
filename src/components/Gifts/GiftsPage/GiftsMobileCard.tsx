'use client'

import Image from 'next/image'
import { ChevronDown } from 'lucide-react'
import { type GiftPageItem, statusStyles, visibilityStyles } from './types'
import GiftsMobileActionButtons from './GiftsMobileActionButtons'

type GiftsMobileCardProps = {
  page: GiftPageItem
  isSelected: boolean
  isOpen: boolean
  selectionMode: boolean
  onToggle: () => void
  onSelect: () => void
  onView: () => void
  onStatusAction: () => void
  onStartPress: () => void
  onClearPress: () => void
}

const GiftsMobileCard = ({
  page,
  isSelected,
  isOpen,
  selectionMode,
  onToggle,
  onSelect,
  onView,
  onStatusAction,
  onStartPress,
  onClearPress,
}: GiftsMobileCardProps) => {
  const isDeactivated = page.status === 'Deactivated'

  return (
    <div
      role='button'
      tabIndex={0}
      onPointerDown={onStartPress}
      onPointerUp={onClearPress}
      onPointerLeave={onClearPress}
      onPointerCancel={onClearPress}
      onClick={() => {
        if (selectionMode) {
          onSelect()
        } else {
          onToggle()
        }
      }}
      className={`p-3 transition-colors ${
        isSelected ? 'bg-success-50/70' : ''
      }`}
    >
      <div className='flex items-center justify-between gap-10 pb-3 border-b border-grey-50 text-left'>
        <div className='flex justify-between items-center gap-3 min-w-0 w-full'>
          <div className='flex gap-2 items-center'>
            <div className='w-8 h-8 rounded-[4px] overflow-hidden'>
              <Image
                src={page.image}
                alt={page.title}
                width={36}
                height={36}
                className='w-full h-full object-cover'
              />
            </div>
            <div className='min-w-0'>
              <p className='font-medium text-grey-900 truncate'>{page.title}</p>
            </div>
          </div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              statusStyles[page.status]
            }`}
          >
            {page.status}
          </span>
        </div>
        <div className='flex items-center'>
          <ChevronDown
            className={`w-6 h-6 text-grey-500 transition-transform ${
              !selectionMode && isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </div>

      {!selectionMode && isOpen && (
        <>
          <div
            className='pt-3 space-y-2 text-sm text-grey-600 w-full'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex items-center justify-between'>
              <span>Category:</span>
              <span className='text-grey-900 font-medium'>{page.category}</span>
            </div>
            <div className='flex items-center justify-between'>
              <span>Visibility:</span>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  visibilityStyles[page.visibility]
                }`}
              >
                {page.visibility}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span>Created on:</span>
              <span className='text-grey-900 font-medium'>
                {page.createdOn}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span>Total Gifts:</span>
              <span className='text-grey-900 font-medium'>
                {page.totalGifts?.toLocaleString()}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span>Total Wishes:</span>
              <span className='text-grey-900 font-medium'>
                {page.totalWishes?.toLocaleString()}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span>Views:</span>
              <span className='text-grey-900 font-medium'>
                {page.views?.toLocaleString()}
              </span>
            </div>
          </div>

          <GiftsMobileActionButtons
            onView={onView}
            onStatusAction={onStatusAction}
            statusActionLabel={isDeactivated ? 'Activate' : 'Deactivate'}
            isDestructive={!isDeactivated}
          />
        </>
      )}
    </div>
  )
}

export default GiftsMobileCard
