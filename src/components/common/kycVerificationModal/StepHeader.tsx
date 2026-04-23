import CloseIcon from '@/assets/icons/CloseIcon'
import BackLeftIcon from '@/assets/icons/BackLeftIcon'

const ProgressBar = ({
  current,
  total = 3,
}: {
  current: number
  total?: number
}) => (
  <div className='flex gap-1.5 w-full'>
    {Array.from({ length: total }, (_, i) => i + 1).map((index) => (
      <div
        key={index}
        className={`h-2 flex-1 rounded-[10px] transition-colors duration-300 ${
          current >= index ? 'bg-secondary-500' : 'bg-grey-50'
        }`}
      />
    ))}
  </div>
)

type StepHeaderProps = {
  title: string
  subtitle?: string
  progressCurrent?: number
  progressTotal?: number
  onClose: () => void
  onMobileBack?: () => void
}

const StepHeader = ({
  title,
  subtitle,
  progressCurrent,
  progressTotal,
  onClose,
  onMobileBack,
}: StepHeaderProps) => {
  return (
    <div className='relative'>
      <button
        type='button'
        onClick={onClose}
        className='absolute -right-5 -top-5 w-9 h-9 rounded-full hidden lg:flex items-center justify-center hover:bg-grey-50'
        aria-label='Close'
      >
        <span className='text-grey-700 w-5 h-5'>
          <CloseIcon />
        </span>
      </button>
      <div className='lg:hidden flex items-center gap-2'>
        <button
          type='button'
          onClick={onMobileBack ?? onClose}
          className='w-6 h-6'
          aria-label='Go back'
        >
          <span className='text-blackish flex'>
            <BackLeftIcon />
          </span>
        </button>
      </div>

      <div className='text-center mt-4 lg:mt-0'>
        <h3 className='text-2xl font-medium text-blackish'>{title}</h3>
        {subtitle ? <p className='text-sm text-grey-600 mt-1'>{subtitle}</p> : null}
        {progressCurrent ? (
          <div className='w-full mt-5'>
            <ProgressBar current={progressCurrent} total={progressTotal} />
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default StepHeader
