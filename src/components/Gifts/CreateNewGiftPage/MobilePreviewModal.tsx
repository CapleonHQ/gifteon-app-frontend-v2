import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import TemplatePreview from './TemplatePreview'
import { GiftPageData } from '@/types/gifts'

type MobilePreviewModalProps = {
  isOpen: boolean
  onClose: () => void
  giftPageData: GiftPageData
  selectedTemplate: number | null
}

const MobilePreviewModal = ({
  isOpen,
  onClose,
  giftPageData,
  selectedTemplate,
}: MobilePreviewModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50'
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 200,
            }}
            className='fixed inset-x-0 bottom-0 top-20 bg-white rounded-t-3xl z-50 overflow-y-hidden'
          >
            <div className='flex flex-col h-full'>
              <div className='bg-white border-b border-grey-100 px-6 py-4 flex items-center justify-between'>
                <h3 className='text-lg font-semibold text-grey-900'>Preview</h3>
                <button
                  onClick={onClose}
                  className='w-8 h-8 flex items-center justify-center rounded-lg hover:bg-grey-100 transition-colors'
                >
                  <X className='w-5 h-5' />
                </button>
              </div>
              <div className='flex-1 overflow-y-auto'>
                <TemplatePreview
                  data={giftPageData}
                  templateId={selectedTemplate}
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default MobilePreviewModal
