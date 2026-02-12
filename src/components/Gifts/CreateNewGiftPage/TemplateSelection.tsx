import { motion } from 'framer-motion'

import TemplateSelectionHeader from './TemplateSelectionHeader'
import TemplateGrid from './TemplateGrid'
import TemplateSelectionFooter from './TemplateSelectionFooter'

const TemplateSelection = ({
  selectedTemplate,
  onTemplateSelect,
  onContinue,
}: {
  selectedTemplate: string | null
  onTemplateSelect: (id: string) => void
  onContinue: () => void
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='w-full pb-10'
    >
      <TemplateSelectionHeader />
      <TemplateGrid
        selectedTemplate={selectedTemplate}
        onTemplateSelect={onTemplateSelect}
      />
      <TemplateSelectionFooter
        canContinue={Boolean(selectedTemplate)}
        onContinue={onContinue}
      />
    </motion.div>
  )
}

export default TemplateSelection
