'use client'

import { useState } from 'react'
import CloseIcon from '@/assets/icons/CloseIcon'
import BackLeftIcon from '@/assets/icons/BackLeftIcon'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import DocumentFieldIcon from '@/assets/icons/DocumentFieldIcon'

const disputeReasons = [
  'Duplicate transaction',
  'Wrong amount',
  'Transaction failed',
  'Service not received',
]

type WalletDisputeModalProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
}

const WalletDisputeModal = ({
  isOpen,
  onClose,
  onSubmit,
}: WalletDisputeModalProps) => {
  const [reason, setReason] = useState('')
  const [description, setDescription] = useState('')

  if (!isOpen) return null

  const handleClose = () => {
    onClose()
    setReason('')
    setDescription('')
  }

  const handleSubmit = () => {
    onSubmit()
    handleClose()
  }

  const renderActions = () => (
    <div className='flex items-center gap-3 pt-2'>
      <button
        type='button'
        onClick={handleClose}
        className='flex-1 py-2.5 rounded-[12px] border border-grey-200 text-grey-700 font-medium bg-grey-50/70 hover:bg-grey-100/70 transition-colors'
      >
        Cancel
      </button>
      <button
        type='button'
        onClick={handleSubmit}
        className='flex-1 py-2.5 rounded-[12px] font-medium text-white bg-primary-400 hover:bg-primary-500 transition-colors'
      >
        Submit
      </button>
    </div>
  )

  const content = (showActions = true) => (
    <div className='space-y-5'>
      <div className='space-y-2'>
        <label className='text-sm text-grey-700'>Reason for Dispute</label>
        <Select value={reason} onValueChange={setReason}>
          <SelectTrigger className='w-full border-grey-100 rounded-[10px] text-sm text-blackish font-medium h-[48px]! shadow-none! bg-white'>
            <SelectValue placeholder='Select an option' />
          </SelectTrigger>
          <SelectContent className='rounded-[12px] border-grey-50'>
            {disputeReasons.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-2'>
        <label className='text-sm text-grey-700'>Description</label>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder='Tell us what happened...'
          className='w-full min-h-[120px] rounded-[12px] border border-grey-100 px-3 py-2 text-sm text-grey-800 focus:outline-none focus:ring-1 focus:ring-primary-300 resize-none'
        />
      </div>

      <div className='space-y-2'>
        <label className='text-sm text-grey-700'>Upload Photos</label>
        <button
          type='button'
          className='w-full py-3 rounded-[12px] border border-dashed border-primary-200 text-primary-500 text-sm font-medium bg-primary-50/40 hover:bg-primary-50 transition-colors flex items-center justify-center gap-2'
        >
          <span className='w-5 h-5'>
            <DocumentFieldIcon />
          </span>
          Upload document
        </button>
        <p className='text-xs text-grey-500'>
          Jpeg, pdf supported. Max. of 5mb
        </p>
      </div>

      {showActions ? renderActions() : null}
    </div>
  )

  return (
    <div className='fixed inset-0 z-30 lg:z-50'>
      <div
        className='absolute inset-0 bg-black/40 backdrop-blur-sm hidden lg:block'
        onClick={handleClose}
      />
      <div className='hidden lg:flex items-center justify-center h-full px-4'>
        <div className='relative w-full max-w-[500px] max-h-[90vh] overflow-hidden rounded-[20px] bg-white shadow-[0px_24px_60px_-20px_#10192852] flex flex-col gap-3'>
          <div className='px-6 sm:px-10 pt-12 pb-3 bg-white sticky top-0 z-10 text-center'>
            <button
              type='button'
              onClick={handleClose}
              className='absolute right-5 top-5 w-9 h-9 rounded-full flex items-center justify-center hover:bg-grey-50'
              aria-label='Close'
            >
              <span className='text-grey-700 w-6 h-6'>
                <CloseIcon />
              </span>
            </button>
            <h3 className='text-2xl font-medium text-blackish'>
              Raise a Dispute
            </h3>
            <p className='text-sm text-grey-600 max-w-[356px] mx-auto mt-1'>
              Tell us what went wrong with this transaction.
            </p>
          </div>
          <div className='px-6 sm:px-10 pb-12 overflow-y-auto flex-1 min-h-0'>
            {content()}
          </div>
        </div>
      </div>

      <div className='lg:hidden fixed inset-x-0 bottom-0 top-[72.5px] bg-white'>
        <div className='flex flex-col h-full'>
          <div className='pt-8 pb-4 px-4'>
            <div className='flex flex-col gap-3'>
              <button
                type='button'
                onClick={handleClose}
                className='w-6 h-6'
                aria-label='Go back'
              >
                <span className='text-blackish hover:text-black/70 flex'>
                  <BackLeftIcon />
                </span>
              </button>
              <div className='flex flex-col items-center justify-center gap-1'>
                <span className='text-2xl font-medium text-blackish'>
                  Raise a Dispute
                </span>
                <p className='text-sm text-grey-600 text-center'>
                  Tell us what went wrong with this transaction.
                </p>
              </div>
            </div>
          </div>
          <div className='flex-1 overflow-y-auto px-4 pb-4'>
            {content(false)}
          </div>
          <div className='px-4 py-3 shadow-[0px_-10px_18px_5px_#4040401A] bg-white'>
            {renderActions()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default WalletDisputeModal
