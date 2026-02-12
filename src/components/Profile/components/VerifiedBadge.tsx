import CheckmarkStyledIcon from '@/assets/icons/CheckmarkStyledIcon'
import ProfileVerifiedIcon from '@/assets/icons/ProfileVerifiedIcon'

const VerifiedBadge = () => {
  return (
    <span className='inline-flex items-center gap-1.5 rounded-full bg-[#E1F9EA80] border border-success-50 text-success-500 text-sm font-medium px-3 md:px-5 py-1.5 md:py-2.5 leading-[18px] md:mb-2.5'>
      <span className='w-4 h-4'>
        <ProfileVerifiedIcon />
      </span>
      Verified
    </span>
  )
}

export default VerifiedBadge
