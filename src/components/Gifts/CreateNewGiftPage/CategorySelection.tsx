'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import TemplateSelectionFooter from './TemplateSelectionFooter'

export type CreatePageCategoryOption = {
  id: string
  slug: string
  title: string
  description: string
  image: string
  sourceName: string
}

type CategorySelectionProps = {
  categories: CreatePageCategoryOption[]
  selectedCategoryId: string | null
  isLoading: boolean
  isError: boolean
  onSelectCategory: (categoryId: string) => void
  onContinue: () => void
}

const LoadingCards = () => (
  <div className='mb-8 grid grid-cols-1 gap-5 md:grid-cols-2'>
    {Array.from({ length: 4 }).map((_, index) => (
      <div
        key={index}
        className='overflow-hidden rounded-[20px] border border-grey-100 bg-white'
      >
        <div className='h-52 animate-pulse bg-grey-100' />
        <div className='space-y-3 p-5'>
          <div className='h-5 w-2/3 animate-pulse rounded bg-grey-100' />
          <div className='h-4 w-full animate-pulse rounded bg-grey-50' />
          <div className='h-4 w-4/5 animate-pulse rounded bg-grey-50' />
        </div>
      </div>
    ))}
  </div>
)

export default function CategorySelection({
  categories,
  selectedCategoryId,
  isLoading,
  isError,
  onSelectCategory,
  onContinue,
}: CategorySelectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='w-full pb-10'
    >
      <div className='mb-6 flex flex-col gap-3'>
        <div>
          <p className='text-xs font-medium uppercase tracking-[0.18em] text-primary-500'>
            Step 1 of 3
          </p>
          <h2 className='mt-2 text-2xl font-semibold text-blackish'>
            Choose a celebration category
          </h2>
          <p className='mt-2 max-w-2xl text-sm leading-6 text-grey-700'>
            Start with the occasion so the rest of the flow stays aligned with
            how visitors discover pages from the landing experience.
          </p>
        </div>
      </div>

      {isLoading ? <LoadingCards /> : null}

      {isError ? (
        <div className='mb-8 rounded-[20px] border border-error-100 bg-error-50/50 p-5'>
          <h3 className='text-base font-medium text-error-800'>
            We could not start this step
          </h3>
          <p className='mt-1 text-sm text-error-700'>
            Celebration categories are unavailable right now, so gift-page
            creation cannot continue yet. Please try again later.
          </p>
        </div>
      ) : null}

      {!isLoading && !isError && categories.length === 0 ? (
        <div className='mb-8 rounded-[20px] border border-warning-100 bg-warning-50/50 p-5'>
          <h3 className='text-base font-medium text-warning-800'>
            No celebration categories found
          </h3>
          <p className='mt-1 text-sm text-warning-700'>
            We could not find any configured categories to begin gift-page
            creation. This usually means setup data has not been added yet.
          </p>
        </div>
      ) : null}

      {!isLoading && !isError && categories.length > 0 ? (
        <div className='mb-8 grid grid-cols-1 gap-5 md:grid-cols-2'>
          {categories.map((category) => {
            const isSelected = category.id === selectedCategoryId

            return (
              <button
                key={category.id}
                type='button'
                onClick={() => onSelectCategory(category.id)}
                className={`group overflow-hidden rounded-[20px] border text-left transition-all ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50/40 shadow-[0px_16px_30px_-18px_#2E319280]'
                    : 'border-grey-100 bg-white hover:border-grey-200 hover:shadow-[0px_12px_24px_-18px_#10192830]'
                }`}
              >
                <div className='relative h-52 overflow-hidden'>
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className='object-cover transition-transform duration-500 group-hover:scale-[1.03]'
                  />
                  <div className='absolute inset-0 bg-linear-to-t from-[#10192866] via-transparent to-transparent' />
                  <div className='absolute left-4 top-4 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-grey-700'>
                    {category.sourceName}
                  </div>
                  {isSelected ? (
                    <div className='absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg'>
                      <svg
                        className='h-4 w-4'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={3}
                          d='M5 13l4 4L19 7'
                        />
                      </svg>
                    </div>
                  ) : null}
                </div>

                <div className='p-5'>
                  <h3 className='text-lg font-semibold text-blackish'>
                    {category.title}
                  </h3>
                  <p className='mt-2 text-sm leading-6 text-grey-700'>
                    {category.description}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      ) : null}

      <TemplateSelectionFooter
        canContinue={Boolean(selectedCategoryId) && !isLoading && !isError}
        onContinue={onContinue}
        ctaLabel='Continue to Templates'
      />
    </motion.div>
  )
}
