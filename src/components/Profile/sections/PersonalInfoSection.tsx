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
  paymentMethods: PaymentMethod[]
  onAddAccount: () => void
  onDeletePayment: (method: PaymentMethod) => void
  onSetDefaultPayment: (method: PaymentMethod) => void
  isLoadingPaymentMethods?: boolean
  hasPaymentMethodsError?: boolean
  onRetryPaymentMethods?: () => void
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
  paymentMethods,
  onAddAccount,
  onDeletePayment,
  onSetDefaultPayment,
  isLoadingPaymentMethods = false,
  hasPaymentMethodsError = false,
  onRetryPaymentMethods,
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
        <PaymentMethodsSection
          methods={paymentMethods}
          onAddAccount={onAddAccount}
          onDelete={onDeletePayment}
          onSetDefault={onSetDefaultPayment}
          isLoading={isLoadingPaymentMethods}
          hasError={hasPaymentMethodsError}
          onRetry={onRetryPaymentMethods}
        />
      </div>
    </div>
  )
}

export default PersonalInfoSection
