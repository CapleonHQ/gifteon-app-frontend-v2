'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { usePublicPages } from '@/hooks/tanstack/publicPage'
import type { ExploreCategory } from '@/types/Explore'
import { PAGE_SIZE, CATEGORY_TABS } from './constants'
import { normalizeCategoryQuery, toExploreCard } from './utils'
import CategoryTabs from './components/CategoryTabs'
import ExploreSkeletonGrid from './components/ExploreSkeletonGrid'
import ExploreCardsGrid from './components/ExploreCardsGrid'
import ErrorStateCard from './components/ErrorStateCard'
import EmptyStateCard from './components/EmptyStateCard'
import ExplorePagination from './components/ExplorePagination'

const ExplorePage = () => {
  const searchParams = useSearchParams()
  const initialCategory = normalizeCategoryQuery(searchParams.get('category'))
  const [activeCategory, setActiveCategory] =
    useState<ExploreCategory>(initialCategory)
  const [currentPage, setCurrentPage] = useState(1)

  const activeTab = useMemo(() => {
    return (
      CATEGORY_TABS.find((tab) => tab.id === activeCategory) ?? CATEGORY_TABS[0]
    )
  }, [activeCategory])

  const offset = (currentPage - 1) * PAGE_SIZE

  const publicPagesQuery = usePublicPages({
    limit: PAGE_SIZE,
    offset,
    ...(activeTab.apiCategory ? { category: activeTab.apiCategory } : {}),
  })

  const pageData = publicPagesQuery.data?.data
  const cards = useMemo(() => {
    return (pageData?.pages ?? []).map(toExploreCard)
  }, [pageData?.pages])

  const totalItems = pageData?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE))
  const visibleCount = cards.length

  const isGridLoading =
    publicPagesQuery.isLoading || publicPagesQuery.isFetching
  const isErrorState = !isGridLoading && publicPagesQuery.isError
  const isEmptyState =
    !isGridLoading && !publicPagesQuery.isError && cards.length === 0
  const shouldShowPagination =
    !isGridLoading && !publicPagesQuery.isError && totalItems > 0

  const handleCategoryChange = (category: ExploreCategory) => {
    setActiveCategory(category)
    setCurrentPage(1)
  }

  const handleViewAll = () => {
    setActiveCategory('all')
    setCurrentPage(1)
  }

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
  }

  return (
    <section className='px-4 py-10 md:px-8 lg:px-20 lg:py-15'>
      <div className='mx-auto w-full max-w-[1600px]'>
        <div className='mx-auto w-full'>
          <div className='flex sm:flex-wrap sm:items-center gap-x-2 gap-y-0'>
            <h1 className='text-[40px] font-bold leading-[52px] text-blackish md:text-[60px] md:leading-[68px]'>
              Moments Shared With the World
            </h1>
            <Image
              src='/assets/images/gifs/world.gif'
              alt='World icon'
              width={60}
              height={60}
              className='h-10 sm:h-15 w-10 sm:w-15 rounded-full object-cover'
              unoptimized
            />
          </div>

          <p className='mt-2 md:mt-3 max-w-[821px] text-sm leading-6 text-grey-700 md:text-xl md:leading-7 tracking-[2%]'>
            These are gift pages people chose to make public, each one holds a
            story, a feeling, a reason.
            <br />
            You can open any of them to read the message, leave kind words,
            contribute to the gift, or surprise the creator with something
            thoughtful.
          </p>

          <CategoryTabs
            activeCategory={activeCategory}
            onChange={handleCategoryChange}
          />

          {isErrorState ? (
            <ErrorStateCard
              onRetry={() => publicPagesQuery.refetch()}
              showViewAll={activeCategory !== 'all'}
              onViewAll={handleViewAll}
            />
          ) : null}

          {isGridLoading ? (
            <ExploreSkeletonGrid />
          ) : (
            <ExploreCardsGrid cards={cards} />
          )}

          {isEmptyState ? (
            <EmptyStateCard
              showViewAll={activeCategory !== 'all'}
              onViewAll={handleViewAll}
            />
          ) : null}

          {shouldShowPagination ? (
            <ExplorePagination
              visibleCount={visibleCount}
              totalItems={totalItems}
              currentPage={currentPage}
              totalPages={totalPages}
              isFetching={publicPagesQuery.isFetching}
              onPrev={handlePrevPage}
              onNext={handleNextPage}
            />
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default ExplorePage
