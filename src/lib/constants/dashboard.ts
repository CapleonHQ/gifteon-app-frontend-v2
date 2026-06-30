import GiftIcon from '@/assets/icons/GiftIcon'
import GiveawaysIcon from '@/assets/icons/GiveawaysIcon'
import StoresIcon from '@/assets/icons/StoresIcon'
import SearchIcon from '@/assets/icons/SearchIcon'
import MoneySendIcon from '@/assets/icons/MoneySendIcon'

export const QUICK_ACTIONS = [
  {
    label: 'Pay Bills',
    href: '/stores/bills',
    icon: StoresIcon,
    iconClass: 'bg-success-50 text-success-500',
    iconGradient: 'from-success-50 to-[#d1f5df]',
  },
  {
    label: 'Send Money',
    href: '/wallet?modal=transfer',
    icon: MoneySendIcon,
    iconClass: 'bg-information-50 text-information-500',
    iconGradient: 'from-information-50 to-[#cce0f8]',
  },
  {
    label: 'Create Gift Page',
    href: '/gifts/create-new',
    icon: GiftIcon,
    iconClass: 'bg-[#FFF4E9] text-[#FF8D28]',
    iconGradient: 'from-[#FFF4E9] to-[#fde4c4]',
  },
  {
    label: 'New Giveaway',
    href: '/giveaways/create-new',
    icon: GiveawaysIcon,
    iconClass: 'bg-primary-50 text-primary-500',
    iconGradient: 'from-primary-50 to-[#d4d4f5]',
  },
  {
    label: 'Explore',
    href: '/explore',
    icon: SearchIcon,
    iconClass: 'bg-error-50 text-error-500',
    iconGradient: 'from-error-50 to-[#f8d0d0]',
  },
] as const
