'use client'

import { useRef, useState } from 'react'
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
  useSubmitKycDocument,
  useSubmitUtilityBill,
} from '@/hooks/tanstack/kyc'
import { uploadMultipleFiles } from '@/api/services/upload'
import { toApiError } from '@/api/errorHelpers'
import type { KycStatusItem } from '@/types/Kyc'
import type { KycRequiredAction, KycStep } from './kycVerificationModal/types'

type KycModalProps = {
  isOpen: boolean
  onClose: () => void
}

const KycVerificationModal = ({ isOpen, onClose }: KycModalProps) => {
  const { openSuccess } = useSuccessModal()
  const [step, setStep] = useState<KycStep>(0)
  const [documentNumber, setDocumentNumber] = useState('')
  const [utilityBillFile, setUtilityBillFile] = useState<File | null>(null)
  const [formError, setFormError] = useState('')
  const [refreshStatusMessage, setRefreshStatusMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const kycStatusQuery = useKycStatus(isOpen)
  const submitDocumentMutation = useSubmitKycDocument()
  const submitUtilityBillMutation = useSubmitUtilityBill()
  const isSubmitting =
    submitDocumentMutation.isPending || submitUtilityBillMutation.isPending
  const isRefreshingStatus = kycStatusQuery.isFetching && !isSubmitting

  const handleClose = () => {
    setStep(0)
    setDocumentNumber('')
    setUtilityBillFile(null)
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

  const kycStatus = kycStatusQuery.data?.data
  const kycLevel = kycStatus?.kycLevel ?? 0
  const requiredAction: KycRequiredAction =
    kycLevel < 1
      ? 'nin'
      : kycLevel < 2
      ? 'bvn'
      : kycLevel < 3
      ? 'utility'
      : 'none'

  const currentActionStatus: KycStatusItem | undefined =
    requiredAction === 'nin'
      ? kycStatus?.nin
      : requiredAction === 'bvn'
      ? kycStatus?.bvn
      : requiredAction === 'utility'
      ? kycStatus?.utilityBill
      : undefined

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
          'Upload a recent utility bill to complete Level 3 verification.',
        progressCurrent: 2,
        primaryLabel: 'Submit Utility Bill',
      }
    }
    return {
      title: 'KYC Completed',
      subtitle: 'You have completed all required KYC steps for now.',
      progressCurrent: 2,
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
    : currentActionStatus?.status !== 'approved' &&
      (requiredAction === 'utility'
        ? Boolean(utilityBillFile)
        : documentNumber.trim().length === 11)

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

      if (!utilityBillFile) {
        setFormError('Please upload a utility bill before submitting.')
        return
      }

      const uploadResponse = await uploadMultipleFiles({
        files: [utilityBillFile],
        folder: 'kyc',
      })

      const firstUploaded = Array.isArray(uploadResponse.data)
        ? uploadResponse.data[0]
        : uploadResponse.data.files?.[0]

      if (!firstUploaded?.url) {
        throw new Error('Unable to upload utility bill. Please try again.')
      }

      const response = await submitUtilityBillMutation.mutateAsync({
        utilityBillUrl: firstUploaded.url,
      })

      openSuccess({
        title: 'Submitted',
        message:
          response.message ||
          'Utility bill submitted successfully. Verification is in progress.',
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

  const isStatusError =
    kycStatusQuery.isError || currentActionStatus?.status === 'rejected'

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
              fileInputRef={fileInputRef}
              isPending={isPendingAction}
              submittedSummary={
                requiredAction === 'utility'
                  ? 'Utility bill submitted. Verification is in progress.'
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
            />
          ) : null}
        </>
      }
      footer={
        <StepFooter
          step={step}
          canSubmit={canSubmitAction}
          isSubmitting={isSubmitting}
          isRefreshingStatus={isRefreshingStatus}
          primaryLabel={
            currentActionStatus?.status === 'pending'
              ? 'Refresh Status'
              : actionMeta.primaryLabel
          }
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
