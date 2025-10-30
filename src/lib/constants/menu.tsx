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

// Page title configuration
export const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/gifts': 'Gift Pages & Donations',
  '/gifts/create-new': 'Create a Gift Page',
  '/wallet': 'Wallet',
  '/profile': 'Profile',
  '/stores': 'Stores',
  '/settings': 'Settings',
}
