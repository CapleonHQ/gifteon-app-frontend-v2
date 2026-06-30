'use client'

import { useMemo, useState } from 'react'
import WalletSummarySection from './WalletSummarySection'
import WalletDisputeModal from './WalletDisputeModal'
import WalletPendingWithdrawalsBanner from './WalletPendingWithdrawalsBanner'
import WalletPendingWithdrawalsModal from './WalletPendingWithdrawalsModal'
import WalletSummarySkeleton from './WalletSummarySkeleton'
import WalletTopUpModal from './WalletTopUpModal'
import WalletTransactionsSection from './WalletTransactionsSection'
import WalletWithdrawModal from './WalletWithdrawModal'
import { useSuccessModal } from '@/context/SuccessModalContext'
import { useConnectedBanks } from '@/hooks/tanstack/banks'
import { useWalletDetails, useWalletWithdrawals } from '@/hooks/tanstack/wallet'
import { useWalletBalanceVisibility } from './hooks/useWalletBalanceVisibility'
import { parseWalletBalance } from '@/lib/wallet/transformers'
import { formatCurrency } from '@/lib/utils/currency'
import { mapWalletBankAccounts } from './utils'

const WalletPageClient = () => {
  const [isTopUpOpen, setIsTopUpOpen] = useState(false)
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false)
  const [isDisputeOpen, setIsDisputeOpen] = useState(false)
  const [isPendingWithdrawalsOpen, setIsPendingWithdrawalsOpen] =
    useState(false)
  const { openSuccess } = useSuccessModal()
  const { isBalanceHidden, toggleBalanceVisibility } =
    useWalletBalanceVisibility()
  const detailsQuery = useWalletDetails()
  const connectedBanksQuery = useConnectedBanks()
  const pendingWithdrawalsQuery = useWalletWithdrawals({ page: 1, limit: 20 })

  const walletDetails = detailsQuery.data?.data
  const totalBalance = parseWalletBalance(walletDetails?.balance)
  const withdrawableBalance = parseWalletBalance(
    walletDetails?.withdrawableBalance
  )

  const totalReceived = parseWalletBalance(walletDetails?.totalReceived)
  const totalWithdrawn = parseWalletBalance(walletDetails?.totalWithdrawn)
  const currency = walletDetails?.currency || 'USD'

  const bankAccounts = useMemo(
    () => mapWalletBankAccounts(connectedBanksQuery.data?.data?.banks ?? []),
    [connectedBanksQuery.data?.data?.banks]
  )
  const pendingWithdrawals = useMemo(
    () =>
      (pendingWithdrawalsQuery.data?.data?.withdrawals ?? []).filter(
        (withdrawal) => withdrawal.status === 'pending'
      ),
    [pendingWithdrawalsQuery.data?.data?.withdrawals]
  )
  const defaultBankId = useMemo(
    () =>
      connectedBanksQuery.data?.data?.banks?.find((bank) => bank.isDefault)?.id,
    [connectedBanksQuery.data?.data?.banks]
  )

  const hasResolvedOverview = detailsQuery.isSuccess || detailsQuery.isError
  const showOverviewSkeleton = detailsQuery.isLoading && !hasResolvedOverview
  const hasOverviewError =
    detailsQuery.isError ||
    detailsQuery.isRefetchError ||
    (!detailsQuery.isLoading && !walletDetails)

  return (
    <div className='w-full flex flex-col gap-10 lg:gap-6 mt-2 mb-10 lg:mt-0 lg:mb-0'>
      <div className='flex flex-col gap-4'>
        {showOverviewSkeleton ? (
          <WalletSummarySkeleton />
        ) : (
          <WalletSummarySection
            availableBalance={formatCurrency(totalBalance, {
              currency,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            withdrawableBalance={formatCurrency(withdrawableBalance, {
              currency,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
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
            onToggleBalanceVisibility={toggleBalanceVisibility}
          />
        )}

        {pendingWithdrawals.length > 0 ? (
          <WalletPendingWithdrawalsBanner
            count={pendingWithdrawals.length}
            onOpen={() => setIsPendingWithdrawalsOpen(true)}
          />
        ) : null}
      </div>

      <WalletTransactionsSection onReport={() => setIsDisputeOpen(true)} />

      <WalletTopUpModal
        isOpen={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
      />

      <WalletWithdrawModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        availableBalance={withdrawableBalance}
        currency={currency}
        bankAccounts={bankAccounts}
        defaultBankId={defaultBankId}
        isLoadingBanks={connectedBanksQuery.isLoading}
      />

      <WalletPendingWithdrawalsModal
        isOpen={isPendingWithdrawalsOpen}
        onClose={() => setIsPendingWithdrawalsOpen(false)}
        withdrawals={pendingWithdrawals}
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
