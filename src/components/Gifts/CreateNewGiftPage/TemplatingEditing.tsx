import React, { useState } from 'react'
import { motion } from 'framer-motion'
import DesktopEditingHeader from './DesktopEditingHeader'
import MobileEditingHeader from './MobileEditingHeader'
import DesktopEditingLayout from './DesktopEditingLayout'
import MobileEditingLayout from './MobileEditingLayout'
import MobilePreviewModal from './MobilePreviewModal'
import { CreateGiftProvider } from './CreateGiftContext'

interface TemplatingEditingProps {
  handleBack: () => void
  handleSave: () => void
  selectedTemplate: number | null
}

const TemplatingEditingContent = ({
  handleBack,
  handleSave,
  selectedTemplate,
}: TemplatingEditingProps) => {
  const [customizationOpen, setCustomizationOpen] = useState(true)
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false)

  return (
    <motion.div
      key='customize'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='w-full h-full'
    >
      <DesktopEditingHeader
        onBack={handleBack}
        customizationOpen={customizationOpen}
        onOpenCustomization={() => setCustomizationOpen(true)}
      />
      <MobileEditingHeader onOpenPreview={() => setMobilePreviewOpen(true)} />
      <DesktopEditingLayout
        customizationOpen={customizationOpen}
        selectedTemplate={selectedTemplate}
        onCloseCustomization={() => setCustomizationOpen(false)}
        onSave={handleSave}
      />
      <MobileEditingLayout onClose={handleBack} onSave={handleSave} />
      <MobilePreviewModal
        isOpen={mobilePreviewOpen}
        onClose={() => setMobilePreviewOpen(false)}
        selectedTemplate={selectedTemplate}
      />
    </motion.div>
  )
}

const TemplatingEditing = (props: TemplatingEditingProps) => {
  return (
    <CreateGiftProvider>
      <TemplatingEditingContent {...props} />
    </CreateGiftProvider>
  )
}

export default TemplatingEditing
