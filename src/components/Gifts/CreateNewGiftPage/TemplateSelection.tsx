import { motion } from 'framer-motion'

import TemplateSelectionHeader from './TemplateSelectionHeader'
import TemplateGrid from './TemplateGrid'
import TemplateSelectionFooter from './TemplateSelectionFooter'

const TemplateSelection = ({
  selectedTemplate,
  selectedCategoryName,
  onTemplateSelect,
  onContinue,
  onBack,
}: {
  selectedTemplate: string | null
  selectedCategoryName?: string
  onTemplateSelect: (id: string) => void
  onContinue: () => void
  onBack?: () => void
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='w-full pb-10'
    >
      <TemplateSelectionHeader
        selectedCategoryName={selectedCategoryName}
        onBack={onBack}
      />
      <TemplateGrid
        selectedTemplate={selectedTemplate}
        onTemplateSelect={onTemplateSelect}
      />
      <TemplateSelectionFooter
        canContinue={Boolean(selectedTemplate)}
        onContinue={onContinue}
        ctaLabel='Continue to Customization'
      />
    </motion.div>
  )
}

export default TemplateSelection
