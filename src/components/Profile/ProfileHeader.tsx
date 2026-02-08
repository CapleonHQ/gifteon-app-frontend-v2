import ProfileHeaderBackground from '@/components/Profile/components/ProfileHeaderBackground'
import ProfileAvatar from '@/components/Profile/components/ProfileAvatar'
import VerifiedBadge from '@/components/Profile/components/VerifiedBadge'

type ProfileHeaderProps = {
  profile: {
    firstName: string
    lastName: string
    gender: string
  }
}

const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
  return (
    <div className='relative'>
      <ProfileHeaderBackground />

      <div className='relative px-4 lg:px-10 -mt-[56px] md:-mt-[70px]'>
        <div className='flex flex-col md:flex-row md:justify-between items-center md:items-end gap-4 md:gap-3'>
          <div className='flex flex-col md:flex-row items-center md:items-end gap-3'>
            <ProfileAvatar />
            <div className='flex items-center md:items-start flex-col gap-1'>
              <h2 className='text-xl md:text-2xl font-medium leading-7 text-blackish'>
                {profile.firstName} {profile.lastName}
              </h2>
              <p className='text-sm leading-[18px] md:mb-2.5 text-grey-600'>
                {profile.gender}
              </p>
            </div>
          </div>

          <VerifiedBadge />
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader
