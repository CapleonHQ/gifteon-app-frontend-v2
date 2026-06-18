'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'
import { useCreateGiveaway } from '@/hooks/tanstack/giveaways'
import { toApiError } from '@/api/errorHelpers'
import { useSuccessModal } from '@/context/SuccessModalContext'
import { analytics } from '@/lib/analytics/events'
import CategoryStep from '@/components/Giveaways/CreateGiveaway/CategoryStep'
import DetailsStep from '@/components/Giveaways/CreateGiveaway/DetailsStep'
import ContentStep from '@/components/Giveaways/CreateGiveaway/ContentStep'
import ReviewStep from '@/components/Giveaways/CreateGiveaway/ReviewStep'
import GiveawayPinModal from '@/components/Giveaways/GiveawayPinModal'
import {
  createInitialDraft,
  type CreateStep,
  type GiveawayDraft,
} from '@/components/Giveaways/CreateGiveaway/types'
import {
  buildCreatePayload,
  validateContent,
  validateDetails,
  type DraftFieldErrors,
} from '@/components/Giveaways/CreateGiveaway/helpers'
import type { GiveawayCategory } from '@/types/Giveaways'

const CreateGiveawayPage = () => {
  const router = useRouter()
  const { openSuccess } = useSuccessModal()
  const createMutation = useCreateGiveaway()

  const [step, setStep] = useState<CreateStep>('category')
  const [draft, setDraft] = useState<GiveawayDraft>(createInitialDraft)
  const [fieldErrors, setFieldErrors] = useState<DraftFieldErrors>({})
  const [isPinOpen, setIsPinOpen] = useState(false)
  const [pinError, setPinError] = useState('')
  const [pinActionError, setPinActionError] = useState('')

  const update = (patch: Partial<GiveawayDraft>) => {
    setDraft((prev) => ({ ...prev, ...patch }))
    if (Object.keys(fieldErrors).length > 0) setFieldErrors({})
  }

  const hasContentStep =
    draft.category === 'trivia' || draft.category === 'task'
  const totalSteps = hasContentStep ? 4 : 3

  const trackStep = (next: CreateStep) =>
    analytics.trackGiveawayCreateStepViewed({
      step: next,
      category: draft.category,
    })

  const handleSelectCategory = (category: GiveawayCategory) =>
    update({ category })

  const goToDetails = () => {
    setFieldErrors({})
    setStep('details')
    trackStep('details')
  }

  const handleDetailsContinue = () => {
    const errors = validateDetails(draft)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    setFieldErrors({})
    const next: CreateStep = hasContentStep ? 'content' : 'review'
    setStep(next)
    trackStep(next)
  }

  const handleContentContinue = () => {
    const errors = validateContent(draft)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    setFieldErrors({})
    setStep('review')
    trackStep('review')
  }

  const handleCreate = async (pin: string) => {
    if (!draft.category) return
    setPinError('')
    setPinActionError('')

    const detailErrors = validateDetails(draft)
    const contentErrors = validateContent(draft)
    const errors = { ...detailErrors, ...contentErrors }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setIsPinOpen(false)
      setStep(Object.keys(detailErrors).length > 0 ? 'details' : 'content')
      return
    }

    try {
      const payload = buildCreatePayload(draft, pin)
      const response = await createMutation.mutateAsync(payload)
      const created = response.data
      analytics.trackGiveawayCreated({
        category: draft.category,
        prize_type: draft.prizeType,
        winner_count: Number(draft.winnerCount) || 1,
      })
      setIsPinOpen(false)
      openSuccess({
        title: 'Giveaway created',
        message: 'Publish it from the giveaway page when you are ready.',
      })
      if (created?.id) {
        router.push(`/giveaways/${created.id}`)
      } else {
        router.push('/giveaways')
      }
    } catch (err) {
      const message =
        toApiError(err).message || 'Could not create giveaway. Try again.'
      if (message.toLowerCase().includes('pin')) {
        setPinError(message)
      } else {
        setPinActionError(message)
      }
    }
  }

  return (
    <div className='w-full bg-white lg:bg-inherit px-4 lg:px-0 flex-1'>
      <div className='max-w-2xl mx-auto'>
        <AnimatePresence mode='wait'>
          {step === 'category' ? (
            <CategoryStep
              key='category'
              totalSteps={totalSteps}
              selected={draft.category}
              onSelect={handleSelectCategory}
              onContinue={goToDetails}
            />
          ) : null}
          {step === 'details' ? (
            <DetailsStep
              key='details'
              totalSteps={totalSteps}
              draft={draft}
              update={update}
              errors={fieldErrors}
              onBack={() => setStep('category')}
              onContinue={handleDetailsContinue}
            />
          ) : null}
          {step === 'content' ? (
            <ContentStep
              key='content'
              totalSteps={totalSteps}
              draft={draft}
              update={update}
              errors={fieldErrors}
              onBack={() => setStep('details')}
              onContinue={handleContentContinue}
            />
          ) : null}
          {step === 'review' ? (
            <ReviewStep
              key='review'
              totalSteps={totalSteps}
              draft={draft}
              isSubmitting={createMutation.isPending}
              onBack={() => setStep(hasContentStep ? 'content' : 'details')}
              onSubmit={() => {
                setPinError('')
                setPinActionError('')
                setIsPinOpen(true)
              }}
            />
          ) : null}
        </AnimatePresence>
      </div>

      <GiveawayPinModal
        isOpen={isPinOpen}
        title='Confirm giveaway'
        description='Enter your transaction PIN to create this giveaway.'
        confirmLabel='Create giveaway'
        pinError={pinError}
        actionError={pinActionError}
        isSubmitting={createMutation.isPending}
        onClose={() => {
          setIsPinOpen(false)
          setPinError('')
          setPinActionError('')
        }}
        onConfirm={handleCreate}
        onClearError={() => {
          setPinError('')
          setPinActionError('')
        }}
      />
    </div>
  )
}

export default CreateGiveawayPage
