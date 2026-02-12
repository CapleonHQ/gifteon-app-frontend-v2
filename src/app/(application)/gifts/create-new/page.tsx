'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TemplateSelection from '@/components/Gifts/CreateNewGiftPage/TemplateSelection'
import TemplatingEditing from '@/components/Gifts/CreateNewGiftPage/TemplatingEditing'
import SuccessModal from '@/components/Gifts/CreateNewGiftPage/CreateSuccessModal'

const CreateNewGiftPage = () => {
  const [step, setStep] = useState<'select' | 'customize'>('select')
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [giftPageLink, setGiftPageLink] = useState('')

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
  }

  const handleContinue = () => {
    if (selectedTemplate) {
      setStep('customize')
    }
  }

  const handleBack = () => {
    setStep('select')
    setSelectedTemplate(null)
  }

  const handleCreated = (link: string) => {
    setGiftPageLink(link)
    setShowSuccessModal(true)
  }

  return (
    <div className='w-full h-full bg-white lg:bg-inherit px-4 lg:px-0'>
      <AnimatePresence mode='wait'>
        {step === 'select' && (
          <TemplateSelection
            selectedTemplate={selectedTemplate}
            onTemplateSelect={handleTemplateSelect}
            onContinue={handleContinue}
          />
        )}

        {step === 'customize' && (
          <TemplatingEditing
            handleBack={handleBack}
            onCreated={handleCreated}
            selectedTemplate={selectedTemplate}
          />
        )}
      </AnimatePresence>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        giftPageLink={giftPageLink}
      />
    </div>
  )
}

export default CreateNewGiftPage
