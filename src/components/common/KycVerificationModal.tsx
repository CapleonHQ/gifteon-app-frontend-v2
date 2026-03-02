'use client'

import { useRef, useState } from 'react'
import { useSuccessModal } from '@/context/SuccessModalContext'
import ResponsiveModal from './ResponsiveModal'
import StepHeader from './kycVerificationModal/StepHeader'
import StepFooter from './kycVerificationModal/StepFooter'
import {
  DocumentStepBody,
  FaceStepBody,
  IntroStepBody,
} from './kycVerificationModal/StepBodies'
import { STEP_META } from './kycVerificationModal/constants'
import type { KycStep } from './kycVerificationModal/types'

type KycModalProps = {
  isOpen: boolean
  onClose: () => void
}

const KycVerificationModal = ({ isOpen, onClose }: KycModalProps) => {
  const { openSuccess } = useSuccessModal()
  const [step, setStep] = useState<KycStep>(0)
  const [documentType, setDocumentType] = useState('')
  const [documentFile, setDocumentFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClose = () => {
    setStep(0)
    setDocumentType('')
    setDocumentFile(null)
    setIsSubmitting(false)
    onClose()
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setDocumentFile(file)
    }
  }

  const handleRemoveFile = () => {
    setDocumentFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleStartScan = async () => {
    setIsSubmitting(true)
    // TODO: Replace with actual face verification / KYC API call
    setTimeout(() => {
      setIsSubmitting(false)
      handleClose()
      openSuccess({
        title: 'KYC Submitted!',
        message:
          "Your verification documents have been submitted. We'll review your information within 24 hours.",
      })
    }, 2000)
  }

  const currentMeta = STEP_META[step]
  const canContinue = Boolean(documentType && documentFile)

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={handleClose}
      desktopMaxWidthClass='max-w-[500px]'
      header={
        <StepHeader
          title={currentMeta.title}
          subtitle={currentMeta.subtitle}
          progressCurrent={currentMeta.progressCurrent}
          onClose={handleClose}
          onMobileBack={step === 0 ? undefined : () => setStep((step - 1) as KycStep)}
        />
      }
      body={
        <>
          {step === 0 ? <IntroStepBody /> : null}
          {step === 1 ? (
            <DocumentStepBody
              documentType={documentType}
              documentFile={documentFile}
              fileInputRef={fileInputRef}
              onDocumentTypeChange={setDocumentType}
              onFileSelect={handleFileSelect}
              onRemoveFile={handleRemoveFile}
            />
          ) : null}
          {step === 2 ? <FaceStepBody /> : null}
        </>
      }
      footer={
        <StepFooter
          step={step}
          canContinue={canContinue}
          isSubmitting={isSubmitting}
          onClose={handleClose}
          onNext={() => {
            if (step === 0) setStep(1)
            if (step === 1) setStep(2)
          }}
          onBack={() => setStep((step - 1) as KycStep)}
          onStartScan={handleStartScan}
        />
      }
    />
  )
}

export default KycVerificationModal
