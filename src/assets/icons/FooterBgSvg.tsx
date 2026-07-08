import React from 'react'
import Image from 'next/image'

type FooterBgSvgProps = {
  className?: string
}

const FooterBgSvg = ({ className }: FooterBgSvgProps) => {
  return (
    <Image
      src='/assets/images/footer/footer-bg-texture.svg'
      alt=''
      aria-hidden
      width={4000}
      height={460}
      className={className ?? 'h-full w-full object-cover'}
    />
  )
}

export default FooterBgSvg
