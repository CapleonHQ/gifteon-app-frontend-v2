import PaymentMethodsManagerSection from '@/components/Profile/sections/PaymentMethodsManagerSection'
import PersonalInfoCard from '@/components/Profile/sections/PersonalInfoCard'
import InterestsSection from '@/components/Profile/sections/InterestsSection'

type PersonalInfoSectionProps = {
  profile: {
    firstName: string
    lastName: string
    phone: string
    email: string
    dob?: Date
    address: string
  }
  interests: { id: string; label: string; icon: string }[]
  isEditingProfile: boolean
  isSavingProfile?: boolean
  profileErrorMessage?: string
  onEditProfile: () => void
  onSaveProfile: () => void
  onPhoneChange: (value: string) => void
  onAddressChange: (value: string) => void
  onDobChange: (value?: Date) => void
  onEditInterests: () => void
}

const PersonalInfoSection = ({
  profile,
  interests,
  isEditingProfile,
  isSavingProfile = false,
  profileErrorMessage,
  onEditProfile,
  onSaveProfile,
  onPhoneChange,
  onAddressChange,
  onDobChange,
  onEditInterests,
}: PersonalInfoSectionProps) => {
  return (
    <div
      className={`flex flex-col gap-8 ${
        isEditingProfile ? 'pb-24 lg:pb-0' : ''
      }`}
    >
      <PersonalInfoCard
        profile={profile}
        isEditing={isEditingProfile}
        isSaving={isSavingProfile}
        errorMessage={profileErrorMessage}
        onEdit={onEditProfile}
        onSave={onSaveProfile}
        onPhoneChange={onPhoneChange}
        onAddressChange={onAddressChange}
        onDobChange={onDobChange}
      />

      <div className={isEditingProfile ? 'hidden lg:block' : ''}>
        <InterestsSection interests={interests} onEdit={onEditInterests} />
      </div>

      <div className={isEditingProfile ? 'hidden lg:block' : ''}>
        <PaymentMethodsManagerSection />
      </div>
    </div>
  )
}

export default PersonalInfoSection
