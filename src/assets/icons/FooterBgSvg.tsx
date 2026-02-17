import React from 'react'

type FooterBgSvgProps = {
  className?: string
}

const FooterBgSvg = ({ className }: FooterBgSvgProps) => {
  return (
    <svg
      className={className}
      width='100%'
      height='100%'
      viewBox='0 0 4000 460'
      preserveAspectRatio='xMidYMid slice'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <g filter='url(#filter0_g_3652_2084)'>
        <rect
          x='-28.2305'
          y='32'
          width='4096.46'
          height='892.854'
          fill='currentColor'
        />
      </g>
      <defs>
        <filter
          id='filter0_g_3652_2084'
          x='-60.2305'
          y='0'
          width='4060.46'
          height='1016.854'
          filterUnits='userSpaceOnUse'
          colorInterpolationFilters='sRGB'
        >
          <feFlood floodOpacity='0' result='BackgroundImageFix' />
          <feBlend
            mode='normal'
            in='SourceGraphic'
            in2='BackgroundImageFix'
            result='shape'
          />
          <feTurbulence
            type='fractalNoise'
            baseFrequency='0.097087375819683075 0.097087375819683075'
            numOctaves='3'
            seed='3574'
          />
          <feDisplacementMap
            in='shape'
            scale='64'
            xChannelSelector='R'
            yChannelSelector='G'
            result='displacedImage'
            width='100%'
            height='100%'
          />
          <feMerge result='effect1_texture_3652_2084'>
            <feMergeNode in='displacedImage' />
          </feMerge>
        </filter>
      </defs>
    </svg>
  )
}

export default FooterBgSvg
