import { Recipient } from '@/types/gifts'
import EditIcon from '@/assets/icons/EditIcon'
import DeleteIcon from '@/assets/icons/DeleteIcon'

const getInitials = (name: string, email: string) => {
  const trimmed = name.trim()
  if (trimmed) {
    const parts = trimmed.split(' ').filter(Boolean)
    const letters = parts.slice(0, 2).map((part) => part[0]?.toUpperCase())
    return letters.join('')
  }
  return email.slice(0, 2).toUpperCase()
}

const RecipientItem = ({
  recipient,
  onEdit,
  onRemove,
}: {
  recipient: Recipient
  onEdit: () => void
  onRemove: () => void
}) => {
  const initials = getInitials(recipient.name, recipient.email)

  return (
    <div className='flex items-center justify-between gap-3 rounded-[16px] border-[0.5px] border-secondary-800 bg-white px-2.5 py-2 shadow-[0px_1px_2px_-1px_#10192812] border-l-4'>
      <div className='flex items-center gap-1.5'>
        <div className='w-10 h-10 rounded-full bg-secondary-100 text-secondary-700 flex items-center justify-center text-sm font-semibold'>
          {initials}
        </div>
        <div>
          <p className='text-grey-900 text-sm font-semibold'>
            {recipient.name || 'Unnamed recipient'}
          </p>
          <p className='text-grey-600 text-xs'>{recipient.email}</p>
        </div>
      </div>
      <div className='flex items-center gap-2.5'>
        <button
          type='button'
          onClick={onEdit}
          className='w-4 h-4 rounded-lg flex items-center justify-center'
          aria-label='Edit recipient'
        >
          <span className='text-grey-600 transition-colors hover:text-grey-800'>
            <EditIcon />
          </span>
        </button>
        <div className='w-px h-6 bg-grey-50' />
        <button
          type='button'
          onClick={onRemove}
          className='w-4 h-4 rounded-lg flex items-center justify-center'
          aria-label='Remove recipient'
        >
          <span className='text-error-300 transition-colors hover:text-error-600'>
            <DeleteIcon />
          </span>
        </button>
      </div>
    </div>
  )
}

export default RecipientItem
