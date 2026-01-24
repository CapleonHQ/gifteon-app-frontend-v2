'use client'

import Image from 'next/image'
import Link from 'next/link'

type OnboardingLogoProps = {
  linkClassName?: string
  wrapperClassName?: string
  imageClassName?: string
}

const OnboardingLogo = ({
  linkClassName,
  wrapperClassName = 'w-[146px] h-[60px] flex items-center justify-center',
  imageClassName = 'w-full h-full',
}: OnboardingLogoProps) => {
  return (
    <Link href='/' className={linkClassName}>
      <div className={wrapperClassName}>
        <Image
          src='/assets/images/logo/logo.svg'
          alt='Giftseon'
          className={imageClassName}
          width={200}
          height={80}
        />
      </div>
    </Link>
  )
}

export default OnboardingLogo
