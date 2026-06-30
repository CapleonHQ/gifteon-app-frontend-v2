'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { QUICK_ACTIONS } from '@/lib/constants/dashboard'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28 } },
}

const DashboardQuickActions = () => {
  return (
    <div className='flex flex-col gap-3'>
      <p className='text-xs font-semibold text-grey-400 uppercase tracking-widest'>
        Quick Actions
      </p>
      <motion.div
        className='flex items-start gap-3 overflow-x-auto pb-1 -mb-1 no-scrollbar'
        variants={containerVariants}
        initial='hidden'
        animate='visible'
      >
        {QUICK_ACTIONS.map(({ label, href, icon: Icon, iconClass }) => (
          <motion.div key={href} variants={itemVariants} className='shrink-0'>
            <Link
              href={href}
              className='flex flex-col items-center gap-2.5 w-[76px] group cursor-pointer'
            >
              <div className='relative w-14 h-14 rounded-2xl overflow-hidden shadow-[0px_4px_12px_-2px_#10192814]'>
                <div className={`absolute inset-0 ${iconClass}`} />
                <div className='absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-200'>
                  <span className='w-6 h-6'>
                    <Icon />
                  </span>
                </div>
              </div>
              <span className='text-[11px] text-grey-700 font-medium text-center leading-tight w-full'>
                {label}
              </span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default DashboardQuickActions
