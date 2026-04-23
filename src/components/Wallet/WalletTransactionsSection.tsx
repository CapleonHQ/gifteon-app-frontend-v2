'use client'

import { useMemo, useState } from 'react'
import KeyboardLeftIcon from '@/assets/icons/KeyboardLeftIcon'
import KeyboardRightIcon from '@/assets/icons/KeyboardRightIcon'
import WalletTransactionsHeader from './WalletTransactionsHeader'
import WalletTransactionsTable from './WalletTransactionsTable'
import WalletTransactionsMobileList from './WalletTransactionsMobileList'
import WalletTransactionsEmptyState from './WalletTransactionsEmptyState'
import WalletTransactionsNoResults from './WalletTransactionsNoResults'
import WalletTransactionsSkeleton from './WalletTransactionsSkeleton'
import WalletTransactionDetailsModal from './WalletTransactionDetailsModal'
import { useWalletTransactions } from '@/hooks/tanstack/wallet'
import { useWalletTransactionFilters } from './hooks/useWalletTransactionFilters'
import { type WalletTransaction } from './types'

const PAGE_SIZE = 10
const EMPTY_TRANSACTIONS: WalletTransaction[] = []

type WalletTransactionsSectionProps = {
  onReport: () => void
}

const WalletTransactionsSection = ({ onReport }: WalletTransactionsSectionProps) => {
  const [openMobileId, setOpenMobileId] = useState<string | null>(null)
  const [viewingTransaction, setViewingTransaction] =
    useState<WalletTransaction | null>(null)
  const {
    searchQuery,
    typeFilter,
    statusFilter,
    currentPage,
    debouncedSearch,
    hasActiveFilters,
    setCurrentPage,
    handleSearchChange,
    handleTypeChange,
    handleStatusChange,
    resetFilters,
  } = useWalletTransactionFilters()

  const transactionsQuery = useWalletTransactions({
    page: currentPage,
    limit: PAGE_SIZE,
    search: debouncedSearch || undefined,
    type: typeFilter === 'all' ? undefined : typeFilter,
    status: statusFilter === 'all' ? undefined : statusFilter,
  })

  const transactionsData = transactionsQuery.data?.data
  const transactions = useMemo(
    () => transactionsData?.transactions ?? EMPTY_TRANSACTIONS,
    [transactionsData?.transactions]
  )
  const pagination = transactionsData?.pagination

  const hasTransactions = transactions.length > 0
  const totalCount = pagination?.total ?? 0
  const pageLimit = pagination?.limit ?? PAGE_SIZE
  const totalPages = pagination?.totalPages ?? 1
  const startItem = totalCount > 0 ? (currentPage - 1) * pageLimit + 1 : 0
  const endItem =
    totalCount > 0 ? Math.min(startItem + pageLimit - 1, totalCount) : 0
  const isPrevDisabled = currentPage <= 1 || transactionsQuery.isFetching
  const isNextDisabled =
    currentPage >= totalPages || transactionsQuery.isFetching || totalPages <= 1

  return (
    <div className='bg-white lg:rounded-[20px] lg:shadow-[0px_10px_18px_-2px_#10192812] pb-3 flex flex-col gap-1'>
      <WalletTransactionsHeader
        searchQuery={searchQuery}
        typeFilter={typeFilter}
        statusFilter={statusFilter}
        onSearchChange={handleSearchChange}
        onTypeChange={handleTypeChange}
        onStatusChange={handleStatusChange}
      />

      <div className='mt-6 lg:mt-0'>
        {transactionsQuery.isLoading ? (
          <WalletTransactionsSkeleton />
        ) : transactionsQuery.isError ? (
          <div className='px-4 py-10 text-center'>
            <p className='text-base font-medium text-error-500'>
              We couldn&apos;t load your transactions.
            </p>
            <p className='mt-1 text-sm text-grey-700'>
              Check your connection and try again.
            </p>
            <button
              type='button'
              onClick={() => transactionsQuery.refetch()}
              disabled={transactionsQuery.isFetching}
              className='mt-4 inline-flex items-center justify-center px-4 py-2 rounded-[10px] border border-grey-200 text-sm text-grey-800 hover:bg-grey-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200'
            >
              {transactionsQuery.isFetching ? 'Retrying...' : 'Retry'}
            </button>
          </div>
        ) : !hasTransactions ? (
          hasActiveFilters ? (
            <WalletTransactionsNoResults onReset={resetFilters} />
          ) : (
            <WalletTransactionsEmptyState />
          )
        ) : (
          <>
            <WalletTransactionsTable
              items={transactions}
              onView={(transaction) => setViewingTransaction(transaction)}
              onReport={onReport}
            />
            <WalletTransactionsMobileList
              items={transactions}
              openId={openMobileId}
              onToggle={(id) =>
                setOpenMobileId((prev) => (prev === id ? null : id))
              }
              onView={(transaction) => setViewingTransaction(transaction)}
              onReport={onReport}
            />
          </>
        )}
      </div>

      {hasTransactions ? (
        <div className='flex flex-col gap-4 lg:flex-row items-center lg:justify-between px-4 mt-4 text-sm text-grey-700'>
          <span>
            Showing {startItem}-{endItem} of {totalCount}
          </span>
          <div className='flex items-center gap-4'>
            <button
              type='button'
              onClick={() =>
                setCurrentPage((page) => (page > 1 ? page - 1 : page))
              }
              disabled={isPrevDisabled}
              className='w-8 h-8 rounded-[5px] text-grey-700 bg-grey-50 hover:bg-grey-100 transition-colors duration-300 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed'
              aria-label='Previous page'
            >
              <span className='w-6 h-6 block relative'>
                <KeyboardLeftIcon />
              </span>
            </button>
            <div className='flex gap-2 items-center justify-center'>
              <span className='w-8 h-8 rounded-[5px] bg-base-bg border border-primary-100 text-primary-400 text-sm font-medium flex items-center justify-center'>
                {currentPage}
              </span>
              <span className='text-sm text-gray-700'>of {totalPages}</span>
            </div>
            <button
              type='button'
              onClick={() =>
                setCurrentPage((page) => (page < totalPages ? page + 1 : page))
              }
              disabled={isNextDisabled}
              className='w-8 h-8 rounded-[5px] text-primary-400 bg-grey-50 hover:bg-grey-100 transition-colors duration-300 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed'
              aria-label='Next page'
            >
              <span className='w-6 h-6 block relative'>
                <KeyboardRightIcon />
              </span>
            </button>
          </div>
        </div>
      ) : null}

      <WalletTransactionDetailsModal
        isOpen={Boolean(viewingTransaction)}
        onClose={() => setViewingTransaction(null)}
        transaction={viewingTransaction}
        onReport={() => {
          setViewingTransaction(null)
          onReport()
        }}
      />
    </div>
  )
}

export default WalletTransactionsSection
