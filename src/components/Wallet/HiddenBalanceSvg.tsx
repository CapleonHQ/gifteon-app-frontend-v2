type HiddenBalanceSvgProps = {
  className?: string
}

const HiddenBalanceSvg = ({ className = 'text-grey-300/90' }: HiddenBalanceSvgProps) => (
  <span className={`inline-flex h-8 w-[132px] items-center ${className}`}>
    <svg
      width='100%'
      height='100%'
      viewBox='0 0 132 32'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden='true'
    >
      <g stroke='currentColor' strokeWidth='2.2' strokeLinecap='round'>
        <path d='M10 10V22M5 13.5L15 18.5M15 13.5L5 18.5' />
        <path d='M34 10V22M29 13.5L39 18.5M39 13.5L29 18.5' />
        <path d='M58 10V22M53 13.5L63 18.5M63 13.5L53 18.5' />
        <path d='M82 10V22M77 13.5L87 18.5M87 13.5L77 18.5' />
        <path d='M106 10V22M101 13.5L111 18.5M111 13.5L101 18.5' />
      </g>
    </svg>
  </span>
)

export default HiddenBalanceSvg
