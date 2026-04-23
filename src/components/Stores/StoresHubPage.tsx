'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { analytics } from '@/lib/analytics/events'
import { STORE_CATEGORY_CARDS } from '@/lib/constants/stores'

const StoresHubPage = () => {
  const enabledCategory = STORE_CATEGORY_CARDS.find((card) => card.enabled)
  const disabledCategories = STORE_CATEGORY_CARDS.filter((card) => !card.enabled)

  return (
    <div className='w-full bg-white lg:rounded-[20px] flex-1 h-full'>
      <div className='flex flex-col gap-4 lg:gap-5 h-full px-4 lg:px-6 py-4 lg:py-6'>
        <p className='text-sm lg:text-base text-grey-600'>
          Choose a category and send a thoughtful gift to someone, or yourself.
        </p>

        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 lg:gap-5'>
          {enabledCategory?.href ? (
            <Link
              href={enabledCategory.href}
              className='group relative overflow-hidden rounded-2xl border border-grey-100 bg-linear-to-br from-base-bg to-white p-5 lg:p-7 min-h-[232px] lg:min-h-[260px] transition hover:border-primary-300 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2'
              onClick={() =>
                analytics.trackStoreCategorySelected({
                  category: enabledCategory.key,
                  enabled: true,
                  source: 'stores_hub',
                })
              }
            >
              <div className='absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-primary-500 via-information-500 to-secondary-500' />
              <div className='pointer-events-none absolute inset-0'>
                <div className='absolute -right-10 -top-10 h-32 w-32 rounded-full border border-primary-100 bg-primary-50/60' />
                <div className='absolute -left-9 bottom-7 h-20 w-20 rounded-full border border-information-100 bg-information-50/50' />
                <div className='absolute right-7 top-16 h-px w-20 bg-primary-200/70' />
              </div>
              <h2 className='relative z-10 text-xl lg:text-2xl font-semibold text-grey-900'>
                {enabledCategory.title}
              </h2>
              <p className='relative z-10 mt-2 text-sm lg:text-base text-grey-600 max-w-[520px]'>
                {enabledCategory.description}
              </p>
              <div className='relative z-10 mt-4 flex flex-wrap gap-2'>
                {enabledCategory.highlights.map((item) => (
                  <span
                    key={item}
                    className='rounded-full border border-primary-100 bg-primary-50 px-2.5 py-1 text-[11px] font-medium text-primary-700'
                  >
                    {item}
                  </span>
                ))}
              </div>
              <span className='relative z-10 mt-6 inline-flex items-center text-sm font-semibold text-primary-500'>
                Continue
                <ArrowRight className='ml-2 h-4 w-4 transition group-hover:translate-x-0.5' />
              </span>
            </Link>
          ) : null}

          {disabledCategories.map((category) => (
            <button
              key={category.key}
              type='button'
              aria-disabled='true'
              className='relative overflow-hidden rounded-2xl border border-grey-100 bg-grey-25 p-5 lg:p-7 min-h-[232px] lg:min-h-[260px] text-left cursor-not-allowed opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grey-300 focus-visible:ring-offset-2'
              onClick={() =>
                analytics.trackStoreCategoryComingSoonClicked({
                  category: category.key,
                  source: 'stores_hub',
                })
              }
            >
              <div className='absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-grey-600 via-grey-400 to-grey-200' />
              <h3 className='relative z-10 text-lg lg:text-xl font-semibold text-grey-800'>
                Coming Soon
              </h3>
              <p className='relative z-10 mt-2 text-sm text-grey-600'>
                A new store category will be available soon.
              </p>
              <div className='relative z-10 mt-5 rounded-xl border border-grey-200/90 bg-white/80 px-3 py-3'>
                <div className='h-2 w-12 rounded-full bg-grey-200 mb-3' />
                <div className='h-2 w-20 rounded-full bg-grey-100 mb-2' />
                <div className='h-2 w-14 rounded-full bg-grey-100' />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StoresHubPage
