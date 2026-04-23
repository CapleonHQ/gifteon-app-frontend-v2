import { X } from 'lucide-react'
import ResponsiveModal from '@/components/common/ResponsiveModal'
import { RecipientCard, formatTimingSummary, parseAmount } from '../models'
import { BillsTabKey } from '../constants'
import { useWalletDetails } from '@/hooks/tanstack/wallet'
import { parseWalletBalance } from '@/lib/wallet/transformers'
import { formatCurrency } from '@/lib/utils/currency'
import {
  useAirtimeNetworks,
  useCableProviders,
  useDataNetworks,
  useElectricityDiscos,
} from '@/hooks/tanstack/bills'
import {
  mapAirtimeNetworkOptions,
  mapCableProviderOptions,
  mapDataNetworkOptions,
  mapElectricityDiscoOptions,
} from '../utils'

type BillsReviewModalProps = {
  isOpen: boolean
  onClose: () => void
  onContinue: () => void
  activeTab: BillsTabKey
  cards: RecipientCard[]
  totalAmount: number
  getDataPlanLabel: (network: string, code: string) => string
  getCablePackageLabel: (provider: string, code: string) => string
}

const BillsReviewModal = ({
  isOpen,
  onClose,
  onContinue,
  activeTab,
  cards,
  totalAmount,
  getDataPlanLabel,
  getCablePackageLabel,
}: BillsReviewModalProps) => {
  const airtimeOptions = mapAirtimeNetworkOptions(useAirtimeNetworks().data)
  const dataNetworkOptions = mapDataNetworkOptions(useDataNetworks().data)
  const electricityOptions = mapElectricityDiscoOptions(useElectricityDiscos().data)
  const cableProviderOptions = mapCableProviderOptions(useCableProviders().data)

  const walletDetailsQuery = useWalletDetails()
  const walletData = walletDetailsQuery.data?.data
  const walletCurrency = walletData?.currency || 'NGN'
  const availableBalance = parseWalletBalance(walletData?.balance)
  const isBalanceLoading = walletDetailsQuery.isLoading
  const hasInsufficientBalance = !isBalanceLoading && totalAmount > availableBalance
  const nextBalance = Math.max(availableBalance - totalAmount, 0)
  const getOptionLabel = (
    options: Array<{ value: string; label: string }>,
    value: string
  ) => options.find((option) => option.value === value)?.label || value
  const getReviewDetails = (card: (typeof cards)[number]) => {
    if (activeTab === 'airtime') {
      return [
        { label: 'Service', value: 'Airtime' },
        {
          label: 'Network',
          value: card.network
            ? getOptionLabel(airtimeOptions, card.network)
            : 'Not selected',
        },
        { label: 'Recipient', value: card.identifierValue || 'Not provided' },
      ]
    }
    if (activeTab === 'data') {
      return [
        { label: 'Service', value: 'Data' },
        {
          label: 'Network',
          value: card.network
            ? getOptionLabel(dataNetworkOptions, card.network)
            : 'Not selected',
        },
        {
          label: 'Plan',
          value:
            card.network && card.planCode
              ? getDataPlanLabel(card.network, card.planCode)
              : 'Not selected',
        },
        { label: 'Recipient', value: card.identifierValue || 'Not provided' },
      ]
    }
    if (activeTab === 'electricity') {
      return [
        { label: 'Service', value: 'Electricity' },
        {
          label: 'Disco',
          value: card.provider
            ? getOptionLabel(electricityOptions, card.provider)
            : 'Not selected',
        },
        { label: 'Meter type', value: card.meterType },
        { label: 'Meter number', value: card.identifierValue || 'Not provided' },
      ]
    }
    return [
      { label: 'Service', value: 'Cable TV' },
      {
        label: 'Provider',
        value: card.provider
          ? getOptionLabel(cableProviderOptions, card.provider)
          : 'Not selected',
      },
      {
        label: 'Package',
        value:
          card.provider && card.planCode
            ? getCablePackageLabel(card.provider, card.planCode)
            : 'Not selected',
      },
      { label: 'IUC number', value: card.identifierValue || 'Not provided' },
    ]
  }

  if (!isOpen) return null

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      desktopMaxWidthClass='max-w-2xl'
      header={
        <div className='relative'>
          <button
            type='button'
            onClick={onClose}
            className='absolute -right-5 -top-5 w-9 h-9 rounded-full hidden lg:flex items-center justify-center hover:bg-grey-50'
            aria-label='Close'
          >
            <span className='text-grey-700'>
              <X className='h-5 w-5' />
            </span>
          </button>
          <div className='text-center mt-4 lg:mt-0'>
            <h3 className='text-2xl font-medium text-blackish'>Review Payment</h3>
            <p className='text-sm text-grey-600 mt-1'>
              Confirm recipients and total before payment
            </p>
          </div>
        </div>
      }
      body={
        <div className='space-y-3'>
          {cards.map((card, index) => (
            <div key={card.id} className='rounded-xl border border-grey-100 p-3 space-y-2'>
              {cards.length > 1 ? (
                <p className='text-sm font-semibold text-grey-900'>
                  Recipient {index + 1}
                </p>
              ) : null}

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm'>
                {getReviewDetails(card).map((item) => (
                  <div key={`${card.id}-${item.label}`}>
                    <p className='text-xs text-grey-500'>{item.label}</p>
                    <p className='text-grey-900 break-all'>{item.value}</p>
                  </div>
                ))}
                <div>
                  <p className='text-xs text-grey-500'>Amount</p>
                  <p className='text-grey-900'>
                    ₦{parseAmount(card.amount).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className='flex flex-wrap gap-2 text-xs'>
                {card.sendAsGift ? (
                  <span className='rounded-full bg-grey-100 px-2 py-1 text-grey-700'>
                    Gift
                  </span>
                ) : null}
                {card.timingMode !== 'instant' ? (
                  <span className='rounded-full bg-grey-100 px-2 py-1 text-grey-700'>
                    {formatTimingSummary(card)}
                  </span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      }
      footer={
        <div className='space-y-3'>
          <div className='rounded-lg border border-grey-100 bg-grey-50/50 p-3 space-y-1'>
            <p className='text-xs text-grey-600'>
              This payment amount will be deducted from your wallet balance.
            </p>
            <p className='text-sm text-grey-700'>
              Available balance:{' '}
              <span className='font-medium text-grey-900'>
                {isBalanceLoading
                  ? 'Loading...'
                  : formatCurrency(availableBalance, {
                      currency: walletCurrency,
                      maximumFractionDigits: 0,
                    })}
              </span>
            </p>
            {!isBalanceLoading ? (
              <p className='text-xs text-grey-600'>
                Balance after payment:{' '}
                <span className='font-medium text-grey-800'>
                  {formatCurrency(nextBalance, {
                    currency: walletCurrency,
                    maximumFractionDigits: 0,
                  })}
                </span>
              </p>
            ) : null}
            {hasInsufficientBalance ? (
              <p className='text-xs text-error-600'>
                Insufficient wallet balance for this payment.
              </p>
            ) : null}
          </div>
          <div className='flex items-center justify-between gap-3'>
            <p className='text-sm text-grey-600'>Total</p>
            <p className='text-lg font-semibold text-grey-900'>
              ₦{totalAmount.toLocaleString()}
            </p>
          </div>
          <div className='flex items-center gap-3'>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 py-2.5 rounded-[10px] border border-grey-200 text-grey-700 font-medium bg-grey-50/70 hover:bg-grey-100/70 transition-colors'
            >
              Cancel
            </button>
            <button
              type='button'
              onClick={onContinue}
              disabled={isBalanceLoading || hasInsufficientBalance}
              className='flex-1 py-2.5 rounded-[10px] font-medium text-white bg-primary-500 hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Continue
            </button>
          </div>
        </div>
      }
    />
  )
}

export default BillsReviewModal
