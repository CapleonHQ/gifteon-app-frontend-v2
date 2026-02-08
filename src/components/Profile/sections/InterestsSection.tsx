import EditIcon from '@/assets/icons/EditIcon'
import SectionCard from '@/components/Profile/components/SectionCard'
import InterestChip from '@/components/Profile/components/InterestChip'

const InterestsSection = ({
  interests,
  onEdit,
}: {
  interests: { id: string; label: string; icon: string }[]
  onEdit: () => void
}) => {
  return (
    <SectionCard
      title='Interests'
      description='This determines the gift ideas we recommend to you'
      action={
        <button
          type='button'
          onClick={onEdit}
          className='inline-flex items-center gap-1.5 rounded-[8px] bg-primary-50 text-primary-500 px-3 py-1.5 text-sm leading-[18px] hover:bg-primary-100 transition-colors'
        >
          <span className='w-4 h-4'>
            <EditIcon />
          </span>
          Edit
        </button>
      }
    >
      <div className='border-t border-grey-50 px-3 lg:px-6 pb-3 lg:pb-6 pt-3 space-y-1'>
        <p className='text-sm text-grey-900 font-medium'>Interest Selection</p>
        <div className='flex flex-wrap gap-3'>
          {interests.map((interest) => (
            <InterestChip
              key={interest.id}
              label={interest.label}
              icon={interest.icon}
            />
          ))}
        </div>
      </div>
    </SectionCard>
  )
}

export default InterestsSection
