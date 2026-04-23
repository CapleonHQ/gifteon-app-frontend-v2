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
  onShare: (id: string) => void
  onDeactivateSelected: () => void
  onStatusActionSingle: (id: string) => void
}

const GiftsTable = ({
  items,
  selectedIds,
  isIndeterminate,
  allSelected,
  onToggleAll,
  onToggleOne,
  onView,
  onShare,
  onDeactivateSelected,
  onStatusActionSingle,
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

      <div className='min-w-[1180px]'>
        <table className='w-full table-fixed border-collapse'>
          <colgroup>
            <col className='w-[56px]' />
            <col className='w-[21%]' />
            <col className='w-[19%]' />
            <col className='w-[11%]' />
            <col className='w-[12%]' />
            <col className='w-[8%]' />
            <col className='w-[9%]' />
            <col className='w-[7%]' />
            <col className='w-[9%]' />
            <col className='w-[64px]' />
          </colgroup>
          <GiftsTableHeader
            isIndeterminate={isIndeterminate}
            allSelected={allSelected}
            onToggleAll={onToggleAll}
          />
          <tbody>
            {items.map((page) => (
              <GiftsTableRow
                key={page.id}
                page={page}
                isSelected={selectedIds.has(page.id)}
                onToggle={() => onToggleOne(page.id)}
                onView={() => onView(page.id)}
                onShare={() => onShare(page.id)}
                onStatusAction={() => onStatusActionSingle(page.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default GiftsTable
