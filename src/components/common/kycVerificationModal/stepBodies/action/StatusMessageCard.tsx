type StatusMessageCardProps = {
  message: string
  isError?: boolean
}

const StatusMessageCard = ({ message, isError = false }: StatusMessageCardProps) => (
  <div
    className={`rounded-[12px] border p-3 ${
      isError
        ? 'bg-error-50 border-error-100 text-error-700'
        : 'bg-information-50 border-information-100 text-information-700'
    }`}
  >
    <p className='text-sm'>{message}</p>
  </div>
)

export default StatusMessageCard
