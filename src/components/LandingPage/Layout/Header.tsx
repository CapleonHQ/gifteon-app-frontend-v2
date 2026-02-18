'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown, Menu, X } from 'lucide-react'
import {
  AnimatePresence,
  MotionConfig,
  motion,
  type Variants,
} from 'framer-motion'

const navLinks = [
  { label: 'Home', href: '#' },
  { label: 'How it Works', href: '#' },
  { label: 'Explore Pages', href: '#' },
  { label: 'Giftseon for Business', href: '#' },
]

const celebrationTypes = [
  { label: 'Birthdays', icon: '🎂', href: '#' },
  { label: 'Weddings', icon: '💍', href: '#' },
  { label: 'Anniversaries', icon: '🎊', href: '#' },
  { label: 'Graduations', icon: '🎓', href: '#' },
  { label: 'Perpetual / Donation', icon: '🔑', href: '#' },
]

const EASE_OUT = [0.22, 1, 0.36, 1] as const

const headerVariants: Variants = {
  hidden: { opacity: 0, y: -16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE_OUT },
  },
}

const desktopDropdownVariants: Variants = {
  hidden: { opacity: 0, y: -6, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.18, ease: EASE_OUT },
  },
  exit: { opacity: 0, y: -4, scale: 0.985, transition: { duration: 0.14 } },
}

const mobileMenuVariants: Variants = {
  hidden: { opacity: 0, y: -8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.24, ease: EASE_OUT, when: 'beforeChildren' },
  },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
}

const mobileBackdropVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.18 } },
  exit: { opacity: 0, transition: { duration: 0.16 } },
}

const mobileListVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.04 } },
}

const mobileItemVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: EASE_OUT } },
}

const mobileSubmenuVariants: Variants = {
  hidden: { opacity: 0, height: 0 },
  show: {
    opacity: 1,
    height: 'auto',
    transition: { duration: 0.2, ease: EASE_OUT },
  },
  exit: { opacity: 0, height: 0, transition: { duration: 0.16 } },
}

