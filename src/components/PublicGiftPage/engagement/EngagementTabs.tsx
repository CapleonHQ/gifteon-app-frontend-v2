import SortIcon from '@/assets/icons/SortIcon'
import type { EngagementTab } from './types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type EngagementTabsProps = {
  activeTab: EngagementTab
  commentsTotal: number
  sortValue: 'most-recent' | 'oldest'
  onSortChange: (value: 'most-recent' | 'oldest') => void
  onTabChange: (tab: EngagementTab) => void
}

const tabClass = (activeTab: EngagementTab, tab: EngagementTab) => {
  const isActive = activeTab === tab
  return isActive
    ? 'rounded-[10px] bg-primary-300 text-white font-medium'
    : 'text-grey-500 hover:text-grey-700'
}

export default function EngagementTabs({
  activeTab,
  commentsTotal,
  sortValue,
  onSortChange,
  onTabChange,
}: EngagementTabsProps) {
  return (
    <>
      <div className='rounded-[12px] border border-primary-100 bg-primary-50 p-2'>
        <div className='grid grid-cols-2 gap-2.5'>
          <button
            type='button'
            className={`py-2 px-4 leading-5 md:text-xl md:leading-6 flex gap-2 items-center justify-center transition-all duration-200 ${tabClass(
              activeTab,
              'comments'
            )}`}
            onClick={() => onTabChange('comments')}
          >
            <span>Comments</span>{' '}
            <span className={`text-sm leading-[18px]`}>({commentsTotal})</span>
          </button>
          <button
            type='button'
            className={`py-2 px-4 leading-5 md:text-xl md:leading-6  transition-all duration-200 ${tabClass(
              activeTab,
              'activities'
            )}`}
            onClick={() => onTabChange('activities')}
          >
            Activities
          </button>
        </div>
      </div>

      <div className='mb-5 mt-4 flex items-center justify-between'>
        <p className='leading-5 text-blackish'>
          {activeTab === 'comments'
            ? 'Wishes from friends and family'
            : 'Activities'}
        </p>
        <Select
          value={sortValue}
          onValueChange={(value) =>
            onSortChange(value as 'most-recent' | 'oldest')
          }
        >
          <SelectTrigger className='h-auto border-none px-0 py-0 text-sm leading-4 text-grey-700 shadow-none focus:ring-0 focus-visible:ring-0'>
            <span className='inline-flex items-center gap-1'>
              <span className='h-4 w-4'>
                <SortIcon />
              </span>
              <SelectValue placeholder='Most recent' />
            </span>
          </SelectTrigger>
          <SelectContent className='rounded-[10px] border-grey-50'>
            <SelectItem value='most-recent'>Most recent</SelectItem>
            <SelectItem value='oldest'>Oldest</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  )
}
