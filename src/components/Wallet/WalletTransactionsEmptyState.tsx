'use client'

import EmptyBox from '@/assets/icons/EmptyBox'
import Image from 'next/image'

const WalletTransactionsEmptyState = () => {
  return (
    <div className='py-16 lg:py-24 flex flex-col items-center justify-center gap-4 text-center'>
      <div className='w-[82px] h-[46px]'>
        <Image
          src='/assets/images/wallet-empty.svg'
          alt='wallet empty'
          width={200}
          height={100}
        />
      </div>
      <div>
        <p className='text-xl font-medium text-blackish'>
          No transactions yet!
        </p>
        <p className='text-sm text-grey-600 mt-2'>
          Your wallet activity will show up here.
        </p>
      </div>
    </div>
  )
}

export default WalletTransactionsEmptyState
