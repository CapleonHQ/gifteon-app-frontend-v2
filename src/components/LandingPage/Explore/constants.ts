import type { ExploreCategoryTab } from '@/types/Explore'

export const PAGE_SIZE = 15
export const SKELETON_COUNT = 6

export const CATEGORY_TABS: ExploreCategoryTab[] = [
  { id: 'all', label: 'All Celebration Types', icon: '' },
  {
    id: 'birthdays',
    label: 'Birthdays',
    icon: '🎂',
    apiCategory: 'Birthday Celebrations',
  },
  {
    id: 'weddings',
    label: 'Weddings',
    icon: '💍',
    apiCategory: 'Weddings & Anniversaries',
  },
  {
    id: 'anniversaries',
    label: 'Anniversaries',
    icon: '🎉',
    apiCategory: 'Anniversaries',
  },
  {
    id: 'graduations',
    label: 'Graduations',
    icon: '🎓',
    apiCategory: 'Graduations',
  },
  {
    id: 'perpetual-donation',
    label: 'Perpetual / Donation',
    icon: '🔑',
    apiCategory: 'Perpetual / Donation',
  },
]
