'use client'

import { type WalletTransaction } from './types'
import WalletTransactionsMobileCard from './WalletTransactionsMobileCard'

type WalletTransactionsMobileListProps = {
  items: WalletTransaction[]
  openId: string | null
  onToggle: (id: string) => void
  formatAmount: (value: number) => string
  onReport: () => void
}

const WalletTransactionsMobileList = ({
  items,
  openId,
  onToggle,
  formatAmount,
  onReport,
}: WalletTransactionsMobileListProps) => {
  return (
    <div className='lg:hidden space-y-1 px-4'>
      {items.map((transaction) => (
        <WalletTransactionsMobileCard
          key={transaction.id}
          transaction={transaction}
          isOpen={openId === transaction.id}
          onToggle={() => onToggle(transaction.id)}
          formatAmount={formatAmount}
          onReport={onReport}
        />
      ))}
    </div>
  )
}

export default WalletTransactionsMobileList
