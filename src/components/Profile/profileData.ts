import type {
  NotificationGroup,
  NotificationPrefs,
} from '@/types/Profile/notification'
import type { PaymentMethod } from '@/types/Profile/payment'

export const profileData = {
  firstName: 'Adenike',
  lastName: 'Abioye',
  phone: '08107388332',
  email: 'adenikeabi@gmail.com',
  dob: '28/05/1990',
  address: '56 Adeniji Ikeja, Lagos State',
  gender: 'Female',
}

export const interestOptions = [
  { id: 'birthdays', label: 'Birthdays', icon: '🎂' },
  { id: 'anniversaries', label: 'Anniversaries', icon: '🎉' },
  { id: 'weddings', label: 'Weddings', icon: '💒' },
  { id: 'baby-showers', label: 'Baby Showers', icon: '👶' },
  { id: 'graduations', label: 'Graduations', icon: '🎓' },
  { id: 'housewarmings', label: 'Housewarmings', icon: '🏡' },
  { id: 'fashion', label: 'Fashion & Accessories', icon: '👕' },
  { id: 'travel', label: 'Travel & Experiences', icon: '🛫' },
  { id: 'tech', label: 'Tech & Gadgets', icon: '📱' },
  { id: 'home', label: 'Home & Lifestyle', icon: '🏠' },
  { id: 'food', label: 'Food & Drinks', icon: '🥖' },
  { id: 'decor', label: 'Art & Decor', icon: '🎨' },
  { id: 'cash', label: 'Cash Gifts & Vouchers', icon: '💸' },
]

export const notificationGroups: NotificationGroup[] = [
  {
    title: 'Gift & Contribution Updates',
    items: [
      {
        id: 'gift-received',
        label: 'Get notified when someone sends you a gift',
      },
      {
        id: 'gift-goal',
        label:
          'Get notified when your gift page reaches its target or goal amount',
      },
      {
        id: 'gift-activity',
        label:
          'Receive alerts when people view, share, or react to your gift page',
      },
    ],
  },
  {
    title: 'Transaction & Wallet Alerts',
    items: [
      {
        id: 'withdrawal-processed',
        label: 'Be notified when your withdrawal request has been processed',
      },
      {
        id: 'wallet-fund',
        label: 'Get updates when funds hit your wallet',
      },
      {
        id: 'payment-failed',
        label: 'Receive alerts if a payment or withdrawal fails',
      },
    ],
  },
  {
    title: 'Platform & Account Notifications',
    items: [
      {
        id: 'features',
        label:
          'Stay informed about new features, discounts, and announcements.',
      },
      {
        id: 'login-alert',
        label:
          "Get notified when there's a login from a new device or unusual activity.",
      },
    ],
  },
]

export const initialNotificationPrefs = notificationGroups.reduce(
  (acc, group) => {
    group.items.forEach((item) => {
      acc[item.id] = { email: true, inApp: false, sms: false }
    })
    return acc
  },
  {} as NotificationPrefs
)

export const paymentMethodsSeed: PaymentMethod[] = [
  { id: 'gtb-1', bank: 'GT Bank', account: '12******34', isDefault: true },
  { id: 'gtb-2', bank: 'GT Bank', account: '12******34', isDefault: false },
]

export const tabs = [
  { id: 'personal', label: 'Personal Information' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'pin', label: 'Security' },
] as const
