import { Eye } from 'lucide-react'

type MobileEditingHeaderProps = {
  onOpenPreview: () => void
}

const MobileEditingHeader = ({ onOpenPreview }: MobileEditingHeaderProps) => {
  return (
    <div className='flex lg:hidden items-center justify-between mt-5'>
      <h2 className='text-xl font-medium blackish'>Customize Page</h2>
      <button
        onClick={onOpenPreview}
        className='flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-lg font-medium hover:bg-primary-100 transition-colors'
      >
        <Eye className='w-4 h-4' />
        <span>Preview</span>
      </button>
    </div>
  )
}

export default MobileEditingHeader
