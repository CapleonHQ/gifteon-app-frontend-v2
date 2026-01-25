import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { GiftPageData } from '../../../types/gifts'
import DesktopEditingHeader from './DesktopEditingHeader'
import MobileEditingHeader from './MobileEditingHeader'
import DesktopEditingLayout from './DesktopEditingLayout'
import MobileEditingLayout from './MobileEditingLayout'
import MobilePreviewModal from './MobilePreviewModal'

interface TemplatingEditingProps {
  handleBack: () => void
  handleSave: () => void
  selectedTemplate: number | null
}

const TemplatingEditing = ({
  handleBack,
  handleSave,
  selectedTemplate,
}: TemplatingEditingProps) => {
  const [customizationOpen, setCustomizationOpen] = useState(true)
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false)

  const [giftPageData, setGiftPageData] = useState<GiftPageData>({
    media: { type: 'image', url: '' },
    title: {
      text: 'Title here',
      font: 'Clash Display',
      color: '#121212',
      alignment: 'left',
      size: '32px',
      bold: false,
      italic: false,
      underline: false,
    },
    description: {
      text: 'You can include the description of the celebration here. You can include the description of the celebration here.',
      font: 'Inter',
      color: '#4B5563',
      alignment: 'left',
      size: '14px',
      bold: false,
      italic: false,
      underline: false,
    },
    button: {
      label: 'Say something nice 😊',
      backgroundColor: '#F3F2F2',
      textColor: '#121212',
    },
    socialLinks: {
      instagram: '',
      twitter: '',
      linkedin: '',
    },
  })

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
        giftPageData={giftPageData}
        selectedTemplate={selectedTemplate}
        onDataChange={setGiftPageData}
        onCloseCustomization={() => setCustomizationOpen(false)}
        onSave={handleSave}
      />
      <MobileEditingLayout
        giftPageData={giftPageData}
        onDataChange={setGiftPageData}
        onClose={handleBack}
        onSave={handleSave}
      />
      <MobilePreviewModal
        isOpen={mobilePreviewOpen}
        onClose={() => setMobilePreviewOpen(false)}
        giftPageData={giftPageData}
        selectedTemplate={selectedTemplate}
      />
    </motion.div>
  )
}

export default TemplatingEditing
