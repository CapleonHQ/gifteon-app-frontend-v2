import type { ChangeEvent, RefObject } from 'react'
import KycIconIllustration from '@/assets/icons/diagrams/KycIconIllustration'
import DocumentFieldIcon from '@/assets/icons/DocumentFieldIcon'
import DeleteIcon from '@/assets/icons/DeleteIcon'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DOCUMENT_TYPES, VERIFICATION_STEPS } from './constants'

export const IntroStepBody = () => (
  <div className='space-y-4'>
    <div className='bg-secondary-50 rounded-[12px] p-3 flex flex-col gap-2'>
      <p className='font-medium leading-[22px] text-[#143535]'>Why do we need this?</p>
      <p className='text-sm text-secondary-800 leading-[20px]'>
        This helps us comply with financial regulations and keep your account
        secure. Your information is encrypted and never shared.
      </p>
    </div>

    <div className='flex flex-col gap-1.5'>
      <h3 className='text-lg leading-6 font-medium text-grey-900 mb-4'>
        Verification process
      </h3>
      <div className='flex flex-col gap-4'>
        {VERIFICATION_STEPS.map((item, i) => (
          <div
            key={item.title}
            className='flex items-center justify-between bg-grey-50/20 gap-4 p-3 rounded-[12px] border border-dashed border-grey-100'
          >
            <div className='flex gap-2 items-center'>
              <span className='w-10 h-10 rounded-lg shrink-0'>
                <KycIconIllustration />
              </span>
              <div className='flex-1 min-w-0'>
                <p className='leading-5 font-medium text-blackish'>{item.title}</p>
                <p className='text-xs text-grey-600 mt-1 leading-4'>
                  {item.description}
                </p>
              </div>
            </div>
            <span className='text-sm leading-[18px] text-grey-800 shrink-0'>
              STEP {i + 1}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
)

type DocumentStepBodyProps = {
  documentType: string
  documentFile: File | null
  fileInputRef: RefObject<HTMLInputElement | null>
  onDocumentTypeChange: (value: string) => void
  onFileSelect: (event: ChangeEvent<HTMLInputElement>) => void
  onRemoveFile: () => void
}

export const DocumentStepBody = ({
  documentType,
  documentFile,
  fileInputRef,
  onDocumentTypeChange,
  onFileSelect,
  onRemoveFile,
}: DocumentStepBodyProps) => (
  <div className='flex flex-col gap-6'>
    <div>
      <label className='text-sm leading-[145%] font-medium text-grey-900 mb-1 block'>
        Document type
      </label>
      <Select value={documentType} onValueChange={onDocumentTypeChange}>
        <SelectTrigger className='w-full h-[48px]! border-grey-50 rounded-[12px] text-sm text-blackish font-medium shadow-none! bg-grey-50/15'>
          <SelectValue placeholder='Select an option' />
        </SelectTrigger>
        <SelectContent className='rounded-[12px] border-grey-50'>
          {DOCUMENT_TYPES.map((doc) => (
            <SelectItem key={doc.value} value={doc.value}>
              {doc.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    <div>
      <label className='text-sm leading-[145%] font-medium text-grey-900 mb-1 block'>
        Document
      </label>

      <input
        ref={fileInputRef}
        type='file'
        accept='.pdf,.jpg,.jpeg,.png'
        onChange={onFileSelect}
        className='hidden'
      />

      {documentFile ? (
        <div className='flex items-center justify-between px-4 py-3.5 rounded-[10px] border border-dashed border-primary-100 bg-primary-50/50'>
          <span className='text-sm leading-[145%] text-grey-900 truncate flex-1 mr-3 font-medium'>
            {documentFile.name}
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
          Upload document
        </button>
      )}
    </div>
  </div>
)

export const FaceStepBody = () => (
  <div className='flex flex-col items-center py-8'>
    <div className='relative w-[140px] h-[140px] flex items-center justify-center'>
      <div className='absolute inset-0 rounded-full bg-primary-50' />
      <div className='absolute inset-[18px] rounded-full bg-primary-100' />
      <div className='w-16 h-16 rounded-full bg-primary-200/60 flex items-center justify-center'>
        <svg width='28' height='28' viewBox='0 0 28 28' fill='none'>
          <rect x='4' y='4' width='6' height='2' rx='1' fill='#4F46E5' />
          <rect x='4' y='4' width='2' height='6' rx='1' fill='#4F46E5' />
          <rect x='18' y='4' width='6' height='2' rx='1' fill='#4F46E5' />
          <rect x='22' y='4' width='2' height='6' rx='1' fill='#4F46E5' />
          <rect x='4' y='22' width='6' height='2' rx='1' fill='#4F46E5' />
          <rect x='4' y='18' width='2' height='6' rx='1' fill='#4F46E5' />
          <rect x='18' y='22' width='6' height='2' rx='1' fill='#4F46E5' />
          <rect x='22' y='18' width='2' height='6' rx='1' fill='#4F46E5' />
          <circle cx='11' cy='12' r='1.5' fill='#4F46E5' />
          <circle cx='17' cy='12' r='1.5' fill='#4F46E5' />
          <path
            d='M11 17C11 17 12.5 19 14 19C15.5 19 17 17 17 17'
            stroke='#4F46E5'
            strokeWidth='1.5'
            strokeLinecap='round'
          />
        </svg>
      </div>
    </div>
  </div>
)
