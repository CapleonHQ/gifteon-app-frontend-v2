import { CATEGORY_TABS } from '../constants'
import type { ExploreCategory } from '@/types/Explore'

type CategoryTabsProps = {
  activeCategory: ExploreCategory
  onChange: (category: ExploreCategory) => void
  variant?: 'landing' | 'application'
}

const CategoryTabs = ({
  activeCategory,
  onChange,
  variant = 'landing',
}: CategoryTabsProps) => {
  const isApplicationVariant = variant === 'application'

  return (
    <div
      className={`relative rounded-[40px] border border-primary-50 bg-grey-50/50 p-2 ${
        isApplicationVariant ? 'mt-2' : 'mt-8'
      }`}
    >
      <div
        className={`overflow-x-auto px-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          isApplicationVariant ? '' : 'xl:overflow-visible xl:px-0'
        }`}
      >
        <div
          className={`flex min-w-max w-max snap-x snap-mandatory items-center gap-2 ${
            isApplicationVariant ? '' : 'xl:mx-auto xl:min-w-0 xl:w-full'
          }`}
        >
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeCategory === tab.id

            return (
              <button
                key={tab.id}
                type='button'
                onClick={() => onChange(tab.id)}
                className={`inline-flex h-11 shrink-0 snap-start items-center gap-1.5 rounded-[40px] px-4 text-sm leading-[130%] tracking-[0.6%] font-medium transition-all duration-200 ${
                  isApplicationVariant
                    ? ''
                    : 'xl:h-12 xl:flex-1 xl:shrink xl:justify-center xl:px-[18px] xl:text-lg xl:leading-[140%]'
                } ${
                  isActive
                    ? 'bg-primary-500 text-white shadow-[0px_12px_22px_-14px_#1A1ABC]'
                    : 'bg-white/60 text-grey-700 hover:bg-white hover:text-grey-900'
                }`}
              >
                {tab.icon ? <span aria-hidden='true'>{tab.icon}</span> : null}
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default CategoryTabs
