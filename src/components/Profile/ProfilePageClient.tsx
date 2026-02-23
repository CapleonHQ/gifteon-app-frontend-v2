'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { format } from 'date-fns'
import { useSuccessModal } from '@/context/SuccessModalContext'
import ProfileHeader from '@/components/Profile/ProfileHeader'
import ProfileTabs from '@/components/Profile/ProfileTabs'
import PersonalInfoSection from '@/components/Profile/sections/PersonalInfoSection'
import NotificationsSection from '@/components/Profile/sections/NotificationsSection'
import AccountPinSection from '@/components/Profile/sections/AccountPinSection'
import EditInterestsModal from '@/components/Profile/modals/EditInterestsModal'
import {
  interestOptions,
  initialNotificationPrefs,
} from '@/components/Profile/profileData'
import type { ProfileTabId } from '@/types/Profile'
import { useProfile, useUpdateProfile } from '@/hooks/tanstack/account'
import type { UserProfile } from '@/types/Account'

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

const toProfileForm = (user: UserProfile | undefined): ProfileFormState => {
  if (!user) {
    return {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      dob: undefined,
      address: '',
      gender: '',
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
  const [isInterestsOpen, setIsInterestsOpen] = useState(false)
  const [profileDraft, setProfileDraft] = useState<ProfileFormState | null>(
    null
  )
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
  const autoEditHandledRef = useRef(false)
  const profileQuery = useProfile()
  const profileData = profileQuery.data?.data
  const updateProfileMutation = useUpdateProfile()

  const currentInterests = useMemo(
    () => interestOptions.filter((item) => selectedInterests.includes(item.id)),
    [selectedInterests]
  )
  const profileFromApi = useMemo(() => toProfileForm(profileData), [profileData])
  const activeProfile = profileDraft ?? profileFromApi
  const isLoadingProfile = profileQuery.isLoading && !profileData
  const isKycEnabled = profileData?.kycEnabled ?? false

  useEffect(() => {
    if (!profileData) return

    const params = new URLSearchParams(window.location.search)
    const mode = params.get('mode')
    if (mode !== 'edit') {
      autoEditHandledRef.current = false
      return
    }
    if (autoEditHandledRef.current) return

    autoEditHandledRef.current = true
    const nextDraft = toProfileForm(profileData)

    window.requestAnimationFrame(() => {
      setActiveTab('personal')
      setIsEditingProfile(true)
      setProfileDraft(nextDraft)
      setProfileErrorMessage('')
    })

    params.delete('mode')
    const nextQuery = params.toString()
    const nextUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ''}`
    window.history.replaceState(null, '', nextUrl)
  })

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

  if (isLoadingProfile) {
    return (
      <div className='w-full min-h-[50vh] flex items-center justify-center'>
        <div className='flex flex-col items-center gap-3'>
          <div className='h-10 w-10 animate-spin rounded-full border-2 border-primary-200 border-t-primary-500' />
          <p className='text-sm text-grey-700'>Loading profile...</p>
        </div>
      </div>
    )
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
              isVerified: isKycEnabled,
            }}
          />
        </div>
        {/* {!isKycEnabled && (
          <div className='lg:pt-4'>
            <KycBanner
              message='Please provide your details for optimal experience on Giftseon'
              actionLabel='Complete your profile'
              actionHref='#'
            />
          </div>
        )} */}

        <div className='px-4 lg:px-10 pb-6'>
          <div className='flex flex-col gap-5'>
            <ProfileTabs
              activeTab={activeTab}
              onChange={(tab) => {
                setActiveTab(tab)
                handleCancelProfileEdit()
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
                    const base = prev ?? profileFromApi
                    return { ...base, phone: value }
                  })
                }
                onAddressChange={(value) =>
                  setProfileDraft((prev) => {
                    setProfileErrorMessage('')
                    const base = prev ?? profileFromApi
                    return { ...base, address: value }
                  })
                }
                onDobChange={(value) =>
                  setProfileDraft((prev) => {
                    setProfileErrorMessage('')
                    const base = prev ?? profileFromApi
                    return { ...base, dob: value }
                  })
                }
                onEditInterests={() => setIsInterestsOpen(true)}
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
                pinActivated={profileData?.pinActivated ?? false}
                onRequestSetPin={() => {
                  if (typeof window === 'undefined') return
                  window.dispatchEvent(new Event('open-transaction-pin-modal'))
                }}
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
    </div>
  )
}

export default ProfilePageClient
