import { useEffect, useMemo, useState } from 'react'
import CloseIcon from '@/assets/icons/CloseIcon'
import SuccessConfetti from '@/components/common/SuccessConfetti'
import Link from 'next/link'
import type { GiftOption } from './types'
import GiftItemRow from './GiftItemRow'

type SuccessModalProps = {
  isOpen: boolean
  onClose: () => void
  onBuyGift: (giftIds: string[]) => void
  owner: { firstName: string; lastName: string; gender: 'male' | 'female' }
  giftItems: GiftOption[]
  giftQuantities: Record<string, number>
  onChangeGiftQuantity: (giftId: string, direction: 'inc' | 'dec') => void
  currency: string
}

export default function SuccessModal({
  isOpen,
  onClose,
  onBuyGift,
  owner,
  giftItems,
  giftQuantities,
  onChangeGiftQuantity,
  currency,
}: SuccessModalProps) {
  const [removedGiftIds, setRemovedGiftIds] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  const visibleGiftItems = useMemo(
    () => giftItems.filter((item) => !removedGiftIds[item.id]),
    [giftItems, removedGiftIds]
  )

  const handleDismiss = () => {
    setRemovedGiftIds({})
    onClose()
  }

  const handleBuyGift = () => {
    const giftIds = visibleGiftItems.map((item) => item.id)
    onBuyGift(giftIds)
    setRemovedGiftIds({})
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center px-4'>
      <button
        type='button'
        className='absolute inset-0 bg-black/40 backdrop-blur-sm'
        onClick={handleDismiss}
        aria-label='Close success modal overlay'
      />

      <div className='relative z-10 flex max-h-[calc(100dvh-2rem)] w-full max-w-[522px] flex-col overflow-hidden rounded-[20px] bg-white p-6 shadow-[0px_24px_60px_-20px_#10192852] lg:px-[50px] lg:py-12'>
        <button
          type='button'
          onClick={handleDismiss}
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
            Your wishes for {owner?.firstName || owner?.lastName} have been
            sent.
          </p>
          <p className='text-sm text-grey-600'>
            You can also buy a gift from{' '}
            {owner?.gender === 'male' ? 'his' : 'her'} list or surprise{' '}
            {owner?.gender === 'male' ? 'him' : 'her'} with something you
            choose.
          </p>
        </div>

        <div className='mt-4 flex-1 overflow-y-auto overscroll-contain'>
          <div className='overflow-hidden rounded-[8px] border border-grey-50 shadow-[0px_1.5px_4px_-1px_#10192812] py-4 px-3 flex flex-col gap-4'>
            {visibleGiftItems.length > 0 ? (
              visibleGiftItems.map((item) => (
                <GiftItemRow
                  key={item.id}
                  item={item}
                  currency={currency}
                  quantity={
                    item.kind === 'cash'
                      ? 1
                      : giftQuantities[item.id] ?? item.quantity
                  }
                  showControls={item.kind !== 'cash'}
                  maxQuantity={item.kind === 'cash' ? 1 : item.quantity}
                  onDecrease={
                    item.kind === 'cash'
                      ? undefined
                      : () => onChangeGiftQuantity(item.id, 'dec')
                  }
                  onIncrease={
                    item.kind === 'cash'
                      ? undefined
                      : () => onChangeGiftQuantity(item.id, 'inc')
                  }
                  onRemove={
                    visibleGiftItems.length > 1
                      ? () =>
                          setRemovedGiftIds((prev) => ({
                            ...prev,
                            [item.id]: true,
                          }))
                      : undefined
                  }
                />
              ))
            ) : (
              <div className='px-4 py-6 text-center text-sm text-grey-500'>
                No gift items left for payment.
              </div>
            )}
          </div>
        </div>

        <div className='mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2'>
          <Link
            href='/gifts/create-new'
            className='inline-flex h-12 items-center justify-center rounded-[14px] border border-grey-200 bg-grey-50 px-4 text-sm font-medium text-grey-800 hover:bg-grey-100 transition-colors duration-300 order-2 sm:order-1'
          >
            Create a Gift Page
          </Link>
          <button
            type='button'
            onClick={handleBuyGift}
            disabled={visibleGiftItems.length === 0}
            className='inline-flex h-12 items-center justify-center rounded-[14px] bg-linear-to-b from-primary-400 to-primary-600 px-4 text-sm font-medium text-white hover:from-primary-500 hover:to-primary-700 transition-colors duration-300 order-1 sm:order-2'
          >
            Buy a Gift
          </button>
        </div>
      </div>
    </div>
  )
}
