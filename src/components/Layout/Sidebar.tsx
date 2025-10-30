'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import Image from 'next/image'
import { LogoutIcon } from '@/assets/icons'
import { MENU_ITEMS } from '@/lib/constants/menu'

const Sidebar = () => {
  const pathname = usePathname()

  return (
    <div className='w-[264px] h-screen overflow-y-scroll bg-white border-r border-grey-50 flex flex-col px-3 py-6'>
      {/* Logo Section */}
      <div className='mb-11 ml-2.5'>
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
      <div className='flex flex-col flex-1 gap-7'>
        {/* Navigation Menu */}
        <nav className='px-2.5 flex flex-col gap-y-1.5'>
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = pathname.includes(item.href)

            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  className={`w-full flex items-center gap-2 px-3 py-3.5 rounded-lg transition-colors relative ${
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
                    {' '}
                    <Icon />
                  </span>
                  <span className='text-sm leading-[129%] tracking-[0%]'>
                    {item.label}
                  </span>
                </motion.div>
              </Link>
            )
          })}
        </nav>
        {/* Logout Button */}
        <div className='pt-3 pb-2 border-y border-grey-50'>
          <motion.button
            className='w-full flex items-center gap-2 px-3 py-3 rounded-lg text-left text-grey-600 hover:bg-grey-50 transition-colors'
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className='w-5 h-5'>
              <LogoutIcon />
            </span>
            <span className='text-sm leading-[129%] tracking-[0%]'>
              Log Out
            </span>
          </motion.button>
        </div>
      </div>
      <div className='mt-10 border border-secondary-100 bg-[#F6FBFD80] shadow-[0px_2px_4px_-1px_#10192805] p-[72px_12px_12px_12px] rounded-xl relative'>
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
              Create Gift page
            </h5>
            <span className='leading-[129%] tracking-[0%] text-xs text-grey-600'>
              Create a gift page & share your story.
            </span>
          </div>
          <Link
            href='/gifts/create-new'
            className='text-primary-500 bg-primary-50 rounded-lg py-2.5 font-medium transition-colors hover:bg-primary-50/70 text-center'
          >
            Create Gift page
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
