import { AnimatePresence, motion } from 'framer-motion'
import TemplatePreview from './TemplatePreview'
import EditingSection from './EditingSection'
import { useCreateGift } from './CreateGiftContext'

type DesktopEditingLayoutProps = {
  customizationOpen: boolean
  selectedTemplate: number | null
  onCloseCustomization: () => void
  onSave: () => void
}

const DesktopEditingLayout = ({
  customizationOpen,
  selectedTemplate,
  onCloseCustomization,
  onSave,
}: DesktopEditingLayoutProps) => {
  const { giftPageData } = useCreateGift()

  return (
    <div className='hidden lg:block pb-6'>
      <div className='relative'>
        <motion.div
          animate={{
            paddingRight: customizationOpen ? '450px' : '0px',
          }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className='min-h-screen'
        >
          <div className='h-full overflow-y-auto'>
            <TemplatePreview data={giftPageData} templateId={selectedTemplate} />
          </div>
        </motion.div>

        <AnimatePresence>
          {customizationOpen && (
            <motion.div
              initial={{ x: 450, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 450, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className='w-full max-w-[450px] bg-white fixed top-0 right-0 h-screen z-40'
            >
              <EditingSection onClose={onCloseCustomization} onSave={onSave} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default DesktopEditingLayout
