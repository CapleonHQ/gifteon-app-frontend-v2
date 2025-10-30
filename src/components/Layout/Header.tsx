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
  WalletIcon,
  ProfileIcon,
  LogoutIcon,
  SearchIcon,
  NotificationIcon,
} from '@/assets/icons'
import { usePathname } from 'next/navigation'
import { MENU_ITEMS } from '@/lib/constants/menu'
import { NOTIFICATIONS } from '@/lib/constants/dummy'

const Header = ({ pageTitle = 'Dashboard' }: { pageTitle: string }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false)

  const pathname = usePathname()

  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length

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

  // Close mobile search when mobile menu opens and vice versa
  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsMobileSearchOpen(false)
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    if (isMobileSearchOpen) {
      setIsMobileMenuOpen(false)
    }
  }, [isMobileSearchOpen])

  return (
    <>
      <header className='w-full bg-[#F5FDFF80] lg:bg-white border-b-[0.2px] lg:border-b-[0.4px] border-grey-50 px-4 sm:px-6 py-4 lg:py-6 fixed lg:relative top-0 left-0 right-0 z-50'>
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
                  {NOTIFICATIONS.map((notification) => (
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
                  ))}
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
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
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
                      <AvatarImage src='/assets/images/avatar-placeholder.png' />
                      <AvatarFallback className='bg-primary-100 text-primary-600 font-medium'>
                        AD
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col gap-1'>
                      <span className='font-medium text-blackish leading-[20px]'>
                        Hello, Adenike
                      </span>
                      <span className='text-xs text-grey-500 leading-[16px]'>
                        adenikeabi@gmail.com
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
              <DropdownMenuContent className='w-56 border-grey-100' align='end'>
                <div className='px-2 py-2'>
                  <p className='text-sm font-medium text-grey-900'>Adenike</p>
                  <p className='text-xs text-grey-600'>adenikeabi@gmail.com</p>
                </div>
                <DropdownMenuSeparator className='bg-grey-50' />
                <DropdownMenuItem className='cursor-pointer text-grey-700 focus:text-grey-900 focus:bg-grey-50'>
                  <span className='w-4 h-4 mr-2'>
                    <ProfileIcon />
                  </span>
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuItem className='cursor-pointer text-grey-700 focus:text-grey-900 focus:bg-grey-50'>
                  <span className='w-4 h-4 mr-2'>
                    <WalletIcon />
                  </span>
                  My Wallet
                </DropdownMenuItem>
                <DropdownMenuItem className='cursor-pointer text-grey-700 focus:text-grey-900 focus:bg-grey-50'>
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
                </DropdownMenuItem>
                <DropdownMenuSeparator className='bg-grey-50' />
                <DropdownMenuItem className='cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50'>
                  <span className='w-4 h-4 mr-2'>
                    <LogoutIcon />
                  </span>
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Toggle */}
            <motion.button
              className={`lg:hidden w-10 h-10 flex items-center justify-center rounded-full border border-grey-50 transition-colors ${
                isMobileMenuOpen
                  ? 'bg-primary-50 hover:bg-primary-50/70'
                  : ' bg-white hover:bg-white/80'
              }`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
              className='fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden'
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Sidebar content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className='fixed top-[72.5px] right-0 bottom-0 w-full max-w-md bg-white z-40 lg:hidden shadow-2xl overflow-y-auto'
            >
              <div className='flex flex-col h-full'>
                {/* Mobile Menu Navigation */}
                <nav className='flex-1 p-4 flex flex-col gap-y-1.5'>
                  {MENU_ITEMS.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname.includes(item.href)
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <motion.div
                          className={`w-full flex items-center gap-2 px-3 py-3.5 rounded-lg transition-colors relative ${
                            isActive
                              ? 'text-primary-600 bg-primary-50'
                              : 'text-grey-600 hover:bg-grey-50'
                          }`}
                          whileTap={{ scale: 0.98 }}
                        >
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

                  {/* Log Out */}
                  <div className='pt-3 pb-2 border-y border-grey-50'>
                    <motion.button
                      className='w-full flex items-center gap-2 px-3 py-3 rounded-lg text-left text-grey-600 hover:bg-grey-50 transition-colors'
                      onClick={() => setIsMobileMenuOpen(false)}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className='w-6 h-6'>
                        <LogoutIcon />
                      </span>
                      <span className='text-base leading-[129%] tracking-[0%]'>
                        Log Out
                      </span>
                    </motion.button>
                  </div>

                  {/* Profile - Expandable */}
                  <div className='mt-2'>
                    <motion.div
                      className='flex items-center gap-2 p-3 hover:bg-grey-50 rounded-xl cursor-pointer transition-colors duration-200'
                      onClick={() => setMobileProfileOpen(!mobileProfileOpen)}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Avatar className='w-10 h-10'>
                        <AvatarImage src='/assets/images/avatar-placeholder.png' />
                        <AvatarFallback className='bg-primary-100 text-primary-600 font-medium'>
                          AD
                        </AvatarFallback>
                      </Avatar>
                      <div className='flex flex-col flex-1 gap-1'>
                        <span className='font-medium text-blackish leading-[20px]'>
                          Hello, Adenike
                        </span>
                        <span className='text-xs text-grey-500 leading-[16px]'>
                          adenikeabi@gmail.com
                        </span>
                      </div>
                      <motion.div
                        animate={{ rotate: mobileProfileOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className='w-5 h-5 text-grey-400' />
                      </motion.div>
                    </motion.div>

                    {/* Profile Dropdown Items */}
                    <AnimatePresence>
                      {mobileProfileOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className='overflow-hidden mt-2 pl-4'
                        >
                          <div className='flex flex-col gap-1 py-2'>
                            <Link
                              href='/settings'
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <div className='flex items-center gap-3 px-3 py-2.5 rounded-lg text-grey-700 hover:bg-grey-50 transition-colors'>
                                <svg
                                  className='w-4 h-4'
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
                                <span className='text-sm'>Settings</span>
                              </div>
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </nav>

                {/* User Profile Section - Mobile */}
                <div className='px-6 pb-6'>
                  {/* Create Gift Page Card */}
                  <div className='mt-6 border border-secondary-100 bg-[#F6FBFD80] shadow-[0px_2px_4px_-1px_#10192805] p-[72px_12px_12px_12px] rounded-xl relative'>
                    <div className='absolute -top-[31px] left-1/2 -translate-x-1/2'>
                      <div className='w-[69px] h-[100px]'>
                        <Image
                          src='/assets/images/gift-bag-icon.svg'
                          alt='Giftseon'
                          className='w-full h-full'
                          width={70}
                          height={100}
                        />
                      </div>
                    </div>
                    <div className='flex flex-col gap-2'>
                      <div className='flex flex-col gap-1 items-center text-grey-900'>
                        <h5 className='font-medium leading-[129%] tracking-[0%]'>
                          Create Gift Page
                        </h5>
                        <span className='leading-[129%] tracking-[0%] text-xs text-grey-600 text-center'>
                          Create a gift page & share your story.
                        </span>
                      </div>
                      <Link
                        href='/gifts/create-new'
                        onClick={() => setIsMobileMenuOpen(false)}
                        className='text-primary-500 text-center bg-primary-50 rounded-lg py-2.5 font-medium transition-colors hover:bg-primary-50/70 text-sm'
                      >
                        Create Gift page
                      </Link>
                    </div>
                  </div>
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
