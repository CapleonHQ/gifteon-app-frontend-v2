'use client'

import {
  type WalletTransaction,
  transactionStatusStyles,
  transactionTypeStyles,
} from './types'
import WalletTransactionsTableActions from './WalletTransactionsTableActions'

type WalletTransactionsTableRowProps = {
  transaction: WalletTransaction
  formatAmount: (value: number) => string
  onReport: () => void
}

const WalletTransactionsTableRow = ({
  transaction,
  formatAmount,
  onReport,
}: WalletTransactionsTableRowProps) => {
  return (
    <div className='grid grid-cols-[1fr_2fr_0.9fr_1fr_1fr_32px] items-center gap-4 text-grey-800 px-4 py-2.5 hover:bg-grey-50 transition-colors duration-300 border-b border-grey-50 whitespace-nowrap text-base'>
      <span>{transaction.date}</span>
      <span className='truncate'>{transaction.description}</span>
      <div>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm leading-[133%] tracking-[-2%] font-medium ${
            transactionTypeStyles[transaction.type]
          }`}
        >
          {transaction.type}
        </span>
      </div>
      <span>{formatAmount(transaction.amount)}</span>
      <div>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm leading-[133%] tracking-[-2%] font-medium ${
            transactionStatusStyles[transaction.status]
          }`}
        >
          {transaction.status}
        </span>
      </div>
      <WalletTransactionsTableActions onReport={onReport} />
    </div>
  )
}

export default WalletTransactionsTableRow
