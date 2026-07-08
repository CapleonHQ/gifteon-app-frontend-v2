'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import CloseIcon from '@/assets/icons/CloseIcon'
import BackLeftIcon from '@/assets/icons/BackLeftIcon'
import ResponsiveModal from '@/components/common/ResponsiveModal'
import type { WalletTransaction } from './types'
import {
  getBillsStatusStyle,
  getTransactionStatusLabel,
  getTransactionTypeLabel,
} from './types'
import { getBillMetadataDetails } from './transactionDetails'

type WalletTransactionDetailsModalProps = {
  isOpen: boolean
  onClose: () => void
  transaction: WalletTransaction | null
  onReport: () => void
}

const WalletTransactionDetailsModal = ({
  isOpen,
  onClose,
  transaction,
  onReport,
}: WalletTransactionDetailsModalProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopyToken = async () => {
    const token =
      transaction?.metadata?.type === 'electricity'
        ? transaction.metadata.token
        : null
    if (!token || !navigator?.clipboard) return
    try {
      await navigator.clipboard.writeText(token)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {
      setCopied(false)
    }
  }

  const header = (
    <div className='relative'>
      <button
        type='button'
        onClick={onClose}
        className='absolute -right-5 -top-5 w-9 h-9 rounded-full hidden lg:flex items-center justify-center hover:bg-grey-50'
        aria-label='Close'
      >
        <span className='text-grey-700 w-5 h-5'>
          <CloseIcon />
        </span>
      </button>

      <div className='lg:hidden flex items-center gap-2'>
        <button
          type='button'
          onClick={onClose}
          className='w-6 h-6'
          aria-label='Go back'
        >
          <span className='text-blackish flex'>
            <BackLeftIcon />
          </span>
        </button>
      </div>

      <div className='text-center mt-4 lg:mt-0'>
        <h3 className='text-2xl font-medium text-blackish'>
          Transaction Details
        </h3>
      </div>
    </div>
  )

  if (!transaction) return null
  const metadata = transaction.metadata
  const token = metadata?.type === 'electricity' ? metadata.token : null
  const extraDetails = getBillMetadataDetails(metadata)

  const body = (
    <div className='space-y-3 text-sm text-grey-600'>
      <div className='rounded-[12px] border border-grey-100 bg-white px-3 py-3 space-y-2'>
        <div className='flex items-center justify-between gap-3'>
          <span>Reference:</span>
          <span className='text-grey-900 font-medium text-right break-all'>
            {transaction.reference}
          </span>
        </div>
        <div className='flex items-center justify-between gap-3'>
          <span>Status:</span>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm leading-[133%] tracking-[-2%] font-medium ${getBillsStatusStyle(
              transaction.status
            )}`}
          >
            {getTransactionStatusLabel(transaction.status)}
          </span>
        </div>
        <div className='flex items-center justify-between gap-3'>
          <span>Type:</span>
          <span className='text-grey-900 font-medium'>
            {getTransactionTypeLabel(transaction.type)}
          </span>
        </div>
        <div className='flex items-center justify-between gap-3'>
          <span>Amount:</span>
          <span className='text-grey-900 font-medium'>
            {transaction.displayAmount}
          </span>
        </div>
        <div className='flex items-center justify-between gap-3'>
          <span>Source:</span>
          <span className='text-grey-900 font-medium capitalize'>
            {transaction.source}
          </span>
        </div>
        <div className='flex items-center justify-between gap-3'>
          <span>Date:</span>
          <span className='text-grey-900 font-medium'>{transaction.date}</span>
        </div>
        <div className='flex items-start justify-between gap-3'>
          <span>Description:</span>
          <span className='text-grey-900 font-medium text-right max-w-[70%]'>
            {transaction.description}
          </span>
        </div>
      </div>

      {token ? (
        <div className='rounded-[12px] border border-warning-100 bg-warning-50/40 px-3 py-3'>
          <div className='flex items-center justify-between gap-2'>
            <span className='text-grey-700'>Token:</span>
            <button
              type='button'
              onClick={handleCopyToken}
              className='h-7 w-7 rounded-md border border-grey-200 text-grey-700 hover:bg-grey-50 transition-colors inline-flex items-center justify-center'
              aria-label={copied ? 'Token copied' : 'Copy token'}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <p className='mt-2 text-grey-900 font-medium break-all'>{token}</p>
        </div>
      ) : null}

      {extraDetails.length > 0 ? (
        <div className='rounded-[12px] border border-grey-100 bg-white px-3 py-3 space-y-2'>
          <p className='text-grey-900 font-medium'>Additional Details</p>
          {extraDetails.map((entry) => (
            <div
              key={`${entry.label}-${entry.value}`}
              className='flex items-start justify-between gap-3'
            >
              <span>{entry.label}:</span>
              <span className='text-grey-900 font-medium text-right break-all max-w-[70%]'>
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      ) : null}

      <button
        type='button'
        onClick={onReport}
        className='w-full text-center text-primary-500 text-sm font-medium py-2'
      >
        Report transaction
      </button>
    </div>
  )

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      header={header}
      body={body}
      desktopMaxWidthClass='max-w-[560px]'
    />
  )
}

export default WalletTransactionDetailsModal
