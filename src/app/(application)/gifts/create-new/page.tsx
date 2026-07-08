'use client'

import React, { useRef, useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { analytics } from '@/lib/analytics/events'
import CategorySelection from '@/components/Gifts/CreateNewGiftPage/CategorySelection'
import TemplateSelection from '@/components/Gifts/CreateNewGiftPage/TemplateSelection'
import TemplatingEditing from '@/components/Gifts/CreateNewGiftPage/TemplatingEditing'
import SuccessModal from '@/components/Gifts/CreateNewGiftPage/CreateSuccessModal'
import type { TemplateLayout } from '@/lib/config/templates/types'

const CreateNewGiftPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedCategorySlug = searchParams.get('category')
  const [step, setStep] = useState<'category' | 'template' | 'customize'>(
    'category'
  )
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  )
  const [selectedCategoryName, setSelectedCategoryName] = useState<
    string | undefined
  >(undefined)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [selectedTemplateLayout, setSelectedTemplateLayout] =
    useState<TemplateLayout | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [giftPageLink, setGiftPageLink] = useState('')
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleCategorySelect = (categoryId: string, categoryTitle: string) => {
    setSelectedCategoryId(categoryId)
    setSelectedCategoryName(categoryTitle)
  }

  const handleTemplateSelect = (
    templateId: string,
    templateLayout: TemplateLayout
  ) => {
    setSelectedTemplate(templateId)
    setSelectedTemplateLayout(templateLayout)
    analytics.trackGiftCreateTemplateSelected({
      template_id: templateId,
      category_id: selectedCategoryId,
    })
  }

  const handleContinueFromCategory = () => {
    if (selectedCategoryId) {
      setStep('template')
    }
  }

  const handleContinueFromTemplate = () => {
    if (selectedTemplate) {
      setStep('customize')
    }
  }

  const handleBack = () => {
    setStep('template')
  }

  const handleBackToCategory = () => {
    setStep('category')
  }

  const handleCreated = (link: string) => {
    setGiftPageLink(link)
    setShowSuccessModal(true)
    analytics.trackGiftCreateSucceeded({
      category_id: selectedCategoryId,
      template_id: selectedTemplate,
    })
    if (redirectTimerRef.current) {
      clearTimeout(redirectTimerRef.current)
    }
    redirectTimerRef.current = setTimeout(() => {
      router.push('/gifts')
    }, 10000)
  }

  useEffect(() => {
    analytics.trackGiftCreateStepViewed({
      step,
      has_preselected_category: Boolean(preselectedCategorySlug),
      category_id: selectedCategoryId,
      template_id: selectedTemplate,
    })
  }, [preselectedCategorySlug, selectedCategoryId, selectedTemplate, step])

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current)
      }
    }
  }, [])

  return (
    <div className='w-full bg-white lg:bg-inherit px-4 lg:px-0 flex-1'>
      <AnimatePresence mode='wait'>
        {step === 'category' && (
          <CategorySelection
            preselectedCategorySlug={preselectedCategorySlug}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={handleCategorySelect}
            onContinue={handleContinueFromCategory}
          />
        )}

        {step === 'template' && (
          <TemplateSelection
            selectedTemplate={selectedTemplate}
            onTemplateSelect={handleTemplateSelect}
            onContinue={handleContinueFromTemplate}
            onBack={handleBackToCategory}
            selectedCategoryName={selectedCategoryName}
          />
        )}

        {step === 'customize' && (
          <TemplatingEditing
            handleBack={handleBack}
            onCreated={handleCreated}
            selectedTemplate={selectedTemplate}
            selectedTemplateLayout={selectedTemplateLayout}
            selectedCategoryId={selectedCategoryId}
          />
        )}
      </AnimatePresence>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false)
          router.push('/gifts')
        }}
        giftPageLink={giftPageLink}
      />
    </div>
  )
}

export default CreateNewGiftPage
