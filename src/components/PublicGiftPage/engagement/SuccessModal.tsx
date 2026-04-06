import { useEffect } from 'react'
import CloseIcon from '@/assets/icons/CloseIcon'
import CashIcon from '@/assets/icons/CashIcon'
import SuccessConfetti from '@/components/common/SuccessConfetti'
import Link from 'next/link'
import type { GiftOption } from './types'
import { DEFAULT_GIFT_IMAGE, formatCurrency } from './utils'
import { Minus, Plus } from 'lucide-react'

type SuccessModalProps = {
  isOpen: boolean
  onClose: () => void
  receiverName: string
  giftItems: GiftOption[]
  giftQuantities: Record<string, number>
  onChangeGiftQuantity: (giftId: string, direction: 'inc' | 'dec') => void
  currency: string
}

export default function SuccessModal({
  isOpen,
  onClose,
  receiverName,
  giftItems,
  giftQuantities,
  onChangeGiftQuantity,
  currency,
}: SuccessModalProps) {
  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center px-4'>
      <button
        type='button'
        className='absolute inset-0 bg-black/40 backdrop-blur-sm'
        onClick={onClose}
        aria-label='Close success modal overlay'
      />

      <div className='relative z-10 flex max-h-[calc(100dvh-2rem)] w-full max-w-[522px] flex-col overflow-hidden rounded-[20px] bg-white p-6 shadow-[0px_24px_60px_-20px_#10192852] lg:px-[50px] lg:py-12'>
        <button
          type='button'
          onClick={onClose}
          className='absolute right-4 top-4 flex h-8 w-8 items-center justify-center text-grey-500 hover:text-grey-700'
          aria-label='Close success modal'
        >
          <span className='h-4 lg:h-6 w-4 lg:w-6'>
            <CloseIcon />
          </span>
        </button>

        <div className='mx-auto h-20 lg:h-[110px] w-20 lg:w-[110px]'>
          <SuccessConfetti />
        </div>

        <div className='text-center'>
          <h3 className='text-[24px] leading-[30px] font-medium text-blackish'>
            Success!
            <span className='ml-1.5 text-[20px] align-middle'>👏🏽</span>
          </h3>
          <p className='mt-1.5 text-sm text-grey-600'>
            Your wishes for {receiverName} have been sent.
          </p>
          <p className='text-sm text-grey-600'>
            You can also buy a gift from her list or surprise her with something
            you choose.
          </p>
        </div>

        <div className='mt-4 flex-1 overflow-y-auto overscroll-contain'>
          <div className='overflow-hidden rounded-[8px] border border-grey-50 shadow-[0px_1.5px_4px_-1px_#10192812] py-4 px-3 flex flex-col gap-4'>
            {giftItems.length > 0 ? (
              giftItems.map((item) => (
                <div
                  key={item.id}
                  className='flex justify-between items-end gap-2 border-b border-grey-50 last:border-b-0 pb-4 last:pb-0'
                >
                  <div className='flex gap-2 w-full'>
                    {item.kind === 'cash' ? (
                      <span className='flex h-15 w-15 rounded-[4px] border border-primary-100 bg-primary-50 p-2 text-primary-700 items-center justify-center'>
                        <CashIcon />
                      </span>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.imageUrl || DEFAULT_GIFT_IMAGE}
                        alt={item.title}
                        className='h-15 w-15 rounded-[4px] border border-grey-100 object-cover'
                      />
                    )}
                    <div className='min-w-0 h-full flex-1 flex flex-col justify-between gap-2'>
                      <p className='truncate text-sm leading-[120%] text-grey-600'>
                        {item.title}
                      </p>
                      {item.kind === 'cash' ? (
                        <div>
                          <p className='text-xs leading-[119%] text-grey-600 font-medium'>
                            {formatCurrency(
                              Math.max(0, item.raisedAmount ?? 0),
                              currency
                            )}{' '}
                            raised of{' '}
                            {formatCurrency(
                              Math.max(0, item.targetAmount ?? 0),
                              currency
                            )}
                          </p>
                          <div className='mt-1 h-2 w-full rounded-full bg-grey-50/50 overflow-hidden'>
                            <div
                              className='h-full bg-primary-300 transition-all duration-300'
                              style={{
                                width: `${Math.max(
                                  Math.min(
                                    ((item.raisedAmount ?? 0) /
                                      Math.max(
                                        item.targetAmount ?? 0,
                                        item.raisedAmount ?? 0,
                                        1
                                      )) *
                                      100,
                                    100
                                  ),
                                  1
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className='flex items-center gap-2'>
                          <button
                            type='button'
                            onClick={() => onChangeGiftQuantity(item.id, 'dec')}
                            className='flex h-8 w-8 items-center justify-center rounded-[6px] border border-primary-100 bg-primary-50/60 text-primary-500 enabled:hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed'
                            disabled={
                              (giftQuantities[item.id] ?? item.quantity) <= 1
                            }
                            aria-label={`Decrease ${item.title} quantity`}
                          >
                            <Minus className='size-4' />
                          </button>
                          <span className='w-6 text-center text-base leading-5 text-grey-700'>
                            {giftQuantities[item.id] ?? item.quantity}
                          </span>
                          <button
                            type='button'
                            onClick={() => onChangeGiftQuantity(item.id, 'inc')}
                            className='flex h-8 w-8 items-center justify-center rounded-[6px] border border-primary-100 bg-primary-50/60 text-primary-500 enabled:hover:bg-primary-50'
                            aria-label={`Increase ${item.title} quantity`}
                          >
                            <Plus className='size-4' />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className='text-right text-base leading-[140%] font-medium text-grey-900'>
                    {item.kind === 'cash'
                      ? formatCurrency(
                          Math.max(0, item.targetAmount ?? item.price),
                          currency
                        )
                      : formatCurrency(
                          item.price *
                            (giftQuantities[item.id] ?? item.quantity),
                          currency
                        )}
                  </p>
                </div>
              ))
            ) : (
              <div className='px-4 py-6 text-center text-sm text-grey-500'>
                No gift items added yet.
              </div>
            )}
          </div>
        </div>

        <div className='mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2'>
          <Link
            href='/gifts/create-new'
            className='inline-flex h-12 items-center justify-center rounded-[14px] border border-grey-200 bg-grey-50 px-4 text-sm font-medium text-grey-800 hover:bg-grey-100 transition-colors duration-300'
          >
            Create a Gift Page
          </Link>
          <button
            type='button'
            onClick={onClose}
            className='inline-flex h-12 items-center justify-center rounded-[14px] bg-linear-to-b from-primary-400 to-primary-600 px-4 text-sm font-medium text-white hover:from-primary-500 hover:to-primary-700 transition-colors duration-300'
          >
            Buy a Gift
          </button>
        </div>
      </div>
    </div>
  )
}
