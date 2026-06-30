'use client'

import Link from 'next/link'
import { ArrowDownToLine } from 'lucide-react'
import { motion } from 'framer-motion'
import { useWalletDetails } from '@/hooks/tanstack/wallet'
import { useWalletBalanceVisibility } from '@/components/Wallet/hooks/useWalletBalanceVisibility'
import { formatCurrency } from '@/lib/utils/currency'
import HiddenBalanceSvg from '@/components/Wallet/HiddenBalanceSvg'
import EyeOnIcon from '@/assets/icons/EyeOnIcon'
import ReloadIcon from '@/assets/icons/ReloadIcon'
import MoneySendIcon from '@/assets/icons/MoneySendIcon'
import MoneyReceiveIcon from '@/assets/icons/MoneyReceiveIcon'

const DashboardWalletBanner = () => {
  const { data, isLoading, isError, refetch, isFetching } = useWalletDetails()
  const { isBalanceHidden, toggleBalanceVisibility } = useWalletBalanceVisibility()

  const wallet = data?.data

  const displayBalance = wallet && !isBalanceHidden
    ? formatCurrency(wallet.balance, { currency: wallet.currency, maximumFractionDigits: 2 })
    : null

  const actionLinks = (
    <div className='flex items-center gap-2'>
      <Link
        href='/wallet?modal=topup'
        className='px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-sm flex items-center gap-1.5 transition-all'
      >
        <span className='w-4 h-4'><MoneyReceiveIcon /></span>
        Top Up
      </Link>
      <Link
        href='/wallet?modal=transfer'
        className='px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-sm flex items-center gap-1.5 transition-all'
      >
        <span className='w-4 h-4'><MoneySendIcon /></span>
        Send
      </Link>
      <Link
        href='/wallet?modal=withdraw'
        className='px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-sm flex items-center gap-1.5 transition-all'
      >
        <ArrowDownToLine className='w-4 h-4' />
        Withdraw
      </Link>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className='relative rounded-2xl px-5 py-5 overflow-hidden'
      style={{ background: 'radial-gradient(ellipse at 70% 50%, #4848c9 0%, #1818ab 40%, #0e0e67 100%)' }}
    >
      <svg
        className='absolute right-0 top-0 h-full w-auto opacity-[0.07] pointer-events-none'
        viewBox='0 0 220 120'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        aria-hidden='true'
      >
        <circle cx='180' cy='20' r='90' stroke='white' strokeWidth='1.5' />
        <circle cx='200' cy='80' r='70' stroke='white' strokeWidth='1' />
        <circle cx='150' cy='100' r='50' stroke='white' strokeWidth='0.8' />
        <circle cx='190' cy='50' r='30' stroke='white' strokeWidth='1.2' />
      </svg>

      <div className='relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-2'>
            <p className='text-xs text-primary-200 font-medium uppercase tracking-wider'>Available Balance</p>
            <button
              type='button'
              onClick={toggleBalanceVisibility}
              className='w-4 h-4 text-primary-200 hover:text-white transition-colors'
              aria-label={isBalanceHidden ? 'Show balance' : 'Hide balance'}
            >
              <EyeOnIcon />
            </button>
          </div>

          {isLoading ? (
            <div className='h-10 w-40 bg-white/10 rounded-lg animate-pulse' />
          ) : isError ? (
            <div className='flex items-center gap-2'>
              <p className='text-white/70 text-sm'>Can&apos;t load —</p>
              <button
                type='button'
                onClick={() => refetch()}
                disabled={isFetching}
                className='flex items-center gap-1 text-primary-200 hover:text-white text-sm transition-colors disabled:opacity-50'
              >
                <span className='w-3.5 h-3.5'><ReloadIcon /></span>
                Retry
              </button>
            </div>
          ) : isBalanceHidden ? (
            <HiddenBalanceSvg className='text-white/40' />
          ) : (
            <p className='text-[34px] leading-tight font-semibold text-white tracking-tight'>
              {displayBalance}
            </p>
          )}

          <div className='sm:hidden mt-1'>{actionLinks}</div>
        </div>

        <div className='hidden sm:flex'>{actionLinks}</div>
      </div>
    </motion.div>
  )
}

export default DashboardWalletBanner
