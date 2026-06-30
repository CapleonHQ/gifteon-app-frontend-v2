'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { useWalletTransactions } from '@/hooks/tanstack/wallet'
import {
  getTransactionStatusStyle,
  getTransactionStatusLabel,
} from '@/components/Wallet/types'
import MoneyReceiveIcon from '@/assets/icons/MoneyReceiveIcon'
import MoneySendIcon from '@/assets/icons/MoneySendIcon'

const DashboardRecentTransactions = () => {
  const { data, isLoading, isError } = useWalletTransactions({ page: 1, limit: 5 })
  const transactions = data?.data?.transactions ?? []

  return (
    <div className='bg-white border border-grey-100 rounded-2xl flex flex-col overflow-hidden'>
      <div className='flex items-center justify-between px-5 pt-5 pb-3 border-b border-grey-50'>
        <h3 className='text-sm font-semibold text-grey-900'>Recent Transactions</h3>
        <Link
          href='/wallet'
          className='flex items-center gap-1 text-xs text-primary-500 hover:text-primary-700 font-medium transition-colors'
        >
          View all
          <ArrowUpRight className='w-3.5 h-3.5' />
        </Link>
      </div>

      <div className='flex flex-col flex-1'>
        {isLoading ? (
          <div className='flex flex-col divide-y divide-grey-50'>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className='flex items-center gap-3 px-5 py-3.5'>
                <div className='w-8 h-8 rounded-full bg-grey-100 animate-pulse shrink-0' />
                <div className='flex-1 flex flex-col gap-1.5'>
                  <div className='h-3 w-28 bg-grey-100 rounded animate-pulse' />
                  <div className='h-3 w-16 bg-grey-100 rounded animate-pulse' />
                </div>
                <div className='h-4 w-16 bg-grey-100 rounded animate-pulse' />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className='flex items-center justify-center flex-1 py-10 text-sm text-grey-400'>
            Unable to load transactions
          </div>
        ) : transactions.length === 0 ? (
          <div className='flex items-center justify-center flex-1 py-10 text-sm text-grey-400'>
            No transactions yet
          </div>
        ) : (
          <motion.div
            className='flex flex-col divide-y divide-grey-50'
            initial='hidden'
            animate='visible'
            variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
          >
            {transactions.map((tx) => {
              const isCredit = tx.type === 'credit'
              const label = tx.description || tx.type.replace(/_/g, ' ')
              const dateStr = format(new Date(tx.createdAt), 'MMM d, h:mm a')

              return (
                <motion.div
                  key={tx.id}
                  variants={{
                    hidden: { opacity: 0, x: -6 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
                  }}
                  className='flex items-center gap-3 px-5 py-3.5 hover:bg-grey-50/60 transition-colors'
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      isCredit ? 'bg-success-50 text-success-500' : 'bg-error-50 text-error-500'
                    }`}
                  >
                    <span className='w-4 h-4'>
                      {isCredit ? <MoneyReceiveIcon /> : <MoneySendIcon />}
                    </span>
                  </div>

                  <div className='flex-1 min-w-0'>
                    <p className='text-sm text-grey-900 font-medium capitalize truncate'>
                      {label}
                    </p>
                    <p className='text-xs text-grey-400'>{dateStr}</p>
                  </div>

                  <div className='flex flex-col items-end gap-1 shrink-0'>
                    <span
                      className={`text-sm font-semibold ${
                        isCredit ? 'text-success-500' : 'text-error-500'
                      }`}
                    >
                      {isCredit ? '+' : '-'}{tx.displayAmount}
                    </span>
                    <span
                      className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${getTransactionStatusStyle(
                        tx.status
                      )}`}
                    >
                      {getTransactionStatusLabel(tx.status)}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default DashboardRecentTransactions
