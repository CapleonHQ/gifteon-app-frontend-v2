'use client'

import React, { useMemo, useRef, useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { getPageCategories } from '@/api/services/pages'
import { analytics } from '@/lib/analytics/events'
import CategorySelection from '@/components/Gifts/CreateNewGiftPage/CategorySelection'
import TemplateSelection from '@/components/Gifts/CreateNewGiftPage/TemplateSelection'
import TemplatingEditing from '@/components/Gifts/CreateNewGiftPage/TemplatingEditing'
import SuccessModal from '@/components/Gifts/CreateNewGiftPage/CreateSuccessModal'
import {
  extractCategoryOptions,
  sortCategoryOptions,
} from '@/components/Gifts/CreateNewGiftPage/utils/categories'

const CreateNewGiftPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedCategorySlug = searchParams.get('category')
  const [step, setStep] = useState<'category' | 'template' | 'customize'>(
    preselectedCategorySlug ? 'template' : 'category'
  )
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  )
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [giftPageLink, setGiftPageLink] = useState('')
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const categoriesQuery = useQuery({
    queryKey: ['gift-page-create-categories'],
    queryFn: () => getPageCategories(),
  })
  const categoryOptions = sortCategoryOptions(
    extractCategoryOptions(categoriesQuery.data)
  )
  const preselectedCategory = useMemo(
    () =>
      categoryOptions.find((item) => item.slug === preselectedCategorySlug) ??
      null,
    [categoryOptions, preselectedCategorySlug]
  )
  const effectiveSelectedCategoryId =
    selectedCategoryId ?? preselectedCategory?.id ?? null
  const selectedCategory = categoryOptions.find(
    (item) => item.id === effectiveSelectedCategoryId
  )

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    analytics.trackGiftCreateTemplateSelected({
      template_id: templateId,
      category_id: effectiveSelectedCategoryId,
    })
  }

  const handleContinueFromCategory = () => {
    if (effectiveSelectedCategoryId) {
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
      category_id: effectiveSelectedCategoryId,
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
      category_id: effectiveSelectedCategoryId,
      template_id: selectedTemplate,
    })
  }, [
    effectiveSelectedCategoryId,
    preselectedCategorySlug,
    selectedTemplate,
    step,
  ])

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
            categories={categoryOptions}
            selectedCategoryId={effectiveSelectedCategoryId}
            isLoading={categoriesQuery.isLoading}
            isError={categoriesQuery.isError}
            onSelectCategory={setSelectedCategoryId}
            onContinue={handleContinueFromCategory}
          />
        )}

        {step === 'template' && (
          <TemplateSelection
            selectedTemplate={selectedTemplate}
            onTemplateSelect={handleTemplateSelect}
            onContinue={handleContinueFromTemplate}
            onBack={handleBackToCategory}
            selectedCategoryName={selectedCategory?.title}
          />
        )}

        {step === 'customize' && (
          <TemplatingEditing
            handleBack={handleBack}
            onCreated={handleCreated}
            selectedTemplate={selectedTemplate}
            selectedCategoryId={effectiveSelectedCategoryId}
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
