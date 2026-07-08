import { motion } from 'framer-motion'

import TemplateSelectionHeader from './TemplateSelectionHeader'
import TemplateGrid from './TemplateGrid'
import TemplateSelectionFooter from './TemplateSelectionFooter'
import { useCreateGiftTemplates } from './hooks/useCreateGiftTemplates'
import type { TemplateLayout } from '@/lib/config/templates/types'

const TemplateSelection = ({
  selectedTemplate,
  selectedCategoryName,
  onTemplateSelect,
  onContinue,
  onBack,
}: {
  selectedTemplate: string | null
  selectedCategoryName?: string
  onTemplateSelect: (id: string, layout: TemplateLayout) => void
  onContinue: () => void
  onBack?: () => void
}) => {
  const { templates, isLoading, isError } = useCreateGiftTemplates()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='w-full pb-10'
    >
      <TemplateSelectionHeader
        selectedCategoryName={selectedCategoryName}
        onBack={onBack}
      />
      {isLoading ? (
        <div className='mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className='h-[280px] animate-pulse rounded-2xl border border-grey-100 bg-grey-50'
            />
          ))}
        </div>
      ) : null}
      {isError ? (
        <div className='mb-8 rounded-[20px] border border-error-100 bg-error-50/50 p-5'>
          <h3 className='text-base font-medium text-error-800'>
            We could not load templates
          </h3>
          <p className='mt-1 text-sm text-error-700'>
            Gift-page templates are unavailable right now. Please try again
            later.
          </p>
        </div>
      ) : null}
      {!isLoading && !isError && templates.length === 0 ? (
        <div className='mb-8 rounded-[20px] border border-warning-100 bg-warning-50/50 p-5'>
          <h3 className='text-base font-medium text-warning-800'>
            No templates available
          </h3>
          <p className='mt-1 text-sm text-warning-700'>
            No configured templates were returned, so you cannot continue yet.
          </p>
        </div>
      ) : null}
      {!isLoading && !isError && templates.length > 0 ? (
        <TemplateGrid
          templates={templates}
          selectedTemplate={selectedTemplate}
          onTemplateSelect={onTemplateSelect}
        />
      ) : null}
      <TemplateSelectionFooter
        canContinue={
          Boolean(selectedTemplate) &&
          !isLoading &&
          !isError &&
          templates.length > 0
        }
        onContinue={onContinue}
        ctaLabel='Continue to Customization'
      />
    </motion.div>
  )
}

export default TemplateSelection
