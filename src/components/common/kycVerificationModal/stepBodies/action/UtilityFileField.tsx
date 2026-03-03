import type { ChangeEvent, RefObject } from 'react'
import DocumentFieldIcon from '@/assets/icons/DocumentFieldIcon'
import DeleteIcon from '@/assets/icons/DeleteIcon'

type UtilityFileFieldProps = {
  utilityBillFile: File | null
  fileInputRef: RefObject<HTMLInputElement | null>
  onFileSelect: (event: ChangeEvent<HTMLInputElement>) => void
  onRemoveFile: () => void
}

const UtilityFileField = ({
  utilityBillFile,
  fileInputRef,
  onFileSelect,
  onRemoveFile,
}: UtilityFileFieldProps) => (
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
)

export default UtilityFileField
