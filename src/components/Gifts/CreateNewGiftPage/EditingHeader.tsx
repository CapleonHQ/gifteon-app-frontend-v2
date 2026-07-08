import { X } from 'lucide-react'

type EditingHeaderProps = {
  step: 'customize' | 'settings'
  onClose: () => void
}

const EditingHeader = ({ step, onClose }: EditingHeaderProps) => {
  return (
    <div className='hidden lg:flex justify-between p-2.5 sm:px-6 sm:py-5 border-b'>
      <span className='text-xl font-medium'>
        {step === 'customize' ? 'Customize Page' : 'Gift Page Settings'}
      </span>
      <button type='button' onClick={onClose}>
        <X />
      </button>
    </div>
  )
}

export default EditingHeader
