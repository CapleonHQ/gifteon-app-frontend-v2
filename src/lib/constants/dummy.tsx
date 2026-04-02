export type HeaderNotification = {
  id: number
  title: string
  message: string
  time: string
  unread: boolean
}

export const NOTIFICATIONS: HeaderNotification[] = []
