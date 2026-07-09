import { useEffect, useMemo, useState } from 'react'
import ResponsiveModal from '@/components/common/ResponsiveModal'
import { checkoutPayment } from '@/api/services/payment'
import { toApiError } from '@/api/errorHelpers'
import { formatCurrency } from '@/lib/utils/currency'
import { storePaymentReturnPath } from '@/lib/payments/paystackReturn'
import type { CheckoutPaymentRequestBody } from '@/types/Payment'
import type { GiftOption } from './types'
import CheckoutPinModal from './CheckoutPinModal'
import ConfirmationHeader from './confirmation/ConfirmationHeader'
import PaymentStepContent from './confirmation/PaymentStepContent'
import ReviewStepContent from './confirmation/ReviewStepContent'
import DesktopPinStepContent from './confirmation/DesktopPinStepContent'
import type { CheckoutStep, GuestDetails } from './confirmation/types'
import {
  EMAIL_REGEX,
  getCashAmountError,
  getDefaultCashAmount,
  getItemAmount,
  resolveCashAmount,
} from './confirmation/helpers'
import { analytics } from '@/lib/analytics/events'
import { calculateFee } from './utils'

type ConfirmationModalProps = {
  isOpen: boolean
  onClose: () => void
  onPaymentSuccess: (message: string) => void
  onRequestWalletSignIn?: (payload: {
    step: 'payment'
    cashAmountInputs: Record<string, string>
  }) => void
  pageId: string
  isAuthenticated: boolean
  initialStep?: CheckoutStep
  initialCashAmountInputs?: Record<string, string>
  selectedGiftItems: GiftOption[]
  giftQuantities: Record<string, number>
  onChangeGiftQuantity: (giftId: string, direction: 'inc' | 'dec') => void
  currency: string
  ownersName: string
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onPaymentSuccess,
  onRequestWalletSignIn,
  pageId,
  isAuthenticated,
  initialStep = 'review',
  initialCashAmountInputs = {},
  selectedGiftItems,
  giftQuantities,
  onChangeGiftQuantity,
  currency,
  ownersName,
}: ConfirmationModalProps) {
  const [step, setStep] = useState<CheckoutStep>('review')
  const [cashAmountInputs, setCashAmountInputs] = useState<
    Record<string, string>
  >({})
  const [cashAmountErrors, setCashAmountErrors] = useState<
    Record<string, string>
  >({})
  const [paymentError, setPaymentError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPinModalOpen, setIsPinModalOpen] = useState(false)
  const [isMobileViewport, setIsMobileViewport] = useState(false)
  const [pinError, setPinError] = useState('')
  const [guestDetails, setGuestDetails] = useState<GuestDetails>({
    fullName: '',
    email: '',
  })
  const [guestErrors, setGuestErrors] = useState<{
    fullName?: string
    email?: string
  }>({})

  const cashItems = useMemo(
    () => selectedGiftItems.filter((item) => item.kind === 'cash'),
    [selectedGiftItems]
  )

  useEffect(() => {
    if (typeof window === 'undefined') return
    const updateViewport = () => {
      setIsMobileViewport(window.innerWidth < 1024)
    }
    updateViewport()
    window.addEventListener('resize', updateViewport)
    return () => window.removeEventListener('resize', updateViewport)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    if (isMobileViewport && step === 'pin' && !isPinModalOpen) {
      setIsPinModalOpen(true)
      return
    }

    if (!isMobileViewport && isPinModalOpen) {
      setIsPinModalOpen(false)
      setStep('pin')
      return
    }

    if (step !== 'pin' && isPinModalOpen) {
      setIsPinModalOpen(false)
    }
  }, [isMobileViewport, isOpen, isPinModalOpen, step])

  useEffect(() => {
    if (!isOpen) {
      setStep('review')
      setCashAmountInputs({})
      setCashAmountErrors({})
      setPaymentError('')
      setPinError('')
      setIsPinModalOpen(false)
      setGuestErrors({})
      return
    }

    setStep(initialStep)
    setCashAmountInputs(initialCashAmountInputs)
    setGuestDetails({
      fullName: '',
      email: '',
    })
  }, [initialCashAmountInputs, initialStep, isOpen])

  if (!isOpen) return null

  const getResolvedCashAmount = (item: GiftOption) =>
    resolveCashAmount(item, cashAmountInputs)

  const getLineAmount = (item: GiftOption) => {
    const quantity = giftQuantities[item.id] ?? item.quantity
    return getItemAmount(item, quantity, getResolvedCashAmount(item))
  }

  const giftsTotal = selectedGiftItems.reduce(
    (sum, item) => sum + getLineAmount(item),
    0
  )

  const serviceCharge = calculateFee(giftsTotal) || Math.round(giftsTotal * 0.07)
  // const serviceCharge = Math.round(giftsTotal * 0.07)
  const total = giftsTotal + serviceCharge
  const paymentBreakdownItems = selectedGiftItems.map((item) => ({
    id: item.id,
    title: item.title,
    quantityLabel:
      item.kind === 'cash'
        ? ''
        : ` x${giftQuantities[item.id] ?? item.quantity}`,
    amount: getLineAmount(item),
  }))

  const validateCashAmounts = () => {
    const nextErrors: Record<string, string> = {}

    cashItems.forEach((item) => {
      const error = getCashAmountError(
        item,
        cashAmountInputs[item.id] ?? getDefaultCashAmount(item),
        currency
      )
      if (error) nextErrors[item.id] = error
    })

    setCashAmountErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleCashAmountChange = (item: GiftOption, raw: string) => {
    const sanitized = raw.replace(/\D/g, '')
    setCashAmountInputs((prev) => ({ ...prev, [item.id]: sanitized }))
    const nextError = getCashAmountError(item, sanitized, currency)
    setCashAmountErrors((prev) => ({ ...prev, [item.id]: nextError }))
    if (paymentError) setPaymentError('')
  }

  const validateGuestDetailsForExternal = () => {
    if (isAuthenticated) return {}

    const nextErrors: { fullName?: string; email?: string } = {}
    const fullName = guestDetails.fullName.trim()
    const email = guestDetails.email.trim()

    if (!fullName) {
      nextErrors.fullName = 'Full name is required.'
    } else if (fullName.length < 2) {
      nextErrors.fullName = 'Enter a valid full name.'
    }

    if (!email) {
      nextErrors.email = 'Email is required.'
    } else if (!EMAIL_REGEX.test(email)) {
      nextErrors.email = 'Enter a valid email address.'
    }

    return nextErrors
  }

  const handleGuestDetailsChange = (
    field: keyof GuestDetails,
    value: string
  ) => {
    setGuestDetails((prev) => ({ ...prev, [field]: value }))
    if (guestErrors[field]) {
      setGuestErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const buildCheckoutPayload = (
    paymentMethod: 'external' | 'wallet',
    pin?: string
  ): CheckoutPaymentRequestBody => {
    const wishListItems = selectedGiftItems
      .filter((item) => item.kind !== 'cash')
      .map((item) => ({
        itemId: item.id,
        quantity: giftQuantities[item.id] ?? item.quantity,
        source:
          item.kind === 'store' ? ('store' as const) : ('custom' as const),
      }))

    const cashGiftAmount = cashItems.reduce(
      (sum, item) => sum + getResolvedCashAmount(item),
      0
    )

    return {
      pageId,
      ...(wishListItems.length > 0 ? { wishListItems } : {}),
      ...(cashGiftAmount > 0 ? { cashGiftAmount } : {}),
      ...(!isAuthenticated && paymentMethod === 'external'
        ? {
          userDetails: {
            fullName: guestDetails.fullName.trim(),
            email: guestDetails.email.trim(),
          },
        }
        : {}),
      ...(paymentMethod === 'wallet' ? { payWithWallet: true, pin } : {}),
    }
  }

  const resolveFriendlyCheckoutError = (
    rawMessage: string,
    paymentMethod: 'external' | 'wallet',
    fieldErrors?: Record<string, string[]>
  ) => {
    const firstFieldError = fieldErrors
      ? Object.values(fieldErrors).find(
        (messages): messages is string[] =>
          Array.isArray(messages) &&
          messages.length > 0 &&
          typeof messages[0] === 'string'
      )?.[0]
      : undefined

    if (firstFieldError?.trim()) return firstFieldError.trim()

    const message = rawMessage.trim().toLowerCase()

    if (!message || message === 'validation failed') {
      return paymentMethod === 'wallet'
        ? 'Unable to complete wallet payment. Check your PIN and try again.'
        : 'Please check your payment details and try again.'
    }

    if (message.includes('pin')) {
      return 'Incorrect PIN. Please try again.'
    }

    if (message.includes('insufficient')) {
      return 'Insufficient wallet balance for this payment.'
    }

    if (message.includes('cashgiftamount') || message.includes('cash gift')) {
      const minMaxMatch = rawMessage.match(
        /between\s+([0-9]+(?:\.[0-9]+)?)\s+and\s+([0-9]+(?:\.[0-9]+)?|null)\s+([A-Z]{3})/i
      )
      if (minMaxMatch) {
        const min = Number(minMaxMatch[1])
        const maxRaw = minMaxMatch[2]
        const parsedCurrency = minMaxMatch[3]?.toUpperCase() || currency

        if (maxRaw.toLowerCase() === 'null') {
          return `Cash gift amount must be at least ${formatCurrency(min, {
            currency: parsedCurrency,
            maximumFractionDigits: 0,
          })}.`
        }

        const max = Number(maxRaw)
        return `Cash gift amount must be between ${formatCurrency(min, {
          currency: parsedCurrency,
          maximumFractionDigits: 0,
        })} and ${formatCurrency(max, {
          currency: parsedCurrency,
          maximumFractionDigits: 0,
        })}.`
      }
      return rawMessage.trim() || 'Cash gift amount is not valid for this page.'
    }

    if (message.includes('email')) {
      return 'Enter a valid email address to continue.'
    }

    if (message.includes('full name') || message.includes('fullname')) {
      return 'Enter your full name to continue.'
    }

    return (
      rawMessage.trim() || 'Unable to initialize payment. Please try again.'
    )
  }

  const isPinRelatedCheckoutError = (
    rawMessage: string,
    fieldErrors?: Record<string, string[]>
  ) => {
    const messageIncludesPin = rawMessage.toLowerCase().includes('pin')
    const fieldErrorIncludesPin = Object.entries(fieldErrors ?? {}).some(
      ([field, messages]) =>
        field.toLowerCase().includes('pin') ||
        messages.some((entry) => entry.toLowerCase().includes('pin'))
    )
    return messageIncludesPin || fieldErrorIncludesPin
  }

  const submitCheckout = async (
    paymentMethod: 'external' | 'wallet',
    pin?: string
  ) => {
    if (!validateCashAmounts()) return
    if (!isAuthenticated && paymentMethod === 'external') {
      const nextGuestErrors = validateGuestDetailsForExternal()
      setGuestErrors(nextGuestErrors)
      if (Object.keys(nextGuestErrors).length > 0) return
    }

    if (selectedGiftItems.length === 0) {
      setPaymentError('No gift items selected.')
      return
    }

    setIsSubmitting(true)
    setPaymentError('')

    try {
      const payload = buildCheckoutPayload(paymentMethod, pin)
      const response = await checkoutPayment(payload, isAuthenticated)
      const responseData = response.data

      if (
        responseData &&
        'authorizationUrl' in responseData &&
        responseData.authorizationUrl
      ) {
        storePaymentReturnPath(responseData.reference)
        window.location.assign(responseData.authorizationUrl)
        return
      }

      setIsPinModalOpen(false)
      analytics.trackPublicPageCheckoutSucceeded({
        page_id: pageId,
        payment_method: paymentMethod,
        is_authenticated: isAuthenticated,
        source: 'public_page',
      })
      onPaymentSuccess(
        `Your gift has been confirmed. Small or big, your gift makes ${ownersName} day special.`
      )
      onClose()
    } catch (error) {
      const apiError = toApiError(error)
      const rawErrorMessage = apiError.message || ''
      const isPinError = isPinRelatedCheckoutError(
        rawErrorMessage,
        apiError.fieldErrors
      )
      const message = resolveFriendlyCheckoutError(
        rawErrorMessage,
        paymentMethod,
        apiError.fieldErrors
      )
      analytics.trackPublicPageCheckoutFailed({
        page_id: pageId,
        payment_method: paymentMethod,
        is_authenticated: isAuthenticated,
        error_message: message,
        source: 'public_page',
      })

      if (paymentMethod === 'wallet') {
        if (isPinError) {
          setPinError(message)
          return
        }
        setPinError('')
        setIsPinModalOpen(false)
        setStep('payment')
        setPaymentError(message)
      } else {
        setPaymentError(message)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleContinueToPayment = () => {
    setPaymentError('')
    if (!validateCashAmounts()) return
    setStep('payment')
  }

  const handleHeaderBack = () => {
    if (step === 'pin') {
      setStep('payment')
      setPinError('')
      return
    }
    if (step === 'payment') {
      setStep('review')
      setPaymentError('')
      return
    }
    onClose()
  }

  return (
    <>
      <ResponsiveModal
        isOpen={isOpen}
        onClose={onClose}
        desktopMaxWidthClass='max-w-[500px]'
        mobileTopOffsetClass='top-0'
        zIndex='z-70 lg:z-50'
        header={
          <ConfirmationHeader
            step={step}
            onClose={onClose}
            onBack={handleHeaderBack}
          />
        }
        body={
          <div className='space-y-4'>
            {step === 'review' ? (
              <ReviewStepContent
                selectedGiftItems={selectedGiftItems}
                giftQuantities={giftQuantities}
                currency={currency}
                cashAmountInputs={cashAmountInputs}
                cashAmountErrors={cashAmountErrors}
                onCashAmountChange={handleCashAmountChange}
                onChangeGiftQuantity={onChangeGiftQuantity}
                giftsTotal={giftsTotal}
                serviceCharge={serviceCharge}
                total={total}
              />
            ) : step === 'payment' ? (
              <PaymentStepContent
                selectedCount={selectedGiftItems.length}
                breakdownItems={paymentBreakdownItems}
                currency={currency}
                total={total}
                serviceCharge={serviceCharge}
                isAuthenticated={isAuthenticated}
                isSubmitting={isSubmitting}
                guestDetails={guestDetails}
                guestErrors={guestErrors}
                paymentError={paymentError}
                cashAmountInputs={cashAmountInputs}
                onChangeGuestDetails={handleGuestDetailsChange}
                onExternalPay={() => void submitCheckout('external')}
                onWalletPay={() => {
                  setPinError('')
                  setStep('pin')
                }}
                onRequestWalletSignIn={onRequestWalletSignIn}
                onGoBack={() => {
                  setStep('review')
                  setPaymentError('')
                }}
              />
            ) : (
              <>
                {!isMobileViewport ? (
                  <DesktopPinStepContent
                    isActive={step === 'pin'}
                    pinError={pinError}
                    isSubmitting={isSubmitting}
                    onBack={() => {
                      setStep('payment')
                      setPinError('')
                    }}
                    onConfirm={async (pin) => {
                      await submitCheckout('wallet', pin)
                    }}
                    onClearError={() => setPinError('')}
                  />
                ) : null}
              </>
            )}
          </div>
        }
        footer={
          step === 'review' ? (
            <div className='grid gap-3 grid-cols-2'>
              <button
                type='button'
                onClick={onClose}
                className='inline-flex h-12 items-center justify-center rounded-[14px] border border-grey-200 bg-grey-50 px-4 text-sm font-medium text-grey-800 hover:bg-grey-100 transition-colors duration-300'
              >
                Cancel
              </button>
              <button
                type='button'
                onClick={handleContinueToPayment}
                disabled={selectedGiftItems.length === 0 || isSubmitting}
                className='inline-flex h-12 items-center justify-center rounded-[14px] bg-linear-to-b from-primary-400 to-primary-600 px-4 text-sm font-medium text-white enabled:hover:from-primary-500 enabled:hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300'
              >
                {isSubmitting ? 'Processing...' : 'Make Payment'}
              </button>
            </div>
          ) : undefined
        }
      />

      {isPinModalOpen ? (
        <CheckoutPinModal
          isOpen={isPinModalOpen}
          pinError={pinError}
          isSubmitting={isSubmitting}
          onClose={() => {
            setIsPinModalOpen(false)
            setStep('payment')
            setPinError('')
          }}
          onClearError={() => setPinError('')}
          onConfirm={async (pin) => {
            await submitCheckout('wallet', pin)
          }}
        />
      ) : null}
    </>
  )
}
