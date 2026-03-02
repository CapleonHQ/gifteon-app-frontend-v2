'use client'

import { useRef, useState } from 'react'
import { useSuccessModal } from '@/context/SuccessModalContext'
import ResponsiveModal from './ResponsiveModal'

type KycModalProps = {
  isOpen: boolean
  onClose: () => void
}

const DOCUMENT_TYPES = [
  { label: 'NIN', value: 'nin' },
  { label: 'International Passport', value: 'passport' },
  { label: "Driver's License", value: 'drivers_license' },
  { label: "Voter's Card", value: 'voters_card' },
]

  // ─── Progress Bar ────────────────────────────────────────────
  const ProgressBar = ({ current }: { current: number }) => (
    <div className='flex gap-2 w-full'>
      <div
        className={`h-[5px] flex-1 rounded-full transition-colors duration-300 ${
          current >= 1 ? 'bg-[#4F46E5]' : 'bg-gray-200'
        }`}
      />
      <div
        className={`h-[5px] flex-1 rounded-full transition-colors duration-300 ${
          current >= 2 ? 'bg-[#4F46E5]' : 'bg-gray-200'
        }`}
      />
    </div>
  )

const KycVerificationModal = ({ isOpen, onClose }: KycModalProps) => {
  const { openSuccess } = useSuccessModal()
  const [step, setStep] = useState(0)
  const [documentType, setDocumentType] = useState('')
  const [documentFile, setDocumentFile] = useState<File | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClose = () => {
    setStep(0)
    setDocumentType('')
    setDocumentFile(null)
    setIsDropdownOpen(false)
    setIsSubmitting(false)
    onClose()
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
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

  const selectedDocLabel =
    DOCUMENT_TYPES.find((d) => d.value === documentType)?.label || ''


  // ─── Step 0: Intro ──────────────────────────────────────────
  if (step === 0) {
    return (
      <ResponsiveModal
        isOpen={isOpen}
        onClose={handleClose}
        desktopMaxWidthClass='max-w-[520px]'
        header={
          <div className='flex flex-col items-center text-center'>
            <button
              type='button'
              onClick={handleClose}
              className='absolute top-5 right-5 w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors'
              aria-label='Close'
            >
              <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                <path d='M2 2L14 14M2 14L14 2' stroke='#6B7280' strokeWidth='2' strokeLinecap='round' />
              </svg>
            </button>
            <h2 className='text-xl font-bold text-gray-900'>
              We need a little more info
            </h2>
            <p className='text-sm text-gray-500 mt-2 max-w-[360px]'>
              To withdraw amounts above ₦100,000, we need a quick ID check. This will only take a minute.
            </p>
          </div>
        }
        body={
          <div className='flex flex-col gap-6'>
            {/* Why do we need this */}
            <div className='bg-[#bbddf636] rounded-xl p-4'>
              <p className='text-sm font-semibold text-gray-900 mb-1'>
                Why do we need this?
              </p>
              <p className='text-sm text-[#637f96] leading-relaxed'>
                This helps us comply with financial regulations and keep your account secure. Your information is encrypted and never shared.
              </p>
            </div>

            {/* Verification Process */}
            <div>
              <h3 className='text-base font-semibold text-gray-900 mb-4'>
                Verification process
              </h3>
              <div className='flex flex-col gap-3'>
                {[
                  {
                    title: 'Upload your ID Document',
                    description:
                      "This could be your National ID, Driver's License, or International Passport",
                    step: 'STEP 1',
                  },
                  {
                    title: 'Verify your Identity',
                    description:
                      'This is a quick selfie verification to match your ID',
                    step: 'STEP 2',
                  },
                  {
                    title: 'Review & Approval',
                    description:
                      "We'll review your information within 24 hours",
                    step: 'STEP 3',
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className='flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-white'
                  >
                    <div className='w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0'>
                      <svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
                        <rect x='2' y='3' width='16' height='14' rx='2' stroke='#374151' strokeWidth='1.5' />
                        <path d='M6 8H14M6 11H10' stroke='#374151' strokeWidth='1.5' strokeLinecap='round' />
                      </svg>
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-semibold text-gray-900'>
                        {item.title}
                      </p>
                      <p className='text-xs text-gray-500 mt-0.5 leading-relaxed'>
                        {item.description}
                      </p>
                    </div>
                    <span className='text-xs font-semibold text-gray-400 shrink-0'>
                      {item.step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        }
        footer={
          <div className='flex gap-3'>
            <button
              type='button'
              onClick={handleClose}
              className='flex-1 py-3.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors'
            >
              Cancel
            </button>
            <button
              type='button'
              onClick={() => setStep(1)}
              className='flex-1 py-3.5 rounded-xl bg-[#4F46E5] text-white font-semibold text-sm hover:bg-[#4338CA] transition-colors'
            >
              Start KYC
            </button>
          </div>
        }
      />
    )
  }

  // ─── Step 1: Document Upload ────────────────────────────────
  if (step === 1) {
    return (
      <ResponsiveModal
        isOpen={isOpen}
        onClose={handleClose}
        desktopMaxWidthClass='max-w-[520px]'
        header={
          <div className='flex flex-col items-center text-center relative'>
            <button
              type='button'
              onClick={handleClose}
              className='absolute -top-2 -right-2 w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors'
              aria-label='Close'
            >
              <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                <path d='M2 2L14 14M2 14L14 2' stroke='#6B7280' strokeWidth='2' strokeLinecap='round' />
              </svg>
            </button>
            <h2 className='text-xl font-bold text-gray-900'>Update KYC</h2>
            <p className='text-sm text-gray-500 mt-1'>
              Please provide the correct details to update your profile
            </p>
            <div className='w-full mt-5'>
              <ProgressBar current={1} />
            </div>
          </div>
        }
        body={
          <div className='flex flex-col gap-5'>
            {/* Document Type */}
            <div>
              <label className='text-sm font-semibold text-gray-900 mb-2 block'>
                Document type
              </label>
              <div className='relative'>
                <button
                  type='button'
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border text-sm text-left transition-colors ${
                    documentType
                      ? 'border-gray-300 text-gray-900 bg-white'
                      : 'border-gray-200 text-gray-400 bg-white'
                  }`}
                >
                  <span>{selectedDocLabel || 'Select an option'}</span>
                  <svg
                    width='16'
                    height='16'
                    viewBox='0 0 16 16'
                    fill='none'
                    className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  >
                    <path d='M4 6L8 10L12 6' stroke='#6B7280' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className='absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden'>
                    {DOCUMENT_TYPES.map((doc) => (
                      <button
                        key={doc.value}
                        type='button'
                        onClick={() => {
                          setDocumentType(doc.value)
                          setIsDropdownOpen(false)
                        }}
                        className={`w-full px-4 py-3 text-sm text-left hover:bg-gray-50 transition-colors ${
                          documentType === doc.value
                            ? 'text-[#4F46E5] font-medium bg-indigo-50'
                            : 'text-gray-700'
                        }`}
                      >
                        {doc.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Document Upload */}
            <div>
              <label className='text-sm font-semibold text-gray-900 mb-2 block'>
                Document
              </label>

              <input
                ref={fileInputRef}
                type='file'
                accept='.pdf,.jpg,.jpeg,.png'
                onChange={handleFileSelect}
                className='hidden'
              />

              {documentFile ? (
                <div className='flex items-center justify-between px-4 py-3.5 rounded-xl border border-gray-200 bg-white'>
                  <span className='text-sm text-gray-900 truncate flex-1 mr-3'>
                    {documentFile.name}
                  </span>
                  <button
                    type='button'
                    onClick={handleRemoveFile}
                    className='shrink-0 text-red-500 hover:text-red-700 transition-colors'
                    aria-label='Remove file'
                  >
                    <svg width='18' height='18' viewBox='0 0 18 18' fill='none'>
                      <path
                        d='M3.75 5.25H14.25M7.5 8.25V12.75M10.5 8.25V12.75M4.5 5.25L5.25 14.25C5.25 14.6478 5.40804 15.0294 5.68934 15.3107C5.97064 15.592 6.35218 15.75 6.75 15.75H11.25C11.6478 15.75 12.0294 15.592 12.3107 15.3107C12.592 15.0294 12.75 14.6478 12.75 14.25L13.5 5.25M6.75 5.25V3.75C6.75 3.55109 6.82902 3.36032 6.96967 3.21967C7.11032 3.07902 7.30109 3 7.5 3H10.5C10.6989 3 10.8897 3.07902 11.0303 3.21967C11.171 3.36032 11.25 3.55109 11.25 3.75V5.25'
                        stroke='currentColor'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  type='button'
                  onClick={() => fileInputRef.current?.click()}
                  className='w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-sm text-[#4F46E5] font-medium hover:border-[#4F46E5] hover:bg-indigo-50/50 transition-colors'
                >
                  <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                    <path
                      d='M2 11L2 12.5C2 13.3284 2.67157 14 3.5 14L12.5 14C13.3284 14 14 13.3284 14 12.5V11M8 2V10.5M8 2L5 5M8 2L11 5'
                      stroke='currentColor'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                  Upload document
                </button>
              )}
            </div>
          </div>
        }
        footer={
          <div className='flex gap-3'>
            <button
              type='button'
              onClick={handleClose}
              className='flex-1 py-3.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors'
            >
              Cancel
            </button>
            <button
              type='button'
              onClick={() => setStep(2)}
              disabled={!documentType || !documentFile}
              className={`flex-1 py-3.5 rounded-xl font-semibold text-sm transition-all ${
                documentType && documentFile
                  ? 'bg-[#4F46E5] text-white hover:bg-[#4338CA]'
                  : 'bg-[#4F46E5]/40 text-white/70 cursor-not-allowed'
              }`}
            >
              Continue
            </button>
          </div>
        }
      />
    )
  }

  // ─── Step 2: Face Verification ──────────────────────────────
  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={handleClose}
      desktopMaxWidthClass='max-w-[520px]'
      header={
        <div className='flex flex-col items-center text-center relative'>
          <button
            type='button'
            onClick={handleClose}
            className='absolute -top-2 -right-2 w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors'
            aria-label='Close'
          >
            <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
              <path d='M2 2L14 14M2 14L14 2' stroke='#6B7280' strokeWidth='2' strokeLinecap='round' />
            </svg>
          </button>
          <h2 className='text-xl font-bold text-gray-900'>Face Verification</h2>
          <div className='w-full mt-5'>
            <ProgressBar current={2} />
          </div>
        </div>
      }
      body={
        <div className='flex flex-col items-center py-8'>
          {/* Face scan icon with rings */}
          <div className='relative w-[140px] h-[140px] flex items-center justify-center'>
            {/* Outer ring */}
            <div className='absolute inset-0 rounded-full bg-[#4F46E5]/5' />
            {/* Middle ring */}
            <div className='absolute inset-[18px] rounded-full bg-[#4F46E5]/10' />
            {/* Inner circle */}
            <div className='w-16 h-16 rounded-full bg-[#4F46E5]/15 flex items-center justify-center'>
              <svg width='28' height='28' viewBox='0 0 28 28' fill='none'>
                {/* Face scan icon */}
                <rect x='4' y='4' width='6' height='2' rx='1' fill='#4F46E5' />
                <rect x='4' y='4' width='2' height='6' rx='1' fill='#4F46E5' />
                <rect x='18' y='4' width='6' height='2' rx='1' fill='#4F46E5' />
                <rect x='22' y='4' width='2' height='6' rx='1' fill='#4F46E5' />
                <rect x='4' y='22' width='6' height='2' rx='1' fill='#4F46E5' />
                <rect x='4' y='18' width='2' height='6' rx='1' fill='#4F46E5' />
                <rect x='18' y='22' width='6' height='2' rx='1' fill='#4F46E5' />
                <rect x='22' y='18' width='2' height='6' rx='1' fill='#4F46E5' />
                {/* Face */}
                <circle cx='11' cy='12' r='1.5' fill='#4F46E5' />
                <circle cx='17' cy='12' r='1.5' fill='#4F46E5' />
                <path d='M11 17C11 17 12.5 19 14 19C15.5 19 17 17 17 17' stroke='#4F46E5' strokeWidth='1.5' strokeLinecap='round' />
              </svg>
            </div>
          </div>

          <p className='text-sm text-gray-500 mt-6'>
            Scan your face to verify your identity
          </p>
        </div>
      }
      footer={
        <div className='flex gap-3'>
          <button
            type='button'
            onClick={() => setStep(1)}
            className='flex-1 py-3.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2'
          >
            <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
              <path d='M10 12L6 8L10 4' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
            Go Back
          </button>
          <button
            type='button'
            onClick={handleStartScan}
            disabled={isSubmitting}
            className='flex-1 py-3.5 rounded-xl bg-[#4F46E5] text-white font-semibold text-sm hover:bg-[#4338CA] transition-colors disabled:opacity-60'
          >
            {isSubmitting ? (
              <span className='flex items-center justify-center gap-2'>
                <svg className='animate-spin h-4 w-4' viewBox='0 0 24 24'>
                  <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' fill='none' />
                  <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z' />
                </svg>
                Verifying...
              </span>
            ) : (
              'Start Scan'
            )}
          </button>
        </div>
      }
    />
  )
}

export default KycVerificationModal
