'use client'

const WalletTransactionsTableHeader = () => {
  return (
    <div className='px-4 py-2.5 border-b border-grey-50 bg-grey-50/50'>
      <div className='grid grid-cols-[1fr_2fr_0.9fr_1fr_1fr_32px] text-sm gap-4 text-grey-600 leading-[18px] items-center whitespace-nowrap'>
        <span>Date</span>
        <span>Description</span>
        <span>Type</span>
        <span>Amount</span>
        <span>Status</span>
        <span />
      </div>
    </div>
  )
}

export default WalletTransactionsTableHeader
