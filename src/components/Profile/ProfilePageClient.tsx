'use client'

import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { useSuccessModal } from '@/context/SuccessModalContext'
import ProfileHeader from '@/components/Profile/ProfileHeader'
import ProfileTabs from '@/components/Profile/ProfileTabs'
import PersonalInfoSection from '@/components/Profile/sections/PersonalInfoSection'
import NotificationsSection from '@/components/Profile/sections/NotificationsSection'
import AccountPinSection from '@/components/Profile/sections/AccountPinSection'
import EditInterestsModal from '@/components/Profile/modals/EditInterestsModal'
import AddAccountModal from '@/components/Profile/modals/AddAccountModal'
import DeletePaymentModal from '@/components/Profile/modals/DeletePaymentModal'
import {
  profileData,
  interestOptions,
  initialNotificationPrefs,
} from '@/components/Profile/profileData'
import type { ProfileTabId } from '@/types/Profile'
import type { PaymentMethod } from '@/types/Profile/payment'
import {
  useAvailableBanks,
  useConnectedBanks,
  useConnectBank,
  useDisconnectBank,
  useSetDefaultConnectedBank,
} from '@/hooks/tanstack/banks'
import { useProfile, useUpdateProfile } from '@/hooks/tanstack/account'
import type { UserProfile } from '@/types/Account'

const maskAccountNumber = (value: string): string => {
  if (value.length <= 4) return value
  const suffix = value.slice(-4)
  return `${'*'.repeat(Math.max(0, value.length - 4))}${suffix}`
}

type ProfileFormState = {
  firstName: string
  lastName: string
  phone: string
  email: string
  dob?: Date
  address: string
  gender: string
}

const parseApiDate = (value?: string | null): Date | undefined => {
  if (!value) return undefined
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return undefined
  return parsed
}

const parseDisplayDate = (value?: string): Date | undefined => {
  if (!value) return undefined
  const [day, month, year] = value.split('/')
  if (!day || !month || !year) return undefined
  const parsed = new Date(Number(year), Number(month) - 1, Number(day))
  if (Number.isNaN(parsed.getTime())) return undefined
  return parsed
}

const toProfileForm = (user: UserProfile | undefined): ProfileFormState => {
  if (!user) {
    return {
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      phone: profileData.phone,
      email: profileData.email,
      dob: parseDisplayDate(profileData.dob),
      address: profileData.address,
      gender: profileData.gender,
    }
  }

  return {
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    phone: user.phoneNumber || '',
    email: user.email || '',
    dob: parseApiDate(user.dateOfBirth),
    address: user.homeAddress || '',
    gender: user.gender || '',
  }
}

