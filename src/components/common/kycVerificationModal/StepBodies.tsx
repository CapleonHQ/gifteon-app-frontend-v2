import { useEffect, useMemo } from 'react'
import type { ChangeEvent, RefObject } from 'react'
import Image from 'next/image'
import KycIconIllustration from '@/assets/icons/diagrams/KycIconIllustration'
import DocumentFieldIcon from '@/assets/icons/DocumentFieldIcon'
import DeleteIcon from '@/assets/icons/DeleteIcon'
import type { KycRequiredAction } from './types'
import FaceScanIcon from '@/assets/icons/FaceScanIcon'

type IntroStepState = 'done' | 'current' | 'upcoming'
type IntroStepItem = {
  title: string
  description: string
  state: IntroStepState
}

const getVerificationSteps = (action: KycRequiredAction): IntroStepItem[] => {
  const allSteps: Array<{
    key: 'nin' | 'bvn' | 'level3'
    title: string
    description: string
  }> = [
    {
      key: 'nin',
      title: 'Submit your NIN',
      description: 'Enter your 11-digit National Identification Number.',
    },
    {
      key: 'bvn',
      title: 'Submit your BVN',
      description: 'Enter your 11-digit Bank Verification Number.',
    },
    {
      key: 'level3',
      title: 'Level 3 verification',
      description: 'First upload utility bill, then complete face recognition.',
    },
  ]

  const currentKey =
    action === 'nin'
      ? 'nin'
      : action === 'bvn'
      ? 'bvn'
      : action === 'utility'
      ? 'level3'
      : action === 'face'
      ? 'level3'
      : 'level3'

  const doneKeys = new Set(
    action === 'nin'
      ? []
      : action === 'bvn'
      ? ['nin']
      : action === 'utility'
      ? ['nin', 'bvn']
      : action === 'face'
      ? ['nin', 'bvn']
      : ['nin', 'bvn', 'level3']
  )

  return allSteps.map((step) => ({
    title: step.title,
    description: step.description,
    state: doneKeys.has(step.key)
      ? 'done'
      : step.key === currentKey
      ? 'current'
      : 'upcoming',
  }))
}

type IntroStepBodyProps = {
  action: KycRequiredAction
  isLoadingStatus?: boolean
}

