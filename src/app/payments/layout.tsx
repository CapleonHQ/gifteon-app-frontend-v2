import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'

const PaymentsLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='min-h-screen bg-base-bg flex flex-col'>
      <header className='border-b border-grey-100 bg-white/90 backdrop-blur-[2px]'>
        <div className='mx-auto flex w-full max-w-[1200px] items-center px-4 py-4 sm:px-6 lg:px-8'>
          <Link href='/' className='inline-flex h-10 w-[124px] items-center'>
            <Image
              src='/assets/images/logo/logo.svg'
              alt='Giftseon'
              width={124}
              height={40}
              priority
            />
          </Link>
        </div>
      </header>

      <div className='flex-1'>{children}</div>

      <footer className='border-t border-grey-100 bg-[#143535]'>
        <div className='mx-auto w-full max-w-[1200px] px-4 py-4 text-center text-sm leading-6 text-white sm:px-6 lg:px-8'>
          &copy; {new Date().getFullYear()} Giftseon. Made with ❤️ for
          celebrations worldwide.
        </div>
      </footer>
    </div>
  )
}

export default PaymentsLayout
