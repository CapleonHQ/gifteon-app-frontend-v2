'use client'

import { type WalletTransaction } from './types'
import WalletTransactionsTableHeader from './WalletTransactionsTableHeader'
import WalletTransactionsTableRow from './WalletTransactionsTableRow'

type WalletTransactionsTableProps = {
  items: WalletTransaction[]
  onView: (transaction: WalletTransaction) => void
  onReport: () => void
}

const WalletTransactionsTable = ({
  items,
  onView,
  onReport,
}: WalletTransactionsTableProps) => {
  return (
    <div className='hidden lg:block overflow-x-auto'>
      <div className='min-w-[980px]'>
        <WalletTransactionsTableHeader />
        <div className='mt-1 flex flex-col gap-0.5'>
          {items.map((transaction) => (
            <WalletTransactionsTableRow
              key={transaction.id}
              transaction={transaction}
              onView={onView}
              onReport={onReport}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default WalletTransactionsTable
