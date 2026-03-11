'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import WalletSummarySection from './WalletSummarySection'
import KeyboardLeftIcon from '@/assets/icons/KeyboardLeftIcon'
import KeyboardRightIcon from '@/assets/icons/KeyboardRightIcon'
import WalletTransactionsHeader from './WalletTransactionsHeader'
import WalletTransactionsTable from './WalletTransactionsTable'
import WalletTransactionsMobileList from './WalletTransactionsMobileList'
import WalletTransactionsEmptyState from './WalletTransactionsEmptyState'
import WalletTransactionsNoResults from './WalletTransactionsNoResults'
import WalletTransactionsSkeleton from './WalletTransactionsSkeleton'
import WalletTopUpModal from './WalletTopUpModal'
import WalletWithdrawModal from './WalletWithdrawModal'
import WalletDisputeModal from './WalletDisputeModal'
import WalletPendingWithdrawalsBanner from './WalletPendingWithdrawalsBanner'
import WalletPendingWithdrawalsModal from './WalletPendingWithdrawalsModal'
import WalletCancelWithdrawalConfirmModal from './WalletCancelWithdrawalConfirmModal'
import WalletSummarySkeleton from './WalletSummarySkeleton'
import { useSuccessModal } from '@/context/SuccessModalContext'
import {
  useCancelWalletWithdrawal,
  useWalletDetails,
  useTopupWalletLocals,
  useWithdrawFromWallet,
  useWalletWithdrawals,
  useWalletTransactions,
} from '@/hooks/tanstack/wallet'
import { useConnectedBanks } from '@/hooks/tanstack/banks'
import { useDebounce } from '@/hooks/useDebounce'
import { parseWalletBalance } from '@/lib/wallet/transformers'
import { formatCurrency } from '@/lib/utils/currency'
import { storePaymentReturnPath } from '@/lib/payments/paystackReturn'
import { MIN_WALLET_TOPUP_AMOUNT } from '@/lib/constants/payments'
import { toApiError } from '@/api/errorHelpers'
import { type WalletTransaction } from './types'
import type { WalletWithdrawal } from '@/types/Wallet'

const PAGE_SIZE = 10
const EMPTY_TRANSACTIONS: WalletTransaction[] = []
const TOPUP_ERROR_MESSAGE = 'Unable to initialize top-up. Please try again.'
const WITHDRAWAL_ERROR_MESSAGE =
  'Unable to initiate withdrawal. Please try again.'
const WALLET_BALANCE_VISIBILITY_KEY = 'wallet-balance-hidden'

const maskAccountNumber = (value: string): string => {
  if (value.length <= 4) return value
  const suffix = value.slice(-4)
  return `${'*'.repeat(Math.max(0, value.length - 4))}${suffix}`
}

