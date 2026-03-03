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
  price: number
  quantity: number
  fulfilled: number
}
