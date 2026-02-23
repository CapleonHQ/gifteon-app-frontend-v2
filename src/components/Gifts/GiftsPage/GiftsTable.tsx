'use client'

import CancelHalfCircle from '@/assets/icons/CancelHalfCircle'
import { type GiftPageItem } from './types'
import GiftsTableHeader from './GiftsTableHeader'
import GiftsTableRow from './GiftsTableRow'

type GiftsTableProps = {
  items: GiftPageItem[]
  selectedIds: Set<string>
  isIndeterminate: boolean
  allSelected: boolean
  onToggleAll: () => void
  onToggleOne: (id: string) => void
  onView: (id: string) => void
  onDeactivateSelected: () => void
  onDeactivateSingle: (id: string) => void
}

const GiftsTable = ({
  items,
  selectedIds,
  isIndeterminate,
  allSelected,
  onToggleAll,
  onToggleOne,
  onView,
  onDeactivateSelected,
  onDeactivateSingle,
}: GiftsTableProps) => {
  return (
    <div className='hidden lg:block overflow-x-auto'>
      <div className='px-4 py-3 border-b border-grey-50'>
        {selectedIds.size > 0 && (
          <button
            type='button'
            onClick={onDeactivateSelected}
            className='flex items-center gap-2 px-3.5 py-2 rounded-[10px] border border-grey-100 bg-white text-sm text-grey-700 hover:bg-grey-50 transition-colors'
          >
            <span className='w-4 h-4 text-error-400'>
              <CancelHalfCircle />
            </span>
            Deactivate
          </button>
        )}
      </div>

      <div className='min-w-[1080px]'>
        <GiftsTableHeader
          isIndeterminate={isIndeterminate}
          allSelected={allSelected}
          onToggleAll={onToggleAll}
        />

        <div>
          {items.map((page) => (
            <GiftsTableRow
              key={page.id}
              page={page}
              isSelected={selectedIds.has(page.id)}
              onToggle={() => onToggleOne(page.id)}
              onView={() => onView(page.id)}
              onDeactivate={() => onDeactivateSingle(page.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default GiftsTable
