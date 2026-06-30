import Link from 'next/link'
import Image from 'next/image'
import CloseIcon from '@/assets/icons/CloseIcon'
import BackLeftIcon from '@/assets/icons/BackLeftIcon'
import type { CheckoutStep } from './types'

type ConfirmationHeaderProps = {
  step: CheckoutStep
  onClose: () => void
  onBack: () => void
}

export default function ConfirmationHeader({
  step,
  onClose,
  onBack,
}: ConfirmationHeaderProps) {
  const title = step === 'review' ? 'Confirmation' : 'Payment Method'
  const subtitle = (() => {
    if (step === 'review') {
      return 'This gift will be delivered as its cash equivalent.'
    }
    if (step === 'pin') {
      return 'Provide your account PIN to move forward'
    }
    return 'Review your final summary and choose how to pay.'
  })()
  const resolvedTitle = step === 'pin' ? 'Confirmation' : title

  return (
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
          onClick={onBack}
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
          {resolvedTitle}
        </h3>
        <p className='text-sm leading-[18px] text-grey-700 mt-1'>{subtitle}</p>
      </div>
    </div>
  )
}
