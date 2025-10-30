import React from 'react'
import { motion } from 'framer-motion'

import {
  Template1Selection,
  Template2Selection,
  Template3Selection,
  Template4Selection,
  TEMPLATES,
} from '@/lib/config/templates/selection'

const TemplateSelection = ({
  selectedTemplate,
  onTemplateSelect,
  onContinue,
}: {
  selectedTemplate: number | null
  onTemplateSelect: (id: number) => void
  onContinue: () => void
}) => {
  const getLayoutComponent = (layout: string) => {
    switch (layout) {
      case 'template1':
        return <Template1Selection />
      case 'template2':
        return <Template2Selection />
      case 'template3':
        return <Template3Selection />
      case 'template4':
        return <Template4Selection />
      default:
        return <Template1Selection />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='w-full pb-10'
    >
      <div className='mb-5'>
        <h2 className='text-base sm:text-2xl text-grey-800'>
          Select a template to get started
        </h2>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8'>
        {TEMPLATES.map((template) => (
          <div
            key={template.id}
            className='relative cursor-pointer transition-all'
            onClick={() => onTemplateSelect(template.id)}
          >
            {selectedTemplate === template.id && (
              <div className='absolute -top-1.5 -right-1 w-5 h-5 bg-success-400 rounded-full flex items-center justify-center z-10'>
                <svg
                  className='w-4 h-4 text-white'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={3}
                    d='M5 13l4 4L19 7'
                  />
                </svg>
              </div>
            )}

            {/* Template Preview - aspect ratio for consistent card sizes */}
            <div
              className={`relative overflow-hidden border bg-white w-full h-full rounded-2xl cursor-pointer ${
                selectedTemplate === template.id
                  ? 'border-success-400 shadow-[0px_1.5px_4px_-1px_#10192812]'
                  : 'border-grey-50 hover:border-grey-200'
              }`}
            >
              {getLayoutComponent(template.layout)}
            </div>
          </div>
        ))}
      </div>

      <div className='flex justify-center'>
        <motion.button
          onClick={onContinue}
          disabled={!selectedTemplate}
          className={`px-9 py-3.5 rounded-xl w-full sm:w-auto font-medium transition-all ${
            selectedTemplate
              ? 'bg-primary-600 text-white hover:bg-primary-700'
              : 'bg-grey-200 text-grey-400 cursor-not-allowed'
          }`}
          whileHover={selectedTemplate ? { scale: 1.02 } : {}}
          whileTap={selectedTemplate ? { scale: 0.98 } : {}}
        >
          Save and Continue
        </motion.button>
      </div>
    </motion.div>
  )
}

export default TemplateSelection
