'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useOwnerGiveaways } from '@/hooks/tanstack/giveaways'
import GiveawayCard from '@/components/Giveaways/components/GiveawayCard'
import GiveawayCardSkeleton from '@/components/Giveaways/components/GiveawayCardSkeleton'
import GiftsPagination from '@/components/Gifts/GiftsPage/GiftsPagination'
import ReloadIcon from '@/assets/icons/ReloadIcon'
import EmptyBox from '@/assets/icons/EmptyBox'
import {
  GIVEAWAY_PAGE_LIMIT,
  GIVEAWAY_STATUS_FILTERS,
  type GiveawayStatusFilter,
} from '@/lib/constants/giveaways'

const GiveawaysPageClient = () => {
  const [statusFilter, setStatusFilter] = useState<GiveawayStatusFilter>('all')
  const [page, setPage] = useState(1)

  const queryParams = useMemo(
    () => ({
      page,
      limit: GIVEAWAY_PAGE_LIMIT,
      ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
    }),
    [page, statusFilter]
  )

  const giveawaysQuery = useOwnerGiveaways(queryParams)

  const items = giveawaysQuery.data?.data ?? []
  const pagination = giveawaysQuery.data?.meta?.pagination
  const total = pagination?.total ?? items.length
  const limit = pagination?.limit ?? GIVEAWAY_PAGE_LIMIT
  const offset = ((pagination?.page ?? page) - 1) * limit

  const isLoading = giveawaysQuery.isLoading
  const hasError = giveawaysQuery.isError && items.length === 0
  const isEmpty = !isLoading && !hasError && items.length === 0

  const handleFilter = (value: GiveawayStatusFilter) => {
    setStatusFilter(value)
    setPage(1)
  }

  return (
    <div className='w-full flex flex-col gap-5 mt-2 mb-10 lg:mt-0 lg:mb-0 px-4 lg:px-0'>
      {/* Header */}
      <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
        <div>
          <h1 className='text-xl font-semibold text-grey-900'>Giveaways</h1>
          <p className='text-sm text-grey-600 mt-0.5'>
            Create and manage trivia, task, and lottery giveaways.
          </p>
        </div>
        <Link
          href='/giveaways/create-new'
          className='inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-[12px] bg-linear-to-b from-[17.5%] from-primary-400 to-primary-600 border border-primary-500 text-white text-sm font-medium hover:from-primary-500 hover:to-primary-700 transition-colors'
        >
          + Create giveaway
        </Link>
      </div>

      {/* Filters */}
      <div className='flex items-center gap-2 overflow-x-auto pb-1 app-shell-scrollbar'>
        {GIVEAWAY_STATUS_FILTERS.map((filter) => {
          const active = statusFilter === filter.value
          return (
            <button
              key={filter.value}
              type='button'
              onClick={() => handleFilter(filter.value)}
              className={`shrink-0 px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${
                active
                  ? 'bg-primary-50 text-primary-600 border border-primary-100'
                  : 'bg-white text-grey-600 border border-grey-50 hover:bg-grey-50'
              }`}
            >
              {filter.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
          {Array.from({ length: 6 }).map((_, index) => (
            <GiveawayCardSkeleton key={index} />
          ))}
        </div>
      ) : hasError ? (
        <div className='flex flex-col items-center justify-center gap-3 py-16 text-center bg-white rounded-[16px] border border-grey-50'>
          <p className='text-sm text-grey-600'>
            We couldn&apos;t load your giveaways.
          </p>
          <button
            type='button'
            onClick={() => giveawaysQuery.refetch()}
            className='inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] bg-grey-50 hover:bg-grey-100 text-grey-700 text-sm font-medium transition-colors'
          >
            <span className='w-4 h-4'>
              <ReloadIcon />
            </span>
            Try again
          </button>
        </div>
      ) : isEmpty ? (
        <div className='flex flex-col items-center justify-center gap-3 py-16 text-center bg-white rounded-[16px] border border-grey-50'>
          <span className='w-16 h-16 text-grey-300'>
            <EmptyBox />
          </span>
          <div>
            <p className='text-sm font-medium text-grey-800'>No giveaways yet</p>
            <p className='text-sm text-grey-500 mt-0.5'>
              Create your first giveaway to engage your audience.
            </p>
          </div>
          <Link
            href='/giveaways/create-new'
            className='inline-flex items-center justify-center px-4 py-2.5 rounded-[12px] bg-primary-50 text-primary-600 text-sm font-medium hover:bg-primary-100 transition-colors'
          >
            Create giveaway
          </Link>
        </div>
      ) : (
        <>
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
            {items.map((giveaway) => (
              <GiveawayCard
                key={giveaway.id}
                giveaway={giveaway}
                href={`/giveaways/${giveaway.id}`}
                ctaLabel='Manage'
              />
            ))}
          </div>
          {total > limit ? (
            <GiftsPagination
              total={total}
              limit={limit}
              offset={offset}
              onPrevious={() => setPage((prev) => Math.max(1, prev - 1))}
              onNext={() =>
                setPage((prev) =>
                  pagination && prev < pagination.totalPages ? prev + 1 : prev
                )
              }
            />
          ) : null}
        </>
      )}
    </div>
  )
}

export default GiveawaysPageClient
