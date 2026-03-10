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
import ChangeGiftseonTagModal from '@/components/Profile/modals/ChangeGiftseonTagModal'
import KycVerificationModal from '@/components/common/KycVerificationModal'
import {
  interestOptions,
  initialNotificationPrefs,
} from '@/components/Profile/profileData'
import type { ProfileTabId } from '@/types/Profile'
import {
  useChangeTag,
  useProfile,
  useUpdateProfile,
} from '@/hooks/tanstack/account'
import { useKycStatus } from '@/hooks/tanstack/kyc'
import {
  useProfileVerificationBadge,
} from '@/components/Profile/hooks/useProfileVerificationBadge'
import { useProfileKycModal } from '@/components/Profile/hooks/useProfileKycModal'
import {
  toProfileForm,
  type ProfileFormState,
} from '@/components/Profile/utils/profileForm'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'sonner'
import { uploadImage } from '@/api/services/upload'
import { useDebounce } from '@/hooks/useDebounce'
import { verifyTag } from '@/api/services/account'

const MAX_PROFILE_PHOTO_SIZE_BYTES = 5 * 1024 * 1024
const GIFTSEON_TAG_PATTERN = /^[a-z0-9_-]+$/
const normalizeTag = (value: string) => value.trim().replace(/^@+/, '').toLowerCase()
const normalizeInterestValue = (value: string) => value.trim().toLowerCase()

