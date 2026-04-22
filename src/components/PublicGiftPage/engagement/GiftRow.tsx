import type { GiftOption } from './types'
import { DEFAULT_GIFT_IMAGE } from './utils'
import CashIcon from '@/assets/icons/CashIcon'
import { Minus, Plus } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/currency'

type GiftRowProps = {
  item: GiftOption
  isSelected: boolean
  quantity: number
  currency: string
  onAdd: () => void
  onRemove: () => void
  onDecrease: () => void
  onIncrease: () => void
}

export default function GiftRow({
  item,
  isSelected,
  quantity,
  currency,
  onAdd,
  onRemove,
  onDecrease,
  onIncrease,
}: GiftRowProps) {
  const isCashGift = item.kind === 'cash'
  const coveredAmount = Math.max(0, item.coveredAmount ?? 0)
  const targetAmount = Math.max(0, item.targetAmount ?? 0)
  const progressDenominator = isCashGift
    ? Math.max(targetAmount, coveredAmount, 1)
    : Math.max(item.quantity, 1)
  const progressValue = isCashGift ? coveredAmount : item.claimed
  const progress = Math.min(progressValue / progressDenominator, 1)
  const progressPercent = Number((progress * 100).toFixed(2))

  if (isCashGift) {
    return (
      <div className='border-b border-grey-50 px-3 py-2 last:border-b-0 md:pl-4 md:pr-5 md:pt-2 md:pb-3.5'>
        <div className='min-w-0 md:grid md:grid-cols-[minmax(0,1fr)_140px_140px] md:items-center md:gap-4'>
          <div className='flex items-center gap-2 md:gap-3'>
            <div className='h-15 md:h-[72px] w-15 md:w-[72px] shrink-0 rounded-[8px] border border-primary-100 bg-primary-50 text-primary-700 flex items-center justify-center'>
              <span className='h-8 w-8 md:h-10 md:w-10'>
                <CashIcon />
              </span>
            </div>

            <div className='ml-1 md:ml-0 w-full h-full flex flex-col justify-between gap-2'>
              <div>
                <p className='truncate leading-[120%] font-medium text-grey-900'>
                  {item.title}
                </p>
                <p className='mt-0.5 truncate text-[10px] leading-[120%] text-grey-700'>
                  {item.subtitle}
                </p>
              </div>
              <div>
                <div className='flex justify-between items-center gap-2 text-xs leading-[119%] text-grey-600 font-medium'>
                  <p>
                    {formatCurrency(coveredAmount, {
                      currency,
                      maximumFractionDigits: 0,
                    })}{' '}
                    raised of{' '}
                    {formatCurrency(targetAmount, {
                      currency,
                      maximumFractionDigits: 0,
                    })}
                  </p>
                  <p>{progressPercent}%</p>
                </div>
                <div className='mt-1 h-2 w-full rounded-full bg-grey-50/50 overflow-hidden'>
                  <div
                    className='h-full bg-primary-300 transition-all duration-300'
                    style={{ width: `${Math.max(progress * 100, 1)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='mt-3 hidden md:flex md:items-center md:justify-center md:gap-2 md:p-3 md:pr-0'>
            {isSelected ? (
              <button
                type='button'
                onClick={onRemove}
                className='h-8 rounded-[8px] border border-error-200 bg-error-50 px-3 text-xs font-medium text-error-700 hover:bg-error-100 transition-colors duration-300'
              >
                Remove
              </button>
            ) : (
              <button
                type='button'
                onClick={onAdd}
                className='h-8 rounded-[8px] border border-primary-200 bg-primary-50 px-3 text-xs font-medium text-primary-700 hover:bg-primary-100 transition-colors duration-300'
              >
                Add cash gift
              </button>
            )}
          </div>

          <div className='mt-3 flex items-center justify-between pl-[70px] pr-1 md:hidden'>
            {isSelected ? (
              <button
                type='button'
                onClick={onRemove}
                className='h-8 rounded-[8px] border border-error-200 bg-error-50 px-3 text-xs font-medium text-error-700 hover:bg-error-100 transition-colors duration-300'
              >
                Remove
              </button>
            ) : (
              <button
                type='button'
                onClick={onAdd}
                className='h-8 rounded-[8px] border border-primary-200 bg-primary-50 px-3 text-xs font-medium text-primary-700 hover:bg-primary-100 transition-colors duration-300'
              >
                Add cash gift
              </button>
            )}
            {isSelected ? (
              <span className='rounded-full bg-success-50 px-2.5 py-1 text-xs font-medium text-success-700'>
                Added
              </span>
            ) : null}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='border-b border-grey-50 px-3 py-2 last:border-b-0 md:grid md:grid-cols-[minmax(0,1fr)_140px_140px] md:items-center md:gap-4 md:pl-4 md:pr-5 md:pt-2 md:pb-3.5'>
      <div className='min-w-0'>
        <div className='flex items-center gap-2 md:gap-3'>
          <div className='h-15 md:h-[72px] w-15 md:w-[72px] shrink-0'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.imageUrl || DEFAULT_GIFT_IMAGE}
              alt={item.title}
              className='h-full w-full rounded-[8px] object-cover'
            />
          </div>
          <div className='ml-1 md:ml-0 w-full h-full flex flex-col justify-between gap-2'>
            <div>
              <p className='truncate leading-[120%] font-medium text-grey-900'>
                {item.title}
              </p>
              <p className='mt-0.5 truncate text-[10px] leading-[120%] text-grey-700'>
                {item.subtitle}
              </p>
            </div>
            <div>
              <div className='flex justify-between items-center gap-2 text-xs leading-[119%] text-grey-600 font-medium'>
                <p>
                  {Math.min(item.claimed, item.quantity)} of {item.quantity}{' '}
                  fulfilled
                </p>
                <p>{progressPercent}%</p>
              </div>
              <div className='mt-1 h-2 w-full rounded-full bg-grey-50/50 overflow-hidden'>
                <div
                  className='h-full bg-primary-300 transition-all duration-300'
                  style={{ width: `${Math.max(progress * 100, 1)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='mt-3 flex items-center justify-between pl-[96px] pr-1 md:hidden'>
        <p className='leading-[140%] font-medium text-grey-900'>
          {formatCurrency(item.price, {
            currency,
            maximumFractionDigits: 0,
          })}
        </p>
        {isSelected ? (
          <div className='flex items-center justify-end gap-2'>
            <button
              type='button'
              onClick={onDecrease}
              className='h-8 w-8 flex items-center justify-center rounded-[6px] bg-primary-50/60 border border-primary-100 text-primary-500 enabled:hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-300'
              disabled={quantity <= 1}
              aria-label={`Decrease ${item.title} quantity`}
            >
              <Minus className='size-4' />
            </button>
            <span className='w-6 text-center leading-5 text-grey-700'>
              {quantity}
            </span>
            <button
              type='button'
              onClick={onIncrease}
              className='h-8 w-8 flex items-center justify-center rounded-[6px] bg-primary-50/60 border border-primary-100 text-primary-500 enabled:hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-300'
              aria-label={`Increase ${item.title} quantity`}
            >
              <Plus className='size-4' />
            </button>
            <button
              type='button'
              onClick={onRemove}
              className='h-8 rounded-[8px] border border-error-200 bg-error-50 px-2.5 text-xs font-medium text-error-700 hover:bg-error-100 transition-colors duration-300'
            >
              Remove
            </button>
          </div>
        ) : (
          <button
            type='button'
            onClick={onAdd}
            className='h-8 rounded-[8px] border border-primary-200 bg-primary-50 px-3 text-xs font-medium text-primary-700 hover:bg-primary-100 transition-colors duration-300'
          >
            Add
          </button>
        )}
      </div>

      <div className='hidden md:flex md:mt-0 md:items-center md:justify-center md:gap-2 md:p-3 md:pr-0'>
        {isSelected ? (
          <>
            <button
              type='button'
              onClick={onDecrease}
              className='h-8 w-8 flex items-center justify-center rounded-[6px] bg-primary-50/60 border border-primary-100 text-primary-500 enabled:hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-300'
              disabled={quantity <= 1}
              aria-label={`Decrease ${item.title} quantity`}
            >
              <Minus className='size-4' />
            </button>
            <span className='w-6 text-center leading-5 text-grey-700'>
              {quantity}
            </span>
            <button
              type='button'
              onClick={onIncrease}
              className='h-8 w-8 flex items-center justify-center rounded-[6px] bg-primary-50/60 border border-primary-100 text-primary-500 enabled:hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-300'
              aria-label={`Increase ${item.title} quantity`}
            >
              <Plus className='size-4' />
            </button>
            <button
              type='button'
              onClick={onRemove}
              className='h-8 rounded-[8px] border border-error-200 bg-error-50 px-2.5 text-xs font-medium text-error-700 hover:bg-error-100 transition-colors duration-300'
            >
              Remove
            </button>
          </>
        ) : (
          <button
            type='button'
            onClick={onAdd}
            className='h-8 rounded-[8px] border border-primary-200 bg-primary-50 px-3 text-xs font-medium text-primary-700 hover:bg-primary-100 transition-colors duration-300'
          >
            Add
          </button>
        )}
      </div>
      <p className='hidden md:block mt-0 pl-0 text-center leading-[140%] font-medium text-grey-900'>
        {formatCurrency(item.price, {
          currency,
          maximumFractionDigits: 0,
        })}
      </p>
    </div>
  )
}
