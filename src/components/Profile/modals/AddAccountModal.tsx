'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
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
import {
  useAvailableBanks,
  useConnectBank,
  useVerifyBankAccount,
} from '@/hooks/tanstack/banks'
import { useProfile } from '@/hooks/tanstack/account'
import { useSuccessModal } from '@/context/SuccessModalContext'

type AddAccountModalProps = {
  isOpen: boolean
  onClose: () => void
}

const AddAccountModal = ({
  isOpen,
  onClose,
}: AddAccountModalProps) => {
  const { openSuccess } = useSuccessModal()
  const availableBanksQuery = useAvailableBanks(isOpen)
  const profileQuery = useProfile()
  const connectBankMutation = useConnectBank()
  const { mutateAsync: verifyBankAccount } = useVerifyBankAccount()
  const verifyRequestIdRef = useRef(0)
  const lastAttemptedResolveKeyRef = useRef('')

  const [selectedBankId, setSelectedBankId] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [resolvedAccountName, setResolvedAccountName] = useState('')
  const [resolveErrorMessage, setResolveErrorMessage] = useState('')
  const [resolveErrorShakeKey, setResolveErrorShakeKey] = useState(0)
  const [isResolvingAccount, setIsResolvingAccount] = useState(false)
  const [makeDefault, setMakeDefault] = useState(false)

  const bankOptions = useMemo(
    () =>
      (availableBanksQuery.data?.data?.banks ?? []).map((bank) => ({
        id: bank.id,
        label: bank.name,
        code: bank.code,
      })),
    [availableBanksQuery.data?.data?.banks]
  )
  const selectedBank = useMemo(
    () => bankOptions.find((option) => option.id === selectedBankId),
    [bankOptions, selectedBankId]
  )
  const environment = (process.env.NEXT_PUBLIC_ENVIRONMENT ?? '').toLowerCase()
  const shouldMockResolve = Boolean(environment) && environment !== 'production'
  const mockAccountName = useMemo(() => {
    const firstName = profileQuery.data?.data?.firstName?.trim() ?? ''
    const lastName = profileQuery.data?.data?.lastName?.trim() ?? ''
    const fullName = `${firstName} ${lastName}`.trim()
    return `${fullName || 'Account Holder'} [MOCK]`
  }, [profileQuery.data?.data?.firstName, profileQuery.data?.data?.lastName])

  const resetForm = () => {
    verifyRequestIdRef.current += 1
    lastAttemptedResolveKeyRef.current = ''
    setSelectedBankId('')
    setAccountNumber('')
    setResolvedAccountName('')
    setResolveErrorMessage('')
    setResolveErrorShakeKey(0)
    setIsResolvingAccount(false)
    setMakeDefault(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  useEffect(() => {
    if (isOpen) return
    resetForm()
  }, [isOpen])

  useEffect(() => {
    const resolveKey = selectedBank ? `${selectedBank.code}:${accountNumber}` : ''

    if (!selectedBank || accountNumber.length !== 10) {
      lastAttemptedResolveKeyRef.current = ''
      setResolvedAccountName('')
      setResolveErrorMessage('')
      setIsResolvingAccount(false)
      return
    }

    if (lastAttemptedResolveKeyRef.current === resolveKey) {
      return
    }
    lastAttemptedResolveKeyRef.current = resolveKey
    setResolvedAccountName('')
    setResolveErrorMessage('')

    const requestId = verifyRequestIdRef.current + 1
    verifyRequestIdRef.current = requestId
    setIsResolvingAccount(true)

    let isCancelled = false
    const resolveAccount = async () => {
      try {
        let accountName = ''
        if (shouldMockResolve) {
          await new Promise((resolve) => window.setTimeout(resolve, 450))
          accountName = mockAccountName
        } else {
          const response = await verifyBankAccount({
            accountNumber,
            bankCode: selectedBank.code,
          })
          accountName = response.data?.accountName?.trim() ?? ''
        }
        if (!accountName) throw new Error('No account name resolved')
        if (isCancelled || verifyRequestIdRef.current !== requestId) return
        setResolvedAccountName(accountName)
      } catch {
        if (isCancelled || verifyRequestIdRef.current !== requestId) return
        setResolveErrorMessage(
          'Invalid account, please check the account information and try again.'
        )
        setResolveErrorShakeKey((prev) => prev + 1)
      } finally {
        if (!isCancelled && verifyRequestIdRef.current === requestId) {
          setIsResolvingAccount(false)
        }
      }
    }

    void resolveAccount()

    return () => {
      isCancelled = true
      if (verifyRequestIdRef.current === requestId) {
        setIsResolvingAccount(false)
      }
    }
  }, [
    accountNumber,
    mockAccountName,
    selectedBank,
    shouldMockResolve,
    verifyBankAccount,
  ])

  const canSave = Boolean(
    selectedBank &&
      accountNumber.length === 10 &&
      resolvedAccountName &&
      !isResolvingAccount &&
      !availableBanksQuery.isLoading &&
      !availableBanksQuery.isFetching &&
      !availableBanksQuery.isError
  )

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
        <h3 className='text-2xl font-semibold text-blackish'>Add New Account</h3>
        <p className='text-sm text-grey-600 mt-1'>Provide the following details</p>
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
          disabled={
            availableBanksQuery.isLoading ||
            availableBanksQuery.isError ||
            bankOptions.length === 0
          }
        >
          <SelectTrigger className='mt-1 w-full rounded-[10px] border border-grey-100 bg-grey-50/15 px-3 py-3.5 text-sm text-grey-600 h-[48px]! disabled:opacity-60'>
            <SelectValue
              placeholder={
                availableBanksQuery.isLoading ? 'Loading banks...' : 'Select bank'
              }
            />
          </SelectTrigger>
          <SelectContent>
            {!availableBanksQuery.isLoading && bankOptions.length === 0 && (
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

        {availableBanksQuery.isError && (
          <div className='mt-2 rounded-[10px] border border-error-100 bg-error-50 px-3 py-2'>
            <p className='text-xs text-error-600'>
              We couldn&apos;t load the bank list.
            </p>
            <button
              type='button'
              onClick={() => availableBanksQuery.refetch()}
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
        onChange={(value) => setAccountNumber(value.replace(/\D/g, '').slice(0, 10))}
      />
      <div>
        <label className='text-sm leading-[145%] font-medium text-grey-900'>
          Account Holder Name
        </label>
        <div className='relative mt-1'>
          <input
            type='text'
            value={resolvedAccountName}
            readOnly
            placeholder='Account name will be auto-filled'
            className='w-full px-3 py-3.5 pr-10 rounded-[12px] leading-[145%] border text-sm font-medium outline-hidden border-grey-100 bg-grey-50 text-grey-600'
          />
          {isResolvingAccount && (
            <span className='absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center'>
              <span className='h-4 w-4 rounded-full border-2 border-grey-300 border-t-primary-500 animate-spin' />
            </span>
          )}
        </div>
      </div>
      <AnimatePresence mode='wait'>
        {resolveErrorMessage ? (
          <motion.p
            key={resolveErrorShakeKey}
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: [0, -14, 14, -10, 10, -6, 6, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
            className='text-xs text-error-500 -mt-2'
          >
            {resolveErrorMessage}
          </motion.p>
        ) : null}
      </AnimatePresence>
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
        onClick={async () => {
          if (!selectedBank || !canSave) return
          try {
            await connectBankMutation.mutateAsync({
              bankName: selectedBank.label,
              bankCode: selectedBank.code,
              accountNumber,
              accountName: resolvedAccountName,
              isDefault: makeDefault,
            })
            openSuccess({
              message: 'The payment method has been successfully added.',
            })
            handleClose()
          } catch {
            openSuccess({
              message: 'Unable to add payment method. Please try again.',
            })
          }
        }}
        className='flex-1 py-3 rounded-[12px] bg-linear-to-b from-[#4848C9] from-[17.5%] to-[#1818AB] enabled:hover:from-primary-600 enabled:hover:to-primary-800 transition-colors duration-300 text-white font-medium disabled:opacity-30'
        disabled={!canSave || connectBankMutation.isPending}
      >
        {connectBankMutation.isPending ? 'Saving...' : 'Save Account'}
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
