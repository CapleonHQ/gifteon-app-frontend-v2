type SubmittedDetailsCardProps = {
  summary: string
}

const SubmittedDetailsCard = ({ summary }: SubmittedDetailsCardProps) => (
  <div className='rounded-[12px] border border-grey-100 bg-grey-50/50 p-4'>
    <p className='text-sm font-medium text-blackish'>Submitted details</p>
    <p className='text-sm text-grey-700 mt-1'>{summary}</p>
  </div>
)

export default SubmittedDetailsCard
