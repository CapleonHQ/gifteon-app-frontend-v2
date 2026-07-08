import { X } from 'lucide-react'
import CloseIcon from '@/assets/icons/CloseIcon'
import BackLeftIcon from '@/assets/icons/BackLeftIcon'
import ResponsiveModal from '@/components/common/ResponsiveModal'
import { interestOptions } from '@/components/Profile/profileData'
import InterestChip from '@/components/Profile/components/InterestChip'

type EditInterestsModalProps = {
  isOpen: boolean
  onClose: () => void
  selected: string[]
  onChange: (value: string[]) => void
  onSave: () => void
  isSaving?: boolean
}

const EditInterestsModal = ({
  isOpen,
  onClose,
  selected,
  onChange,
  onSave,
  isSaving = false,
}: EditInterestsModalProps) => {
  const current = interestOptions.filter((item) => selected.includes(item.id))
  const others = interestOptions.filter((item) => !selected.includes(item.id))

  const header = (
    <div className='relative'>
      <button
        type='button'
        onClick={onClose}
        className='absolute -right-5 -top-5 w-9 h-9 rounded-full hidden lg:flex items-center justify-center hover:bg-grey-50'
        aria-label='Close'
      >
        <span className='text-grey-700 w-5 h-5'>
          <CloseIcon />
        </span>
      </button>
      <div className='lg:hidden flex items-center gap-2'>
        <button
          type='button'
          onClick={onClose}
          className='w-6 h-6'
          aria-label='Go back'
        >
          <span className='text-blackish flex'>
            <BackLeftIcon />
          </span>
        </button>
      </div>

      <div className='text-center mt-3 lg:mt-0'>
        <h3 className='text-2xl font-semibold text-blackish'>
          Edit your interests
        </h3>
        <p className='text-sm text-grey-600 mt-1'>
          We&apos;ll use this to recommend gift ideas you&apos;ll actually care
          about.
        </p>
      </div>
    </div>
  )

  const body = (
    <div className='space-y-5'>
      <div className='space-y-2'>
        <p className='font-medium text-grey-900 tracking-[0]'>
          Current Interests
        </p>
        {current.length > 0 ? (
          <div className='flex flex-wrap gap-3'>
            {current.map((interest) => (
              <InterestChip
                key={interest.id}
                label={interest.label}
                icon={interest.icon}
                onClick={() =>
                  onChange(selected.filter((item) => item !== interest.id))
                }
                suffix={
                  <span className='bg-error-50 w-[14px] h-[14px] flex items-center justify-center rounded-full text-error-400 hover:bg-error-100 transition-colors duration-300'>
                    <X className='w-2.5 h-2.5' />
                  </span>
                }
              />
            ))}
          </div>
        ) : (
          <p className='text-sm text-grey-600'>
            No interests selected yet. Choose from Others below.
          </p>
        )}
      </div>
      <div className='space-y-2'>
        <p className='font-medium text-grey-900 tracking-[0]'>Others</p>
        <div className='flex flex-wrap gap-3'>
          {others.map((interest) => (
            <InterestChip
              key={interest.id}
              label={interest.label}
              icon={interest.icon}
              onClick={() => onChange([...selected, interest.id])}
            />
          ))}
        </div>
      </div>
    </div>
  )

  const footer = (
    <div className='flex items-center gap-3'>
      <button
        type='button'
        onClick={onClose}
        className='flex-1 py-3 rounded-[12px] border border-grey-200 text-grey-700 font-medium bg-grey-50/70'
      >
        Cancel
      </button>
      <button
        type='button'
        onClick={onSave}
        disabled={isSaving}
        className='flex-1 py-3 rounded-[12px] bg-linear-to-r from-primary-400 to-primary-600 border border-primary-500 text-white font-medium disabled:opacity-60 disabled:cursor-not-allowed'
      >
        {isSaving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  )

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      desktopMaxWidthClass='max-w-[500px]'
      header={header}
      body={body}
      footer={footer}
    />
  )
}

export default EditInterestsModal
