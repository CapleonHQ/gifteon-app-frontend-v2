export type ExploreCategory =
  | 'all'
  | 'birthdays'
  | 'weddings'
  | 'anniversaries'
  | 'graduations'
  | 'perpetual-donation'

export type ExploreCard = {
  id: string
  slug: string
  title: string
  content: string
  image: string
}

export type ExploreCategoryTab = {
  id: ExploreCategory
  label: string
  icon: string
  apiCategory?: string
}
