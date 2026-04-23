import ShakeOnError from '@/components/common/ShakeOnError'
import DocumentNumberField from './action/DocumentNumberField'
import FaceStageField from './action/FaceStageField'
import StatusMessageCard from './action/StatusMessageCard'
import SubmittedDetailsCard from './action/SubmittedDetailsCard'
import UtilityFileField from './action/UtilityFileField'
import type { ActionStepBodyProps } from './action/types'

const CompletedCard = () => (
  <div className='rounded-[12px] border border-success-100 bg-success-50 p-4'>
    <p className='text-sm font-medium text-success-700'>
      Your KYC is already complete for your current withdrawal tier.
    </p>
  </div>
)

export const ActionStepBody = ({
  action,
  documentNumber,
  utilityBillFile,
  faceFile,
  fileInputRef,
  faceInputRef,
  faceCaptureStage,
  faceScanProgress,
  isPending = false,
  isReadOnlyAction = false,
  submittedSummary,
  statusMessage,
  isStatusError = false,
  errorMessage,
  onDocumentNumberChange,
  onFileSelect,
  onRemoveFile,
  onFaceFileSelect,
}: ActionStepBodyProps) => {
  if (action === 'none') return <CompletedCard />

  const summary = submittedSummary || 'Your details have been submitted.'

  return (
    <div className='flex flex-col gap-6'>
      {statusMessage ? <StatusMessageCard message={statusMessage} isError={isStatusError} /> : null}
      {isPending || isReadOnlyAction ? <SubmittedDetailsCard summary={summary} /> : null}

      {!isPending && !isReadOnlyAction && (action === 'nin' || action === 'bvn') ? (
        <DocumentNumberField
          action={action}
          value={documentNumber}
          onChange={onDocumentNumberChange}
        />
      ) : null}

      {!isPending && !isReadOnlyAction && action === 'utility' ? (
        <UtilityFileField
          utilityBillFile={utilityBillFile}
          fileInputRef={fileInputRef}
          onFileSelect={onFileSelect}
          onRemoveFile={onRemoveFile}
        />
      ) : null}

      {!isPending && !isReadOnlyAction && action === 'face' ? (
        <FaceStageField
          faceFile={faceFile}
          faceInputRef={faceInputRef}
          faceCaptureStage={faceCaptureStage}
          faceScanProgress={faceScanProgress}
          onFaceFileSelect={onFaceFileSelect}
        />
      ) : null}

      <ShakeOnError active={Boolean(errorMessage)}>
        {errorMessage ? <p className='text-sm text-error-500'>{errorMessage}</p> : null}
      </ShakeOnError>
    </div>
  )
}
