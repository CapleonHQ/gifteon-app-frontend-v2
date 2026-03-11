'use client'

import DocumentIcon from '@/assets/icons/DocumentIcon'
import KeyboardRightIcon from '@/assets/icons/KeyboardRightIcon'

type WalletPendingWithdrawalsBannerProps = {
  count: number
  onOpen: () => void
}

const WalletPendingWithdrawalsBanner = ({
  count,
  onOpen,
}: WalletPendingWithdrawalsBannerProps) => {
  return (
    <button
      type='button'
      onClick={onOpen}
      className='flex-1 mx-4 lg:mx-0 group relative flex items-stretch overflow-hidden rounded-[12px] border border-primary-300 bg-primary-400 text-left shadow-[0px_18px_30px_-18px_#1818AB66] transition-colors duration-300 hover:bg-primary-500'
    >
      <div
        className='absolute inset-0 opacity-25'
        style={{
          backgroundImage:
            'radial-gradient(circle at 24% 50%, rgba(255,255,255,0.16), transparent 30%), repeating-radial-gradient(circle at 22% 50%, rgba(255,255,255,0.11) 0 1px, transparent 1px 16px)',
          backgroundSize: 'auto, auto',
          backgroundPosition: '0 0, 0 0',
        }}
      />

      <div className='relative flex min-w-0 flex-1 items-center px-4 py-4 md:px-5'>
        <div className='absolute left-0 top-1/2 h-24 w-24 -translate-y-1/2 text-primary-200/45 md:left-1 md:h-28 md:w-28'>
          <DocumentIcon />
        </div>

        <div className='relative min-w-0 flex-1'>
          <p className='text-base font-semibold text-white md:text-lg'>
            {count === 1
              ? 'Your withdrawal is under review'
              : `${count} withdrawals are under review`}
          </p>
        </div>
      </div>

      <div className='relative flex shrink-0 items-center justify-center px-4'>
        <div className='absolute inset-0 opacity-20'>
          <div
            className='h-full w-full'
            style={{
              backgroundImage:
                'repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0 1px, transparent 1px 14px)',
            }}
          />
        </div>
        <div className='relative flex h-10 w-10 items-center justify-center rounded-full bg-black/10 text-white shadow-[0px_10px_20px_-14px_#1818AB66] transition-transform duration-300 group-hover:scale-[1.04]'>
          <span className='h-5 w-5'>
            <KeyboardRightIcon />
          </span>
        </div>
      </div>
    </button>
  )
}

export default WalletPendingWithdrawalsBanner
