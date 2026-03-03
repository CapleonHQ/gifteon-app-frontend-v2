import { Checkbox } from '@/components/ui/checkbox'
import type { GiftOption } from './types'
import { DEFAULT_GIFT_IMAGE, formatCurrency } from './utils'
import { Minus, Plus } from 'lucide-react'

type GiftRowProps = {
  item: GiftOption
  isSelected: boolean
  quantity: number
  currency: string
  onSelect: (checked: boolean) => void
  onDecrease: () => void
  onIncrease: () => void
}

export default function GiftRow({
  item,
  isSelected,
  quantity,
  currency,
  onSelect,
  onDecrease,
  onIncrease,
}: GiftRowProps) {
  const progressDenominator = Math.max(item.quantity, 1)
  const progress = Math.min(item.fulfilled / progressDenominator, 1)

  return (
    <div className='border-b border-grey-50 px-3 py-2 last:border-b-0 md:grid md:grid-cols-[minmax(0,1fr)_140px_140px] md:items-center md:gap-4 md:pl-4 md:pr-5 md:pt-2 md:pb-3.5'>
      <div className='min-w-0'>
        <div className='flex items-center gap-2 md:gap-3'>
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelect}
            className='size-4 md:size-5 rounded-sm'
          />

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
                  {Math.min(item.fulfilled, item.quantity)} of {item.quantity}{' '}
                  fulfilled
                </p>
                <p>{Number((progress * 100).toFixed(2))}%</p>
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
          {formatCurrency(item.price, currency)}
        </p>
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
        </div>
      </div>

      <p className='hidden md:block mt-0 pl-0 text-center leading-[140%] font-medium text-grey-900'>
        {formatCurrency(item.price, currency)}
      </p>

      <div className='hidden md:flex md:mt-0 md:items-center md:justify-center md:gap-2 md:p-3 md:pr-0'>
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
      </div>
    </div>
  )
}
