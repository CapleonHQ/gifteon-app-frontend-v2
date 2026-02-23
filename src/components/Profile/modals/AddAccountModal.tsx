'use client'

import { useState } from 'react'
import CloseIcon from '@/assets/icons/CloseIcon'
import BackLeftIcon from '@/assets/icons/BackLeftIcon'
import ResponsiveModal from '@/components/common/ResponsiveModal'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import InputField from '@/components/Profile/components/InputField'

type BankOption = {
  id: string
  label: string
  code: string
}

type AddAccountModalProps = {
  isOpen: boolean
  onClose: () => void
  bankOptions: BankOption[]
  isLoadingBanks?: boolean
  hasBanksError?: boolean
  onRetryBanks?: () => void
  isSaving?: boolean
  onSave: (payload: {
    bank: string
    bankCode: string
    accountNumber: string
    accountName: string
    isDefault: boolean
  }) => void
}

const AddAccountModal = ({
  isOpen,
  onClose,
  bankOptions,
  isLoadingBanks = false,
  hasBanksError = false,
  onRetryBanks,
  isSaving = false,
  onSave,
}: AddAccountModalProps) => {
  const [selectedBankId, setSelectedBankId] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountName, setAccountName] = useState('')
  const [makeDefault, setMakeDefault] = useState(false)
  const hasValidAccountNumber = accountNumber.length === 10

  const handleClose = () => {
    onClose()
    setSelectedBankId('')
    setAccountNumber('')
    setAccountName('')
    setMakeDefault(false)
  }

  const handleSave = () => {
    const selectedBank = bankOptions.find(
      (option) => option.id === selectedBankId
    )
    if (!selectedBank || !hasValidAccountNumber || !accountName.trim()) return

    onSave({
      bank: selectedBank.label,
      bankCode: selectedBank.code,
      accountNumber,
      accountName: accountName.trim(),
      isDefault: makeDefault,
    })

    setSelectedBankId('')
    setAccountNumber('')
    setAccountName('')
    setMakeDefault(false)
  }

  const header = (
    <div className='relative'>
      <button
        type='button'
        onClick={handleClose}
        className='hidden lg:flex absolute -right-5 -top-5 w-9 h-9 rounded-full items-center justify-center hover:bg-grey-50'
        aria-label='Close'
      >
        <span className='text-grey-700 w-5 h-5'>
          <CloseIcon />
        </span>
      </button>
      <div className='lg:hidden flex items-center gap-2'>
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
      </div>
      <div className='text-center mt-3 lg:mt-0'>
        <h3 className='text-2xl font-semibold text-blackish'>
          Add New Account
        </h3>
        <p className='text-sm text-grey-600 mt-1'>
          Provide the following details
        </p>
      </div>
    </div>
  )

  const body = (
    <div className='space-y-4'>
      <div>
        <label className='text-sm font-medium text-grey-900'>Bank Name</label>
        <Select
          value={selectedBankId}
          onValueChange={setSelectedBankId}
          disabled={isLoadingBanks || hasBanksError || bankOptions.length === 0}
        >
          <SelectTrigger className='mt-1 w-full rounded-[10px] border border-grey-100 bg-grey-50/15 px-3 py-3.5 text-sm text-grey-600 h-[48px]! disabled:opacity-60'>
            <SelectValue
              placeholder={isLoadingBanks ? 'Loading banks...' : 'Select bank'}
            />
          </SelectTrigger>
          <SelectContent>
            {!isLoadingBanks && bankOptions.length === 0 && (
              <SelectItem value='no-banks' disabled>
                No banks available
              </SelectItem>
            )}
            {bankOptions.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasBanksError && (
          <div className='mt-2 rounded-[10px] border border-error-100 bg-error-50 px-3 py-2'>
            <p className='text-xs text-error-600'>
              We couldn&apos;t load the bank list.
            </p>
            <button
              type='button'
              onClick={onRetryBanks}
              className='mt-1 text-xs font-medium text-error-600 underline underline-offset-2'
            >
              Retry
            </button>
          </div>
        )}
      </div>
      <InputField
        label='Account Number'
        placeholder='Enter the account number'
        value={accountNumber}
        onChange={(value) =>
          setAccountNumber(value.replace(/\D/g, '').slice(0, 10))
        }
      />
      {accountNumber.length > 0 && !hasValidAccountNumber && (
        <p className='text-xs text-error-500 -mt-2'>
          Account number must be exactly 10 digits.
        </p>
      )}
      <InputField
        label='Account Holder Name'
        placeholder='Account name'
        value={accountName}
        onChange={setAccountName}
      />
      <label className='flex items-center gap-2 text-sm text-grey-600 font-medium'>
        <Checkbox
          checked={makeDefault}
          className='w-5 h-5'
          onCheckedChange={(checked) => setMakeDefault(Boolean(checked))}
        />
        Make this the default account
      </label>
    </div>
  )
  const footer = (
    <div className='flex items-center gap-3'>
      <button
        type='button'
        onClick={handleClose}
        className='flex-1 py-3 rounded-[12px] border border-grey-200 text-grey-700 font-medium bg-grey-50/70 hover:bg-grey-100 transition-colors duration-300'
      >
        Cancel
      </button>
      <button
        type='button'
        onClick={handleSave}
        className='flex-1 py-3 rounded-[12px] bg-linear-to-b from-[#4848C9] from-[17.5%] to-[#1818AB] enabled:hover:from-primary-600 enabled:hover:to-primary-800 transition-colors duration-300 text-white font-medium disabled:opacity-30'
        disabled={
          !selectedBankId ||
          !hasValidAccountNumber ||
          !accountName.trim() ||
          isSaving ||
          isLoadingBanks ||
          hasBanksError
        }
      >
        {isSaving ? 'Saving...' : 'Save Account'}
      </button>
    </div>
  )

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={handleClose}
      header={header}
      body={body}
      footer={footer}
    />
  )
}

export default AddAccountModal
