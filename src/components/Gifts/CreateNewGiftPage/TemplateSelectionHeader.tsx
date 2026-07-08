const TemplateSelectionHeader = ({
  selectedCategoryName,
  onBack,
}: {
  selectedCategoryName?: string
  onBack?: () => void
}) => {
  return (
    <div className='mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
      <div>
        <p className='text-xs font-medium uppercase tracking-[0.18em] text-primary-500'>
          Step 2 of 3
        </p>
        <h2 className='mt-2 text-base text-grey-800'>
          Select a template to get started
        </h2>
        {selectedCategoryName ? (
          <p className='mt-1 text-sm text-grey-600'>
            Category:{' '}
            <span className='font-medium text-grey-900'>
              {selectedCategoryName}
            </span>
          </p>
        ) : null}
      </div>
      {onBack ? (
        <button
          type='button'
          onClick={onBack}
          className='inline-flex items-center rounded-[10px] border border-grey-200 bg-white px-3 py-2 text-sm font-medium text-grey-700 hover:bg-grey-50'
        >
          Change Category
        </button>
      ) : null}
    </div>
  )
}

export default TemplateSelectionHeader
