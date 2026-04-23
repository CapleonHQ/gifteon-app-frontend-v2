import type { ExploreCard, ExploreCategory } from '@/types/Explore'
import type { PublicPageListApiItem } from '@/types/PublicPages'

export const normalizeCategoryQuery = (value: string | null): ExploreCategory => {
  const normalized = (value || '').trim().toLowerCase()

  if (normalized === 'birthday' || normalized === 'birthdays') {
    return 'birthdays'
  }
  if (normalized === 'wedding' || normalized === 'weddings') {
    return 'weddings'
  }
  if (normalized === 'anniversary' || normalized === 'anniversaries') {
    return 'anniversaries'
  }
  if (normalized === 'graduation' || normalized === 'graduations') {
    return 'graduations'
  }
  if (
    normalized === 'perpetual-donation' ||
    normalized === 'donation' ||
    normalized === 'donations' ||
    normalized === 'perpetual'
  ) {
    return 'perpetual-donation'
  }

  return 'all'
}

export const toExploreCard = (item: PublicPageListApiItem): ExploreCard => {
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    content: item.content.trim(),
    image: item.coverImageUrl,
  }
}
