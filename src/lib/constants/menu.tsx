import {
  DashboardIcon,
  GiftIcon,
  WalletIcon,
  ProfileIcon,
  StoresIcon,
} from '@/assets/icons'

export const MENU_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: DashboardIcon },
  { href: '/gifts', label: 'Gift Pages & Donations', icon: GiftIcon },
  { href: '/wallet', label: 'Wallet', icon: WalletIcon },
  { href: '/profile', label: 'Profile', icon: ProfileIcon },
  { href: '/stores', label: 'Stores', icon: StoresIcon },
]

export const PAGE_TITLE_ROUTES: Array<{
  pattern: RegExp
  title: string
}> = [
  // Most specific first
  { pattern: /^\/gifts\/create-new$/, title: 'Create a Gift Page' },
  { pattern: /^\/gifts\/[^/]+$/, title: 'Gift Page Details' }, // /gifts/:id
  { pattern: /^\/gifts$/, title: 'Gift Pages & Donations' },

  { pattern: /^\/dashboard$/, title: 'Dashboard' },
  { pattern: /^\/wallet$/, title: 'Wallet' },
  { pattern: /^\/profile$/, title: 'Profile' },
  { pattern: /^\/stores$/, title: 'Stores' },
  { pattern: /^\/settings$/, title: 'Settings' },
]
