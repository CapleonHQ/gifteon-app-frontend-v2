import GiftHandIcon from '@/assets/icons/diagrams/GiftHandIcon'
import GiftRow from './GiftRow'
import type { GiftOption } from './types'

type GiftListSectionProps = {
  receiverName: string
  currency: string
  gifts: GiftOption[]
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
  selectedGiftIds,
  giftQuantities,
  onSelectGift,
  onChangeGiftQuantity,
  onSendCustomGift,
}: GiftListSectionProps) {
  return (
    <div className='mt-10 lg:mt-7'>
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
            {gifts.map((item) => (
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
            ))}
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
              Looking for something more?
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
    </div>
  )
}
