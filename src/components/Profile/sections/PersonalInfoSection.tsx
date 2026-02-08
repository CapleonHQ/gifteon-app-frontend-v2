import PaymentMethodsSection from '@/components/Profile/sections/PaymentMethodsSection'
import PersonalInfoCard from '@/components/Profile/sections/PersonalInfoCard'
import InterestsSection from '@/components/Profile/sections/InterestsSection'
import type { PaymentMethod } from '@/types/Profile/payment'

type PersonalInfoSectionProps = {
  profile: {
    firstName: string
    lastName: string
    phone: string
    email: string
    dob: string
    address: string
  }
  interests: { id: string; label: string; icon: string }[]
  isEditingProfile: boolean
  onEditProfile: () => void
  onSaveProfile: () => void
  onEditInterests: () => void
  paymentMethods: PaymentMethod[]
  onAddAccount: () => void
  onDeletePayment: (method: PaymentMethod) => void
}

const PersonalInfoSection = ({
  profile,
  interests,
  isEditingProfile,
  onEditProfile,
  onSaveProfile,
  onEditInterests,
  paymentMethods,
  onAddAccount,
  onDeletePayment,
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
        onEdit={onEditProfile}
        onSave={onSaveProfile}
      />

      <div className={isEditingProfile ? 'hidden lg:block' : ''}>
        <InterestsSection interests={interests} onEdit={onEditInterests} />
      </div>

      <div className={isEditingProfile ? 'hidden lg:block' : ''}>
        <PaymentMethodsSection
          methods={paymentMethods}
          onAddAccount={onAddAccount}
          onDelete={onDeletePayment}
        />
      </div>
    </div>
  )
}

export default PersonalInfoSection