const Header = () => {
  const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileCelebrationOpen, setIsMobileCelebrationOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const closeDropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!isMobileMenuOpen) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false)
        setIsMobileCelebrationOpen(false)
      }
    }

    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const openDesktopDropdown = () => {
    if (closeDropdownTimeoutRef.current) {
      clearTimeout(closeDropdownTimeoutRef.current)
      closeDropdownTimeoutRef.current = null
    }
    setIsDesktopDropdownOpen(true)
  }

  const closeDesktopDropdown = () => {
    closeDropdownTimeoutRef.current = setTimeout(() => {
      setIsDesktopDropdownOpen(false)
    }, 120)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
    setIsMobileCelebrationOpen(false)
  }

  return (
    <MotionConfig reducedMotion='user'>
      <motion.header
        className={`sticky top-0 z-50 border-b-[0.2px] border-grey-50 bg-base-bg transition-[box-shadow,backdrop-filter,background-color] duration-300 ${
          isScrolled
            ? isMobileMenuOpen
              ? 'shadow-[0px_8px_26px_-14px_#10192833]'
              : 'shadow-[0px_8px_26px_-14px_#10192833] backdrop-blur-md'
            : 'shadow-[0px_1.5px_4px_-1px_#10192812]'
        }`}
        initial='hidden'
        animate='show'
        variants={headerVariants}
      >
        <div className='mx-auto flex w-full max-w-[1600px] items-center justify-between gap-4 py-4 lg:py-5 px-4 md:px-8 xl:px-20'>
          <Link href='/' className='h-10 w-[104px] shrink-0'>
            <Image
              src='/assets/images/logo/logo.svg'
              alt='Giftseon'
              width={124}
              height={40}
              className='h-full w-full'
              priority
            />
          </Link>

          <nav className='hidden items-center gap-5 xl:gap-8 lg:flex'>
            <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }}>
              <Link
                href={navLinks[0].href}
                className='text-base leading-6 text-primary-500 underline underline-offset-4 font-semibold'
              >
                {navLinks[0].label}
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }}>
              <Link
                href={navLinks[1].href}
                className='text-base leading-6 text-grey-700 transition-colors hover:text-grey-900'
              >
                {navLinks[1].label}
              </Link>
            </motion.div>

            <div
              className='relative'
              onMouseEnter={openDesktopDropdown}
              onMouseLeave={closeDesktopDropdown}
            >
              <button
                type='button'
                className='inline-flex items-center gap-1 text-base leading-6 text-grey-700 transition-colors hover:text-grey-900'
              >
                Celebration Types
                {/* <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  isDesktopDropdownOpen ? 'rotate-180' : ''
                }`}
              /> */}
              </button>

              <AnimatePresence>
                {isDesktopDropdownOpen && (
                  <motion.div
                    className='absolute left-1/2 top-full z-50 w-[240px] -translate-x-1/2 pt-3'
                    onMouseEnter={openDesktopDropdown}
                    onMouseLeave={closeDesktopDropdown}
                    initial='hidden'
                    animate='show'
                    exit='exit'
                    variants={desktopDropdownVariants}
                  >
                    <div className='absolute left-1/2 top-[8px] z-30 h-3 w-3 -translate-x-1/2 rotate-45 border-l border-t border-grey-100 bg-white' />
                    <div className='relative z-20 rounded-[12px] bg-white p-2 shadow-[0_15px_40px_rgba(16,24,40,0.16)]'>
                      <ul className='relative overflow-hidden'>
                        {celebrationTypes.map((item, index) => (
                          <li key={item.label}>
                            <Link
                              href={item.href}
                              className='flex items-center gap-2 px-2 py-2.5 text-base leading-6 text-grey-800 transition-colors hover:bg-grey-50/70'
                            >
                              <span aria-hidden='true'>{item.icon}</span>
                              <span>{item.label}</span>
                            </Link>
                            {index < celebrationTypes.length - 1 && (
                              <div className='h-px bg-grey-50' />
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }}>
              <Link
                href={navLinks[2].href}
                className='text-base leading-6 text-grey-700 transition-colors hover:text-grey-900'
              >
                {navLinks[2].label}
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }}>
              <Link
                href={navLinks[3].href}
                className='text-base leading-6 text-grey-700 transition-colors hover:text-grey-900'
              >
                {navLinks[3].label}
              </Link>
            </motion.div>
          </nav>

          <div className='hidden items-center gap-5 lg:flex'>
            <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
              <Link
                href='#'
                className='text-base font-medium leading-5 text-primary-500 transition-colors hover:text-primary-600'
              >
                Log In
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ y: -1, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href='#'
                className='inline-flex py-3.5 w-[100px] xl:w-[200px] items-center justify-center rounded-2xl bg-linear-to-b from-17% from-primary-400 to-primary-600 text-base font-medium leading-5 text-white transition-colors hover:from-primary-500 hover:to-primary-700'
              >
                Sign Up
              </Link>
            </motion.div>
          </div>

          <button
            type='button'
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-grey-50 ${
              isMobileMenuOpen ? 'bg-primary-50' : 'bg-white'
            } text-primary-900 lg:hidden`}
          >
            {isMobileMenuOpen ? (
              <X className='h-6 w-6' />
            ) : (
              <Menu className='h-6 w-6' />
            )}
          </button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.button
                type='button'
                aria-label='Close mobile menu backdrop'
                className='fixed inset-x-0 bottom-0 top-[72px] z-40 bg-[#101928]/30 backdrop-blur-[2px] lg:hidden'
                onClick={closeMobileMenu}
                initial='hidden'
                animate='show'
                exit='exit'
                variants={mobileBackdropVariants}
              />
              <motion.div
                className='fixed inset-x-0 top-[72px] z-45 max-h-[calc(100dvh-72px)] overflow-y-auto bg-white p-4 lg:hidden shadow-[0px_14px_22px_-9px_#10192824]'
                initial='hidden'
                animate='show'
                exit='exit'
                variants={mobileMenuVariants}
              >
                <nav>
                  <motion.ul
                    variants={mobileListVariants}
                    initial='hidden'
                    animate='show'
                  >
                    <motion.li
                      className='border-b border-[#E4E7EA] py-4'
                      variants={mobileItemVariants}
                    >
                      <Link
                        href={navLinks[0].href}
                        onClick={closeMobileMenu}
                        className='text-base font-medium leading-6 text-primary-500 underline underline-offset-4'
                      >
                        {navLinks[0].label}
                      </Link>
                    </motion.li>
                    <motion.li
                      className='border-b border-[#E4E7EA] py-4'
                      variants={mobileItemVariants}
                    >
                      <Link
                        href={navLinks[1].href}
                        onClick={closeMobileMenu}
                        className='text-base leading-6 text-grey-700'
                      >
                        {navLinks[1].label}
                      </Link>
                    </motion.li>
                    <motion.li
                      className='border-b border-[#E4E7EA] py-4'
                      variants={mobileItemVariants}
                    >
                      <button
                        type='button'
                        onClick={() =>
                          setIsMobileCelebrationOpen(
                            (previousState) => !previousState
                          )
                        }
                        className='flex w-full items-center justify-between text-left text-base leading-6 text-grey-700'
                      >
                        <span>Celebration Types</span>
                        <ChevronDown
                          className={`h-5 w-5 text-grey-500 transition-transform duration-200 ${
                            isMobileCelebrationOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {isMobileCelebrationOpen && (
                          <motion.ul
                            className='mt-4 space-y-4 overflow-hidden pb-1'
                            initial='hidden'
                            animate='show'
                            exit='exit'
                            variants={mobileSubmenuVariants}
                          >
                            {celebrationTypes.map((item) => (
                              <motion.li
                                key={item.label}
                                variants={mobileItemVariants}
                              >
                                <Link
                                  href={item.href}
                                  onClick={closeMobileMenu}
                                  className='flex items-center gap-3 text-base leading-6 text-grey-700'
                                >
                                  <span aria-hidden='true'>{item.icon}</span>
                                  <span>{item.label}</span>
                                </Link>
                              </motion.li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </motion.li>
                    <motion.li
                      className='border-b border-[#E4E7EA] py-4'
                      variants={mobileItemVariants}
                    >
                      <Link
                        href={navLinks[2].href}
                        onClick={closeMobileMenu}
                        className='text-base leading-6 text-grey-700'
                      >
                        {navLinks[2].label}
                      </Link>
                    </motion.li>
                    <motion.li className='py-4' variants={mobileItemVariants}>
                      <Link
                        href={navLinks[3].href}
                        onClick={closeMobileMenu}
                        className='text-base leading-6 text-grey-700'
                      >
                        {navLinks[3].label}
                      </Link>
                    </motion.li>
                  </motion.ul>
                </nav>

                <motion.div
                  className='mt-4 flex flex-col gap-3'
                  variants={mobileListVariants}
                  initial='hidden'
                  animate='show'
                >
                  <motion.div variants={mobileItemVariants}>
                    <Link
                      href='#'
                      onClick={closeMobileMenu}
                      className='inline-flex h-[54px] w-full items-center justify-center rounded-2xl bg-linear-to-b from-primary-400 to-primary-600 text-base font-medium leading-6 text-white'
                    >
                      Sign Up
                    </Link>
                  </motion.div>
                  <motion.div variants={mobileItemVariants}>
                    <Link
                      href='#'
                      onClick={closeMobileMenu}
                      className='inline-flex h-[54px] w-full items-center justify-center rounded-2xl border border-primary-300 text-base font-medium leading-6 text-primary-400'
                    >
                      Log In
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.header>
    </MotionConfig>
  )
}

export default Header
