'use client'

import { useState } from 'react'
import { Check, Coins, Sparkles, X } from 'lucide-react'
import ResponsiveModal from '@/components/common/ResponsiveModal'
import GiveawayPinModal from '@/components/Giveaways/GiveawayPinModal'
import { toApiError } from '@/api/errorHelpers'
import { useSuccessModal } from '@/context/SuccessModalContext'
import {
  useAiCatalogue,
  useExchangeRate,
  usePurchaseAiPack,
} from '@/hooks/tanstack/ai'
import { formatCurrency } from '@/lib/utils/currency'
import { extractWalletAmount, packName } from '@/components/Ai/utils'

type AiCreditShopModalProps = {
  isOpen: boolean
  onClose: () => void
  onPurchased?: () => void
}

const PRIMARY_BTN =
  'bg-linear-to-b from-[17.5%] from-primary-400 to-primary-600 hover:from-primary-500 hover:to-primary-700'

const AiCreditShopModal = ({
  isOpen,
  onClose,
  onPurchased,
}: AiCreditShopModalProps) => {
  const catalogueQuery = useAiCatalogue(isOpen)
  const catalogue = catalogueQuery.data?.data
  const packs = catalogue?.packs ?? []
  const walletCurrency = catalogue?.walletCurrency ?? 'USD'
  const walletBalance = catalogue?.walletBalance ?? 0

  const { openSuccess } = useSuccessModal()

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isPinOpen, setIsPinOpen] = useState(false)
  const [pinError, setPinError] = useState('')
  const [actionError, setActionError] = useState('')

  const purchaseMutation = usePurchaseAiPack()
  const selectedPack = packs.find((p) => p.id === selectedId) ?? null

  const fxQuery = useExchangeRate(
    { from: 'USD', to: walletCurrency, amount: selectedPack?.priceUsd ?? 0 },
    isOpen && !!selectedPack && walletCurrency !== 'USD'
  )
  const walletAmount = selectedPack
    ? extractWalletAmount(
        fxQuery.data?.data,
        selectedPack.priceUsd,
        walletCurrency
      )
    : null
  const insufficient = walletAmount != null && walletAmount > walletBalance

  const bestValueId = packs.reduce<{ id: string; ratio: number } | null>(
    (best, p) => {
      const ratio = p.priceUsd > 0 ? p.credits / p.priceUsd : 0
      return !best || ratio > best.ratio ? { id: p.id, ratio } : best
    },
    null
  )?.id

  const resetAndClose = () => {
    setSelectedId(null)
    setIsPinOpen(false)
    setPinError('')
    setActionError('')
    onClose()
  }

  const handleConfirmPin = async (pin: string) => {
    if (!selectedPack) return
    setPinError('')
    setActionError('')
    try {
      const res = await purchaseMutation.mutateAsync({
        packId: selectedPack.id,
        pin,
      })
      setIsPinOpen(false)
      if (res.data) {
        const { creditsAdded, amountCharged, currency, credits } = res.data
        resetAndClose()
        onPurchased?.()
        openSuccess({
          title: 'Credits added',
          message: `${creditsAdded.toLocaleString()} credits added. ${formatCurrency(
            amountCharged,
            { currency, maximumFractionDigits: 2 }
          )} was charged from your wallet. New balance: ${credits.toLocaleString()} credits.`,
        })
      }
    } catch (err) {
      const message =
        toApiError(err).message || 'Could not complete purchase. Try again.'
      if (message.toLowerCase().includes('pin')) setPinError(message)
      else setActionError(message)
    }
  }

  const header = (
    <div className='flex items-start justify-between gap-4'>
      <div className='flex items-start gap-3'>
        <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600'>
          <Coins className='h-5 w-5' />
        </span>
        <div>
          <h2 className='text-lg font-semibold text-blackish'>
            Buy AI credits
          </h2>
          <p className='mt-0.5 text-sm text-grey-600'>
            Credits power AI features like trivia generation.
          </p>
        </div>
      </div>
      <button
        type='button'
        onClick={resetAndClose}
        aria-label='Close'
        className='text-grey-400 hover:text-grey-600'
      >
        <X className='h-5 w-5' />
      </button>
    </div>
  )

  let body: React.ReactNode
  if (catalogueQuery.isLoading) {
    body = (
      <div className='flex items-center justify-center py-12'>
        <div className='h-6 w-6 animate-spin rounded-full border-2 border-primary-200 border-t-primary-500' />
      </div>
    )
  } else if (catalogueQuery.isError || !catalogue) {
    body = (
      <div className='py-10 text-center text-sm text-grey-600'>
        Couldn’t load credit packs. Please try again.
      </div>
    )
  } else {
    body = (
      <div className='flex flex-col gap-4'>
        <div className='flex items-center justify-between rounded-xl bg-primary-50/60 px-3 py-2.5'>
          <span className='text-xs text-grey-600'>Current balance</span>
          <span className='inline-flex items-center gap-1.5 text-xs font-semibold text-primary-700'>
            <Sparkles className='h-3.5 w-3.5' />
            {catalogue.currentCredits.toLocaleString()} credits
          </span>
        </div>

        <div className='flex flex-col gap-2'>
          {packs.map((pack) => {
            const selected = pack.id === selectedId
            return (
              <button
                key={pack.id}
                type='button'
                onClick={() => setSelectedId(pack.id)}
                className={`flex items-center justify-between gap-3 rounded-[14px] border px-4 py-3 text-left transition-colors ${
                  selected
                    ? 'border-primary-400 bg-primary-50/40 ring-1 ring-primary-300'
                    : 'border-grey-100 bg-white hover:border-primary-200'
                }`}
              >
                <div className='flex items-center gap-3'>
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      selected
                        ? 'border-primary-500 bg-primary-500 text-white'
                        : 'border-grey-300'
                    }`}
                  >
                    {selected ? (
                      <Check className='h-3 w-3' strokeWidth={3} />
                    ) : null}
                  </span>
                  <div>
                    <p className='text-sm font-semibold text-grey-900'>
                      {packName(pack)}
                      {pack.id === bestValueId ? (
                        <span className='ml-2 rounded-full bg-success-50 px-2 py-0.5 text-[10px] font-medium text-success-600'>
                          Best value
                        </span>
                      ) : null}
                    </p>
                    <p className='text-xs text-grey-500'>
                      {pack.credits.toLocaleString()} credits
                    </p>
                  </div>
                </div>
                <span className='text-sm font-semibold text-grey-900'>
                  ${pack.priceUsd}
                </span>
              </button>
            )
          })}
        </div>

        {selectedPack ? (
          <div className='rounded-xl bg-grey-50/70 px-3 py-2.5 text-sm text-grey-700'>
            {walletAmount != null ? (
              <span>
                You’ll be charged{' '}
                <span className='font-semibold text-grey-900'>
                  ≈{' '}
                  {formatCurrency(walletAmount, {
                    currency: walletCurrency,
                    maximumFractionDigits: 2,
                  })}
                </span>{' '}
                from your wallet
                {fxQuery.isLoading ? ' (calculating…)' : ''}.
              </span>
            ) : (
              <span>
                Charged in {walletCurrency} from your wallet at today’s rate.
              </span>
            )}
            {insufficient ? (
              <p className='mt-1 text-xs font-medium text-error-600'>
                Insufficient wallet balance (
                {formatCurrency(walletBalance, {
                  currency: walletCurrency,
                  maximumFractionDigits: 2,
                })}{' '}
                available).
              </p>
            ) : null}
          </div>
        ) : null}

        {actionError ? (
          <div className='rounded-lg bg-error-50 px-3 py-2.5 text-sm text-error-700'>
            {actionError}
          </div>
        ) : null}
      </div>
    )
  }

  const footer =
    catalogue && !catalogueQuery.isLoading ? (
      <button
        type='button'
        disabled={!selectedPack || insufficient}
        onClick={() => {
          setPinError('')
          setActionError('')
          setIsPinOpen(true)
        }}
        className={`w-full rounded-[14px] py-3.5 text-base font-medium text-white transition-colors ${
          !selectedPack || insufficient
            ? 'cursor-not-allowed bg-primary-200'
            : PRIMARY_BTN
        }`}
      >
        {selectedPack
          ? `Buy ${selectedPack.credits.toLocaleString()} credits`
          : 'Select a pack'}
      </button>
    ) : undefined

  return (
    <>
      <ResponsiveModal
        isOpen={isOpen}
        onClose={resetAndClose}
        header={header}
        body={body}
        footer={footer}
        desktopMaxWidthClass='max-w-[460px]'
      />

      <GiveawayPinModal
        isOpen={isPinOpen}
        title='Confirm purchase'
        description={
          selectedPack
            ? `Enter your transaction PIN to buy ${selectedPack.credits.toLocaleString()} AI credits.`
            : 'Enter your transaction PIN to continue.'
        }
        confirmLabel='Pay & add credits'
        submittingLabel='Processing...'
        pinError={pinError}
        actionError={actionError}
        isSubmitting={purchaseMutation.isPending}
        onConfirm={handleConfirmPin}
        onClose={() => {
          setIsPinOpen(false)
          setPinError('')
          setActionError('')
        }}
        onClearError={() => {
          setPinError('')
          setActionError('')
        }}
      />
    </>
  )
}

export default AiCreditShopModal
