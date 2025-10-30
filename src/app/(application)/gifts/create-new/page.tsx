'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GiftPageData } from '@/types/gifts'
import TemplateSelection from '@/components/Gifts/CreateNewGiftPage/TemplateSelection'
import TemplatingEditing from '@/components/Gifts/CreateNewGiftPage/TemplatingEditing'
import SuccessModal from '@/components/Gifts/CreateNewGiftPage/CreateSuccessModal'

const CreateNewGiftPage = () => {
  const [step, setStep] = useState<'select' | 'customize'>('select')
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [giftPageLink, setGiftPageLink] = useState('')

  const handleTemplateSelect = (templateId: number) => {
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

  const handleSave = async () => {
    // Here you would send giftPageData to your backend
    console.log('Saving gift page data:')

    // Example API call:
    try {
      // const response = await fetch('/api/gift-pages', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(giftPageData)
      // })
      // const result = await response.json()

      // For demo purposes, using a mock link
      const mockLink = 'giftpagelinkhereqiftpagelinkhereQgiftseon.com'
      setGiftPageLink(mockLink)
      setShowSuccessModal(true)
    } catch (error) {
      console.error('Failed to save:', error)
    }
  }

  return (
    <div className='w-full h-full'>
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
            handleSave={handleSave}
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
