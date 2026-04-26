import type { ApiTemplateOption } from '@/lib/config/templates/types'
import TemplateCard from './TemplateCard'

type TemplateGridProps = {
  templates: ApiTemplateOption[]
  selectedTemplate: string | null
  onTemplateSelect: (id: string, layout: ApiTemplateOption['layout']) => void
}

const TemplateGrid = ({
  templates,
  selectedTemplate,
  onTemplateSelect,
}: TemplateGridProps) => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8'>
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          layout={template.layout}
          isSelected={selectedTemplate === template.id}
          onSelect={() => onTemplateSelect(template.id, template.layout)}
        />
      ))}
    </div>
  )
}

export default TemplateGrid
