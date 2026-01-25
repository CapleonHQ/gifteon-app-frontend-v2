'use client'

import { ChevronLeftIcon } from '@/assets/icons'
import { useMobileBack } from './MobileTitleContext'
import BackLeftIcon from '@/assets/icons/BackLeftIcon'

const MobileTitleBar = ({ title }: { title: string }) => {
  const { onBack } = useMobileBack()

  return (
    <div className='lg:hidden flex items-center gap-2'>
      {onBack && (
        <button
          type='button'
          onClick={onBack}
          className='w-6 h-6'
          aria-label='Go back'
        >
          <span className='text-blackish hover:text-black/70 flex'>
            <BackLeftIcon />
          </span>
        </button>
      )}
      <h1 className='text-blackish text-2xl leading-[127%] font-medium'>
        {title}
      </h1>
    </div>
  )
}

export default MobileTitleBar
