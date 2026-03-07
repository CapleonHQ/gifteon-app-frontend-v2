'use client'

import { type PublicPageApiData } from '@/api/services/publicPages'
import { useState } from 'react'
import { ChevronDownIcon } from '@/assets/icons'
import SortIcon from '@/assets/icons/SortIcon'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import EngagementFeed from './engagement/EngagementFeed'
import EngagementTabs from './engagement/EngagementTabs'
import type { EngagementTab } from './engagement/types'

type PublicGiftPageEngagementSectionProps = {
  page: PublicPageApiData
  variant?: 'default' | 'spotlightGrid'
}

export default function PublicGiftPageEngagementSection({
  page,
  variant = 'default',
}: PublicGiftPageEngagementSectionProps) {
  const [activeTab, setActiveTab] = useState<EngagementTab>('comments')
  const [commentsTotal, setCommentsTotal] = useState<number>(
    Array.isArray(page.comments) ? page.comments.length : 0
  )
  const [sortValue, setSortValue] = useState<'most-recent' | 'oldest'>(
    'most-recent'
  )
  const [commentsOpen, setCommentsOpen] = useState(true)
  const [activitiesOpen, setActivitiesOpen] = useState(true)

  const handleTabChange = (tab: EngagementTab) => {
    setSortValue('most-recent')
    setActiveTab(tab)
  }

  if (variant === 'spotlightGrid') {
    const toggleComments = () => {
      setCommentsOpen((prev) => {
        if (prev && !activitiesOpen) return true
        return !prev
      })
    }

    const toggleActivities = () => {
      setActivitiesOpen((prev) => {
        if (prev && !commentsOpen) return true
        return !prev
      })
    }

    return (
      <div className='w-full flex flex-col gap-3'>
        <div className='border rounded-[10px] border-grey-100 bg-white flex flex-col overflow-hidden'>
          <button
            type='button'
            onClick={toggleComments}
            className='flex justify-between items-center bg-[#F3F2F280] px-4 py-3 text-left transition-colors hover:bg-[#F3F2F2]'
          >
            <span className='text-sm font-medium text-grey-900'>
              Comments ({commentsTotal})
            </span>
            <span
              className={`h-4 w-4 transition-transform ${
                commentsOpen ? 'rotate-180' : ''
              }`}
            >
              <ChevronDownIcon />
            </span>
          </button>
          {commentsOpen ? (
            <div className='max-h-[380px] overflow-y-auto px-4 py-3 md:max-h-[460px]'>
              <div className='mb-4 flex items-center justify-between gap-3'>
                <p className='text-sm leading-5 text-blackish'>
                  Wishes from friends and family
                </p>
                <Select
                  value={sortValue}
                  onValueChange={(value) =>
                    setSortValue(value as 'most-recent' | 'oldest')
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
              <EngagementFeed
                activeTab='comments'
                pageId={page.id}
                sortValue={sortValue}
                initialActivities={page.activities}
                onCommentsTotalChange={setCommentsTotal}
              />
            </div>
          ) : null}
        </div>

        <div className='border rounded-[10px] border-grey-100 bg-white flex flex-col overflow-hidden'>
          <button
            type='button'
            onClick={toggleActivities}
            className='flex justify-between items-center bg-[#F3F2F280] px-4 py-3 text-left transition-colors hover:bg-[#F3F2F2]'
          >
            <span className='text-sm font-medium text-grey-900'>
              Activities
            </span>
            <span
              className={`h-4 w-4 transition-transform ${
                activitiesOpen ? 'rotate-180' : ''
              }`}
            >
              <ChevronDownIcon />
            </span>
          </button>
          {activitiesOpen ? (
            <div className='max-h-[380px] overflow-y-auto px-4 py-3 md:max-h-[460px]'>
              <div className='mb-4 flex items-center justify-between gap-3'>
                <p className='text-sm leading-5 text-blackish'>Activities</p>
              </div>
              <EngagementFeed
                activeTab='activities'
                pageId={page.id}
                sortValue='most-recent'
                initialActivities={page.activities}
                onCommentsTotalChange={setCommentsTotal}
              />
            </div>
          ) : null}
        </div>
      </div>
    )
  }

  return (
    <div className='w-full px-5 pb-8 sm:px-8 lg:px-15 lg:pb-14'>
      <EngagementTabs
        activeTab={activeTab}
        commentsTotal={commentsTotal}
        sortValue={sortValue}
        onSortChange={setSortValue}
        onTabChange={handleTabChange}
      />

      <EngagementFeed
        activeTab={activeTab}
        pageId={page.id}
        sortValue={sortValue}
        initialActivities={page.activities}
        onCommentsTotalChange={setCommentsTotal}
      />
    </div>
  )
}
