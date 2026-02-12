'use client'

import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import TemplateSelection from '@/components/Gifts/CreateNewGiftPage/TemplateSelection'
import TemplatingEditing from '@/components/Gifts/CreateNewGiftPage/TemplatingEditing'
import SuccessModal from '@/components/Gifts/CreateNewGiftPage/CreateSuccessModal'

const CreateNewGiftPage = () => {
  const router = useRouter()
  const [step, setStep] = useState<'select' | 'customize'>('select')
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [giftPageLink, setGiftPageLink] = useState('')
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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
    if (redirectTimerRef.current) {
      clearTimeout(redirectTimerRef.current)
    }
    redirectTimerRef.current = setTimeout(() => {
      router.push('/gift-pages')
    }, 10000)
  }

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current)
      }
    }
  }, [])

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
        onClose={() => {
          setShowSuccessModal(false)
          router.push('/gift-pages')
        }}
        giftPageLink={giftPageLink}
      />
    </div>
  )
}

export default CreateNewGiftPage
