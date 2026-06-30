import React from 'react'
import {
  DashboardIcon,
  GiftIcon,
  GiveawaysIcon,
  WalletIcon,
  ProfileIcon,
  StoresIcon,
  SearchIcon,
} from '@/assets/icons'

export const MENU_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: DashboardIcon },
  { href: '/explore', label: 'Explore', icon: SearchIcon },
  { href: '/stores', label: 'Stores', icon: StoresIcon },
  { href: '/gifts', label: 'Gift Pages & Donations', icon: GiftIcon },
  { href: '/giveaways', label: 'Giveaways', icon: GiveawaysIcon },
  { href: '/wallet', label: 'Wallet', icon: WalletIcon },
  { href: '/profile', label: 'Profile', icon: ProfileIcon },
]

export const NAV_GROUPS: Array<{
  label: string | null
  items: Array<{ href: string; label: string; icon: React.ComponentType }>
}> = [
  {
    label: null,
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: DashboardIcon },
      { href: '/wallet', label: 'Wallet', icon: WalletIcon },
      { href: '/gifts', label: 'Gift Pages & Donations', icon: GiftIcon },
      { href: '/giveaways', label: 'Giveaways', icon: GiveawaysIcon },
    ],
  },
  {
    label: 'DISCOVER',
    items: [
      { href: '/explore', label: 'Explore', icon: SearchIcon },
      { href: '/stores', label: 'Stores', icon: StoresIcon },
    ],
  },
  {
    label: 'ACCOUNT',
    items: [
      { href: '/profile', label: 'Profile', icon: ProfileIcon },
    ],
  },
]

export const PAGE_TITLE_ROUTES: Array<{
  pattern: RegExp
  title: string
}> = [
  // Most specific first
  { pattern: /^\/gifts\/create-new$/, title: 'Create a Gift Page' },
  { pattern: /^\/gifts\/[^/]+$/, title: 'Gift Page Details' }, // /gifts/:id
  { pattern: /^\/gifts$/, title: 'Gift Pages & Donations' },
  { pattern: /^\/contributions$/, title: 'All Gifts' },

  { pattern: /^\/giveaways\/create-new$/, title: 'Create a Giveaway' },
  { pattern: /^\/giveaways\/[^/]+$/, title: 'Giveaway Details' }, // /giveaways/:id
  { pattern: /^\/giveaways$/, title: 'Giveaways' },

  { pattern: /^\/dashboard$/, title: 'Dashboard' },
  { pattern: /^\/explore$/, title: 'Explore' },
  { pattern: /^\/wallet$/, title: 'Wallet' },
  { pattern: /^\/profile$/, title: 'Profile' },
  { pattern: /^\/rewards$/, title: 'Rewards & Referrals' },
  { pattern: /^\/stores\/bills$/, title: 'Bills & Utilities' },
  { pattern: /^\/stores$/, title: 'Stores' },
  { pattern: /^\/settings$/, title: 'Settings' },
]