const WalletPageClient = () => {
  const [isTopUpOpen, setIsTopUpOpen] = useState(false)
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false)
  const [isDisputeOpen, setIsDisputeOpen] = useState(false)
  const [isPendingWithdrawalsOpen, setIsPendingWithdrawalsOpen] =
    useState(false)
  const [withdrawalToCancel, setWithdrawalToCancel] =
    useState<WalletWithdrawal | null>(null)
  const [openMobileId, setOpenMobileId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [isBalanceHidden, setIsBalanceHidden] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.localStorage.getItem(WALLET_BALANCE_VISIBILITY_KEY) === 'true'
  })
  const { openSuccess } = useSuccessModal()
  const router = useRouter()
  const debouncedSearch = useDebounce(searchQuery.trim(), 400)

  const detailsQuery = useWalletDetails()
  const connectedBanksQuery = useConnectedBanks()
  const topupMutation = useTopupWalletLocals()
  const withdrawMutation = useWithdrawFromWallet()
  const pendingWithdrawalsQuery = useWalletWithdrawals({ page: 1, limit: 20 })
  const cancelWithdrawalMutation = useCancelWalletWithdrawal()
  const transactionsQuery = useWalletTransactions({
    page: currentPage,
    limit: PAGE_SIZE,
    search: debouncedSearch || undefined,
    type: typeFilter === 'all' ? undefined : typeFilter,
    status: statusFilter === 'all' ? undefined : statusFilter,
  })

  const walletDetails = detailsQuery.data?.data
  const bankAccounts = useMemo(
    () =>
      (connectedBanksQuery.data?.data?.banks ?? []).map((bank) => ({
        id: bank.id,
        label: `${bank.bankName} - ${maskAccountNumber(bank.accountNumber)}`,
        bankName: bank.bankName,
        accountNumber: bank.accountNumber,
        accountName: bank.accountName,
      })),
    [connectedBanksQuery.data?.data?.banks]
  )
  const defaultBankId = useMemo(
    () =>
      connectedBanksQuery.data?.data?.banks?.find((bank) => bank.isDefault)?.id,
    [connectedBanksQuery.data?.data?.banks]
  )
  const transactionsData = transactionsQuery.data?.data
  const withdrawalHistory = pendingWithdrawalsQuery.data?.data

  const availableBalance = parseWalletBalance(walletDetails?.balance)
  const totalReceived = parseWalletBalance(walletDetails?.totalReceived)
  const totalWithdrawn = parseWalletBalance(walletDetails?.totalWithdrawn)
  const currency = walletDetails?.currency || 'USD'
  const transactions = useMemo(
    () => transactionsData?.transactions ?? EMPTY_TRANSACTIONS,
    [transactionsData?.transactions]
  )
  const pendingWithdrawals = useMemo(
    () =>
      (withdrawalHistory?.withdrawals ?? []).filter(
        (withdrawal) => withdrawal.status === 'pending'
      ),
    [withdrawalHistory?.withdrawals]
  )
  const pagination = transactionsData?.pagination

  const hasTransactions = transactions.length > 0
  const isLoadingTransactions = transactionsQuery.isLoading
  const hasTransactionsError = transactionsQuery.isError
  const hasActiveFilters = Boolean(
    debouncedSearch || typeFilter !== 'all' || statusFilter !== 'all'
  )

  const formattedBalance = formatCurrency(availableBalance, {
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  const totalCount = pagination?.total ?? 0
  const pageLimit = pagination?.limit ?? PAGE_SIZE
  const totalPages = pagination?.totalPages ?? 1
  const startItem = totalCount > 0 ? (currentPage - 1) * pageLimit + 1 : 0
  const endItem =
    totalCount > 0 ? Math.min(startItem + pageLimit - 1, totalCount) : 0
  const isPrevDisabled = currentPage <= 1 || transactionsQuery.isFetching
  const isNextDisabled =
    currentPage >= totalPages || transactionsQuery.isFetching || totalPages <= 1
  const hasResolvedOverview = detailsQuery.isSuccess || detailsQuery.isError
  const showOverviewSkeleton = detailsQuery.isLoading && !hasResolvedOverview

  const hasOverviewError =
    detailsQuery.isError ||
    detailsQuery.isRefetchError ||
    (!detailsQuery.isLoading && !walletDetails)
  const topupError =
    topupMutation.error instanceof Error
      ? topupMutation.error.message
      : topupMutation.isError
      ? TOPUP_ERROR_MESSAGE
      : undefined
  const withdrawalError = withdrawMutation.isError
    ? toApiError(withdrawMutation.error).message || WITHDRAWAL_ERROR_MESSAGE
    : undefined
  const withdrawalApiError = withdrawMutation.isError
    ? toApiError(withdrawMutation.error)
    : null
  const showWithdrawalKycCta = Boolean(
    withdrawalApiError &&
      (withdrawalApiError.code === 'FORBIDDEN' ||
        withdrawalApiError.message
          .toLowerCase()
          .includes('verify your identity') ||
        withdrawalApiError.message.toLowerCase().includes('kyc') ||
        withdrawalApiError.message.toLowerCase().includes('nin') ||
        withdrawalApiError.message.toLowerCase().includes('bvn'))
  )
  const hasPendingWithdrawals = pendingWithdrawals.length > 0

  const handleTopupSubmit = async (amount: number) => {
    if (amount < MIN_WALLET_TOPUP_AMOUNT) return

    try {
      const data = await topupMutation.mutateAsync(amount)
      if (typeof window !== 'undefined') {
        storePaymentReturnPath(data.reference)
        window.location.assign(data.authorizationUrl)
      }
    } catch {
      // Error state is handled in modal via `topupMutation.error`.
    }
  }

  const handleWithdrawSubmit = async (payload: {
    amount: number
    bankId: string
    pin: string
  }) => {
    const response = await withdrawMutation.mutateAsync(payload)
    openSuccess({
      message:
        response.data?.message ||
        response.message ||
        'Withdrawal initiated successfully.',
    })
  }

  const handleCancelPendingWithdrawal = async () => {
    if (!withdrawalToCancel) return

    const response = await cancelWithdrawalMutation.mutateAsync(
      withdrawalToCancel.id
    )
    setWithdrawalToCancel(null)
    setIsPendingWithdrawalsOpen(false)
    openSuccess({
      message: response.message || 'Withdrawal cancelled successfully.',
    })
  }

  return (
    <div className='w-full flex flex-col gap-10 lg:gap-6 mt-2 mb-10 lg:mt-0 lg:mb-0'>
      <div className='flex flex-col gap-4'>
        {showOverviewSkeleton ? (
          <WalletSummarySkeleton />
        ) : (
          <WalletSummarySection
            availableBalance={formattedBalance}
            totalReceived={formatCurrency(totalReceived, {
              currency,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            totalWithdrawn={formatCurrency(totalWithdrawn, {
              currency,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            onTopUp={() => setIsTopUpOpen(true)}
            onWithdraw={() => setIsWithdrawOpen(true)}
            hasError={hasOverviewError}
            isRetrying={hasOverviewError && detailsQuery.isFetching}
            onRetry={() => detailsQuery.refetch()}
            isBalanceHidden={isBalanceHidden}
            onToggleBalanceVisibility={() => {
              setIsBalanceHidden((prev) => {
                const nextValue = !prev
                if (typeof window !== 'undefined') {
                  window.localStorage.setItem(
                    WALLET_BALANCE_VISIBILITY_KEY,
                    String(nextValue)
                  )
                }
                return nextValue
              })
            }}
          />
        )}

        {hasPendingWithdrawals ? (
          <WalletPendingWithdrawalsBanner
            count={pendingWithdrawals.length}
            onOpen={() => setIsPendingWithdrawalsOpen(true)}
          />
        ) : null}
      </div>

      <div className='bg-white lg:rounded-[20px] lg:shadow-[0px_10px_18px_-2px_#10192812] pb-3 flex flex-col gap-1'>
        <WalletTransactionsHeader
          searchQuery={searchQuery}
          typeFilter={typeFilter}
          statusFilter={statusFilter}
          onSearchChange={(value) => {
            setSearchQuery(value)
            setCurrentPage(1)
          }}
          onTypeChange={(value) => {
            setTypeFilter(value)
            setCurrentPage(1)
          }}
          onStatusChange={(value) => {
            setStatusFilter(value)
            setCurrentPage(1)
          }}
        />

        <div className='mt-6 lg:mt-0'>
          {isLoadingTransactions ? (
            <WalletTransactionsSkeleton />
          ) : hasTransactionsError ? (
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
              <WalletTransactionsNoResults
                onReset={() => {
                  setSearchQuery('')
                  setTypeFilter('all')
                  setStatusFilter('all')
                  setCurrentPage(1)
                }}
              />
            ) : (
              <WalletTransactionsEmptyState />
            )
          ) : (
            <>
              <WalletTransactionsTable
                items={transactions}
                formatAmount={(value) =>
                  formatCurrency(value, {
                    currency,
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                }
                onReport={() => setIsDisputeOpen(true)}
              />
              <WalletTransactionsMobileList
                items={transactions}
                openId={openMobileId}
                onToggle={(id) =>
                  setOpenMobileId((prev) => (prev === id ? null : id))
                }
                formatAmount={(value) =>
                  formatCurrency(value, {
                    currency,
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                }
                onReport={() => setIsDisputeOpen(true)}
              />
            </>
          )}
        </div>

        {hasTransactions && (
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
                  setCurrentPage((page) =>
                    page < totalPages ? page + 1 : page
                  )
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
        )}
      </div>

      <WalletTopUpModal
        isOpen={isTopUpOpen}
        onClose={() => {
          setIsTopUpOpen(false)
          topupMutation.reset()
        }}
        onSubmit={handleTopupSubmit}
        isSubmitting={topupMutation.isPending}
        errorMessage={topupError}
        minAmount={MIN_WALLET_TOPUP_AMOUNT}
      />

      <WalletWithdrawModal
        isOpen={isWithdrawOpen}
        onClose={() => {
          setIsWithdrawOpen(false)
          withdrawMutation.reset()
        }}
        availableBalance={availableBalance}
        currency={currency}
        bankAccounts={bankAccounts}
        defaultBankId={defaultBankId}
        onSubmit={handleWithdrawSubmit}
        onResetError={() => withdrawMutation.reset()}
        isSubmitting={withdrawMutation.isPending}
        errorMessage={withdrawalError}
        isLoadingBanks={connectedBanksQuery.isLoading}
        showKycCta={showWithdrawalKycCta}
        onKycCta={() => {
          setIsWithdrawOpen(false)
          withdrawMutation.reset()
          router.push('/profile?modal=kyc&source=wallet')
        }}
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

      <WalletPendingWithdrawalsModal
        isOpen={isPendingWithdrawalsOpen}
        onClose={() => {
          setIsPendingWithdrawalsOpen(false)
          setWithdrawalToCancel(null)
          cancelWithdrawalMutation.reset()
        }}
        withdrawals={pendingWithdrawals}
        isCancelling={cancelWithdrawalMutation.isPending}
        onCancel={setWithdrawalToCancel}
      />
      <WalletCancelWithdrawalConfirmModal
        isOpen={Boolean(withdrawalToCancel)}
        onClose={() => {
          if (cancelWithdrawalMutation.isPending) return
          setWithdrawalToCancel(null)
        }}
        withdrawal={withdrawalToCancel}
        isSubmitting={cancelWithdrawalMutation.isPending}
        onConfirm={handleCancelPendingWithdrawal}
      />
    </div>
  )
}

export default WalletPageClient