const ProfilePageClient = () => {
  const { openSuccess } = useSuccessModal()
  const { refreshUser } = useAuth()
  const [activeTab, setActiveTab] = useState<ProfileTabId>('personal')
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isInterestsOpen, setIsInterestsOpen] = useState(false)
  const [isGiftseonTagModalOpen, setIsGiftseonTagModalOpen] = useState(false)
  const [profileDraft, setProfileDraft] = useState<ProfileFormState | null>(
    null
  )
  const [profileErrorMessage, setProfileErrorMessage] = useState('')
  const [profilePhotoPreviewUrl, setProfilePhotoPreviewUrl] = useState('')
  const [isUploadingProfilePhoto, setIsUploadingProfilePhoto] = useState(false)
  const [giftseonTagDraft, setGiftseonTagDraft] = useState('')
  const [isCheckingGiftseonTag, setIsCheckingGiftseonTag] = useState(false)
  const [verifiedAvailableGiftseonTag, setVerifiedAvailableGiftseonTag] = useState('')
  const [giftseonTagMessage, setGiftseonTagMessage] = useState(
    'You can change your Giftseon tag only once. Choose carefully.'
  )
  const [hasGiftseonTagError, setHasGiftseonTagError] = useState(false)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [interestsDraft, setInterestsDraft] = useState<string[]>([])
  const [notifications, setNotifications] = useState(initialNotificationPrefs)
  const autoEditHandledRef = useRef(false)
  const tagVerifyRequestIdRef = useRef(0)
  const profileQuery = useProfile()
  const profileData = profileQuery.data?.data
  const kycStatusQuery = useKycStatus()
  const { isKycModalOpen, openKycModal, closeKycModal } = useProfileKycModal()
  const updateProfileMutation = useUpdateProfile()
  const updateProfilePhotoMutation = useUpdateProfile()
  const updateInterestsMutation = useUpdateProfile()
  const changeTagMutation = useChangeTag()

  const interestIdByNormalizedValue = useMemo(() => {
    return interestOptions.reduce<Record<string, string>>((acc, option) => {
      acc[normalizeInterestValue(option.id)] = option.id
      acc[normalizeInterestValue(option.label)] = option.id
      return acc
    }, {})
  }, [])

  const currentInterests = useMemo(
    () => interestOptions.filter((item) => selectedInterests.includes(item.id)),
    [selectedInterests]
  )
  const profileFromApi = useMemo(() => toProfileForm(profileData), [profileData])
  const activeProfile = useMemo(() => {
    const base = profileDraft ?? profileFromApi
    return {
      ...base,
      giftseonTag: profileFromApi.giftseonTag,
    }
  }, [profileDraft, profileFromApi])
  const normalizedDraftTag = useMemo(
    () => normalizeTag(giftseonTagDraft),
    [giftseonTagDraft]
  )
  const normalizedCurrentApiTag = useMemo(
    () => normalizeTag(profileFromApi.giftseonTag),
    [profileFromApi.giftseonTag]
  )
  const canChangeGiftseonTag = Boolean(profileData?.temporaryTag)
  const debouncedGiftseonTag = useDebounce(normalizedDraftTag, 500)
  const isGiftseonTagDirty =
    canChangeGiftseonTag && normalizedDraftTag !== normalizedCurrentApiTag
  const canSaveGiftseonTag =
    isGiftseonTagModalOpen &&
    isGiftseonTagDirty &&
    !hasGiftseonTagError &&
    giftseonTagMessage === 'Tag is available.' &&
    !isCheckingGiftseonTag &&
    !changeTagMutation.isPending
  const isLoadingProfile = profileQuery.isLoading && !profileData
  const hasProfileError =
    profileQuery.isError ||
    profileQuery.isRefetchError ||
    (!profileQuery.isLoading && !profileData)
  const { label: verificationLabel, tone: verificationTone } =
    useProfileVerificationBadge(kycStatusQuery.data?.data, profileData?.kycEnabled)

  useEffect(() => {
    if (!profileData) return
    const incomingInterests = Array.isArray(profileData.interests)
      ? profileData.interests
      : []

    const mappedIds = incomingInterests
      .map((interest) => interestIdByNormalizedValue[normalizeInterestValue(interest)])
      .filter((value): value is string => Boolean(value))

    setSelectedInterests(mappedIds)
    setInterestsDraft(mappedIds)
  }, [interestIdByNormalizedValue, profileData])

  useEffect(() => {
    setGiftseonTagDraft(profileFromApi.giftseonTag)
  }, [profileFromApi.giftseonTag])

  useEffect(() => {
    return () => {
      if (!profilePhotoPreviewUrl) return
      URL.revokeObjectURL(profilePhotoPreviewUrl)
    }
  }, [profilePhotoPreviewUrl])

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

  useEffect(() => {
    if (!isGiftseonTagModalOpen) {
      setHasGiftseonTagError(false)
      setIsCheckingGiftseonTag(false)
      setVerifiedAvailableGiftseonTag('')
      setGiftseonTagMessage(
        canChangeGiftseonTag
          ? 'You can change your Giftseon tag only once. Choose carefully.'
          : 'Your Giftseon tag has already been changed and can no longer be edited.'
      )
      return
    }

    if (!canChangeGiftseonTag) {
      setHasGiftseonTagError(false)
      setIsCheckingGiftseonTag(false)
      setVerifiedAvailableGiftseonTag('')
      setGiftseonTagMessage(
        'Your Giftseon tag has already been changed and can no longer be edited.'
      )
      return
    }

    if (!debouncedGiftseonTag || debouncedGiftseonTag === normalizedCurrentApiTag) {
      setHasGiftseonTagError(false)
      setIsCheckingGiftseonTag(false)
      setVerifiedAvailableGiftseonTag('')
      setGiftseonTagMessage('You can change your Giftseon tag only once. Choose carefully.')
      return
    }

    if (!GIFTSEON_TAG_PATTERN.test(debouncedGiftseonTag)) {
      setHasGiftseonTagError(true)
      setIsCheckingGiftseonTag(false)
      setVerifiedAvailableGiftseonTag('')
      setGiftseonTagMessage(
        'Tag can only include lowercase letters, numbers, hyphen, or underscore.'
      )
      return
    }

    if (verifiedAvailableGiftseonTag === debouncedGiftseonTag) {
      setHasGiftseonTagError(false)
      setIsCheckingGiftseonTag(false)
      setGiftseonTagMessage('Tag is available.')
      return
    }

    let isCancelled = false
    const requestId = tagVerifyRequestIdRef.current + 1
    tagVerifyRequestIdRef.current = requestId
    setIsCheckingGiftseonTag(true)
    ;(async () => {
      try {
        const resp = await verifyTag({ tag: debouncedGiftseonTag })
        if (isCancelled || requestId !== tagVerifyRequestIdRef.current) return

        const exists = Boolean(resp.data?.exists)
        if (exists) {
          setIsCheckingGiftseonTag(false)
          setVerifiedAvailableGiftseonTag('')
          setHasGiftseonTagError(true)
          setGiftseonTagMessage('This tag is already taken. Try another one.')
          return
        }

        setIsCheckingGiftseonTag(false)
        setVerifiedAvailableGiftseonTag(debouncedGiftseonTag)
        setHasGiftseonTagError(false)
        setGiftseonTagMessage('Tag is available.')
      } catch {
        if (isCancelled || requestId !== tagVerifyRequestIdRef.current) return
        setIsCheckingGiftseonTag(false)
        setVerifiedAvailableGiftseonTag('')
        setHasGiftseonTagError(true)
        setGiftseonTagMessage('Unable to verify tag right now. Please try again.')
      }
    })()

    return () => {
      isCancelled = true
    }
  }, [
    canChangeGiftseonTag,
    debouncedGiftseonTag,
    isGiftseonTagModalOpen,
    normalizedCurrentApiTag,
    verifiedAvailableGiftseonTag,
  ])

  const handleCancelProfileEdit = () => {
    setIsEditingProfile(false)
    setProfileDraft(null)
    setProfileErrorMessage('')
  }

  const handleOpenGiftseonTagModal = () => {
    if (!canChangeGiftseonTag) return
    setIsGiftseonTagModalOpen(true)
    setGiftseonTagDraft(profileFromApi.giftseonTag)
    setHasGiftseonTagError(false)
    setVerifiedAvailableGiftseonTag('')
    setGiftseonTagMessage('You can change your Giftseon tag only once. Choose carefully.')
  }

  const handleCloseGiftseonTagModal = () => {
    setIsGiftseonTagModalOpen(false)
    setGiftseonTagDraft(profileFromApi.giftseonTag)
    setHasGiftseonTagError(false)
    setIsCheckingGiftseonTag(false)
    setVerifiedAvailableGiftseonTag('')
    setGiftseonTagMessage('You can change your Giftseon tag only once. Choose carefully.')
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
      await refreshUser()
      handleCancelProfileEdit()
      openSuccess({ message: 'Your profile has been successfully updated.' })
    } catch {
      setProfileErrorMessage('Unable to update profile. Please try again.')
    }
  }

  const handleSaveGiftseonTag = async () => {
    if (!canChangeGiftseonTag) return

    const nextTag = normalizeTag(giftseonTagDraft)
    if (!nextTag) {
      setHasGiftseonTagError(true)
      setGiftseonTagMessage('Tag is required.')
      return
    }
    if (!GIFTSEON_TAG_PATTERN.test(nextTag)) {
      setHasGiftseonTagError(true)
      setGiftseonTagMessage(
        'Tag can only include lowercase letters, numbers, hyphen, or underscore.'
      )
      return
    }
    if (!isGiftseonTagDirty) {
      setHasGiftseonTagError(false)
      setGiftseonTagMessage('You have not changed the tag yet.')
      return
    }
    if (verifiedAvailableGiftseonTag !== nextTag || hasGiftseonTagError) {
      setHasGiftseonTagError(true)
      setGiftseonTagMessage('Please choose an available tag before saving.')
      return
    }

    try {
      await changeTagMutation.mutateAsync({ tag: nextTag })
      await refreshUser()
      setIsGiftseonTagModalOpen(false)
      setVerifiedAvailableGiftseonTag('')
      setHasGiftseonTagError(false)
      setGiftseonTagMessage(
        'Your Giftseon tag has already been changed and can no longer be edited.'
      )
      openSuccess({ message: 'Your Giftseon tag has been successfully updated.' })
    } catch {
      setHasGiftseonTagError(true)
      setGiftseonTagMessage('Unable to update tag. Please try again.')
    }
  }

  const handleSelectProfilePhoto = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file.')
      return
    }
    if (file.size > MAX_PROFILE_PHOTO_SIZE_BYTES) {
      toast.error('Image size must be 5MB or less.')
      return
    }

    const nextPreviewUrl = URL.createObjectURL(file)
    setProfilePhotoPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return nextPreviewUrl
    })

    setIsUploadingProfilePhoto(true)
    try {
      const uploadResponse = await uploadImage({
        file,
        folder: 'profile',
      })
      const uploadedImageUrl = uploadResponse?.data?.url

      if (!uploadedImageUrl) {
        throw new Error('Unable to upload profile photo. Please try again.')
      }

      await updateProfilePhotoMutation.mutateAsync({
        profilePicture: uploadedImageUrl,
      })
      await refreshUser()
      setProfilePhotoPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev)
        return ''
      })
      toast.success('Your profile photo has been successfully updated.')
    } catch {
      setProfilePhotoPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev)
        return ''
      })
      toast.error('Unable to upload profile photo. Please try again.')
    } finally {
      setIsUploadingProfilePhoto(false)
    }
  }

  const handleCloseInterestsModal = () => {
    setInterestsDraft(selectedInterests)
    setIsInterestsOpen(false)
  }

  const handleSaveInterests = async () => {
    const sortedCurrent = [...selectedInterests].sort()
    const sortedDraft = [...interestsDraft].sort()
    const hasChanged =
      sortedCurrent.length !== sortedDraft.length ||
      sortedCurrent.some((value, index) => value !== sortedDraft[index])

    if (!hasChanged) {
      setIsInterestsOpen(false)
      return
    }

    const interestsPayload = interestsDraft
      .map((id) => interestOptions.find((option) => option.id === id)?.label)
      .filter((value): value is string => Boolean(value))

    try {
      await updateInterestsMutation.mutateAsync({
        interests: interestsPayload,
      })
      setSelectedInterests(interestsDraft)
      setIsInterestsOpen(false)
      openSuccess({
        message: 'Your interests have been successfully updated.',
      })
    } catch {
      toast.error('Unable to update interests. Please try again.')
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

  if (hasProfileError) {
    return (
      <div className='w-full min-h-[50vh] flex items-center justify-center px-4'>
        <div className='w-full max-w-[420px] rounded-[16px] border border-grey-100 bg-white px-6 py-8 text-center shadow-[0px_10px_18px_-2px_#10192812]'>
          <h2 className='text-lg font-semibold text-blackish'>
            We couldn&apos;t load your profile
          </h2>
          <p className='mt-2 text-sm leading-[22px] text-grey-600'>
            Check your connection and try again.
          </p>
          <button
            type='button'
            onClick={() => profileQuery.refetch()}
            disabled={profileQuery.isFetching}
            className='mt-5 inline-flex items-center justify-center rounded-[10px] border border-grey-200 px-4 py-2 text-sm font-medium text-grey-800 transition-colors hover:bg-grey-50 disabled:cursor-not-allowed disabled:opacity-60'
          >
            {profileQuery.isFetching ? 'Retrying...' : 'Retry'}
          </button>
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
              giftseonTag: activeProfile.giftseonTag,
              profilePicture: profilePhotoPreviewUrl || activeProfile.profilePicture,
              verificationLabel,
              verificationTone,
            }}
            isUploadingPhoto={
              isUploadingProfilePhoto || updateProfilePhotoMutation.isPending
            }
            onSelectPhoto={handleSelectProfilePhoto}
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
                onOpenGiftseonTagModal={handleOpenGiftseonTagModal}
                canChangeGiftseonTag={canChangeGiftseonTag}
                giftseonTagMessage={giftseonTagMessage}
                onEditInterests={() => {
                  setInterestsDraft(selectedInterests)
                  setIsInterestsOpen(true)
                }}
                onOpenKyc={openKycModal}
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
        onClose={handleCloseInterestsModal}
        selected={interestsDraft}
        onChange={setInterestsDraft}
        onSave={handleSaveInterests}
        isSaving={updateInterestsMutation.isPending}
      />

      <ChangeGiftseonTagModal
        isOpen={isGiftseonTagModalOpen}
        onClose={handleCloseGiftseonTagModal}
        tag={giftseonTagDraft}
        onTagChange={(value) => {
          const cleaned = value.replace(/^@+/, '').toLowerCase()
          setGiftseonTagDraft(cleaned)
          setVerifiedAvailableGiftseonTag('')
          if (hasGiftseonTagError) {
            setHasGiftseonTagError(false)
          }
          if (
            giftseonTagMessage !==
            'You can change your Giftseon tag only once. Choose carefully.'
          ) {
            setGiftseonTagMessage(
              'You can change your Giftseon tag only once. Choose carefully.'
            )
          }
        }}
        onSave={handleSaveGiftseonTag}
        canSave={canSaveGiftseonTag}
        isSaving={changeTagMutation.isPending}
        isChecking={isCheckingGiftseonTag}
        message={giftseonTagMessage}
        hasError={hasGiftseonTagError}
      />

      <KycVerificationModal
        isOpen={isKycModalOpen}
        onClose={closeKycModal}
      />
    </div>
  )
}

export default ProfilePageClient
