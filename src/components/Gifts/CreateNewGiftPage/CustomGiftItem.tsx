import EditIcon from '@/assets/icons/EditIcon'
import DeleteIcon from '@/assets/icons/DeleteIcon'

type CustomGiftItemProps = {
  title: string
  price: string
  imageUrl?: string
  onEdit: () => void
  onRemove: () => void
}

const formatPrice = (value: string) => {
  if (!value) return ''
  const numeric = value.replace(/\D/g, '')
  if (!numeric) return ''
  return Number(numeric).toLocaleString('en-US')
}

const CustomGiftItem = ({
  title,
  price,
  imageUrl,
  onEdit,
  onRemove,
}: CustomGiftItemProps) => {
  return (
    <div className='flex items-center justify-between gap-3 rounded-[16px] border-[0.5px] border-secondary-800 bg-white px-2.5 py-2 shadow-[0px_1px_2px_-1px_#10192812] border-l-4'>
      <div className='flex items-center gap-1.5 min-w-0'>
        <div className='w-10 h-10 rounded-[8px] bg-secondary-100 text-secondary-700 flex items-center justify-center overflow-hidden'>
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt=''
              className='w-full h-full object-cover'
            />
          ) : (
            <span className='text-[10px] text-secondary-700'>IMG</span>
          )}
        </div>
        <div className='min-w-0'>
          <p className='text-grey-900 text-sm font-semibold truncate'>
            {title}
          </p>
          <p className='text-grey-600 text-xs'>
            {price ? `₦${formatPrice(price)}` : ''}
          </p>
        </div>
      </div>
      <div className='flex items-center gap-2.5'>
        <button
          type='button'
          onClick={onEdit}
          className='w-4 h-4 rounded-lg flex items-center justify-center'
          aria-label='Edit custom gift'
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
          aria-label='Remove custom gift'
        >
          <span className='text-error-300 transition-colors hover:text-error-600'>
            <DeleteIcon />
          </span>
        </button>
      </div>
    </div>
  )
}

export default CustomGiftItem
