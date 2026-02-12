import { TEMPLATES } from '@/lib/config/templates/selection'
import TemplateCard from './TemplateCard'

type TemplateGridProps = {
  selectedTemplate: string | null
  onTemplateSelect: (id: string) => void
}

const TemplateGrid = ({
  selectedTemplate,
  onTemplateSelect,
}: TemplateGridProps) => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8'>
      {TEMPLATES.map((template) => (
        <TemplateCard
          key={template.id}
          layout={template.layout}
          isSelected={selectedTemplate === template.id}
          onSelect={() => onTemplateSelect(template.id)}
        />
      ))}
    </div>
  )
}

export default TemplateGrid
