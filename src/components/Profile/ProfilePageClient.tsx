'use client'

import { useMemo, useState } from 'react'
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
  paymentMethodsSeed,
} from '@/components/Profile/profileData'
import type { ProfileTabId } from '@/types/Profile'
import type { PaymentMethod } from '@/types/Profile/payment'

const ProfilePageClient = () => {
  const { openSuccess } = useSuccessModal()
  const [activeTab, setActiveTab] = useState<ProfileTabId>('personal')
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isEditingPin, setIsEditingPin] = useState(false)
  const [isInterestsOpen, setIsInterestsOpen] = useState(false)
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<PaymentMethod | null>(null)
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
  const [paymentMethods, setPaymentMethods] =
    useState<PaymentMethod[]>(paymentMethodsSeed)

  const currentInterests = useMemo(
    () => interestOptions.filter((item) => selectedInterests.includes(item.id)),
    [selectedInterests]
  )

  const handleSaveProfile = () => {
    setIsEditingProfile(false)
    openSuccess({ message: 'Your profile has been successfully updated.' })
  }

  const handleSavePin = () => {
    setIsEditingPin(false)
    openSuccess({ message: 'Your PIN has been successfully updated.' })
  }

  const handleDeletePayment = () => {
    if (!deleteTarget) return
    setPaymentMethods((prev) =>
      prev.filter((method) => method.id !== deleteTarget.id)
    )
    setDeleteTarget(null)
    openSuccess({
      message: 'The payment method has been successfully deleted.',
    })
  }

  const handleAddPayment = (payload: {
    bank: string
    account: string
    isDefault: boolean
  }) => {
    setPaymentMethods((prev) => {
      const next = payload.isDefault
        ? prev.map((item) => ({ ...item, isDefault: false }))
        : prev
      return [{ id: `pm-${Date.now()}`, ...payload }, ...next]
    })
    setIsAddAccountOpen(false)
    openSuccess({
      message: 'The payment method has been successfully added.',
    })
  }

  return (
    <div className='w-full flex flex-col gap-6 lg:gap-8'>
      <div className='bg-white mt-2 lg:mt-0 lg:rounded-[12px] lg:shadow-[0px_10px_18px_-2px_#10192812] overflow-hidden'>
        <div className='mb-4'>
          <ProfileHeader profile={profileData} />
        </div>

        <div className='px-4 lg:px-10 pb-6'>
          <div className='flex flex-col gap-5'>
            <ProfileTabs
              activeTab={activeTab}
              onChange={(tab) => {
                setActiveTab(tab)
                setIsEditingProfile(false)
                setIsEditingPin(false)
              }}
            />

            {activeTab === 'personal' && (
              <PersonalInfoSection
                profile={profileData}
                interests={currentInterests}
                isEditingProfile={isEditingProfile}
                onEditProfile={() => setIsEditingProfile(true)}
                onSaveProfile={handleSaveProfile}
                onEditInterests={() => setIsInterestsOpen(true)}
                paymentMethods={paymentMethods}
                onAddAccount={() => setIsAddAccountOpen(true)}
                onDeletePayment={(method) => setDeleteTarget(method)}
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
            onClick={() => setIsEditingProfile(false)}
            className='flex-1 py-3 rounded-[10px] border border-grey-200 text-grey-700 font-medium bg-grey-50/70 hover:bg-grey-100 transition-colors duration-300'
          >
            Cancel
          </button>
          <button
            type='button'
            onClick={handleSaveProfile}
            className='flex-1 py-3 rounded-[10px] bg-linear-to-b from-primary-400 from-[17.5%] to-primary-600 border border-primary-500 enabled:hover:from-primary-600 enabled:hover:to-primary-600 text-white font-medium transition-colors duration-300'
          >
            Save Changes
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
