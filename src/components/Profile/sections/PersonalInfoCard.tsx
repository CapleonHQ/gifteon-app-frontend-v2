import { useMemo, useState } from 'react'
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
    dob: string
    address: string
  }
  isEditing: boolean
  onEdit: () => void
  onSave: () => void
}

const PersonalInfoCard = ({
  profile,
  isEditing,
  onEdit,
  onSave,
}: PersonalInfoCardProps) => {
  const parsedDob = useMemo(() => {
    if (!profile.dob) return undefined
    const [day, month, year] = profile.dob.split('/')
    if (!day || !month || !year) return undefined
    const date = new Date(Number(year), Number(month) - 1, Number(day))
    return Number.isNaN(date.getTime()) ? undefined : date
  }, [profile.dob])

  const [dob, setDob] = useState<Date | undefined>(parsedDob)

  return (
    <SectionCard
      title='Personal Information'
      description='These are your personal details'
      action={
        isEditing ? (
          <button
            type='button'
            onClick={onSave}
            className='hidden lg:inline-flex items-center gap-1.5 rounded-[8px] bg-primary-50 text-primary-500 px-3 py-1.5 text-sm leading-[18px] hover:bg-primary-100 transition-colors'
          >
            <span className='w-4 h-4'>
              <Tick01Icon />
            </span>
            Save Changes
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
      <div className='border-t border-grey-50 px-3 lg:px-6 pb-3 lg:pb-6 pt-3 grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-5 lg:gap-y-6'>
        <InputField
          label='First Name'
          defaultValue={profile.firstName}
          disabled={true}
        />
        <InputField
          label='Last Name'
          defaultValue={profile.lastName}
          disabled={true}
        />
        <InputField
          label='Phone Number'
          defaultValue={profile.phone}
          disabled={!isEditing}
        />
        <InputField
          label='Email Address'
          defaultValue={profile.email}
          disabled
        />
        <DatePickerField
          label='Date of Birth'
          value={dob}
          onChange={setDob}
          placeholder='Select date'
          disabled={true}
          displayFormat='dd/MM/yyyy'
        />
        <InputField
          label='Home Address'
          defaultValue={profile.address}
          disabled={!isEditing}
        />
      </div>
    </SectionCard>
  )
}

export default PersonalInfoCard
