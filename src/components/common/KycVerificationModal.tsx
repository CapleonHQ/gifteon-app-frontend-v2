'use client'

import { useEffect, useRef, useState } from 'react'
import { useSuccessModal } from '@/context/SuccessModalContext'
import ResponsiveModal from './ResponsiveModal'
import StepHeader from './kycVerificationModal/StepHeader'
import StepFooter from './kycVerificationModal/StepFooter'
import {
  ActionStepBody,
  IntroStepBody,
} from './kycVerificationModal/StepBodies'
import {
  useKycStatus,
  useSubmitFaceVerification,
  useSubmitKycDocument,
  useSubmitUtilityBill,
} from '@/hooks/tanstack/kyc'
import { uploadDocument, uploadImage } from '@/api/services/upload'
import { toApiError } from '@/api/errorHelpers'
import type { KycStatusItem } from '@/types/Kyc'
import type { KycRequiredAction, KycStep } from './kycVerificationModal/types'

type KycModalProps = {
  isOpen: boolean
  onClose: () => void
}

const ENABLE_FACE_VERIFICATION = false

const KycVerificationModal = ({ isOpen, onClose }: KycModalProps) => {
  const { openSuccess } = useSuccessModal()
  const [step, setStep] = useState<KycStep>(0)
  const [documentNumber, setDocumentNumber] = useState('')
  const [utilityBillFile, setUtilityBillFile] = useState<File | null>(null)
  const [faceFile, setFaceFile] = useState<File | null>(null)
  const [faceCaptureStage, setFaceCaptureStage] = useState<
    'idle' | 'preview' | 'scanning' | 'ready'
  >('idle')
  const [faceScanProgress, setFaceScanProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [formError, setFormError] = useState('')
  const [refreshStatusMessage, setRefreshStatusMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const faceInputRef = useRef<HTMLInputElement>(null)
  const faceScanTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const kycStatusQuery = useKycStatus(isOpen)
  const submitDocumentMutation = useSubmitKycDocument()
  const submitUtilityBillMutation = useSubmitUtilityBill()
  const submitFaceMutation = useSubmitFaceVerification()
  const isSubmitting =
    isUploading ||
    submitDocumentMutation.isPending ||
    submitUtilityBillMutation.isPending ||
    submitFaceMutation.isPending
  const isRefreshingStatus = kycStatusQuery.isFetching && !isSubmitting

  const handleClose = () => {
    if (faceScanTimerRef.current) {
      clearInterval(faceScanTimerRef.current)
      faceScanTimerRef.current = null
    }
    setStep(0)
    setDocumentNumber('')
    setUtilityBillFile(null)
    setFaceFile(null)
    setFaceCaptureStage('idle')
    setFaceScanProgress(0)
    setIsUploading(false)
    setFormError('')
    setRefreshStatusMessage('')
    onClose()
  }

  const handleUtilityBillSelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      setUtilityBillFile(file)
      setFormError('')
      setRefreshStatusMessage('')
    }
  }

  const handleRemoveUtilityBill = () => {
    setUtilityBillFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleFaceFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFaceFile(file)
      setFaceCaptureStage('preview')
      setFaceScanProgress(0)
      setFormError('')
      setRefreshStatusMessage('')
    }
  }

  const handleStartFaceScan = () => {
    if (!faceFile) {
      faceInputRef.current?.click()
      return
    }

    if (faceScanTimerRef.current) {
      clearInterval(faceScanTimerRef.current)
      faceScanTimerRef.current = null
    }

    setFaceCaptureStage('scanning')
    setFaceScanProgress(0)
    faceScanTimerRef.current = setInterval(() => {
      setFaceScanProgress((previous) => {
        const next = Math.min(previous + 20, 100)
        if (next >= 100) {
          if (faceScanTimerRef.current) {
            clearInterval(faceScanTimerRef.current)
            faceScanTimerRef.current = null
          }
          setFaceCaptureStage('ready')
        }
        return next
      })
    }, 250)
  }

  const kycStatus = kycStatusQuery.data?.data
  const kycLevel = kycStatus?.kycLevel ?? 0
  const requiredAction: KycRequiredAction =
    kycLevel < 1
      ? 'nin'
      : kycLevel < 2
      ? 'bvn'
      : kycLevel < 3
      ? !ENABLE_FACE_VERIFICATION
        ? 'utility'
        : kycStatus?.utilityBill?.status !== 'approved'
        ? 'utility'
        : kycStatus?.faceVerification?.status !== 'approved'
        ? 'face'
        : 'none'
      : 'none'

  const currentActionStatus: KycStatusItem | undefined =
    requiredAction === 'nin'
      ? kycStatus?.nin
      : requiredAction === 'bvn'
      ? kycStatus?.bvn
      : requiredAction === 'utility'
      ? kycStatus?.utilityBill
      : requiredAction === 'face'
      ? kycStatus?.faceVerification
      : undefined

  useEffect(() => {
    if (requiredAction !== 'face') {
      if (faceScanTimerRef.current) {
        clearInterval(faceScanTimerRef.current)
        faceScanTimerRef.current = null
      }
      setFaceCaptureStage('idle')
      setFaceScanProgress(0)
    }
  }, [requiredAction])

  const statusMessage = kycStatusQuery.isLoading
    ? 'Loading KYC status...'
    : kycStatusQuery.isError
    ? 'Unable to load KYC status right now. Please retry.'
    : currentActionStatus?.status === 'pending'
    ? 'Verification is in progress. We will notify you once approved.'
    : currentActionStatus?.status === 'approved'
    ? 'This step has already been approved.'
    : currentActionStatus?.status === 'rejected'
    ? currentActionStatus.rejectionReason ||
      'Verification was rejected. Please update and resubmit.'
    : undefined
  const isPendingAction = currentActionStatus?.status === 'pending'

  const getActionMeta = () => {
    if (kycStatusQuery.isError) {
      return {
        title: 'KYC status unavailable',
        subtitle: 'We could not load your KYC status. Please retry.',
        progressCurrent: undefined,
        primaryLabel: 'Retry',
      }
    }
    if (requiredAction === 'nin') {
      return {
        title: 'Verify your NIN',
        subtitle: 'Submit your NIN to continue your verification.',
        progressCurrent: undefined,
        primaryLabel: 'Submit NIN',
      }
    }
    if (requiredAction === 'bvn') {
      return {
        title: 'Verify your BVN',
        subtitle: 'Submit your BVN to continue your verification.',
        progressCurrent: undefined,
        primaryLabel: 'Submit BVN',
      }
    }
    if (requiredAction === 'utility') {
      return {
        title: 'Upload Utility Bill',
        subtitle:
          'Upload a recent utility bill for address verification.',
        progressCurrent: 1,
        primaryLabel: 'Submit Utility Bill',
      }
    }
    if (requiredAction === 'face') {
      return {
        title: 'Face Recognition',
        subtitle: 'Complete the second part of Level 3 with face recognition.',
        progressCurrent: 2,
        primaryLabel: 'Submit Face Verification',
      }
    }
    return {
      title: 'KYC Completed',
      subtitle: 'You have completed all required KYC steps for now.',
      progressCurrent: ENABLE_FACE_VERIFICATION ? 3 : 1,
      primaryLabel: 'Done',
    }
  }

  const actionMeta = getActionMeta()
  const canSubmitAction = kycStatusQuery.isLoading
    ? false
    : requiredAction === 'none'
    ? true
    : kycStatusQuery.isError
    ? true
    : currentActionStatus?.status === 'pending'
    ? true
    : requiredAction === 'face'
    ? faceCaptureStage !== 'scanning'
    : currentActionStatus?.status !== 'approved' &&
      ((requiredAction === 'utility' && Boolean(utilityBillFile)) ||
        ((requiredAction === 'nin' || requiredAction === 'bvn') &&
          documentNumber.trim().length === 11))

  const handleSubmitAction = async () => {
    setFormError('')
    setRefreshStatusMessage('')

    if (requiredAction === 'none') {
      handleClose()
      return
    }

    if (kycStatusQuery.isLoading) return

    if (kycStatusQuery.isError) {
      await kycStatusQuery.refetch()
      setRefreshStatusMessage('Status updated just now.')
      return
    }

    if (currentActionStatus?.status === 'pending') {
      await kycStatusQuery.refetch()
      setRefreshStatusMessage('Status updated just now.')
      return
    }

    try {
      if (requiredAction === 'face' && faceCaptureStage !== 'ready') {
        handleStartFaceScan()
        return
      }

      if (requiredAction === 'nin' || requiredAction === 'bvn') {
        if (documentNumber.trim().length !== 11) {
          setFormError(
            `${
              requiredAction === 'nin' ? 'NIN' : 'BVN'
            } must be exactly 11 digits.`
          )
          return
        }

        const response = await submitDocumentMutation.mutateAsync({
          type: requiredAction.toUpperCase() as 'NIN' | 'BVN',
          documentNumber: documentNumber.trim(),
        })

        openSuccess({
          title: 'Submitted',
          message:
            response.message ||
            'Document submitted successfully. Verification is in progress.',
        })
        handleClose()
        return
      }

      if (requiredAction === 'utility') {
        if (!utilityBillFile) {
          setFormError('Please upload a utility bill before submitting.')
          return
        }

        const uploadResponse = await (async () => {
          setIsUploading(true)
          try {
            return await uploadDocument({
              file: utilityBillFile,
              folder: 'kyc',
            })
          } finally {
            setIsUploading(false)
          }
        })()

        if (!uploadResponse?.data?.url) {
          throw new Error('Unable to upload utility bill. Please try again.')
        }

        const response = await submitUtilityBillMutation.mutateAsync({
          utilityBillUrl: uploadResponse.data.url,
        })

        openSuccess({
          title: 'Submitted',
          message:
            response.message ||
            'Utility bill submitted successfully. Verification is in progress.',
        })
        handleClose()
        return
      }

      if (!faceFile) {
        setFormError('Please upload a face image before submitting.')
        return
      }

      const uploadResponse = await (async () => {
        setIsUploading(true)
        try {
          return await uploadImage({
            file: faceFile,
            folder: 'kyc',
          })
        } finally {
          setIsUploading(false)
        }
      })()

      if (!uploadResponse?.data?.url) {
        throw new Error('Unable to upload face image. Please try again.')
      }

      const response = await submitFaceMutation.mutateAsync({
        faceVerificationUrl: uploadResponse.data.url,
      })

      openSuccess({
        title: 'Submitted',
        message:
          response.message ||
          'Face verification submitted successfully. Verification is in progress.',
      })
      handleClose()
    } catch (error: unknown) {
      setFormError(toApiError(error).message || 'Unable to submit KYC details.')
    }
  }

  const headerTitle =
    step === 0
      ? kycStatusQuery.isLoading
        ? 'Setting up your verification'
        : requiredAction === 'none'
        ? 'Verification up to date'
        : 'Complete your verification'
      : actionMeta.title
  const headerSubtitle =
    step === 0
      ? kycStatusQuery.isLoading
        ? 'We are checking your current KYC level.'
        : requiredAction === 'none'
        ? 'No additional information is required right now.'
        : 'Follow the steps below based on your current KYC level.'
      : actionMeta.subtitle
  const progressCurrent = step === 0 ? undefined : actionMeta.progressCurrent
  const progressTotal =
    step === 0
      ? undefined
      : !ENABLE_FACE_VERIFICATION &&
        (requiredAction === 'utility' || requiredAction === 'none')
      ? 2
      : requiredAction === 'utility' || requiredAction === 'face'
      ? 2
      : 3

  const isStatusError =
    kycStatusQuery.isError || currentActionStatus?.status === 'rejected'
  const primaryLabel =
    currentActionStatus?.status === 'pending'
      ? 'Refresh Status'
      : requiredAction === 'face' && !isPendingAction
      ? faceCaptureStage === 'idle'
        ? 'Start Scan'
        : faceCaptureStage === 'preview'
        ? 'Start Scanning'
        : faceCaptureStage === 'scanning'
        ? 'Scanning...'
        : 'Submit Face Verification'
      : actionMeta.primaryLabel

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={handleClose}
      desktopMaxWidthClass='max-w-[500px]'
      header={
        <StepHeader
          title={headerTitle}
          subtitle={headerSubtitle}
          progressCurrent={progressCurrent}
          progressTotal={progressTotal}
          onClose={handleClose}
          onMobileBack={step === 0 ? undefined : () => setStep(0)}
        />
      }
      body={
        <>
          {step === 0 ? (
            <IntroStepBody
              action={requiredAction}
              isLoadingStatus={kycStatusQuery.isLoading}
            />
          ) : null}
          {step === 1 ? (
            <ActionStepBody
              action={requiredAction}
              documentNumber={documentNumber}
              utilityBillFile={utilityBillFile}
              faceFile={faceFile}
              fileInputRef={fileInputRef}
              faceInputRef={faceInputRef}
              faceCaptureStage={faceCaptureStage}
              faceScanProgress={faceScanProgress}
              isPending={isPendingAction}
              submittedSummary={
                requiredAction === 'utility'
                  ? 'Utility bill submitted. Verification is in progress.'
                  : requiredAction === 'face'
                  ? 'Face verification submitted. Verification is in progress.'
                  : `${requiredAction === 'nin' ? 'NIN' : 'BVN'} submitted. Verification is in progress.`
              }
              statusMessage={refreshStatusMessage || statusMessage}
              isStatusError={isStatusError}
              errorMessage={formError}
              onDocumentNumberChange={(value) => {
                setDocumentNumber(value)
                setFormError('')
              }}
              onFileSelect={handleUtilityBillSelect}
              onRemoveFile={handleRemoveUtilityBill}
              onFaceFileSelect={handleFaceFileSelect}
            />
          ) : null}
        </>
      }
      footer={
        <StepFooter
          step={step}
          canSubmit={canSubmitAction}
          isSubmitting={isSubmitting}
          isUploading={isUploading}
          isRefreshingStatus={isRefreshingStatus}
          primaryLabel={primaryLabel}
          onClose={handleClose}
          onNext={() => setStep(1)}
          onBack={() => setStep(0)}
          onSubmit={handleSubmitAction}
        />
      }
    />
  )
}

export default KycVerificationModal
