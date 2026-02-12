import SectionCard from '@/components/Profile/components/SectionCard'
import InputField from '@/components/Profile/components/InputField'

type AccountPinSectionProps = {
  isEditingPin: boolean
  onEdit: () => void
  onSave: () => void
}

const AccountPinSection = ({
  isEditingPin,
  onEdit,
  onSave,
}: AccountPinSectionProps) => {
  return (
    <SectionCard
      title='Account PIN'
      description='This is the PIN you will use for all your withdrawals'
      action={
        isEditingPin ? (
          <button
            type='button'
            onClick={onSave}
            className='rounded-[8px] bg-primary-50 text-primary-500 px-3 py-1.5 text-sm leading-[18px] hover:bg-primary-100 transition-colors min-w-[106px]'
          >
            Save Changes
          </button>
        ) : (
          <button
            type='button'
            onClick={onEdit}
            className='rounded-[8px] bg-primary-50 text-primary-500 px-3 py-1.5 text-sm leading-[18px] hover:bg-primary-100 transition-colors min-w-[106px]'
          >
            Change PIN
          </button>
        )
      }
    >
      <div className='border-t border-grey-50 px-3 lg:px-6 pb-3 lg:pb-6 pt-3 space-y-6 max-w-[476px]'>
        <InputField
          label='Current PIN'
          placeholder='Enter your current PIN'
          disabled={!isEditingPin}
          type='password'
        />
        <InputField
          label='New PIN'
          placeholder='Enter your new PIN'
          disabled={!isEditingPin}
          type='password'
        />
        <InputField
          label='Confirm PIN'
          placeholder='Confirm your new PIN'
          disabled={!isEditingPin}
          type='password'
        />
      </div>
    </SectionCard>
  )
}

export default AccountPinSection
