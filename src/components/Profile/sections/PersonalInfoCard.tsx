import EditIcon from '@/assets/icons/EditIcon'
import SectionCard from '@/components/Profile/components/SectionCard'
import InputField from '@/components/Profile/components/InputField'
import DatePickerField from '@/components/Gifts/CreateNewGiftPage/Components/DatePickerField'
import Tick01Icon from '@/assets/icons/Tick01Icon'

type PersonalInfoCardProps = {
  profile: {
    firstName: string
    lastName: string
    phone: string
    email: string
    dob?: Date
    address: string
  }
  isEditing: boolean
  isSaving?: boolean
  errorMessage?: string
  onEdit: () => void
  onSave: () => void
  onPhoneChange: (value: string) => void
  onAddressChange: (value: string) => void
  onDobChange: (value?: Date) => void
}

const PersonalInfoCard = ({
  profile,
  isEditing,
  isSaving = false,
  errorMessage,
  onEdit,
  onSave,
  onPhoneChange,
  onAddressChange,
  onDobChange,
}: PersonalInfoCardProps) => {
  return (
    <SectionCard
      title='Personal Information'
      description='These are your personal details'
      action={
        isEditing ? (
          <button
            type='button'
            onClick={onSave}
            disabled={isSaving}
            className='hidden lg:inline-flex items-center gap-1.5 rounded-[8px] bg-primary-50 text-primary-500 px-3 py-1.5 text-sm leading-[18px] hover:bg-primary-100 transition-colors'
          >
            <span className='w-4 h-4'>
              <Tick01Icon />
            </span>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        ) : (
          <button
            type='button'
            onClick={onEdit}
            className='inline-flex items-center gap-1.5 rounded-[8px] bg-primary-50 text-primary-500 px-3 py-1.5 text-sm leading-[18px] hover:bg-primary-100 transition-colors'
          >
            <span className='w-4 h-4'>
              <EditIcon />
            </span>
            Edit
          </button>
        )
      }
    >
      {' '}
      {errorMessage ? (
        <div className='px-3 lg:px-6 pb-4 lg:pb-6'>
          <p className='text-sm text-error-500'>{errorMessage}</p>
        </div>
      ) : null}
      <div className='border-t border-grey-50 px-3 lg:px-6 pb-3 lg:pb-6 pt-3 grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-5 lg:gap-y-6'>
        <InputField
          label='First Name'
          value={profile.firstName}
          disabled={true}
        />
        <InputField
          label='Last Name'
          value={profile.lastName}
          disabled={true}
        />
        <InputField
          label='Phone Number'
          value={profile.phone}
          onChange={onPhoneChange}
          disabled={!isEditing}
        />
        <InputField label='Email Address' value={profile.email} disabled />
        <DatePickerField
          label='Date of Birth'
          value={profile.dob}
          onChange={onDobChange}
          placeholder='Select date'
          disabled={!isEditing}
          displayFormat='dd/MM/yyyy'
        />
        <InputField
          label='Home Address'
          value={profile.address}
          onChange={onAddressChange}
          disabled={!isEditing}
        />
      </div>
    </SectionCard>
  )
}

export default PersonalInfoCard
