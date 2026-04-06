import CashIcon from '@/assets/icons/CashIcon'
import { Minus, Plus } from 'lucide-react'
import type { GiftOption } from './types'
import { DEFAULT_GIFT_IMAGE } from './utils'
import { formatCurrency } from '@/lib/utils/currency'

type GiftItemRowProps = {
  item: GiftOption
  currency: string
  quantity: number
  showControls: boolean
  maxQuantity?: number
  onDecrease?: () => void
  onIncrease?: () => void
  onRemove?: () => void
}

export default function GiftItemRow({
  item,
  currency,
  quantity,
  showControls,
  maxQuantity,
  onDecrease,
  onIncrease,
  onRemove,
}: GiftItemRowProps) {
  const isCashGift = item.kind === 'cash'
  const raisedAmount = Math.max(0, item.raisedAmount ?? 0)
  const targetAmount = Math.max(0, item.targetAmount ?? item.price)
  const cashProgress = Math.min(
    (raisedAmount / Math.max(targetAmount, raisedAmount, 1)) * 100,
    100
  )
  const lineAmount = isCashGift ? targetAmount : item.price * quantity

  return (
    <div className='flex justify-between items-end gap-2 border-b border-grey-50 last:border-b-0 pb-4 last:pb-0'>
      <div className='flex gap-2 w-full'>
        {isCashGift ? (
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
          <p className='truncate text-sm leading-[120%] text-grey-600'>{item.title}</p>

          {isCashGift ? (
            <div>
              <p className='text-xs leading-[119%] text-grey-600 font-medium'>
                {formatCurrency(raisedAmount, {
                  currency,
                  maximumFractionDigits: 0,
                })}{' '}
                raised of{' '}
                {formatCurrency(targetAmount, {
                  currency,
                  maximumFractionDigits: 0,
                })}
              </p>
              <div className='mt-1 h-2 w-full rounded-full bg-grey-50/50 overflow-hidden'>
                <div
                  className='h-full bg-primary-300 transition-all duration-300'
                  style={{ width: `${Math.max(cashProgress, 1)}%` }}
                />
              </div>
            </div>
          ) : showControls ? (
            <div className='flex items-center gap-2'>
              <button
                type='button'
                onClick={onDecrease}
                className='flex h-8 w-8 items-center justify-center rounded-[6px] border border-primary-100 bg-primary-50/60 text-primary-500 enabled:hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed'
                disabled={quantity <= 1}
                aria-label={`Decrease ${item.title} quantity`}
              >
                <Minus className='size-4' />
              </button>
              <span className='w-6 text-center text-base leading-5 text-grey-700'>
                {quantity}
              </span>
              <button
                type='button'
                onClick={onIncrease}
                className='flex h-8 w-8 items-center justify-center rounded-[6px] border border-primary-100 bg-primary-50/60 text-primary-500 enabled:hover:bg-primary-50'
                disabled={typeof maxQuantity === 'number' && quantity >= maxQuantity}
                aria-label={`Increase ${item.title} quantity`}
              >
                <Plus className='size-4' />
              </button>
            </div>
          ) : (
            <p className='text-xs leading-[119%] text-grey-600 font-medium'>
              Qty: {quantity}
            </p>
          )}
        </div>
      </div>

      <div className='shrink-0 text-right'>
        <p className='text-base leading-[140%] font-medium text-grey-900'>
          {formatCurrency(lineAmount, {
            currency,
            maximumFractionDigits: 0,
          })}
        </p>
        {onRemove ? (
          <button
            type='button'
            onClick={onRemove}
            className='mt-1 text-xs text-error-300 hover:text-error-500'
          >
            Remove
          </button>
        ) : null}
      </div>
    </div>
  )
}
