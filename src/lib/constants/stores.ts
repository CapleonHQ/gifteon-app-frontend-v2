export type StoreCategoryKey =
  | 'bills_utilities'
  | 'gift_cards'
  | 'gift_packages'
  | 'gift_someone'
  | 'send_a_package'
  | 'marketplace'

export interface StoreCategoryCardConfig {
  key: StoreCategoryKey
  title: string
  description: string
  href?: string
  enabled: boolean
  highlights: string[]
}

export const STORE_CATEGORY_CARDS: StoreCategoryCardConfig[] = [
  {
    key: 'bills_utilities',
    title: 'Bills & Utilities',
    description: 'Airtime, data, electricity, and cable TV in one place.',
    href: '/stores/bills',
    enabled: true,
    highlights: ['Airtime', 'Data', 'Electricity', 'Cable TV'],
  },
  {
    key: 'gift_cards',
    title: 'Gift Cards',
    description: 'Premium digital gift cards for every occasion.',
    enabled: false,
    highlights: [],
  },
  {
    key: 'gift_packages',
    title: 'Gift Packages',
    description: 'Curated bundles for celebrations and milestones.',
    enabled: false,
    highlights: [],
  },
  {
    key: 'gift_someone',
    title: 'Gift Someone',
    description: 'Curated gifts for family, friends, and loved ones.',
    enabled: false,
    highlights: [],
  },
  {
    key: 'send_a_package',
    title: 'Send a Package',
    description: 'Send your own items with packaging and delivery support.',
    enabled: false,
    highlights: [],
  },
  {
    key: 'marketplace',
    title: 'Marketplace',
    description: 'Discover unique gifts from vendors.',
    enabled: false,
    highlights: [],
  },
]

