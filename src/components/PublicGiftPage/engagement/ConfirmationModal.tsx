import { useMemo, useState } from 'react'
import CloseIcon from '@/assets/icons/CloseIcon'
import CashIcon from '@/assets/icons/CashIcon'
import ResponsiveModal from '@/components/common/ResponsiveModal'
import type { GiftOption } from './types'
import GiftItemRow from './GiftItemRow'
import Link from 'next/link'
import Image from 'next/image'
import BackLeftIcon from '@/assets/icons/BackLeftIcon'
import ShakeOnError from '@/components/common/ShakeOnError'
import { formatCurrency } from '@/lib/utils/currency'

type ConfirmationModalProps = {
  isOpen: boolean
  onClose: () => void
  onMakePayment: () => void
  selectedGiftItems: GiftOption[]
  giftQuantities: Record<string, number>
  onChangeGiftQuantity: (giftId: string, direction: 'inc' | 'dec') => void
  currency: string
}

const getItemAmount = (item: GiftOption, quantity: number) => {
  if (item.kind === 'cash') return Math.max(0, item.targetAmount ?? item.price)
  return Math.max(0, item.price * quantity)
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onMakePayment,
  selectedGiftItems,
  giftQuantities,
  onChangeGiftQuantity,
  currency,
}: ConfirmationModalProps) {
  const [cashAmountInputs, setCashAmountInputs] = useState<
    Record<string, string>
  >({})
  const [cashAmountErrors, setCashAmountErrors] = useState<
    Record<string, string>
  >({})

  const cashItems = useMemo(
    () => selectedGiftItems.filter((item) => item.kind === 'cash'),
    [selectedGiftItems]
  )

  if (!isOpen) return null

  const getDefaultCashAmount = (item: GiftOption) => {
    const defaultAmount = Math.max(
      0,
      item.minimumAmount ?? item.targetAmount ?? item.price ?? 0
    )
    return defaultAmount > 0 ? String(defaultAmount) : ''
  }

  const formatAmountDigits = (value: string) => {
    const numeric = value.replace(/\D/g, '')
    if (!numeric) return ''
    return Number(numeric).toLocaleString('en-US')
  }

  const resolveCashAmount = (item: GiftOption) => {
    const raw = (cashAmountInputs[item.id] ?? getDefaultCashAmount(item)).trim()
    const numeric = raw.replace(/\D/g, '')
    const parsed = Number(numeric)
    if (Number.isFinite(parsed) && parsed > 0) return parsed
    return Math.max(0, item.targetAmount ?? item.price)
  }

  const giftsTotal = selectedGiftItems.reduce((sum, item) => {
    if (item.kind === 'cash') {
      return sum + resolveCashAmount(item)
    }
    const quantity = giftQuantities[item.id] ?? item.quantity
    return sum + getItemAmount(item, quantity)
  }, 0)
  const serviceCharge = Math.round(giftsTotal * 0.07)
  const total = giftsTotal + serviceCharge

  const getCashAmountError = (item: GiftOption, value: string) => {
    const minimum = Math.max(0, item.minimumAmount ?? 0)
    const raw = value.trim().replace(/\D/g, '')
    if (!raw) return 'Enter an amount.'
    const amount = Number(raw)
    if (!Number.isFinite(amount) || amount <= 0) return 'Enter a valid amount.'
    if (amount < minimum) {
      return `Amount cannot be below ${formatCurrency(minimum, {
        currency,
        maximumFractionDigits: 0,
      })}.`
    }
    return ''
  }

  const handleCashAmountChange = (item: GiftOption, raw: string) => {
    const sanitized = raw.replace(/\D/g, '')
    setCashAmountInputs((prev) => ({ ...prev, [item.id]: sanitized }))
    const nextError = getCashAmountError(item, sanitized)
    setCashAmountErrors((prev) => ({ ...prev, [item.id]: nextError }))
  }

  const handleMakePayment = () => {
    const nextErrors: Record<string, string> = {}
    cashItems.forEach((item) => {
      const error = getCashAmountError(
        item,
        cashAmountInputs[item.id] ?? getDefaultCashAmount(item)
      )
      if (error) nextErrors[item.id] = error
    })

    setCashAmountErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    onMakePayment()
  }

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      desktopMaxWidthClass='max-w-[500px]'
      mobileTopOffsetClass='top-0'
      zIndex='z-70 lg:z-50'
      header={
        <div className='relative'>
          <button
            type='button'
            onClick={onClose}
            className='hidden lg:flex absolute -right-5 -top-5 w-9 h-9 rounded-full items-center justify-center hover:bg-grey-50'
            aria-label='Close'
          >
            <span className='text-grey-700 w-5 lg:w-6 h-5 lg:h-6'>
              <CloseIcon />
            </span>
          </button>
          <div className='lg:hidden -mt-8 bg-secondary-50 -mx-4 p-4'>
            <Link href='/'>
              <div className='w-[104px] h-[40px]'>
                <Image
                  src='/assets/images/logo/logo.svg'
                  alt='Giftseon'
                  className='w-full h-full'
                  width={114}
                  height={44}
                />
              </div>
            </Link>
          </div>
          <div className='lg:hidden flex items-center gap-2 mt-8'>
            <button
              type='button'
              onClick={onClose}
              className='w-6 h-6'
              aria-label='Go back'
            >
              <span className='text-blackish flex'>
                <BackLeftIcon />
              </span>
            </button>
          </div>
          <div className='text-center mt-2 lg:mt-0'>
            <h3 className='text-xl leading-7 font-medium text-blackish'>
              Confirmation
            </h3>
            <p className='text-sm leading-[18px] text-grey-700 mt-1'>
              This gift will be delivered as its cash equivalent.
            </p>
          </div>
        </div>
      }
      body={
        <div className='space-y-4'>
          <div className='overflow-hidden rounded-[8px] border border-grey-50 shadow-[0px_1.5px_4px_-1px_#10192812] py-4 px-3 flex flex-col gap-4'>
            {selectedGiftItems.length > 0 ? (
              selectedGiftItems.map((item) =>
                item.kind === 'cash' ? (
                  <div
                    key={item.id}
                    className='flex items-start gap-2 border-b border-grey-50 last:border-b-0 pb-4 last:pb-0'
                  >
                    <div className='flex gap-2 w-full'>
                      <span className='flex h-15 w-15 rounded-[4px] border border-primary-100 bg-primary-50 p-2 text-primary-700 items-center justify-center'>
                        <CashIcon />
                      </span>
                      <div className='min-w-0 h-full flex-1 flex flex-col justify-between gap-2'>
                        <div className='flex items-center justify-between gap-2'>
                          <p className='truncate text-sm leading-[120%] text-grey-600'>
                            {item.title}
                          </p>
                          <label className='shrink-0 text-xs text-grey-600 font-medium'>
                            Enter amount
                          </label>
                        </div>
                        <div
                          className={`mt-1 flex h-11 w-full items-center rounded-[10px] border px-3 ${
                            cashAmountErrors[item.id]
                              ? 'border-error-300'
                              : 'border-grey-100 focus-within:border-primary-300'
                          }`}
                        >
                          <span className='text-sm text-grey-500 mr-2'>₦</span>
                          <input
                            type='text'
                            inputMode='numeric'
                            value={formatAmountDigits(
                              cashAmountInputs[item.id] ??
                                getDefaultCashAmount(item)
                            )}
                            onChange={(event) =>
                              handleCashAmountChange(item, event.target.value)
                            }
                            placeholder='0'
                            className='h-full w-full bg-transparent text-sm text-grey-900 outline-none'
                          />
                        </div>
                        {cashAmountErrors[item.id] ? (
                          <ShakeOnError active={true}>
                            <p className='mt-1 text-xs text-error-300'>
                              {cashAmountErrors[item.id]}
                            </p>
                          </ShakeOnError>
                        ) : (
                          <p className='mt-1 text-xs text-grey-500'>
                            Minimum:{' '}
                            {formatCurrency(Math.max(0, item.minimumAmount ?? 0), {
                              currency,
                              maximumFractionDigits: 0,
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <GiftItemRow
                    key={item.id}
                    item={item}
                    currency={currency}
                    quantity={giftQuantities[item.id] ?? item.quantity}
                    showControls={true}
                    maxQuantity={item.quantity}
                    onDecrease={() => onChangeGiftQuantity(item.id, 'dec')}
                    onIncrease={() => onChangeGiftQuantity(item.id, 'inc')}
                  />
                )
              )
            ) : (
              <div className='px-4 py-6 text-center text-sm text-grey-500'>
                No gift items selected.
              </div>
            )}
          </div>

          <div className='rounded-[12px] bg-secondary-50 p-3 flex flex-col gap-3'>
            <div className='flex items-center justify-between'>
              <p className='text-sm leading-5 text-[#143535]'>Gifts:</p>
              <p className='text-sm leading-5 text-[#143535] font-medium'>
                {formatCurrency(giftsTotal, {
                  currency,
                  maximumFractionDigits: 0,
                })}
              </p>
            </div>
            <div className='flex items-center justify-between'>
              <p className='text-sm leading-5 text-[#143535]'>
                Service charge (7%):
              </p>
              <p className='text-sm leading-5 text-[#143535] font-medium'>
                {formatCurrency(serviceCharge, {
                  currency,
                  maximumFractionDigits: 0,
                })}
              </p>
            </div>
            <div className='flex items-center justify-between py-1'>
              <p className='text-sm leading-5 text-grey-700'>Total:</p>
              <p className='text-base leading-[22px] text-[#143535] font-semibold'>
                {formatCurrency(total, {
                  currency,
                  maximumFractionDigits: 0,
                })}
              </p>
            </div>
          </div>
        </div>
      }
      footer={
        <div className='grid gap-3 grid-cols-2'>
          <button
            type='button'
            onClick={onClose}
            className='inline-flex h-12 items-center justify-center rounded-[14px] border border-grey-200 bg-grey-50 px-4 text-sm font-medium text-grey-800 hover:bg-grey-100 transition-colors duration-300'
          >
            Cancel
          </button>
          <button
            type='button'
            onClick={handleMakePayment}
            disabled={selectedGiftItems.length === 0}
            className='inline-flex h-12 items-center justify-center rounded-[14px] bg-linear-to-b from-primary-400 to-primary-600 px-4 text-sm font-medium text-white enabled:hover:from-primary-500 enabled:hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300'
          >
            Make Payment
          </button>
        </div>
      }
    />
  )
}
