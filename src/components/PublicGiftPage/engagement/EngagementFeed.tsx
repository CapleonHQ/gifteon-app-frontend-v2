import { useEffect, useMemo } from 'react'
import type { PageComment } from '@/types/Comments'
import type { EngagementTab, PublicActivityItem } from './types'
import { mapActivities } from './utils'
import ActivitiesList from './feed/ActivitiesList'
import CommentsList from './feed/CommentsList'
import FeedLoadingState from './feed/FeedLoadingState'
import FeedStatus from './feed/FeedStatus'
import {
  usePublicPageActivities,
  usePublicPageComments,
} from '@/hooks/tanstack/publicPage'

type EngagementFeedProps = {
  pageId: string
  activeTab: EngagementTab
  sortValue: 'most-recent' | 'oldest'
  onCommentsTotalChange?: (total: number) => void
}

export default function EngagementFeed({
  pageId,
  activeTab,
  sortValue,
  onCommentsTotalChange,
}: EngagementFeedProps) {
  const commentsQuery = usePublicPageComments(pageId, sortValue)
  const activitiesQuery = usePublicPageActivities(pageId)

  const liveComments = useMemo(() => {
    const pages = commentsQuery.data?.pages ?? []
    return pages.flatMap((entry) => entry.data?.comments ?? [])
  }, [commentsQuery.data?.pages])

  const comments: PageComment[] = liveComments

  const commentsTotal =
    commentsQuery.data?.pages?.[0]?.data?.total ?? comments.length

  useEffect(() => {
    onCommentsTotalChange?.(commentsTotal)
  }, [commentsTotal, onCommentsTotalChange])

  const liveActivities = useMemo(() => {
    const pages = activitiesQuery.data?.pages ?? []
    const loadedItems = pages.flatMap((entry) => entry.data?.activities ?? [])
    return mapActivities(loadedItems)
  }, [activitiesQuery.data?.pages])

  const activities: PublicActivityItem[] = liveActivities

  const isLoading =
    activeTab === 'comments'
      ? commentsQuery.isLoading
      : activitiesQuery.isLoading
  if (isLoading) {
    return <FeedLoadingState activeTab={activeTab} />
  }

  const liveItems = activeTab === 'comments' ? liveComments : liveActivities
  const showErrorStatus =
    (activeTab === 'comments'
      ? commentsQuery.isError
      : activitiesQuery.isError) && !isLoading
  const showEmptyStatus =
    !isLoading && !showErrorStatus && liveItems.length === 0

  return (
    <div>
      {showErrorStatus ? (
        <FeedStatus
          title={
            activeTab === 'comments'
              ? 'Could not load comments'
              : 'Could not load activities'
          }
          message='Please try again.'
          tone='error'
          action={
            <button
              type='button'
              onClick={() =>
                activeTab === 'comments'
                  ? commentsQuery.refetch()
                  : activitiesQuery.refetch()
              }
              className='rounded-[10px] border border-grey-200 bg-white px-3 py-1.5 text-xs text-grey-700 hover:bg-grey-50'
            >
              Retry
            </button>
          }
        />
      ) : null}

      {showEmptyStatus ? (
        <FeedStatus
          title={
            activeTab === 'comments' ? 'No wishes yet' : 'No activities yet'
          }
          message={
            activeTab === 'comments' ? 'Be the first to leave a wish.' : ''
          }
        />
      ) : null}

      {!showErrorStatus && !showEmptyStatus ? (
        activeTab === 'comments' ? (
          <CommentsList comments={comments} />
        ) : (
          <ActivitiesList activities={activities} />
        )
      ) : null}

      {!showErrorStatus &&
      !showEmptyStatus &&
      (activeTab === 'comments'
        ? commentsQuery.hasNextPage
        : activitiesQuery.hasNextPage) ? (
        <div className='border-t border-grey-50 px-4 py-3 text-center'>
          <button
            type='button'
            onClick={() =>
              activeTab === 'comments'
                ? commentsQuery.fetchNextPage()
                : activitiesQuery.fetchNextPage()
            }
            disabled={
              activeTab === 'comments'
                ? commentsQuery.isFetchingNextPage
                : activitiesQuery.isFetchingNextPage
            }
            className='rounded-[10px] border border-grey-100 px-4 py-2 text-sm font-medium text-primary-400 hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-60'
          >
            {(
              activeTab === 'comments'
                ? commentsQuery.isFetchingNextPage
                : activitiesQuery.isFetchingNextPage
            )
              ? 'Loading...'
              : 'See more'}
          </button>
        </div>
      ) : null}
    </div>
  )
}
