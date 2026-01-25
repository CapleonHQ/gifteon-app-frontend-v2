import EditingSection from './EditingSection'

type MobileEditingLayoutProps = {
  onClose: () => void
  onSave: () => void
}

const MobileEditingLayout = ({
  onClose,
  onSave,
}: MobileEditingLayoutProps) => {
  return (
    <div className='lg:hidden overflow-y-auto'>
      <EditingSection onClose={onClose} onSave={onSave} />
    </div>
  )
}

export default MobileEditingLayout
