import ProfileVerifiedIcon from '@/assets/icons/ProfileVerifiedIcon'

type VerifiedBadgeProps = {
  label: string
  tone?: 'verified' | 'warning' | 'pending' | 'rejected'
}

const VerifiedBadge = ({ label, tone = 'warning' }: VerifiedBadgeProps) => {
  const toneClass =
    tone === 'verified'
      ? 'bg-[#E1F9EA80] border-success-50 text-success-500'
      : tone === 'pending'
        ? 'bg-information-50 border-information-100 text-information-700'
        : tone === 'rejected'
          ? 'bg-error-50 border-error-100 text-error-700'
          : 'bg-warning-50 border-warning-100 text-warning-700'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border text-sm font-medium px-3 md:px-5 py-1.5 md:py-2.5 leading-[18px] md:mb-2.5 ${toneClass}`}
    >
      <span className='w-4 h-4'>
        <ProfileVerifiedIcon />
      </span>
      {label}
    </span>
  )
}

export default VerifiedBadge
