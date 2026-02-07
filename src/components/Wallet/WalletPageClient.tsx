'use client'

import { useMemo, useState } from 'react'
import WalletSummarySection from './WalletSummarySection'
import KeyboardLeftIcon from '@/assets/icons/KeyboardLeftIcon'
import KeyboardRightIcon from '@/assets/icons/KeyboardRightIcon'
import WalletTransactionsHeader from './WalletTransactionsHeader'
import WalletTransactionsTable from './WalletTransactionsTable'
import WalletTransactionsMobileList from './WalletTransactionsMobileList'
import WalletTransactionsEmptyState from './WalletTransactionsEmptyState'
import WalletTopUpModal from './WalletTopUpModal'
import WalletWithdrawModal from './WalletWithdrawModal'
import WalletDisputeModal from './WalletDisputeModal'
import { useSuccessModal } from '@/context/SuccessModalContext'
import { type WalletTransaction } from './types'

const mockTransactions: WalletTransaction[] = [
  {
    id: '1',
    date: 'Aug 13, 2025',
    description: 'Gift Received from Campaign #GH23',
    type: 'Credit',
    amount: 40500,
    status: 'Completed',
  },
  {
    id: '2',
    date: 'Aug 13, 2025',
    description: 'Withdrawal to Bank (GTB - 12******34)',
    type: 'Debit',
    amount: 40500,
    status: 'Pending',
  },
  {
    id: '3',
    date: 'Aug 13, 2025',
    description: 'Gift Received from Campaign #GH23',
    type: 'Credit',
    amount: 40500,
    status: 'Completed',
  },
  {
    id: '4',
    date: 'Aug 13, 2025',
    description: 'Withdrawal to Bank (GTB - 12******34)',
    type: 'Debit',
    amount: 40500,
    status: 'Completed',
  },
  {
    id: '5',
    date: 'Aug 13, 2025',
    description: 'Gift Received from Campaign #GH23',
    type: 'Credit',
    amount: 40500,
    status: 'Completed',
  },
]

const bankAccounts = [
  { id: 'gtb', label: 'GTB - 12******34' },
  { id: 'sterling', label: 'Sterling Bank - 01******78' },
]

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(value)
}

const WalletPageClient = () => {
  const [isTopUpOpen, setIsTopUpOpen] = useState(false)
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false)
  const [isDisputeOpen, setIsDisputeOpen] = useState(false)
  const [openMobileId, setOpenMobileId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const { openSuccess } = useSuccessModal()

  const availableBalance = 750890
  const totalReceived = 777100
  const totalWithdrawn = 27790

  const transactions = mockTransactions
  const hasTransactions = transactions.length > 0

  const formattedBalance = useMemo(
    () => formatCurrency(availableBalance),
    [availableBalance]
  )

  return (
    <div className='w-full flex flex-col gap-10 lg:gap-6 mt-2 mb-10 lg:mt-0 lg:mb-0'>
      <WalletSummarySection
        availableBalance={formattedBalance}
        totalReceived={formatCurrency(totalReceived)}
        totalWithdrawn={formatCurrency(totalWithdrawn)}
        onTopUp={() => setIsTopUpOpen(true)}
        onWithdraw={() => setIsWithdrawOpen(true)}
      />

      <div className='bg-white lg:rounded-[20px] lg:shadow-[0px_10px_18px_-2px_#10192812] pb-3 flex flex-col gap-1'>
        <WalletTransactionsHeader
          searchQuery={searchQuery}
          typeFilter={typeFilter}
          statusFilter={statusFilter}
          onSearchChange={setSearchQuery}
          onTypeChange={setTypeFilter}
          onStatusChange={setStatusFilter}
        />

        <div className='mt-6 lg:mt-0'>
          {!hasTransactions ? (
            <WalletTransactionsEmptyState />
          ) : (
            <>
              <WalletTransactionsTable
                items={transactions}
                formatAmount={formatCurrency}
                onReport={() => setIsDisputeOpen(true)}
              />
              <WalletTransactionsMobileList
                items={transactions}
                openId={openMobileId}
                onToggle={(id) =>
                  setOpenMobileId((prev) => (prev === id ? null : id))
                }
                formatAmount={formatCurrency}
                onReport={() => setIsDisputeOpen(true)}
              />
            </>
          )}
        </div>

        {hasTransactions && (
          <div className='flex flex-col gap-4 lg:flex-row items-center lg:justify-between px-4 mt-4 text-sm text-grey-700'>
            <span>Showing 14 of 132</span>
            <div className='flex items-center gap-4'>
              <button
                type='button'
                className='w-8 h-8 rounded-[5px] text-grey-700 bg-grey-50 hover:bg-grey-100 transition-colors duration-300 flex items-center justify-center opacity-30'
                aria-label='Previous page'
              >
                <span className='w-6 h-6 block relative'>
                  <KeyboardLeftIcon />
                </span>
              </button>
              <div className='flex gap-2 items-center justify-center'>
                <span className='w-8 h-8 rounded-[5px] bg-base-bg border border-primary-100 text-primary-400 text-sm font-medium flex items-center justify-center'>
                  1
                </span>
                <span className='text-sm text-gray-700'>of 8</span>
              </div>
              <button
                type='button'
                className='w-8 h-8 rounded-[5px] text-primary-400 bg-grey-50 hover:bg-grey-100 transition-colors duration-300 flex items-center justify-center'
                aria-label='Next page'
              >
                <span className='w-6 h-6 block relative'>
                  <KeyboardRightIcon />
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      <WalletTopUpModal
        isOpen={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
        bankName='Sterling Bank'
        accountName='Giftseon - Adenike Abioye'
        accountNumber='0123456789'
      />

      <WalletWithdrawModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        availableBalance={availableBalance}
        bankAccounts={bankAccounts}
        onSuccess={() =>
          openSuccess({
            message:
              'This withdrawal has been initiated successfully. You will get a notification once it is completed.',
          })
        }
      />

      <WalletDisputeModal
        isOpen={isDisputeOpen}
        onClose={() => setIsDisputeOpen(false)}
        onSubmit={() =>
          openSuccess({
            message:
              'This dispute has been raised successfully. A ticket has been created for you and you can track this by going to support tab > chat with an agent > last ticket to monitor the process.',
          })
        }
      />
    </div>
  )
}

export default WalletPageClient
