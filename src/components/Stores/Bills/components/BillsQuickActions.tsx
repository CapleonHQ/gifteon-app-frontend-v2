type BillsQuickActionsProps = {
  recentBeneficiaries: string[]
  onAddRecipientCard: () => void
  onApplyQuickRecipient: (value: string) => void
}

const BillsQuickActions = ({
  recentBeneficiaries,
  onAddRecipientCard,
  onApplyQuickRecipient,
}: BillsQuickActionsProps) => {
  return (
    <>
      <div className='flex justify-end'>
        <button
          type='button'
          onClick={onAddRecipientCard}
          className='h-9 px-3 rounded-lg border border-grey-200 text-grey-700 bg-white hover:bg-grey-50 inline-flex items-center justify-center gap-2 text-sm font-medium'
        >
          Add new recipient
        </button>
      </div>

      {recentBeneficiaries.length > 0 ? (
        <div className='space-y-2'>
          <p className='text-xs font-medium text-grey-700'>Quick actions</p>
          <div className='flex flex-wrap gap-2'>
            {recentBeneficiaries.map((item) => (
              <button
                key={item}
                type='button'
                onClick={() => onApplyQuickRecipient(item)}
                className='rounded-full border border-grey-200 bg-white px-3 py-1.5 text-xs text-grey-700 hover:border-primary-200 hover:text-primary-600'
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </>
  )
}

export default BillsQuickActions
