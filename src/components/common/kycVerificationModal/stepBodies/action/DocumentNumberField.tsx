type DocumentNumberFieldProps = {
  action: 'nin' | 'bvn'
  value: string
  onChange: (value: string) => void
}

const getDocumentFieldLabel = (action: 'nin' | 'bvn') =>
  action === 'bvn' ? 'BVN Number' : 'NIN Number'

const getDocumentFieldHint = (action: 'nin' | 'bvn') =>
  action === 'bvn'
    ? 'Enter your 11-digit Bank Verification Number.'
    : 'Enter your 11-digit National Identification Number.'

const DocumentNumberField = ({ action, value, onChange }: DocumentNumberFieldProps) => (
  <div>
    <label className='text-sm leading-[145%] font-medium text-grey-900 mb-1 block'>
      {getDocumentFieldLabel(action)}
    </label>
    <input
      value={value}
      onChange={(event) => onChange(event.target.value.replace(/\D/g, '').slice(0, 11))}
      inputMode='numeric'
      placeholder='Enter number'
      className='w-full h-[48px] border border-grey-50 rounded-[12px] px-3 text-sm text-blackish font-medium bg-grey-50/15 outline-none focus:border-primary-300'
    />
    <p className='text-xs text-grey-600 mt-2'>{getDocumentFieldHint(action)}</p>
  </div>
)

export default DocumentNumberField
