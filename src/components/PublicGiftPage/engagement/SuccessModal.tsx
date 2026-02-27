import CloseIcon from '@/assets/icons/CloseIcon'
import SuccessConfetti from '@/components/common/SuccessConfetti'
import Link from 'next/link'
import type { GiftOption } from './types'
import { DEFAULT_GIFT_IMAGE, formatCurrency } from './utils'

type SuccessModalProps = {
  isOpen: boolean
  onClose: () => void
  receiverName: string
  selectedGiftItems: GiftOption[]
  giftQuantities: Record<string, number>
  currency: string
}

export default function SuccessModal({
  isOpen,
  onClose,
  receiverName,
  selectedGiftItems,
  giftQuantities,
  currency,
}: SuccessModalProps) {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center px-4'>
      <button
        type='button'
        className='absolute inset-0 bg-black/40 backdrop-blur-sm'
        onClick={onClose}
        aria-label='Close success modal overlay'
      />

      <div className='relative z-10 w-full max-w-[620px] rounded-[24px] bg-white p-6 shadow-[0px_24px_60px_-20px_#10192852] lg:p-8'>
        <button
          type='button'
          onClick={onClose}
          className='absolute right-4 top-4 flex h-8 w-8 items-center justify-center text-grey-500 hover:text-grey-700'
          aria-label='Close success modal'
        >
          <span className='h-4 w-4'>
            <CloseIcon />
          </span>
        </button>

        <div className='mx-auto mb-2 h-20 w-20'>
          <SuccessConfetti />
        </div>

        <div className='text-center'>
          <h3 className='text-[36px] leading-none font-medium text-blackish'>Success!</h3>
          <p className='mt-2 text-sm text-grey-600'>
            Your wishes for {receiverName} have been sent.
          </p>
          <p className='text-sm text-grey-600'>
            You can also buy a gift from her list or surprise her with something you choose.
          </p>
        </div>

        {selectedGiftItems.length > 0 ? (
          <div className='mt-6 overflow-hidden rounded-[14px] border border-grey-100'>
            {selectedGiftItems.map((item) => (
              <div
                key={item.id}
                className='grid grid-cols-[56px_minmax(0,1fr)_120px_96px] items-center gap-3 border-t border-grey-50 p-3 first:border-t-0'
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl || DEFAULT_GIFT_IMAGE}
                  alt={item.title}
                  className='h-12 w-12 rounded-[8px] border border-grey-100 object-cover'
                />
                <p className='truncate text-sm text-grey-700'>{item.title}</p>
                <div className='flex items-center justify-center gap-2'>
                  <span className='flex h-7 w-7 items-center justify-center rounded-[8px] border border-primary-100 text-primary-400'>
                    -
                  </span>
                  <span className='text-sm text-grey-700'>{giftQuantities[item.id] ?? 1}</span>
                  <span className='flex h-7 w-7 items-center justify-center rounded-[8px] border border-primary-100 text-primary-400'>
                    +
                  </span>
                </div>
                <p className='text-right text-lg font-medium text-blackish'>
                  {formatCurrency(item.price, currency)}
                </p>
              </div>
            ))}
          </div>
        ) : null}

        <div className='mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2'>
          <Link
            href='/gifts/create-new'
            className='inline-flex h-12 items-center justify-center rounded-[14px] border border-grey-200 bg-grey-50 px-4 text-sm font-medium text-grey-800 hover:bg-grey-100'
          >
            Create a Gift Page
          </Link>
          <button
            type='button'
            onClick={onClose}
            className='inline-flex h-12 items-center justify-center rounded-[14px] bg-linear-to-b from-primary-400 to-primary-600 px-4 text-sm font-medium text-white hover:from-primary-500 hover:to-primary-700'
          >
            Buy a Gift
          </button>
        </div>
      </div>
    </div>
  )
}
