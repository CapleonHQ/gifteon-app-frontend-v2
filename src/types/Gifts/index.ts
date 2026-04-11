export type GiftItem = {
  id: string
  name: string
  type: string
  date: string
  image?: string
  worth: string
  status: 'Delivered' | 'Fulfilled' | 'Shipped' | 'Not fulfilled'
  actionType?: 'claim_cash' | 'claim_gift' | 'deliver'
  actionLabel?: string
  fromName?: string
}

export type CustomGiftForm = {
  title: string
  price: string
  imageName: string
  imageUrl?: string
  imageFile?: File
  quantity: string
}