const ProfilePageClient = () => {
  const { openSuccess } = useSuccessModal()
  const [activeTab, setActiveTab] = useState<ProfileTabId>('personal')
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isEditingPin, setIsEditingPin] = useState(false)
  const [isInterestsOpen, setIsInterestsOpen] = useState(false)
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<PaymentMethod | null>(null)
  const [profileDraft, setProfileDraft] = useState<ProfileFormState | null>(null)
  const [profileErrorMessage, setProfileErrorMessage] = useState('')
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'birthdays',
    'anniversaries',
    'weddings',
    'baby-showers',
    'graduations',
    'housewarmings',
    'fashion',
    'travel',
    'tech',
    'home',
    'food',
    'decor',
    'cash',
  ])
  const [notifications, setNotifications] = useState(initialNotificationPrefs)
  const availableBanksQuery = useAvailableBanks(isAddAccountOpen)
  const connectedBanksQuery = useConnectedBanks()
  const profileQuery = useProfile()
  const updateProfileMutation = useUpdateProfile()
  const connectBankMutation = useConnectBank()
  const disconnectBankMutation = useDisconnectBank()
  const setDefaultBankMutation = useSetDefaultConnectedBank()

  const paymentMethods = useMemo<PaymentMethod[]>(
    () =>
      (connectedBanksQuery.data?.data?.banks ?? []).map((bank) => ({
        id: bank.id,
        bank: bank.bankName,
        account: maskAccountNumber(bank.accountNumber),
        accountName: bank.accountName,
        accountNumber: bank.accountNumber,
        bankCode: bank.bankCode,
        isDefault: bank.isDefault,
      })),
    [connectedBanksQuery.data?.data?.banks]
  )
  const bankOptions = useMemo(
    () =>
      (availableBanksQuery.data?.data?.banks ?? []).map((bank) => ({
        id: bank.id,
        label: bank.name,
        code: bank.code,
      })),
    [availableBanksQuery.data?.data?.banks]
  )

  const currentInterests = useMemo(
    () => interestOptions.filter((item) => selectedInterests.includes(item.id)),
    [selectedInterests]
  )
  const profileFromApi = useMemo(
    () => toProfileForm(profileQuery.data?.data),
    [profileQuery.data?.data]
  )
  const activeProfile = profileDraft ?? profileFromApi

  const handleCancelProfileEdit = () => {
    setIsEditingProfile(false)
    setProfileDraft(null)
    setProfileErrorMessage('')
  }

  const handleSaveProfile = async () => {
    if (!profileDraft) return
    try {
      await updateProfileMutation.mutateAsync({
        phoneNumber: profileDraft.phone || undefined,
        homeAddress: profileDraft.address || undefined,
        dateOfBirth: profileDraft.dob
          ? format(profileDraft.dob, 'yyyy-MM-dd')
          : undefined,
      })
      handleCancelProfileEdit()
      openSuccess({ message: 'Your profile has been successfully updated.' })
    } catch {
      setProfileErrorMessage('Unable to update profile. Please try again.')
    }
  }

  const handleSavePin = () => {
    setIsEditingPin(false)
    openSuccess({ message: 'Your PIN has been successfully updated.' })
  }

  const handleDeletePayment = async () => {
    if (!deleteTarget) return
    try {
      await disconnectBankMutation.mutateAsync(deleteTarget.id)
      setDeleteTarget(null)
      openSuccess({
        message: 'The payment method has been successfully deleted.',
      })
    } catch {
      openSuccess({
        message: 'Unable to delete payment method. Please try again.',
      })
    }
  }

  const handleAddPayment = async (payload: {
    bank: string
    bankCode: string
    accountNumber: string
    accountName: string
    isDefault: boolean
  }) => {
    try {
      await connectBankMutation.mutateAsync({
        bankName: payload.bank,
        bankCode: payload.bankCode,
        accountNumber: payload.accountNumber,
        accountName: payload.accountName,
        isDefault: payload.isDefault,
      })
      setIsAddAccountOpen(false)
      openSuccess({
        message: 'The payment method has been successfully added.',
      })
    } catch {
      openSuccess({
        message: 'Unable to add payment method. Please try again.',
      })
    }
  }

  const handleSetDefaultPayment = async (method: PaymentMethod) => {
    try {
      await setDefaultBankMutation.mutateAsync(method.id)
      openSuccess({
        message: 'Default payment method updated successfully.',
      })
    } catch {
      openSuccess({
        message: 'Unable to update default payment method. Please try again.',
      })
    }
  }

  return (
    <div className='w-full flex flex-col gap-6 lg:gap-8'>
      <div className='bg-white mt-2 lg:mt-0 lg:rounded-[12px] lg:shadow-[0px_10px_18px_-2px_#10192812] overflow-hidden'>
        <div className='mb-4'>
          <ProfileHeader
            profile={{
              firstName: activeProfile.firstName,
              lastName: activeProfile.lastName,
              gender: activeProfile.gender,
            }}
          />
        </div>

        <div className='px-4 lg:px-10 pb-6'>
          <div className='flex flex-col gap-5'>
            <ProfileTabs
              activeTab={activeTab}
              onChange={(tab) => {
                setActiveTab(tab)
                handleCancelProfileEdit()
                setIsEditingPin(false)
              }}
            />

            {activeTab === 'personal' && (
              <PersonalInfoSection
                profile={activeProfile}
                interests={currentInterests}
                isEditingProfile={isEditingProfile}
                isSavingProfile={updateProfileMutation.isPending}
                profileErrorMessage={profileErrorMessage}
                onEditProfile={() => {
                  setIsEditingProfile(true)
                  setProfileDraft(profileFromApi)
                  setProfileErrorMessage('')
                }}
                onSaveProfile={handleSaveProfile}
                onPhoneChange={(value) =>
                  setProfileDraft((prev) => {
                    setProfileErrorMessage('')
                    return prev ? { ...prev, phone: value } : prev
                  })
                }
                onAddressChange={(value) =>
                  setProfileDraft((prev) => {
                    setProfileErrorMessage('')
                    return prev ? { ...prev, address: value } : prev
                  })
                }
                onDobChange={(value) =>
                  setProfileDraft((prev) => {
                    setProfileErrorMessage('')
                    return prev ? { ...prev, dob: value } : prev
                  })
                }
                onEditInterests={() => setIsInterestsOpen(true)}
                paymentMethods={paymentMethods}
                onAddAccount={() => setIsAddAccountOpen(true)}
                onDeletePayment={(method) => setDeleteTarget(method)}
                onSetDefaultPayment={handleSetDefaultPayment}
                isLoadingPaymentMethods={connectedBanksQuery.isLoading}
                hasPaymentMethodsError={connectedBanksQuery.isError}
                onRetryPaymentMethods={() => connectedBanksQuery.refetch()}
              />
            )}

            {activeTab === 'notifications' && (
              <NotificationsSection
                notifications={notifications}
                onChange={setNotifications}
              />
            )}

            {activeTab === 'pin' && (
              <AccountPinSection
                isEditingPin={isEditingPin}
                onEdit={() => setIsEditingPin(true)}
                onSave={handleSavePin}
              />
            )}
          </div>
        </div>
      </div>

      {isEditingProfile && (
        <div className='lg:hidden fixed inset-x-0 bottom-0 bg-white border-t border-grey-100 px-4 py-4 flex items-center gap-3 z-20'>
          <button
            type='button'
            onClick={handleCancelProfileEdit}
            className='flex-1 py-3 rounded-[10px] border border-grey-200 text-grey-700 font-medium bg-grey-50/70 hover:bg-grey-100 transition-colors duration-300'
          >
            Cancel
          </button>
          <button
            type='button'
            onClick={handleSaveProfile}
            disabled={updateProfileMutation.isPending}
            className='flex-1 py-3 rounded-[10px] bg-linear-to-b from-primary-400 from-[17.5%] to-primary-600 border border-primary-500 enabled:hover:from-primary-600 enabled:hover:to-primary-600 text-white font-medium transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed'
          >
            {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}

      <EditInterestsModal
        isOpen={isInterestsOpen}
        onClose={() => setIsInterestsOpen(false)}
        selected={selectedInterests}
        onChange={setSelectedInterests}
        onSave={() => {
          setIsInterestsOpen(false)
          openSuccess({
            message: 'Your interests have been successfully updated.',
          })
        }}
      />

      <AddAccountModal
        isOpen={isAddAccountOpen}
        onClose={() => setIsAddAccountOpen(false)}
        bankOptions={bankOptions}
        isLoadingBanks={availableBanksQuery.isLoading}
        hasBanksError={availableBanksQuery.isError}
        onRetryBanks={() => availableBanksQuery.refetch()}
        isSaving={connectBankMutation.isPending}
        onSave={handleAddPayment}
      />

      <DeletePaymentModal
        target={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onDelete={handleDeletePayment}
      />
    </div>
  )
}

export default ProfilePageClient
