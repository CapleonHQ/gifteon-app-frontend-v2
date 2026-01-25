import EditingSection from './EditingSection'
import { GiftPageData } from '@/types/gifts'

type MobileEditingLayoutProps = {
  giftPageData: GiftPageData
  onDataChange: (data: GiftPageData) => void
  onClose: () => void
  onSave: () => void
}

const MobileEditingLayout = ({
  giftPageData,
  onDataChange,
  onClose,
  onSave,
}: MobileEditingLayoutProps) => {
  return (
    <div className='lg:hidden overflow-y-auto'>
      <EditingSection
        data={giftPageData}
        onDataChange={onDataChange}
        onClose={onClose}
        onSave={onSave}
      />
    </div>
  )
}

export default MobileEditingLayout
