import CashIcon from '@/assets/icons/CashIcon'
import ShakeOnError from '@/components/common/ShakeOnError'
import { formatCurrency } from '@/lib/utils/currency'
import GiftItemRow from '../GiftItemRow'
import type { GiftOption } from '../types'
import { formatAmountDigits, getDefaultCashAmount } from './helpers'

type ReviewStepContentProps = {
  selectedGiftItems: GiftOption[]
  giftQuantities: Record<string, number>
  currency: string
  cashAmountInputs: Record<string, string>
  cashAmountErrors: Record<string, string>
  onCashAmountChange: (item: GiftOption, raw: string) => void
  onChangeGiftQuantity: (giftId: string, direction: 'inc' | 'dec') => void
  giftsTotal: number
  serviceCharge: number
  total: number
}

export default function ReviewStepContent({
  selectedGiftItems,
  giftQuantities,
  currency,
  cashAmountInputs,
  cashAmountErrors,
  onCashAmountChange,
  onChangeGiftQuantity,
  giftsTotal,
  serviceCharge,
  total,
}: ReviewStepContentProps) {
  return (
    <>
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
                          onCashAmountChange(item, event.target.value)
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
          <p className='text-sm leading-5 text-[#143535]'>Service charge:</p>
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
    </>
  )
}
