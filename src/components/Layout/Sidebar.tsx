'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { LogoutIcon } from '@/assets/icons'
import { NAV_GROUPS } from '@/lib/constants/menu'
import { logout } from '@/api/auth'
import { useAuth } from '@/context/AuthContext'
import { useProfile } from '@/hooks/tanstack/account'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'

const Sidebar = () => {
  const pathname = usePathname()
  const { user } = useAuth()
  const profile = useProfile()

  const handleLogout = () => {
    logout({ redirectTo: '/login' })
  }

  const initials = user
    ? `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase()
    : ''
  const fullName = user ? `${user.firstName} ${user.lastName}` : ''
  const giftseonTag =
    profile.data?.data?.giftseonTag ?? user?.giftseonTag ?? ''

  return (
    <div className='w-[240px] h-screen overflow-y-auto bg-white border-r border-grey-100 flex flex-col'>
      <div className='mb-8 px-4 pt-6'>
        <Link href='/'>
          <div className='w-[114px] h-[44px] flex items-center justify-center'>
            <Image
              src='/assets/images/logo/logo.svg'
              alt='Giftseon'
              className='w-full h-full'
              width={200}
              height={80}
            />
          </div>
        </Link>
      </div>

      <nav className='flex flex-col flex-1 gap-5 px-3'>
        {NAV_GROUPS.map((group, groupIndex) => (
          <div key={groupIndex} className='flex flex-col gap-0.5'>
            {group.label && (
              <p className='text-[10px] font-semibold text-grey-400 uppercase tracking-widest px-3 mb-1'>
                {group.label}
              </p>
            )}
            {group.items.map((item) => {
              const Icon = item.icon
              const isActive = pathname.includes(item.href)

              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    className={`w-full flex items-center gap-2 px-3 py-3 rounded-xl transition-colors relative ${
                      isActive
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-grey-600 hover:bg-grey-50'
                    }`}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId='activeIndicator'
                        className='absolute left-0 top-0 bottom-0 w-1 bg-primary-600 rounded-r'
                        transition={{
                          type: 'spring',
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}
                    <span className='w-4 h-4'>
                      <Icon />
                    </span>
                    <span className='text-sm leading-[129%] tracking-[0%]'>
                      {item.label}
                    </span>
                  </motion.div>
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      <div className='mt-auto'>
        <div className='border-t border-grey-100 mx-3' />
        <div className='flex items-center gap-3 px-3 py-4'>
          <Avatar className='w-8 h-8'>
            {user?.profilePicture && (
              <AvatarImage src={user.profilePicture} alt={fullName} />
            )}
            <AvatarFallback className='bg-primary-100 text-primary-600 text-xs font-semibold'>
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className='flex flex-col flex-1 min-w-0'>
            <span className='text-sm font-medium text-grey-900 truncate'>
              {fullName}
            </span>
            {giftseonTag && (
              <span className='text-xs text-grey-500 truncate'>
                @{giftseonTag}
              </span>
            )}
          </div>

          <button
            type='button'
            onClick={handleLogout}
            className='w-8 h-8 rounded-lg bg-grey-50 hover:bg-error-50 hover:text-error-500 flex items-center justify-center transition-colors shrink-0'
            aria-label='Log out'
          >
            <span className='w-4 h-4'>
              <LogoutIcon />
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
