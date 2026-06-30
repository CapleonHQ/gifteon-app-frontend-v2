import Link from 'next/link'
import { TrophyIcon, ChevronRight, Users } from 'lucide-react'
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
        <Link href='/rewards'>
          <div className='bg-white border border-grey-100 rounded-[12px] px-4 lg:px-6 py-4 flex items-center justify-between gap-4 hover:bg-grey-50 transition-colors group'>
            <div className='flex items-center gap-4'>
              <div className='w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0'>
                <TrophyIcon className='w-5 h-5 text-primary-500' />
              </div>
              <div>
                <p className='text-sm font-medium text-grey-900'>
                  Rewards & Referrals
                </p>
                <p className='text-xs text-grey-500 mt-0.5'>
                  View your coins, rank, and refer friends
                </p>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <div className='flex items-center gap-1 bg-primary-50 text-primary-600 text-xs font-medium px-2.5 py-1 rounded-full'>
                <Users className='w-3 h-3' />
                Referrals
              </div>
              <ChevronRight className='w-4 h-4 text-grey-400 group-hover:text-grey-600 transition-colors' />
            </div>
          </div>
        </Link>
      </div>

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