export const IntroStepBody = ({
  action,
  isLoadingStatus = false,
}: IntroStepBodyProps) => {
  const verificationSteps = getVerificationSteps(action)

  return (
    <div className='space-y-4'>
      <div className='bg-secondary-50 rounded-[12px] p-3 flex flex-col gap-2'>
        <p className='font-medium leading-[22px] text-[#143535]'>
          Why do we need this?
        </p>
        <p className='text-sm text-secondary-800 leading-[20px]'>
          This helps us comply with financial regulations and keep your account
          secure. Your information is encrypted and never shared.
        </p>
      </div>

      <div className='flex flex-col gap-1.5'>
        <h3 className='text-lg leading-6 font-medium text-grey-900 mb-4'>
          Verification process
        </h3>
        {isLoadingStatus ? (
          <p className='text-sm text-grey-600'>
            Checking your current KYC level...
          </p>
        ) : (
          <div className='flex flex-col gap-4'>
            {verificationSteps.map((item, i) => (
              <div
                key={item.title}
                className={`flex items-center justify-between gap-4 p-3 rounded-[12px] border ${
                  item.state === 'done'
                    ? 'bg-success-50 border-success-100'
                    : item.state === 'current'
                    ? 'bg-primary-50/40 border-primary-100'
                    : 'bg-grey-50/20 border-dashed border-grey-100'
                }`}
              >
                <div className='flex gap-2 items-center'>
                  <span className='w-10 h-10 rounded-lg shrink-0'>
                    <KycIconIllustration />
                  </span>
                  <div className='flex-1 min-w-0'>
                    <p className='leading-5 font-medium text-blackish'>
                      {item.title}
                    </p>
                    <p className='text-xs text-grey-600 mt-1 leading-4'>
                      {item.description}
                    </p>
                  </div>
                </div>
                <span className='text-sm leading-[18px] text-grey-800 shrink-0'>
                  {item.state === 'done' ? 'Done' : `STEP ${i + 1}`}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

type ActionStepBodyProps = {
  action: KycRequiredAction
  documentNumber: string
  utilityBillFile: File | null
  faceFile: File | null
  fileInputRef: RefObject<HTMLInputElement | null>
  faceInputRef: RefObject<HTMLInputElement | null>
  faceCaptureStage: 'idle' | 'preview' | 'scanning' | 'ready'
  faceScanProgress: number
  isPending?: boolean
  submittedSummary?: string
  statusMessage?: string
  isStatusError?: boolean
  errorMessage?: string
  onDocumentNumberChange: (value: string) => void
  onFileSelect: (event: ChangeEvent<HTMLInputElement>) => void
  onRemoveFile: () => void
  onFaceFileSelect: (event: ChangeEvent<HTMLInputElement>) => void
}

const getDocumentFieldLabel = (action: KycRequiredAction) =>
  action === 'bvn' ? 'BVN Number' : 'NIN Number'

const getDocumentFieldHint = (action: KycRequiredAction) =>
  action === 'bvn'
    ? 'Enter your 11-digit Bank Verification Number.'
    : 'Enter your 11-digit National Identification Number.'

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
  submittedSummary,
  statusMessage,
  isStatusError = false,
  errorMessage,
  onDocumentNumberChange,
  onFileSelect,
  onRemoveFile,
  onFaceFileSelect,
}: ActionStepBodyProps) => {
  const facePreviewUrl = useMemo(() => {
    if (!faceFile) return ''
    return URL.createObjectURL(faceFile)
  }, [faceFile])

  useEffect(() => {
    return () => {
      if (facePreviewUrl) URL.revokeObjectURL(facePreviewUrl)
    }
  }, [facePreviewUrl])

  if (action === 'none') {
    return (
      <div className='rounded-[12px] border border-success-100 bg-success-50 p-4'>
        <p className='text-sm font-medium text-success-700'>
          Your KYC is already complete for your current withdrawal tier.
        </p>
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-6'>
      {statusMessage ? (
        <div
          className={`rounded-[12px] border p-3 ${
            isStatusError
              ? 'bg-error-50 border-error-100 text-error-700'
              : 'bg-information-50 border-information-100 text-information-700'
          }`}
        >
          <p className='text-sm'>{statusMessage}</p>
        </div>
      ) : null}

      {isPending ? (
        <div className='rounded-[12px] border border-grey-100 bg-grey-50/50 p-4'>
          <p className='text-sm font-medium text-blackish'>Submitted details</p>
          <p className='text-sm text-grey-700 mt-1'>
            {submittedSummary || 'Your details have been submitted.'}
          </p>
        </div>
      ) : null}

      {!isPending && (action === 'nin' || action === 'bvn') && (
        <div>
          <label className='text-sm leading-[145%] font-medium text-grey-900 mb-1 block'>
            {getDocumentFieldLabel(action)}
          </label>
          <input
            value={documentNumber}
            onChange={(event) =>
              onDocumentNumberChange(
                event.target.value.replace(/\D/g, '').slice(0, 11)
              )
            }
            inputMode='numeric'
            placeholder='Enter number'
            className='w-full h-[48px] border border-grey-50 rounded-[12px] px-3 text-sm text-blackish font-medium bg-grey-50/15 outline-none focus:border-primary-300'
          />
          <p className='text-xs text-grey-600 mt-2'>
            {getDocumentFieldHint(action)}
          </p>
        </div>
      )}

      {!isPending && action === 'utility' && (
        <div>
          <label className='text-sm leading-[145%] font-medium text-grey-900 mb-1 block'>
            Utility bill document
          </label>

          <input
            ref={fileInputRef}
            type='file'
            accept='.pdf,.jpg,.jpeg,.png'
            onChange={onFileSelect}
            className='hidden'
          />

          {utilityBillFile ? (
            <div className='flex items-center justify-between px-4 py-3.5 rounded-[10px] border border-dashed border-primary-100 bg-primary-50/50'>
              <span className='text-sm leading-[145%] text-grey-900 truncate flex-1 mr-3 font-medium'>
                {utilityBillFile.name}
              </span>
              <button
                type='button'
                onClick={onRemoveFile}
                className='shrink-0 text-error-500 hover:text-error-600 transition-colors'
                aria-label='Remove file'
              >
                <span className='w-5 h-5 block'>
                  <DeleteIcon />
                </span>
              </button>
            </div>
          ) : (
            <button
              type='button'
              onClick={() => fileInputRef.current?.click()}
              className='w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-[10px] border border-dashed border-primary-100 bg-primary-50/40 text-sm text-primary-500 font-medium hover:bg-primary-50/40 transition-colors'
            >
              <span className='w-5 h-5 text-primary-400'>
                <DocumentFieldIcon />
              </span>
              Upload utility bill
            </button>
          )}
        </div>
      )}

      {!isPending && action === 'face' && (
        <div className='space-y-5'>
          <input
            ref={faceInputRef}
            type='file'
            accept='.jpg,.jpeg,.png'
            onChange={onFaceFileSelect}
            className='hidden'
          />

          <div className='mt-4 lg:mt-0 flex flex-col items-center justify-center gap-8'>
            {faceCaptureStage === 'idle' ? (
              <>
                <div className='lg:h-[250px] flex justify-center items-center'>
                  <div className='w-[100px] h-[100px] flex items-center justify-center bg-primary-50 rounded-full'>
                    <div className='w-20 h-20 flex items-center justify-center rounded-full bg-primary-100'>
                      <div className='w-15 h-15 rounded-full bg-primary-400 flex items-center justify-center'>
                        <span className='w-6 h-6 rounded-full text-white flex items-center justify-center'>
                          <FaceScanIcon />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className='text-center text-grey-600 text-sm'>
                  Scan your face to verify your identity
                </p>
              </>
            ) : (
              <>
                <div className='relative'>
                  <div className='rounded-[20px] border border-dashed border-primary-100 overflow-hidden bg-grey-50'>
                    {facePreviewUrl ? (
                      <div className='w-full h-[320px]'>
                        <Image
                          src={facePreviewUrl}
                          alt='Face preview'
                          width={800}
                          height={620}
                          unoptimized
                          className='w-full h-full object-cover'
                        />
                      </div>
                    ) : (
                      <div className='h-[310px] flex items-center justify-center text-grey-500 text-sm'>
                        Face image not available
                      </div>
                    )}
                  </div>
                  {faceCaptureStage === 'scanning' ? (
                    <div className='absolute inset-0 pointer-events-none'>
                      <div className='absolute inset-0 bg-black/10' />
                      <div className='absolute inset-x-6 top-6 bottom-6 border border-white/60 rounded-[14px]' />
                    </div>
                  ) : null}
                </div>
                {faceCaptureStage === 'preview' ? (
                  <>
                    <p className='text-center text-grey-600 text-sm'>
                      Please look into the camera and hold still
                    </p>
                  </>
                ) : null}
                {faceCaptureStage === 'scanning' ||
                faceCaptureStage === 'ready' ? (
                  <div className='space-y-2'>
                    <p className='text-center text-3xl text-blackish font-medium'>
                      {faceCaptureStage === 'ready'
                        ? 'Scan Complete'
                        : 'Scanning...'}
                    </p>
                    <div className='h-3 rounded-full bg-grey-100 overflow-hidden'>
                      <div
                        className='h-full bg-primary-500 transition-all duration-300'
                        style={{
                          width: `${
                            faceCaptureStage === 'ready'
                              ? 100
                              : faceScanProgress
                          }%`,
                        }}
                      />
                    </div>
                    <p className='text-center text-grey-600 text-sm'>
                      {faceCaptureStage === 'ready'
                        ? 'Your face has been captured successfully.'
                        : 'Please keep your face centered so we can capture your face.'}
                    </p>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      )}

      {errorMessage ? (
        <p className='text-sm text-error-500'>{errorMessage}</p>
      ) : null}
    </div>
  )
}
