'use client'

import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import CloseIcon from '@/assets/icons/CloseIcon'
import BackLeftIcon from '@/assets/icons/BackLeftIcon'
import ShakeOnError from '@/components/common/ShakeOnError'
import { useSuccessModal } from '@/context/SuccessModalContext'
import { useProfile } from '@/hooks/tanstack/account'
import {
  useLookupTransferRecipient,
  useTransferToWallet,
} from '@/hooks/tanstack/wallet'
import { useDebounce } from '@/hooks/useDebounce'
import type { TransferRecipientLookupData } from '@/types/Wallet'
import { toApiError } from '@/api/errorHelpers'
import { analytics } from '@/lib/analytics/events'
import { formatAmountDigits, formatCurrency } from '@/lib/utils/currency'

type WalletTransferModalProps = {
  isOpen: boolean
  onClose: () => void
  availableBalance: number
  currency: string
}

const TRANSFER_ERROR_MESSAGE = 'Unable to complete transfer. Please try again.'

const WalletTransferModal = ({
  isOpen,
  onClose,
  availableBalance,
  currency,
}: WalletTransferModalProps) => {
  const { openSuccess } = useSuccessModal()
  const profileQuery = useProfile()
  const { mutateAsync: lookupRecipient } = useLookupTransferRecipient()
  const transferMutation = useTransferToWallet()
  const [step, setStep] = useState<'form' | 'pin'>('form')
  const [tagInput, setTagInput] = useState('')
  const [amountInput, setAmountInput] = useState('')
  const [pin, setPin] = useState(['', '', '', ''])
  const [isPinModalOpen, setIsPinModalOpen] = useState(false)
  const [recipient, setRecipient] =
    useState<TransferRecipientLookupData | null>(null)
  const [isResolvingRecipient, setIsResolvingRecipient] = useState(false)
  const [resolveErrorMessage, setResolveErrorMessage] = useState('')
  const [resolveErrorShakeKey, setResolveErrorShakeKey] = useState(0)
  const pinRefs = useRef<Array<HTMLInputElement | null>>([])
  const lookupRequestIdRef = useRef(0)
  const lastAttemptedTagRef = useRef('')

  const normalizedTag = tagInput.replace(/^@+/, '').trim()
  const debouncedTag = useDebounce(normalizedTag, 500)

  useEffect(() => {
    if (debouncedTag.length === 0) {
      lookupRequestIdRef.current += 1
      lastAttemptedTagRef.current = ''
      setRecipient(null)
      setResolveErrorMessage('')
      setIsResolvingRecipient(false)
      return
    }

    if (lastAttemptedTagRef.current === debouncedTag) return
    lastAttemptedTagRef.current = debouncedTag
    setRecipient(null)
    setResolveErrorMessage('')

    const requestId = lookupRequestIdRef.current + 1
    lookupRequestIdRef.current = requestId
    setIsResolvingRecipient(true)

    let isCancelled = false
    const resolveRecipient = async () => {
      try {
        const response = await lookupRecipient(debouncedTag)
        const resolved = response.data
        if (!resolved) throw new Error('No recipient resolved')
        if (isCancelled || lookupRequestIdRef.current !== requestId) return
        setRecipient(resolved)
      } catch {
        if (isCancelled || lookupRequestIdRef.current !== requestId) return
        setResolveErrorMessage('No Giftseon user found for this tag.')
        setResolveErrorShakeKey((prev) => prev + 1)
      } finally {
        if (!isCancelled && lookupRequestIdRef.current === requestId) {
          setIsResolvingRecipient(false)
        }
      }
    }

    void resolveRecipient()

    return () => {
      isCancelled = true
      if (lookupRequestIdRef.current === requestId) {
        setIsResolvingRecipient(false)
      }
    }
  }, [debouncedTag, lookupRecipient])

  const currentTag = profileQuery.data?.data?.giftseonTag ?? undefined
  const isSelfTransfer = Boolean(
    recipient &&
    currentTag &&
    recipient.tag.toLowerCase() === currentTag.toLowerCase(),
  )

  const amountValue = Number(amountInput)
  const isInsufficient = amountValue > availableBalance
  const insufficientBalanceMessage = isInsufficient
    ? `You have less than ${formatCurrency(amountValue, {
        currency,
        maximumFractionDigits: 0,
      })} in your account`
    : undefined
  const isCrossCurrency = Boolean(
    recipient && recipient.walletCurrency !== currency,
  )

  const isContinueDisabled =
    !recipient ||
    isSelfTransfer ||
    amountValue <= 0 ||
    isInsufficient ||
    isResolvingRecipient
  const isPinComplete = pin.every((digit) => digit.length === 1)

  const errorMessage = transferMutation.isError
    ? toApiError(transferMutation.error).message || TRANSFER_ERROR_MESSAGE
    : undefined
  const isPinError = errorMessage?.toLowerCase().includes('pin') ?? false
  const pinErrorMessage = isPinError ? errorMessage : undefined
  const formErrorMessage = isPinError ? undefined : errorMessage

  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') return

    const syncPinUiByViewport = () => {
      const isMobileViewport = window.innerWidth < 1024

      if (isMobileViewport && step === 'pin' && !isPinModalOpen) {
        setIsPinModalOpen(true)
      }

      if (!isMobileViewport && isPinModalOpen) {
        setIsPinModalOpen(false)
        setStep('pin')
      }
    }

    syncPinUiByViewport()
    window.addEventListener('resize', syncPinUiByViewport)
    return () => window.removeEventListener('resize', syncPinUiByViewport)
  }, [isOpen, isPinModalOpen, step])

  const handleClose = () => {
    onClose()
    setStep('form')
    setTagInput('')
    setAmountInput('')
    setPin(['', '', '', ''])
    setIsPinModalOpen(false)
    lookupRequestIdRef.current += 1
    lastAttemptedTagRef.current = ''
    setRecipient(null)
    setResolveErrorMessage('')
    setResolveErrorShakeKey(0)
    setIsResolvingRecipient(false)
    transferMutation.reset()
  }

  const handlePinChange = (index: number, value: string) => {
    const next = [...pin]
    next[index] = value.replace(/[^0-9]/g, '').slice(0, 1)
    setPin(next)
    transferMutation.reset()
    if (value && pinRefs.current[index + 1]) {
      pinRefs.current[index + 1]?.focus()
    }
  }

  const handlePinKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (
      event.key === 'Backspace' &&
      !pin[index] &&
      pinRefs.current[index - 1]
    ) {
      pinRefs.current[index - 1]?.focus()
    }
  }

  const handlePinPaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 4)
    if (!pasted) return
    const next = pasted.split('').slice(0, 4)
    setPin([next[0] || '', next[1] || '', next[2] || '', next[3] || ''])
    transferMutation.reset()
    const targetIndex = Math.min(pasted.length, 4) - 1
    pinRefs.current[targetIndex]?.focus()
  }

  const openPinStep = () => {
    transferMutation.reset()
    analytics.trackWalletTransferPinStepOpened({
      amount: amountValue,
      currency,
    })
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsPinModalOpen(true)
      return
    }
    setStep('pin')
  }

  const handleTransferSubmit = async () => {
    if (!isPinComplete || transferMutation.isPending || !recipient) return
    try {
      analytics.trackWalletTransferSubmitted({
        amount: amountValue,
        currency,
      })
      const response = await transferMutation.mutateAsync({
        receiverTag: recipient.tag,
        amount: amountValue,
        pin: pin.join(''),
      })
      const result = response.data
      const crossCurrency = Boolean(
        result && result.senderCurrency !== result.receiverCurrency,
      )
      analytics.trackWalletTransferSucceeded({
        amount: amountValue,
        currency,
        cross_currency: crossCurrency,
      })
      const messageParts: string[] = [
        `You sent ${formatCurrency(amountValue, {
          currency,
          maximumFractionDigits: 0,
        })} to ${recipient.fullName} (@${recipient.tag}).`,
      ]
      if (result?.reference) {
        messageParts.push(`Reference: ${result.reference}.`)
      }
      if (crossCurrency && result) {
        messageParts.push(
          `${formatCurrency(result.convertedAmount, {
            currency: result.receiverCurrency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })} was credited to the recipient.`,
        )
        messageParts.push(
          `A fee of ${formatCurrency(result.fee, {
            currency: result.senderCurrency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })} was applied.`,
        )
      }
      openSuccess({
        title: 'Transfer successful',
        message: response.message || messageParts.join(' '),
      })
      handleClose()
    } catch (error: unknown) {
      const apiError = toApiError(error)
      const apiErrorMessage = apiError.message?.toLowerCase() ?? ''
      const reason = apiErrorMessage.includes('pin') ? 'pin' : 'other'
      analytics.trackWalletTransferFailed({
        amount: amountValue,
        currency,
        reason,
        error_message: apiError.message || TRANSFER_ERROR_MESSAGE,
      })
      setPin(['', '', '', ''])
      pinRefs.current[0]?.focus()
      if (reason !== 'pin') {
        setStep('form')
        setIsPinModalOpen(false)
      }
    }
  }

  const headerTitle = step === 'pin' ? 'Confirmation' : 'Send Funds'
  const headerSubtitle =
    step === 'pin'
      ? 'Provide your account PIN to move forward'
      : `Available balance: ${formatCurrency(availableBalance, {
          currency,
          maximumFractionDigits: 0,
        })}`

  const recipientCard = recipient ? (
    <div className='flex items-center gap-3 bg-[#F7FAFF] border border-grey-50 rounded-[10px] p-3'>
      {recipient.profilePicture ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={recipient.profilePicture}
          alt={recipient.fullName}
          className='w-10 h-10 rounded-full object-cover'
        />
      ) : (
        <span className='w-10 h-10 rounded-full bg-primary-100 text-primary-600 text-sm font-medium flex items-center justify-center'>
          {recipient.fullName
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part.charAt(0))
            .join('')
            .toUpperCase() || '?'}
        </span>
      )}
      <div className='min-w-0'>
        <p className='text-sm font-medium text-grey-900 truncate'>
          {recipient.fullName}
        </p>
        <p className='text-xs text-grey-500 truncate'>
          {recipient.tag} · {recipient.walletCurrency}
        </p>
      </div>
    </div>
  ) : null

  const renderActions = () => {
    if (step === 'pin') {
      return (
        <div className='flex items-center gap-3'>
          <button
            type='button'
            onClick={() => {
              setStep('form')
            }}
            className='flex-1 py-2.5 rounded-[10px] border border-grey-200 text-grey-700 font-medium bg-grey-50/70 hover:bg-grey-100/70 transition-colors'
          >
            Go Back
          </button>
          <button
            type='button'
            disabled={!isPinComplete || transferMutation.isPending}
            onClick={handleTransferSubmit}
            className={`flex-1 py-2.5 rounded-[10px] font-medium text-white transition-colors ${
              isPinComplete && !transferMutation.isPending
                ? 'bg-primary-500 hover:bg-primary-600'
                : 'bg-primary-200 cursor-not-allowed'
            }`}
          >
            {transferMutation.isPending ? 'Processing...' : 'Confirm Transfer'}
          </button>
        </div>
      )
    }

    return (
      <div className='flex items-center gap-3'>
        <button
          type='button'
          onClick={handleClose}
          className='flex-1 py-2.5 rounded-[10px] border border-grey-200 text-grey-700 font-medium bg-grey-50/70 hover:bg-grey-100/70 transition-colors'
        >
          Cancel
        </button>
        <button
          type='button'
          disabled={isContinueDisabled}
          onClick={openPinStep}
          className={`flex-1 py-2.5 rounded-[10px] font-medium text-white transition-colors ${
            isContinueDisabled
              ? 'bg-primary-200 cursor-not-allowed'
              : 'bg-primary-500 hover:bg-primary-600'
          }`}
        >
          Continue
        </button>
      </div>
    )
  }

  const pinBoxes = (mobileOverlay = false) => (
    <div className='flex items-center justify-center gap-3'>
      {pin.map((value, index) => (
        <input
          key={index}
          ref={(el) => {
            pinRefs.current[index] = el
          }}
          value={value}
          onChange={(event) => handlePinChange(index, event.target.value)}
          onKeyDown={(event) => handlePinKeyDown(index, event)}
          onPaste={handlePinPaste}
          className={`w-12 h-12 border rounded-[8px] text-center text-lg font-medium text-blackish focus:outline-none ${
            mobileOverlay ? '' : 'focus:ring-0'
          } ${
            pinErrorMessage
              ? mobileOverlay
                ? 'border-error-400 focus:ring-1 focus:ring-error-200'
                : 'border-error-400 focus:border-error-400'
              : mobileOverlay
                ? 'border-grey-100 focus:ring-1 focus:ring-primary-300'
                : 'border-grey-100 focus:border-primary-300'
          }`}
          type='password'
          inputMode='numeric'
          maxLength={1}
        />
      ))}
    </div>
  )

  const stepContent = (showActions = true) => {
    if (step === 'pin') {
      if (!showActions) return null
      return (
        <div className='space-y-4'>
          {pinBoxes()}
          <ShakeOnError active={Boolean(pinErrorMessage)}>
            {pinErrorMessage ? (
              <p className='text-xs text-error-500 text-center'>
                {pinErrorMessage}
              </p>
            ) : null}
          </ShakeOnError>
          {showActions ? renderActions() : null}
        </div>
      )
    }

    return (
      <div className='space-y-4'>
        <div>
          <label className='text-sm font-medium mb-2 block'>
            Recipient Giftseon Tag
          </label>
          <div
            className={`flex items-center w-full px-3 border rounded-lg ${
              Boolean(resolveErrorMessage) || isSelfTransfer
                ? 'border-error-400 focus-within:border-error-400'
                : 'border-grey-50 focus-within:border-primary-500'
            }`}
          >
            <span className='text-sm font-medium text-grey-500 pr-1'>@</span>
            <input
              type='text'
              value={tagInput}
              onChange={(event) => {
                setTagInput(event.target.value)
                transferMutation.reset()
              }}
              placeholder='username'
              className='w-full py-3.5 bg-transparent outline-hidden focus:outline-hidden text-sm text-blackish font-medium'
            />
            {isResolvingRecipient ? (
              <span className='inline-flex items-center justify-center pl-2'>
                <span className='h-4 w-4 rounded-full border-2 border-grey-300 border-t-primary-500 animate-spin' />
              </span>
            ) : null}
          </div>
          {recipient ? <div className='mt-3'>{recipientCard}</div> : null}
          <AnimatePresence mode='wait'>
            {resolveErrorMessage && !recipient ? (
              <motion.p
                key={resolveErrorShakeKey}
                initial={{ opacity: 0, x: 0 }}
                animate={{ opacity: 1, x: [0, -14, 14, -10, 10, -6, 6, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: 'easeInOut' }}
                className='text-xs text-error-500 mt-2'
              >
                {resolveErrorMessage}
              </motion.p>
            ) : null}
          </AnimatePresence>
          {isSelfTransfer ? (
            <p className='text-xs text-error-500 mt-2'>
              You can&apos;t transfer to yourself.
            </p>
          ) : null}
        </div>

        <div>
          <label className='text-sm font-medium mb-2 block'>
            Amount to Send
          </label>
          <input
            type='text'
            value={formatAmountDigits(amountInput)}
            onChange={(event) => {
              setAmountInput(event.target.value.replace(/\D/g, ''))
              transferMutation.reset()
            }}
            inputMode='numeric'
            placeholder='0.00'
            className={`w-full px-3 py-3.5 border rounded-lg outline-hidden focus:outline-hidden text-sm text-blackish font-medium ${
              isInsufficient
                ? 'border-error-400 focus:border-error-400'
                : 'border-grey-50 focus:border-primary-500'
            }`}
          />
        </div>
        <ShakeOnError active={Boolean(insufficientBalanceMessage)}>
          {insufficientBalanceMessage ? (
            <p className='text-xs text-error-500 -mt-2'>
              {insufficientBalanceMessage}
            </p>
          ) : null}
        </ShakeOnError>

        {isCrossCurrency && recipient ? (
          <div className='bg-information-50 border border-information-100 rounded-[10px] p-3 text-xs text-information-700'>
            {`This recipient receives in ${recipient.walletCurrency}. Your ${currency} amount will be converted and a fee may apply. Final figures are shown after the transfer.`}
          </div>
        ) : null}

        {formErrorMessage ? (
          <p className='text-xs text-error-500'>{formErrorMessage}</p>
        ) : null}

        {showActions ? renderActions() : null}
      </div>
    )
  }

  useEffect(() => {
    if (recipient && !isSelfTransfer) {
      analytics.trackWalletTransferRecipientResolved({ currency })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipient?.userId])

  if (!isOpen) return null

  return (
    <div
      className={`fixed inset-0 ${isPinModalOpen ? 'z-60' : 'z-30'} lg:z-50`}
    >
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
              {headerTitle}
            </h3>
            {headerSubtitle ? (
              <p className='text-sm text-grey-600 max-w-[356px] mx-auto mt-1'>
                {headerSubtitle}
              </p>
            ) : null}
          </div>
          <div className='px-6 sm:px-10 pb-12 overflow-y-auto flex-1 min-h-0'>
            {stepContent()}
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
                  {headerTitle}
                </span>
                {headerSubtitle ? (
                  <p className='text-sm text-grey-600 text-center'>
                    {headerSubtitle}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
          <div className='flex-1 overflow-y-auto px-4 pb-4'>
            {stepContent(false)}
          </div>
          <div className='px-4 py-3 shadow-[0px_-10px_18px_5px_#4040401A] bg-white'>
            {renderActions()}
          </div>
        </div>
      </div>

      {isPinModalOpen && (
        <div className='fixed inset-0 z-70 lg:hidden flex items-center justify-center px-4'>
          <div
            className='absolute inset-0 bg-black/40 backdrop-blur-sm'
            onClick={() => {
              setIsPinModalOpen(false)
              setStep('form')
            }}
          />
          <div className='relative w-full max-w-[520px] rounded-[20px] bg-white shadow-[0px_24px_60px_-20px_#10192852] px-6 py-8'>
            <button
              type='button'
              onClick={() => {
                setIsPinModalOpen(false)
                setStep('form')
              }}
              className='absolute right-5 top-5 w-9 h-9 rounded-full flex items-center justify-center hover:bg-grey-50'
              aria-label='Close'
            >
              <span className='text-grey-700 w-6 h-6'>
                <CloseIcon />
              </span>
            </button>
            <div className='flex flex-col items-center text-center gap-4'>
              <div>
                <h3 className='text-xl font-medium text-blackish'>
                  Confirmation
                </h3>
                <p className='text-sm text-grey-600'>
                  Provide your account PIN to move forward
                </p>
              </div>
              {pinBoxes(true)}
              <div className='flex items-center gap-3 w-full'>
                <button
                  type='button'
                  onClick={() => {
                    setIsPinModalOpen(false)
                    setStep('form')
                  }}
                  className='flex-1 py-2.5 rounded-[10px] border border-grey-200 text-grey-700 font-medium bg-grey-50/70 hover:bg-grey-100/70 transition-colors'
                >
                  Go Back
                </button>
                <button
                  type='button'
                  disabled={!isPinComplete || transferMutation.isPending}
                  onClick={handleTransferSubmit}
                  className={`flex-1 py-2.5 rounded-[10px] font-medium text-white transition-colors ${
                    isPinComplete && !transferMutation.isPending
                      ? 'bg-primary-500 hover:bg-primary-600'
                      : 'bg-primary-200 cursor-not-allowed'
                  }`}
                >
                  {transferMutation.isPending ? 'Processing...' : 'Confirm'}
                </button>
              </div>
              <ShakeOnError
                active={Boolean(pinErrorMessage)}
                className='w-full'
              >
                {pinErrorMessage ? (
                  <p className='text-xs text-error-500'>{pinErrorMessage}</p>
                ) : null}
              </ShakeOnError>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WalletTransferModal
