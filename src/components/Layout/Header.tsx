'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, ChevronUp } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  LogoutIcon,
  SearchIcon,
  NotificationIcon,
} from '@/assets/icons'
import { usePathname, useRouter } from 'next/navigation'
import { NAV_GROUPS } from '@/lib/constants/menu'
import { NOTIFICATIONS } from '@/lib/constants/dummy'
import { useAuth } from '@/context/AuthContext'
import { logout } from '@/api/auth'
import PolygonIcon from '@/assets/icons/PolygonIcon'
import Favoriteicon from '@/assets/icons/Favoriteicon'
import EditIcon02 from '@/assets/icons/EditIcon02'

const Header = ({ pageTitle = 'Dashboard' }: { pageTitle: string }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()

  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length

  const displayName = user?.firstName ? `Hello, ${user.firstName}` : 'Hello'
  const email = user?.email ?? ''
  const avatarUrl = user?.profilePicture ?? ''
  const initials =
    `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase() ||
    'U'
  const handleLogout = () => {
    setProfileDropdownOpen(false)
    setIsMobileMenuOpen(false)
    logout({ redirectTo: '/login' })
  }

  const handleToggleMobileSearch = () => {
    const nextIsSearchOpen = !isMobileSearchOpen
    setIsMobileSearchOpen(nextIsSearchOpen)
    if (nextIsSearchOpen) {
      setIsMobileMenuOpen(false)
    }
  }

  const handleToggleMobileMenu = () => {
    const nextIsMenuOpen = !isMobileMenuOpen
    setIsMobileMenuOpen(nextIsMenuOpen)
    if (nextIsMenuOpen) {
      setIsMobileSearchOpen(false)
    }
  }

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  // Close mobile overlays when crossing into desktop
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)')
    const handleChange = () => {
      if (mediaQuery.matches) {
        setIsMobileMenuOpen(false)
        setIsMobileSearchOpen(false)
      }
    }

    handleChange()
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }

    mediaQuery.addListener(handleChange)
    return () => mediaQuery.removeListener(handleChange)
  }, [])

  return (
    <>
      <header
        className={`w-full ${
          isMobileSearchOpen ? 'bg-white' : 'bg-[#F5FDFF80]'
        } lg:bg-white border-b-[0.2px] lg:border-b-[0.4px] border-grey-50 px-4 sm:px-6 py-4 lg:py-6 fixed lg:relative top-0 left-0 right-0 z-40`}
      >
        <div className='flex items-center justify-between gap-4 lg:gap-6'>
          {/* Left Section - Logo (Mobile) and Page Title */}
          <div className='flex items-center gap-6'>
            {/* Mobile Logo */}
            <Link href='/' className='lg:hidden'>
              <div className='w-[104px] h-[40px]'>
                <Image
                  src='/assets/images/logo/logo.svg'
                  alt='Giftseon'
                  className='w-full h-full'
                  width={114}
                  height={44}
                />
              </div>
            </Link>

            {/* Page Title - Hidden on mobile - Dynamic based on pathname */}
            <h1 className='hidden lg:block text-grey-900 text-[28px] font-medium leading-[127%] tracking-[0%]'>
              {pageTitle}
            </h1>
          </div>

          {/* Center Section - Search Bar (Desktop) */}
          <div className='hidden lg:flex flex-1 max-w-[350px]'>
            <div className='relative w-full transition-all'>
              <span
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                  isSearchFocused ? 'text-primary-300' : 'text-grey-700'
                }`}
              >
                <SearchIcon />
              </span>

              <input
                type='text'
                placeholder='Search'
                className='w-full pl-8 pr-4 py-2.5 bg-[#F3F2F24D] border border-grey-50 rounded-xl text-grey-700 placeholder:text-grey-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-primary-300 transition-colors'
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className='flex items-center gap-3 lg:gap-[26px]'>
            {/* Notifications */}
            <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
              <PopoverTrigger asChild>
                <motion.button
                  className='w-10 h-10 flex items-center justify-center lg:hover:bg-base-bg/80 hover:bg-white/80 rounded-full border border-grey-50 bg-white lg:bg-base-bg  transition-colors'
                  whileTap={{ scale: 0.95 }}
                >
                  <span className='w-5 h-5 text-blackish relative'>
                    <NotificationIcon />
                    {unreadCount > 0 && (
                      <span className='absolute top-px left-3 w-[5px] h-[5px] bg-success-400 rounded-full' />
                    )}
                  </span>
                </motion.button>
              </PopoverTrigger>
              <PopoverContent className='w-80 p-0 border-grey-100' align='end'>
                <div className='px-4 py-3 border-b border-grey-50'>
                  <div className='flex items-center justify-between'>
                    <h3 className='font-semibold text-grey-900'>
                      Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <span className='text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded-full'>
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                </div>
                <div className='max-h-96 overflow-y-auto'>
                  {NOTIFICATIONS.length > 0 ? (
                    NOTIFICATIONS.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 hover:bg-grey-50 cursor-pointer transition-colors border-b border-grey-50 last:border-0 ${
                          notification.unread ? 'bg-primary-50/30' : ''
                        }`}
                      >
                        <div className='flex gap-3'>
                          <div className='flex-1'>
                            <div className='flex items-start justify-between gap-2'>
                              <p className='text-sm font-medium text-grey-900'>
                                {notification.title}
                              </p>
                              {notification.unread && (
                                <span className='w-2 h-2 bg-primary-500 rounded-full mt-1.5 shrink-0' />
                              )}
                            </div>
                            <p className='text-xs text-grey-600 mt-1'>
                              {notification.message}
                            </p>
                            <p className='text-xs text-grey-400 mt-1'>
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className='px-4 py-8 text-center text-sm text-grey-500'>
                      You&apos;re all caught up. New notifications will appear
                      here.
                    </div>
                  )}
                </div>
                <div className='px-4 py-3 border-t border-grey-50'>
                  <button className='w-full text-sm text-primary-600 font-medium hover:text-primary-700 transition-colors'>
                    View all notifications
                  </button>
                </div>
              </PopoverContent>
            </Popover>
            {/* Search Icon (Mobile) */}
            <motion.button
              className='lg:hidden w-10 h-10 flex items-center justify-center hover:bg-white/80 rounded-full border border-grey-50 bg-white  transition-colors'
              onClick={handleToggleMobileSearch}
              whileTap={{ scale: 0.95 }}
            >
              <span className='w-5 h-5 text-blackish'>
                <SearchIcon />
              </span>
            </motion.button>

            {/* User Profile - Desktop */}
            <DropdownMenu
              open={profileDropdownOpen}
              onOpenChange={setProfileDropdownOpen}
            >
              <DropdownMenuTrigger asChild>
                <div className='hidden lg:flex items-center gap-2 pl-3 pr-2 py-2 hover:bg-grey-50 rounded-lg transition-colors cursor-pointer'>
                  <div className='flex items-center gap-2'>
                    <Avatar className='w-10 h-10'>
                      {avatarUrl ? <AvatarImage src={avatarUrl} /> : null}
                      <AvatarFallback className='bg-primary-100 text-primary-600 font-medium'>
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col gap-1'>
                      <span className='font-medium text-blackish leading-[20px]'>
                        {displayName}
                      </span>
                      <span className='text-xs text-grey-500 leading-[16px]'>
                        {email}
                      </span>
                    </div>
                  </div>
                  {profileDropdownOpen ? (
                    <ChevronUp className='w-5 h-5 text-grey-500' />
                  ) : (
                    <ChevronDown className='w-5 h-5 text-grey-500' />
                  )}
                </div>
              </DropdownMenuTrigger>
              <div className='relative'>
                <DropdownMenuContent
                  className='w-56 border-none shadow-[0px_10px_18px_-2px_#10192812]'
                  align='end'
                  sideOffset={24}
                >
                  <span className='absolute text-white w-10 h-[29px] -top-4 right-2.5'>
                    <PolygonIcon />
                  </span>
                  <div className='px-2 py-2'>
                    <p className='text-sm font-medium text-grey-900'>
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className='text-xs text-grey-600'>{email}</p>
                  </div>
                  <DropdownMenuSeparator className='bg-grey-50' />
                  <DropdownMenuItem className='cursor-pointer text-grey-900 focus:text-grey-900 focus:bg-grey-50'>
                    <span className='w-5 h-5 mr-2 text-grey-500 [&>svg]:size-full! [&_svg]:text-current!'>
                      <Favoriteicon />
                    </span>
                    Favorite Gifts
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className='cursor-pointer text-grey-900 focus:text-grey-900 focus:bg-grey-50'
                    onClick={() => {
                      setProfileDropdownOpen(false)
                      router.push('/profile?mode=edit')
                    }}
                  >
                    <span className='w-5 h-5 mr-2 text-grey-500 [&>svg]:size-full! [&_svg]:text-current!'>
                      <EditIcon02 />
                    </span>
                    Edit Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className='cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50'
                    onClick={handleLogout}
                  >
                    <span className='w-5 h-5 mr-2 text-grey-500 [&>svg]:size-full! [&_svg]:text-current!'>
                      <LogoutIcon />
                    </span>
                    Log Out
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem className='cursor-pointer text-grey-700 focus:text-grey-900 focus:bg-grey-50'>
                    <svg
                      className='w-4 h-4 mr-2'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
                      />
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                      />
                    </svg>
                    Settings
                  </DropdownMenuItem> */}
                  {/* <DropdownMenuSeparator className='bg-grey-50' /> */}
                </DropdownMenuContent>
              </div>
            </DropdownMenu>

            {/* Mobile Menu Toggle */}
            <motion.button
              className={`lg:hidden w-10 h-10 flex items-center justify-center rounded-full border border-grey-50 transition-colors ${
                isMobileMenuOpen
                  ? 'bg-primary-50 hover:bg-primary-50/70'
                  : ' bg-white hover:bg-white/80'
              }`}
              onClick={handleToggleMobileMenu}
              whileTap={{ scale: 0.95 }}
            >
              {isMobileMenuOpen ? (
                <X className='w-6 h-6 text-blackish' />
              ) : (
                <Menu className='w-6 h-6 text-blackish' />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <AnimatePresence>
          {isMobileSearchOpen && (
            <>
              {/* Backdrop to close search */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='fixed inset-0 z-[-1]'
                onClick={() => setIsMobileSearchOpen(false)}
              />
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className='lg:hidden overflow-hidden'
              >
                <div className='mt-4 relative p-1'>
                  <span
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                      isSearchFocused ? 'text-primary-300' : 'text-grey-700'
                    }`}
                  >
                    <SearchIcon />
                  </span>
                  <input
                    type='text'
                    placeholder='Search'
                    className='w-full pl-8 pr-4 py-2.5 bg-[#F3F2F24D] border border-grey-50 rounded-xl text-grey-700 placeholder:text-grey-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-primary-300 transition-colors'
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                  />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu Sidebar - Appears below header */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop overlay with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className='fixed inset-x-0 bottom-0 top-[72.5px] bg-black/20 backdrop-blur-sm z-40 lg:hidden'
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Sidebar content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className='fixed top-[72.5px] right-0 bottom-0 w-full max-w-md bg-white z-50 lg:hidden shadow-2xl overflow-y-auto'
            >
              <div className='flex flex-col h-full'>
                {/* Mobile Menu Navigation */}
                <nav className='flex-1 p-4 flex flex-col gap-5 overflow-y-auto'>
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
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <motion.div
                              className={`w-full flex items-center gap-2 px-3 py-3 rounded-xl transition-colors relative ${
                                isActive
                                  ? 'text-primary-600 bg-primary-50'
                                  : 'text-grey-600 hover:bg-grey-50'
                              }`}
                              whileTap={{ scale: 0.98 }}
                            >
                              {isActive && (
                                <motion.div
                                  layoutId='mobileActiveIndicator'
                                  className='absolute left-0 top-0 bottom-0 w-1 bg-primary-600 rounded-r'
                                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                              )}
                              <span className='w-4 h-4'>
                                <Icon />
                              </span>
                              <span className='text-base leading-[129%] tracking-[0%]'>
                                {item.label}
                              </span>
                            </motion.div>
                          </Link>
                        )
                      })}
                    </div>
                  ))}
                </nav>

                {/* User Profile Section - Mobile */}
                <div className='border-t border-grey-100 mx-4' />
                <div className='flex items-center gap-3 px-4 py-4'>
                  <Avatar className='w-10 h-10'>
                    {avatarUrl ? <AvatarImage src={avatarUrl} /> : null}
                    <AvatarFallback className='bg-primary-100 text-primary-600 font-medium'>
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col flex-1 min-w-0'>
                    <span className='font-medium text-blackish text-sm leading-[20px] truncate'>
                      {user?.firstName} {user?.lastName}
                    </span>
                    <span className='text-xs text-grey-500 leading-[16px] truncate'>
                      {email}
                    </span>
                  </div>
                  <button
                    type='button'
                    onClick={handleLogout}
                    className='w-9 h-9 rounded-lg bg-grey-50 hover:bg-error-50 hover:text-error-500 flex items-center justify-center transition-colors shrink-0'
                    aria-label='Log out'
                  >
                    <span className='w-4 h-4'>
                      <LogoutIcon />
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Header
