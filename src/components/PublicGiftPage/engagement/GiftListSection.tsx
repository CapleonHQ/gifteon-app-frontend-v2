import GiftHandIcon from '@/assets/icons/diagrams/GiftHandIcon'
import CashIcon from '@/assets/icons/CashIcon'
import GiftRow from './GiftRow'
import type { GiftOption } from './types'
import DeleteIcon from '@/assets/icons/DeleteIcon'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

type GiftListSectionProps = {
  receiverName: string
  currency: string
  gifts: GiftOption[]
  selectedGiftItems: GiftOption[]
  selectedGiftIds: Record<string, boolean>
  giftQuantities: Record<string, number>
  onSelectGift: (giftId: string, checked: boolean) => void
  onChangeGiftQuantity: (giftId: string, direction: 'inc' | 'dec') => void
  onSendCustomGift: () => void
}

export default function GiftListSection({
  receiverName,
  currency,
  gifts,
  selectedGiftItems,
  selectedGiftIds,
  giftQuantities,
  onSelectGift,
  onChangeGiftQuantity,
  onSendCustomGift,
}: GiftListSectionProps) {
  const cashGift = gifts.find((item) => item.kind === 'cash')
  const nonCashGifts = gifts.filter((item) => item.kind !== 'cash')
  const hasSelectedItems = selectedGiftItems.length > 0

  const renderGiftRow = (item: GiftOption) => (
    <GiftRow
      key={item.id}
      item={item}
      isSelected={Boolean(selectedGiftIds[item.id])}
      quantity={giftQuantities[item.id] ?? 1}
      onSelect={(checked) => onSelectGift(item.id, Boolean(checked))}
      onDecrease={() => onChangeGiftQuantity(item.id, 'dec')}
      onIncrease={() => onChangeGiftQuantity(item.id, 'inc')}
      currency={currency}
    />
  )

  return (
    <div className={`mt-10 lg:mt-7 ${hasSelectedItems ? 'pb-28' : ''}`}>
      <h3 className='text-xl lg:text-2xl leading-6 lg:leading-8 font-medium text-blackish'>
        {receiverName}&apos;s Gift List
      </h3>
      <p className='mt-1 text-sm leading-5 text-grey-800'>
        Select the gifts you&apos;d like to purchase
      </p>

      <div className='mt-4 overflow-hidden rounded-[10px] border border-grey-50 bg-white pb-2 shadow-[0px_10px_18px_-2px_#10192812]'>
        <div className='hidden md:grid grid-cols-[minmax(0,1fr)_140px_140px] gap-3 border-b border-grey-50/40 bg-grey-50/20 pr-5 py-[18px] leading-[125%] font-medium tracking-[-2%] text-grey-700'>
          <div className='pl-4 flex items-center gap-3'>
            <span className='w-5 h-5' />
            <span>Gift</span>
          </div>
          <span className='text-center'>Quantity</span>
          <span className='text-center'>Price</span>
        </div>

        {gifts.length == 0 ? (
          <div className='px-4 py-10 text-center text-sm text-grey-500'>
            No gift options added yet.
          </div>
        ) : (
          <div className='flex flex-col mt-2 md:mt-0'>
            {cashGift ? renderGiftRow(cashGift) : null}
            {nonCashGifts.map(renderGiftRow)}
          </div>
        )}
      </div>

      <div className='mt-4 flex flex-col gap-4 rounded-[10px] bg-white border border-grey-50 px-4 py-4 md:flex-row md:items-center md:justify-between'>
        <div className='flex items-center gap-3'>
          <div className='flex h-15 md:h-[72px] w-15 md:w-[72px] rounded-full bg-[#F5EFE6] relative justify-center overflow-hidden shrink-0'>
            <span className='absolute bottom-0 w-[45px] md:w-[54px] h-[46px] md:h-[56px]'>
              <GiftHandIcon />
            </span>
          </div>
          <div>
            <p className='md:text-xl leading-[140%] font-medium text-grey-900'>
              Still not sure what to send?
            </p>
            <p className='text-xs md:text-sm leading-[120%] text-grey-600 mt-1.5'>
              You can pick your own gift, get AI recommendations, or send cash
              directly.
            </p>
          </div>
        </div>

        <button
          type='button'
          onClick={onSendCustomGift}
          className='w-[140px] rounded-[12px] bg-linear-to-b from-primary-400 from-17% to-primary-600 py-2 text-sm font-medium text-white hover:from-primary-500 hover:to-primary-700 transition-colors duration-300'
        >
          Send Custom Gift
        </button>
      </div>

      {hasSelectedItems ? (
        <div className='fixed inset-x-0 bottom-0 z-50 bg-white shadow-[0px_-10px_18px_5px_#9494941C]'>
          <div className='mx-auto flex w-full max-w-[1084px] flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between md:px-20 md:py-4'>
            <TooltipProvider delayDuration={150}>
              <div className='flex flex-nowrap items-center gap-3 overflow-x-auto pr-1'>
                {selectedGiftItems.map((item) => (
                  <div
                    key={item.id}
                    className='grid grid-cols-[24px_4px_minmax(0,1fr)_8px_14px] items-center w-[120px] shrink-0 rounded-[6px] bg-grey-50/20 pl-3 pr-1 py-2 shadow-[inset_0_0_2px_0_#AAAAAA40] overflow-hidden'
                  >
                    {item.kind === 'cash' ? (
                      <span className='flex h-6 w-6 p-0.5 rounded-[2px] items-center justify-center bg-primary-50 text-primary-700'>
                        <CashIcon />
                      </span>
                    ) : (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className='h-6 w-6 rounded-[2px] object-cover'
                      />
                    )}
                    <span aria-hidden />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className='min-w-0 font-medium truncate text-sm text-grey-900'>
                          {item.title}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side='top'>{item.title}</TooltipContent>
                    </Tooltip>
                    <span aria-hidden />
                    <button
                      type='button'
                      onClick={() => onSelectGift(item.id, false)}
                      className='w-3.5 h-3.5 bg-error-50 border-[0.7px] border-white rounded-full text-error-300 hover:text-error-500 shrink-0 flex items-center justify-center'
                      aria-label={`Remove ${item.title}`}
                    >
                      <span className='w-[7px] h-[7px]'>
                        <DeleteIcon />
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </TooltipProvider>
            <button
              type='button'
              className='h-10 min-w-[180px] rounded-[12px] bg-linear-to-b from-primary-400 to-primary-600 px-6 text-sm font-medium text-white hover:from-primary-500 hover:to-primary-700 transition-colors duration-300'
            >
              Check Out
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
