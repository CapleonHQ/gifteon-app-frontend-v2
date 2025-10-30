import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Eye, X } from 'lucide-react'
import TemplatePreview from './TemplatePreview'
import EditingSection from './EditingSection'
import { GiftPageData } from '../../../types/gifts'
import { ChevronLeftIcon } from '../../../assets/icons'

interface TemplatingEditingProps {
  handleBack: () => void
  handleSave: () => void
  selectedTemplate: number | null
}

const TemplatingEditing = ({
  handleBack,
  handleSave,
  selectedTemplate,
}: TemplatingEditingProps) => {
  const [customizationOpen, setCustomizationOpen] = useState(true)
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false)

  const [giftPageData, setGiftPageData] = useState<GiftPageData>({
    media: { type: 'image', url: '' },
    title: {
      text: 'Title here',
      font: 'Clash Display',
      color: '#121212',
      alignment: 'left',
      size: '32px',
      bold: false,
      italic: false,
      underline: false,
    },
    description: {
      text: 'You can include the description of the celebration here. You can include the description of the celebration here.',
      font: 'Inter',
      color: '#4B5563',
      alignment: 'left',
      size: '14px',
      bold: false,
      italic: false,
      underline: false,
    },
    button: {
      label: 'Say something nice 😊',
      backgroundColor: '#F3F2F2',
      textColor: '#121212',
    },
    socialLinks: {
      instagram: '',
      twitter: '',
      linkedin: '',
    },
  })

  return (
    <motion.div
      key='customize'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='w-full h-full'
    >
      <div className='flex lg:flex-col justify-between mt-2.5 items-center lg:items-start gap-2 lg:mb-3'>
        <div className='order-1 lg:order-2 flex lg:justify-between lg:items-center w-full'>
          <span className='font-medium text-grey-800'>
            Let&apos;s customize your template
          </span>
          {!customizationOpen && (
            <button
              className='hidden lg:block bg-linear-to-r from-primary-400 to-primary-600 text-white rounded-md hover:from-primary-500 hover:to-primary-700 transition-colors py-2.5 px-3'
              onClick={() => setCustomizationOpen(true)}
            >
              Customize page
            </button>
          )}
        </div>
        <button
          className='flex gap-1 items-center justify-center text-grey-800 bg-secondary-50 border border-grey-50 px-4 py-2 rounded-lg transition-colors hover:bg-primary-100 order-2 lg:order-1'
          onClick={handleBack}
        >
          <span className='w-4 h-4 block'>
            <ChevronLeftIcon />
          </span>
          <span className='text-base leading-[22px]'>Back</span>
        </button>
      </div>
      <div className='flex lg:hidden items-center justify-between mt-5'>
        <h2 className='text-xl font-medium blackish'>Customize Page</h2>
        <button
          onClick={() => setMobilePreviewOpen(true)}
          className='flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-lg font-medium hover:bg-primary-100 transition-colors'
        >
          <Eye className='w-4 h-4' />
          <span>Preview</span>
        </button>
      </div>
      {/* Desktop Layout */}
      <div className='hidden lg:block h-full pb-6'>
        <div className='flex gap-6 sticky top-0'>
          <motion.div
            animate={{
              width: customizationOpen ? 'calc(100% - 450px)' : '100%',
            }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            // className='sticky top-0 h-[calc(100vh-120px)]'
          >
            <div className='h-full overflow-y-auto'>
              <TemplatePreview
                data={giftPageData}
                templateId={selectedTemplate}
              />
            </div>
          </motion.div>

          <AnimatePresence>
            {customizationOpen && (
              <motion.div
                initial={{ x: 450, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 450, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className='w-full max-w-[450px] bg-white sticky top-0 h-[calc(100vh-120px)]'
              >
                <EditingSection
                  data={giftPageData}
                  onDataChange={setGiftPageData}
                  onClose={() => setCustomizationOpen(false)}
                  onSave={handleSave}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className='lg:hidden overflow-y-auto'>
        <EditingSection
          data={giftPageData}
          onDataChange={setGiftPageData}
          onClose={() => {}}
          onSave={handleSave}
        />
      </div>

      {/* Mobile Preview Modal */}
      <AnimatePresence>
        {mobilePreviewOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50'
              onClick={() => setMobilePreviewOpen(false)}
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
                  <h3 className='text-lg font-semibold text-grey-900'>
                    Preview
                  </h3>
                  <button
                    onClick={() => setMobilePreviewOpen(false)}
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
    </motion.div>
  )
}

export default TemplatingEditing
