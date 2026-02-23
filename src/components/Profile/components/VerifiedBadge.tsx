import ProfileVerifiedIcon from '@/assets/icons/ProfileVerifiedIcon'

type VerifiedBadgeProps = {
  isVerified: boolean
}

const VerifiedBadge = ({ isVerified }: VerifiedBadgeProps) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border text-sm font-medium px-3 md:px-5 py-1.5 md:py-2.5 leading-[18px] md:mb-2.5 ${
        isVerified
          ? 'bg-[#E1F9EA80] border-success-50 text-success-500'
          : 'bg-warning-50 border-warning-100 text-warning-700'
      }`}
    >
      <span className='w-4 h-4'>
        <ProfileVerifiedIcon />
      </span>
      {isVerified ? 'Verified' : 'Not Verified'}
    </span>
  )
}

export default VerifiedBadge
