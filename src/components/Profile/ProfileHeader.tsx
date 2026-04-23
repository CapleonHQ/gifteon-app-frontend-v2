import { useState } from 'react'
import Tick01Icon from '@/assets/icons/Tick01Icon'
import ProfileHeaderBackground from '@/components/Profile/components/ProfileHeaderBackground'
import ProfileAvatar from '@/components/Profile/components/ProfileAvatar'
import VerifiedBadge from '@/components/Profile/components/VerifiedBadge'
import { CopyIcon } from 'lucide-react'

type ProfileHeaderProps = {
  profile: {
    firstName: string
    lastName: string
    giftseonTag: string
    profilePicture: string
    verificationLabel: string
    verificationTone?: 'verified' | 'warning' | 'pending' | 'rejected'
  }
  isUploadingPhoto?: boolean
  onSelectPhoto: (file: File) => void
}

const ProfileHeader = ({
  profile,
  isUploadingPhoto = false,
  onSelectPhoto,
}: ProfileHeaderProps) => {
  const [isCopyingTag, setIsCopyingTag] = useState(false)
  const [hasCopiedTag, setHasCopiedTag] = useState(false)
  const initials =
    `${profile.firstName?.[0] ?? ''}${
      profile.lastName?.[0] ?? ''
    }`.toUpperCase() || 'U'
  const displayTag = profile.giftseonTag ? `@${profile.giftseonTag}` : ''

  const handleCopyTag = async () => {
    if (
      !displayTag ||
      typeof navigator === 'undefined' ||
      !navigator.clipboard
    ) {
      return
    }

    try {
      setIsCopyingTag(true)
      await navigator.clipboard.writeText(displayTag)
      setHasCopiedTag(true)
      window.setTimeout(() => {
        setHasCopiedTag(false)
      }, 1500)
    } finally {
      setIsCopyingTag(false)
    }
  }

  return (
    <div className='relative'>
      <ProfileHeaderBackground />

      <div className='relative px-4 lg:px-10 -mt-[56px] md:-mt-[64px]'>
        <div className='flex flex-col md:flex-row md:justify-between items-center md:items-end gap-4 md:gap-3'>
          <div className='flex flex-col md:flex-row items-center md:items-end gap-3'>
            <ProfileAvatar
              imageUrl={profile.profilePicture}
              initials={initials}
              isUploading={isUploadingPhoto}
              onSelectFile={onSelectPhoto}
            />
            <div className='flex items-center md:items-start flex-col gap-1'>
              <h2 className='text-xl md:text-2xl font-medium leading-7 text-blackish'>
                {profile.firstName} {profile.lastName}
              </h2>

              {displayTag ? (
                <div className='md:mb-2.5 inline-flex items-center gap-1.5 rounded-full bg-grey-50/90 px-2.5 py-1 text-sm leading-[18px] text-grey-700 ring-1 ring-white/80 shadow-[0_1px_3px_rgba(16,24,40,0.06)]'>
                  <span className='font-medium text-blackish'>
                    {displayTag}
                  </span>
                  <button
                    type='button'
                    onClick={handleCopyTag}
                    disabled={isCopyingTag}
                    aria-label='Copy Giftseon tag'
                    className='inline-flex h-5 w-5 items-center justify-center rounded-full text-grey-500 transition-colors hover:bg-white hover:text-primary-500 disabled:cursor-not-allowed disabled:opacity-60'
                  >
                    {hasCopiedTag ? (
                      <span className='h-3.5 w-3.5 text-success-500'>
                        <Tick01Icon />
                      </span>
                    ) : (
                      <CopyIcon className='size-3.5' />
                    )}
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          <VerifiedBadge
            label={profile.verificationLabel}
            tone={profile.verificationTone}
          />
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader
