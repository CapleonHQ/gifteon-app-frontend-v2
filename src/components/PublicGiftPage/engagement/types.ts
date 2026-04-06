export type EngagementTab = 'comments' | 'activities'

export type PublicActivityItem = {
  id: string
  label: string
  time: string
}

export type GiftOption = {
  id: string
  title: string
  subtitle: string
  imageUrl: string
  quantity: number
  fulfilled: number
  price: number
  kind: 'wishlist' | 'store' | 'cash'
  raisedAmount?: number
  targetAmount?: number
  minimumAmount?: number
}
