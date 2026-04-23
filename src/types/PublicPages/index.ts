import type { PagesQueryParams } from '@/types/Pages'

export type PublicPageApiSocial = {
  id?: string
  provider?: string
  url?: string
}

export type PublicPageApiMedia = {
  id?: string
  url?: string
  mediaType?: string
  alt?: string | null
}

export type PublicPageApiCategory = {
  id?: string
  name?: string
  avatar?: string | null
}

export type PublicPageApiTemplate = {
  id?: string
  name?: string
}

export type PublicPageApiWishListItem = {
  id: string
  type?: string | null
  title: string
  description: string
  imageUrl: string
  itemId?: string | null
  quantity: number | string
  unitPrice: number | string
  quantityGifted?: number | string | null
  quantityClaimed: number | string
  quantityClaimable?: number | string | null
  status?: string | null
  source?: string | null
}

export type PublicPageApiSettings = {
  id?: string
  whoIsFor?: string | null
  hasMusic?: boolean
  allowCustomGifts?: boolean
  privacy?: 'public' | 'private' | 'shareable' | string
  acceptCashGift?: boolean
  currency?: string | null
  allowParticipation?: boolean
  receiverName?: string | null
  receiverEmail?: string | null
  receiverDeliveryAddress?: string | null
  receiverPhoneNumber?: string | null
  minimumAmount?: string | null
  maximumAmount?: string | null
  amount?: string | null
  targetAmount?: string | null
  hasStoreItems?: boolean
  deletedAt?: string | null
  socials?: PublicPageApiSocial[]
  wishListItems?: PublicPageApiWishListItem[]
  storeItems?: PublicPageApiWishListItem[]
}

export type PublicPageApiActivity = {
  id: string
  message: string
  createdAt: string
  updatedAt: string
}

export type PublicPageActivitiesData = {
  activities: PublicPageApiActivity[]
  total?: number
  limit?: number
  offset?: number
  hasMore?: boolean
}

export type PublicPageApiData = {
  id: string
  status?: string
  active?: boolean
  views?: number
  userId?: string
  categoryId?: string
  slug: string
  title: string
  content?: string | null
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
  coverImageUrl?: string | null
  templateId?: string | null
  template?: PublicPageApiTemplate | null
  category?: PublicPageApiCategory | null
  titleFont?: string | null
  titleColor?: string | null
  textAlignment?: 'left' | 'middle' | 'right' | string | null
  titleFormat?: string | null
  titleSize?: number | string | null
  buttonLabel?: string | null
  buttonTextColor?: string | null
  buttonBackgroundColor?: string | null
  contentFont?: string | null
  contentColor?: string | null
  contentSize?: number | string | null
  media?: PublicPageApiMedia[]
  settings?: PublicPageApiSettings | null
  owner: {
    firstName: string
    lastName: string
    gender: 'male' | 'female'
  }
}

export type PublicPageListApiItem = {
  id: string
  title: string
  content: string
  slug: string
  coverImageUrl: string
  status: string
  createdAt: string
  updatedAt: string
  categoryName: string | null
  templateName: string | null
  totalGifts: number
  totalWishes: number
  totalViews: number
}

export type PublicPagesListApiData = {
  pages: PublicPageListApiItem[]
  total: number
  limit: number
  offset: number
  hasMore: boolean
}

export type PublicPagesQueryParams = Pick<
  PagesQueryParams,
  'limit' | 'offset' | 'startdate' | 'enddate' | 'visibility' | 'status' | 'category' | 's'
>
