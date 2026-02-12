'use client'

type WalletTransactionsNoResultsProps = {
  onReset: () => void
}

const WalletTransactionsNoResults = ({
  onReset,
}: WalletTransactionsNoResultsProps) => {
  return (
    <div className='py-16 lg:py-24 px-4 flex flex-col items-center justify-center gap-3 text-center'>
      <p className='text-xl font-medium text-blackish'>No transactions found</p>
      <p className='text-sm text-grey-600'>
        Try adjusting your search or filters to find matching transactions.
      </p>
      <button
        type='button'
        onClick={onReset}
        className='mt-2 inline-flex items-center justify-center px-4 py-2 rounded-[10px] border border-grey-200 text-sm text-grey-800 hover:bg-grey-50 transition-colors duration-200'
      >
        Reset filters
      </button>
    </div>
  )
}

export default WalletTransactionsNoResults
