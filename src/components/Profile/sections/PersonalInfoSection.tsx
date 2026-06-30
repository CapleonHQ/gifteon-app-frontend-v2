import PaymentMethodsManagerSection from '@/components/Profile/sections/PaymentMethodsManagerSection'
import PersonalInfoCard from '@/components/Profile/sections/PersonalInfoCard'
import InterestsSection from '@/components/Profile/sections/InterestsSection'
import VerificationSection from '@/components/Profile/sections/VerificationSection'

type PersonalInfoSectionProps = {
  profile: {
    firstName: string
    lastName: string
    phone: string
    email: string
    dob?: Date
    address: string
    giftseonTag: string
    temporaryTag: boolean
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
  onOpenGiftseonTagModal: () => void
  canChangeGiftseonTag: boolean
  giftseonTagMessage?: string
  onEditInterests: () => void
  onOpenKyc: () => void
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
  onOpenGiftseonTagModal,
  canChangeGiftseonTag,
  giftseonTagMessage,
  onEditInterests,
  onOpenKyc,
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
        onOpenGiftseonTagModal={onOpenGiftseonTagModal}
        canChangeGiftseonTag={canChangeGiftseonTag}
        giftseonTagMessage={giftseonTagMessage}
      />

      <div className={isEditingProfile ? 'hidden lg:block' : ''}>
        <InterestsSection interests={interests} onEdit={onEditInterests} />
      </div>

      <div className={isEditingProfile ? 'hidden lg:block' : ''}>
        <VerificationSection onOpenKyc={onOpenKyc} />
      </div>

      <div className={isEditingProfile ? 'hidden lg:block' : ''}>
        <PaymentMethodsManagerSection />
      </div>
    </div>
  )
}

export default PersonalInfoSection
