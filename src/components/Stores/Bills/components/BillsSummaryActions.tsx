type BillsSummaryActionsProps = {
  totalAmount: number
  recipientsCount: number
  isActionBusy: boolean
  onReview: () => void
}

const BillsSummaryActions = ({
  totalAmount,
  recipientsCount,
  isActionBusy,
  onReview,
}: BillsSummaryActionsProps) => {

  return (
    <>
      <aside className='hidden lg:block'>
        <div className='sticky top-20 space-y-3'>
          <div className='rounded-xl border border-grey-100 bg-white p-4'>
            <p className='text-xs text-grey-500'>Total</p>
            <p className='text-2xl font-semibold text-grey-900'>
              ₦{totalAmount.toLocaleString()}
            </p>
            {recipientsCount > 1 ? (
              <p className='text-sm text-grey-600 mt-1'>
                {recipientsCount} recipients
              </p>
            ) : null}
          </div>

          <button
            type='button'
            onClick={onReview}
            disabled={isActionBusy || recipientsCount === 0}
            className='w-full h-11 rounded-xl bg-primary-500 text-white font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isActionBusy ? 'Processing...' : 'Review & Pay'}
          </button>

          <div className='rounded-xl border border-grey-100 bg-white p-4'>
            <h3 className='text-sm font-semibold text-grey-900'>Need Help?</h3>
            <p className='mt-2 text-sm text-grey-600'>
              Add recipients as cards, configure each card, then confirm all at
              once.
            </p>
          </div>
        </div>
      </aside>

      <div className='fixed lg:hidden bottom-0 left-0 right-0 z-20 border-t border-grey-100 bg-white px-4 py-3'>
        <div className='max-w-5xl mx-auto flex items-center justify-between gap-3'>
          <div>
            <p className='text-xs text-grey-500'>Total</p>
            <p className='text-base font-semibold text-grey-900'>
              ₦{totalAmount.toLocaleString()}
            </p>
            {recipientsCount > 1 ? (
              <p className='text-xs text-grey-600'>{recipientsCount} recipients</p>
            ) : null}
          </div>
          <button
            type='button'
            onClick={onReview}
            disabled={isActionBusy || recipientsCount === 0}
            className='h-11 px-5 rounded-xl bg-primary-500 text-white font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Review & Pay
          </button>
        </div>
      </div>
    </>
  )
}

export default BillsSummaryActions
