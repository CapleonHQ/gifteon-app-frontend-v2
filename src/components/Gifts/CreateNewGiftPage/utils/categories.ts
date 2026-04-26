import { findGiftCategoryMetaByName } from '@/lib/constants/giftCategories'

export type CreatePageCategoryOption = {
  id: string
  slug: string
  title: string
  description: string
  image: string
  sourceName: string
}

export const extractCategoryOptions = (
  payload: unknown
): CreatePageCategoryOption[] => {
  const response = payload as { data?: unknown[] | null } | undefined
  const rawItems = Array.isArray(response?.data) ? response.data : []

  return rawItems
    .map((item) => {
      const raw = item as { id?: unknown; name?: unknown }
      const id = String(raw.id || '').trim()
      const name = String(raw.name || '').trim()

      if (!id || !name) return null

      const meta = findGiftCategoryMetaByName(name)

      return {
        id,
        slug:
          meta?.slug ||
          name
            .toLowerCase()
            .replace(/&/g, 'and')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, ''),
        title: meta?.title || name,
        description:
          meta?.description || 'Create a gift page for this celebration.',
        image: meta?.image || '/assets/images/place-holder-image.jpg',
        sourceName: name,
      }
    })
    .filter((item): item is CreatePageCategoryOption => Boolean(item))
}

const getCategoryPriority = (category: CreatePageCategoryOption): number => {
  const value = `${category.slug} ${category.title} ${category.sourceName}`
    .toLowerCase()
    .trim()

  if (value.includes('birthday')) return 0
  if (value.includes('wedding')) return 1
  return 2
}

export const sortCategoryOptions = (
  categories: CreatePageCategoryOption[]
): CreatePageCategoryOption[] =>
  [...categories].sort((left, right) => {
    const leftPriority = getCategoryPriority(left)
    const rightPriority = getCategoryPriority(right)

    if (leftPriority !== rightPriority) return leftPriority - rightPriority
    return 0
  })
