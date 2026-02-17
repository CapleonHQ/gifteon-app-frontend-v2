import type { StepType } from './steps'

interface StepCardProps {
  step: StepType[number]
}

const StepCard = ({ step }: StepCardProps) => {
  const Icon = step.icon

  return (
    <article className='w-full lg:max-w-[400px] flex flex-col gap-5 relative'>
      <div className='absolute top-5 lg:top-6 right-[7px] lg:right-0'>
        <Icon />
      </div>
      <span className='inline-flex h-15 w-15 items-center justify-center rounded-full bg-white shadow-[0px_10px_18px_-2px_#10192812] text-2xl font-medium leading-8 text-primary-900'>
        {step.number}
      </span>
      <div>
        <h5 className='text-primary-900 text-xl lg:text-2xl leading-7 lg:leading-8 font-medium'>
          {step.title}
        </h5>
        <p className='text-sm lg:text-base mt-1.5 text-grey-700 leading-[22px] lg:leading-6'>
          {step.description}
        </p>
      </div>
    </article>
  )
}

export default StepCard
