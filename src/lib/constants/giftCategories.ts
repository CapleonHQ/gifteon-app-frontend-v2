export type GiftCategoryMeta = {
  slug: string
  title: string
  description: string
  image: string
  aliases: string[]
}

export const GIFT_CATEGORY_META: GiftCategoryMeta[] = [
  {
    slug: 'birthday',
    title: 'Birthday Celebrations',
    description:
      'Create memorable birthday experiences with personalized gift collections',
    image: '/assets/images/birthday-celebration.jpg',
    aliases: [
      'birthday',
      'birthdays',
      'birthday celebration',
      'birthday celebrations',
    ],
  },
  {
    slug: 'weddings-anniversaries',
    title: 'Weddings & Anniversaries',
    description:
      'Perfect for couples planning their special day or milestone celebrations',
    image: '/assets/images/wedding-anniversary.jpg',
    aliases: [
      'wedding',
      'weddings',
      'anniversary',
      'anniversaries',
      'weddings anniversaries',
      'weddings & anniversaries',
      'wedding anniversary',
    ],
  },
  {
    slug: 'graduation',
    title: 'Graduations',
    description:
      'Celebrate academic achievements and support new graduates next steps',
    image: '/assets/images/graduation-celebration.jpg',
    aliases: ['graduation', 'graduations'],
  },
  {
    slug: 'promotion',
    title: 'Promotions',
    description:
      'Support artists, creators, and entrepreneurs launching new ventures',
    image: '/assets/images/promotion-celebration.jpg',
    aliases: ['promotion', 'promotions'],
  },
]

export const normalizeGiftCategoryValue = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

export const findGiftCategoryMetaByName = (name?: string | null) => {
  if (!name) return null
  const normalizedName = normalizeGiftCategoryValue(name)
  return (
    GIFT_CATEGORY_META.find((item) =>
      item.aliases.some(
        (alias) => normalizeGiftCategoryValue(alias) === normalizedName
      )
    ) ?? null
  )
}
