'use client'

import { ChevronDown } from 'lucide-react'
import {
  getTransactionStatusLabel,
  getTransactionStatusStyle,
  getTransactionTypeLabel,
  getTransactionTypeStyle,
  type WalletTransaction,
} from './types'
import FlagIcon from '@/assets/icons/FlagIcon'

type WalletTransactionsMobileCardProps = {
  transaction: WalletTransaction
  isOpen: boolean
  onToggle: () => void
  formatAmount: (value: number) => string
  onReport: () => void
}

const WalletTransactionsMobileCard = ({
  transaction,
  isOpen,
  onToggle,
  formatAmount,
  onReport,
}: WalletTransactionsMobileCardProps) => {
  return (
    <div className='border-b border-grey-50'>
      <div
        role='button'
        onClick={onToggle}
        className='w-full flex items-center justify-between gap-5 p-3 text-left'
      >
        <div className='flex justify-between items-center flex-1 gap-2'>
          <span className='text-grey-900 font-medium'>{transaction.date}</span>
          <div className='w-[90px]'>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm leading-[133%] tracking-[-2%] font-medium ${
                getTransactionStatusStyle(transaction.status)
              }`}
            >
              {getTransactionStatusLabel(transaction.status)}
            </span>
          </div>
        </div>
        <ChevronDown
          className={`w-6 h-6 text-grey-500 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </div>
      {isOpen && (
        <div className='mt-3 px-3 pb-3 space-y-2 text-sm text-grey-600'>
          <div className='flex items-center justify-between'>
            <span>Description:</span>
            <span className='text-grey-900 font-medium text-right max-w-[200px] leading-[150%] tracking-[-2%]'>
              {transaction.description}
            </span>
          </div>
          <div className='flex items-center justify-between'>
            <span>Type:</span>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm leading-[133%] tracking-[-2%] font-medium ${
                getTransactionTypeStyle(transaction.type)
              }`}
            >
              {getTransactionTypeLabel(transaction.type)}
            </span>
          </div>
          <div className='flex items-center justify-between'>
            <span>Amount:</span>
            <span className='text-grey-900 font-medium'>
              {formatAmount(transaction.amount)}
            </span>
          </div>
          <button
            type='button'
            className='w-full mt-3 py-3 flex items-center justify-center gap-2 rounded-[8px] bg-primary-400 text-white text-sm font-medium hover:bg-primary-500 transition-colors'
            onClick={onReport}
          >
            <span className='w-3.5 h-3.5'>
              <FlagIcon />
            </span>
            Report Transaction Issue
          </button>
        </div>
      )}
    </div>
  )
}

export default WalletTransactionsMobileCard
