export type NotificationPrefs = Record<
  string,
  { email: boolean; inApp: boolean; sms: boolean }
>

export type NotificationItem = {
  id: string
  label: string
}

export type NotificationGroup = {
  title: string
  items: NotificationItem[]
}
