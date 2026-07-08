import { renderSelectionTemplate } from '@/lib/config/templates/registry'
import type { TemplateLayout } from '@/lib/config/templates/types'

type TemplateCardProps = {
  layout: TemplateLayout
  isSelected: boolean
  onSelect: () => void
}

const TemplateCard = ({ layout, isSelected, onSelect }: TemplateCardProps) => {
  return (
    <div
      className='relative cursor-pointer transition-all'
      onClick={onSelect}
    >
      {isSelected && (
        <div className='absolute -top-1.5 -right-1 w-5 h-5 bg-success-400 rounded-full flex items-center justify-center z-10'>
          <svg
            className='w-4 h-4 text-white'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={3}
              d='M5 13l4 4L19 7'
            />
          </svg>
        </div>
      )}

      <div
        className={`relative overflow-hidden border bg-white w-full h-full rounded-2xl cursor-pointer ${
          isSelected
            ? 'border-success-400 shadow-[0px_1.5px_4px_-1px_#10192812]'
            : 'border-grey-50 hover:border-grey-200'
        }`}
      >
        {renderSelectionTemplate(layout)}
      </div>
    </div>
  )
}

export default TemplateCard
