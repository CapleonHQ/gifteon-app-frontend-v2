import ProfileBgSvg from '@/assets/icons/ProfileBgSvg'

const ProfileHeaderBackground = () => {
  return (
    <div className='relative h-[108px] md:h-[140px] bg-[linear-gradient(180deg,#4848C9_17.5%,#1818AB_100%)] md:py-[12px]'>
      {/* SVG Background */}
      <div className='absolute right-0 top-1/2 -translate-y-1/2 w-[57%] h-[36px] md:w-[70%] md:top-[12px] md:bottom-[12px] md:h-auto md:translate-y-0 pointer-events-none'>
        <ProfileBgSvg />
      </div>
    </div>
  )
}

export default ProfileHeaderBackground
