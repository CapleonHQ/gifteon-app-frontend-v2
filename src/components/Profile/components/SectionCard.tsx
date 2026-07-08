import type { ReactNode } from 'react'

type SectionCardProps = {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
}

const SectionCard = ({
  title,
  description,
  action,
  children,
}: SectionCardProps) => {
  return (
    <div className='bg-white border border-grey-50 rounded-[12px]'>
      <div className='flex items-center justify-between gap-3 px-3 lg:px-6 pt-3 lg:pt-6 pb-3'>
        <div>
          <h3 className='text-xl leading-6 font-medium text-blackish'>
            {title}
          </h3>
          {description && (
            <p className='text-xs leading-[18px] text-grey-700 mt-1'>
              {description}
            </p>
          )}
        </div>

        {action}
      </div>
      {children}
    </div>
  )
}

export default SectionCard
