'use client'

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type KeyboardEvent,
} from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  useProfile,
  useRequestAccountOtp,
  useSetPassword,
  useSetPin,
} from '@/hooks/tanstack/account'
import { toApiError } from '@/api/errorHelpers'
import { useAuth } from '@/context/AuthContext'
import ResponsiveModal from '@/components/common/ResponsiveModal'
import SuccessModal from '@/components/common/SuccessModal'
import OtpInputs from '@/app/(onboarding)/components/OtpInputs'
import { getAuthTokenIssuedAt } from '@/api/token'
import {
  INITIAL_SETUP_WINDOW_MS,
  sanitizePin,
  STRONG_PASSWORD_REGEX,
} from '@/lib/utils/security'

const OTP_RESEND_WINDOW_SECONDS = 60

type SetupPurpose = 'set-password' | 'set-pin'
type SetupViewStep = 'request-otp' | 'complete'

const AccountSetupPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { status, refreshUser } = useAuth()
  const profileQuery = useProfile()
  const requestOtpMutation = useRequestAccountOtp()
  const setPasswordMutation = useSetPassword()
  const setPinMutation = useSetPin()
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [otpError, setOtpError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const [pinError, setPinError] = useState('')
  const [confirmPinError, setConfirmPinError] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isCompletingSetup, setIsCompletingSetup] = useState(false)
  const [successStage, setSuccessStage] = useState<'password' | 'pin' | null>(null)
  const [otpRequestedFor, setOtpRequestedFor] = useState<SetupPurpose | null>(null)
  const [otpCountdown, setOtpCountdown] = useState(0)
  const [setupEntryTimestamp] = useState(() => Date.now())
  const profile = profileQuery.data?.data

  const nextPath = useMemo(() => {
    const requested = searchParams.get('next')
    if (!requested) return '/dashboard'
    if (!requested.startsWith('/')) return '/dashboard'
    if (requested.startsWith('//')) return '/dashboard'
    if (requested.startsWith('/account-setup')) return '/dashboard'
    return requested
  }, [searchParams])

  const currentPurpose: SetupPurpose | null =
    !profile || profileQuery.isLoading
      ? null
      : !profile.passwordActivated
      ? 'set-password'
      : !profile.pinActivated
      ? 'set-pin'
      : null

  const tokenIssuedAt = getAuthTokenIssuedAt()
  const canBypassOtp = (() => {
    if (!tokenIssuedAt) return false
    const issuedAtMs = Date.parse(tokenIssuedAt)
    if (Number.isNaN(issuedAtMs)) return false
    return setupEntryTimestamp - issuedAtMs < INITIAL_SETUP_WINDOW_MS
  })()

  const requiresOtp = Boolean(currentPurpose) && !canBypassOtp
  const hasRequestedOtp = currentPurpose !== null && otpRequestedFor === currentPurpose
  const currentStep: SetupViewStep =
    requiresOtp && !hasRequestedOtp ? 'request-otp' : 'complete'
  const isPasswordStep = currentPurpose === 'set-password'
  const isSetupRequired =
    profile?.passwordActivated === false || profile?.pinActivated === false
  const needsPinAfterPassword = profile?.pinActivated === false
  const isResolvingSetup =
    status === 'checking' || profileQuery.isLoading || (status === 'authenticated' && !profile)

  useEffect(() => {
    if (otpCountdown <= 0) return
    const timer = window.setTimeout(() => {
      setOtpCountdown((current) => Math.max(0, current - 1))
    }, 1000)
    return () => window.clearTimeout(timer)
  }, [otpCountdown])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login')
    }
  }, [router, status])

  useEffect(() => {
    if (successStage) return
    if (!profile) return
    if (profile.passwordActivated && profile.pinActivated) {
      router.replace(nextPath)
    }
  }, [nextPath, profile, router, successStage])

  useEffect(() => {
    if (currentStep === 'complete' && requiresOtp) {
      otpInputRefs.current[0]?.focus()
    }
  }, [currentStep, requiresOtp])

  const clearErrors = () => {
    setErrorMessage('')
    setOtpError('')
    setPasswordError('')
    setConfirmPasswordError('')
    setPinError('')
    setConfirmPinError('')
  }

  const resetOtpState = () => {
    setOtp(['', '', '', '', '', ''])
    setOtpError('')
  }

  const handleRequestOtp = async () => {
    if (!currentPurpose || !requiresOtp || otpCountdown > 0) return
    try {
      clearErrors()
      await requestOtpMutation.mutateAsync({ purpose: currentPurpose })
      resetOtpState()
      setOtpRequestedFor(currentPurpose)
      setOtpCountdown(OTP_RESEND_WINDOW_SECONDS)
    } catch (error: unknown) {
      setErrorMessage(
        toApiError(error).message || 'Unable to request an OTP right now.'
      )
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return
    if (otpError) setOtpError('')
    if (errorMessage) setErrorMessage('')
    const nextOtp = [...otp]
    nextOtp[index] = value.replace(/\D/g, '')
    setOtp(nextOtp)
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpPaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    if (otpError) setOtpError('')
    if (errorMessage) setErrorMessage('')
    const pastedData = event.clipboardData.getData('text').replace(/\D/g, '')
    if (pastedData.length === 6) {
      const nextOtp = pastedData.split('').slice(0, 6)
      setOtp(nextOtp)
      otpInputRefs.current[5]?.focus()
    }
  }

  const handleOtpKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (otpError) setOtpError('')
    if (errorMessage) setErrorMessage('')
    const { key } = event
    if (key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        const nextOtp = [...otp]
        nextOtp[index - 1] = ''
        setOtp(nextOtp)
        otpInputRefs.current[index - 1]?.focus()
      } else {
        const nextOtp = [...otp]
        nextOtp[index] = ''
        setOtp(nextOtp)
      }
    } else if (key === 'ArrowLeft' && index > 0) {
      otpInputRefs.current[index - 1]?.focus()
    } else if (key === 'ArrowRight' && index < 5) {
      otpInputRefs.current[index + 1]?.focus()
    }
  }

  const handleSubmit = async () => {
    if (!currentPurpose) return
    clearErrors()

    if (requiresOtp && !otp.every((digit) => digit !== '')) {
      setOtpError('Enter the 6-digit OTP sent to your email.')
      return
    }

    try {
      setErrorMessage('')
      const submittedPurpose = currentPurpose

      if (submittedPurpose === 'set-password') {
        if (!STRONG_PASSWORD_REGEX.test(password)) {
          setPasswordError(
            'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.'
          )
          return
        }
        if (password !== confirmPassword) {
          setConfirmPasswordError('Passwords do not match.')
          return
        }

        await setPasswordMutation.mutateAsync({
          otp: requiresOtp ? otp.join('') : undefined,
          password,
        })
        setPassword('')
        setConfirmPassword('')
      } else {
        if (pin.length !== 4) {
          setPinError('PIN must be exactly 4 digits.')
          return
        }
        if (!confirmPin) {
          setConfirmPinError('Confirm your PIN.')
          return
        }
        if (confirmPin.length < pin.length) {
          return
        }
        if (pin !== confirmPin) {
          setConfirmPinError('PINs do not match.')
          return
        }

        await setPinMutation.mutateAsync({
          otp: requiresOtp ? otp.join('') : undefined,
          pin,
        })
        setPin('')
        setConfirmPin('')
      }

      const nextSuccessStage = submittedPurpose === 'set-password' ? 'password' : 'pin'
      setIsCompletingSetup(true)
      setSuccessStage(nextSuccessStage)
      resetOtpState()
      setOtpRequestedFor(null)
      await refreshUser()
      setIsCompletingSetup(false)
    } catch (error: unknown) {
      setIsCompletingSetup(false)
      setErrorMessage(
        toApiError(error).message ||
          'Unable to complete setup right now. Please try again.'
      )
    }
  }

  const isLoading =
    isCompletingSetup ||
    profileQuery.isLoading ||
    requestOtpMutation.isPending ||
    setPasswordMutation.isPending ||
    setPinMutation.isPending

  const otpButtonLabel =
    otpCountdown > 0
      ? `Request OTP again in ${otpCountdown}s`
      : hasRequestedOtp
      ? 'Request OTP Again'
      : 'Request OTP'

  const handleCloseSuccess = () => {
    if (successStage === 'password') {
      setSuccessStage(null)
      setOtpRequestedFor(null)
      resetOtpState()
      return
    }

    setSuccessStage(null)
    router.replace(nextPath)
  }

  const handleCloseSetup = () => {
    if (isSetupRequired) return
    router.replace(nextPath)
  }

  const renderLoadingStep = () => (
    <div className='flex flex-col items-center justify-center gap-4 py-8 text-center'>
      <span className='h-10 w-10 rounded-full border-2 border-primary-500 border-t-transparent animate-spin' />
      <p className='text-sm text-grey-600'>Checking your setup requirements...</p>
    </div>
  )

  const renderRequestOtpStep = () => (
    <div className='space-y-6 py-2'>
      <div className='space-y-2 text-center'>
        <p className='text-sm text-grey-600'>
          Request a one-time code to continue setting up your account.
        </p>
      </div>

      <button
        type='button'
        onClick={handleRequestOtp}
        disabled={requestOtpMutation.isPending || otpCountdown > 0 || !currentPurpose}
        className='w-full rounded-[12px] border border-primary-500 bg-linear-to-r from-primary-400 to-primary-600 px-4 py-3 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60'
      >
        {requestOtpMutation.isPending ? (
          <span className='inline-flex items-center justify-center gap-2'>
            <span className='h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin' />
            <span>Sending OTP...</span>
          </span>
        ) : (
          'Request OTP'
        )}
      </button>

      {otpCountdown > 0 ? (
        <p className='text-center text-sm text-grey-600'>
          {`Request OTP again in ${otpCountdown}s`}
        </p>
      ) : null}

      {errorMessage ? <p className='text-sm text-error-500'>{errorMessage}</p> : null}
    </div>
  )

  const renderCompleteStep = () => (
    <div className='space-y-5'>
      {requiresOtp ? (
        <div className='flex flex-col gap-2'>
          <span className='text-sm font-medium text-grey-900'>OTP</span>
          <OtpInputs
            otp={otp}
            inputRefs={otpInputRefs}
            onChange={handleOtpChange}
            onKeyDown={handleOtpKeyDown}
            onPaste={handleOtpPaste}
          />
          {otpError ? <p className='text-sm text-error-500'>{otpError}</p> : null}
        </div>
      ) : null}

      {isPasswordStep ? (
        <>
          <label className='flex flex-col gap-2'>
            <span className='text-sm font-medium text-grey-900'>Password</span>
            <input
              type='password'
              autoComplete='new-password'
              value={password}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setPassword(event.target.value)
                if (passwordError) setPasswordError('')
                if (errorMessage) setErrorMessage('')
              }}
              placeholder='Create a password'
              className='w-full rounded-[12px] border border-grey-100 px-4 py-3 text-blackish outline-none transition focus:border-primary-400 focus:ring-1 focus:ring-primary-400'
            />
            {passwordError ? (
              <p className='text-sm text-error-500'>{passwordError}</p>
            ) : null}
          </label>
          <label className='flex flex-col gap-2'>
            <span className='text-sm font-medium text-grey-900'>Confirm Password</span>
            <input
              type='password'
              autoComplete='new-password'
              value={confirmPassword}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setConfirmPassword(event.target.value)
                if (confirmPasswordError) setConfirmPasswordError('')
                if (errorMessage) setErrorMessage('')
              }}
              placeholder='Confirm your password'
              className='w-full rounded-[12px] border border-grey-100 px-4 py-3 text-blackish outline-none transition focus:border-primary-400 focus:ring-1 focus:ring-primary-400'
            />
            {confirmPasswordError ? (
              <p className='text-sm text-error-500'>{confirmPasswordError}</p>
            ) : null}
          </label>
        </>
      ) : (
        <>
          <label className='flex flex-col gap-2'>
            <span className='text-sm font-medium text-grey-900'>New PIN</span>
            <input
              type='password'
              inputMode='numeric'
              autoComplete='off'
              value={pin}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setPin(sanitizePin(event.target.value))
                if (pinError) setPinError('')
                if (errorMessage) setErrorMessage('')
              }}
              placeholder='Create 4-digit PIN'
              className='w-full rounded-[12px] border border-grey-100 px-4 py-3 text-blackish outline-none transition focus:border-primary-400 focus:ring-1 focus:ring-primary-400'
            />
            {pinError ? <p className='text-sm text-error-500'>{pinError}</p> : null}
          </label>
          <label className='flex flex-col gap-2'>
            <span className='text-sm font-medium text-grey-900'>Confirm PIN</span>
            <input
              type='password'
              inputMode='numeric'
              autoComplete='off'
              value={confirmPin}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setConfirmPin(sanitizePin(event.target.value))
                if (confirmPinError) setConfirmPinError('')
                if (errorMessage) setErrorMessage('')
              }}
              placeholder='Confirm 4-digit PIN'
              className='w-full rounded-[12px] border border-grey-100 px-4 py-3 text-blackish outline-none transition focus:border-primary-400 focus:ring-1 focus:ring-primary-400'
            />
            {confirmPinError ? (
              <p className='text-sm text-error-500'>{confirmPinError}</p>
            ) : null}
          </label>
        </>
      )}

      {errorMessage ? <p className='text-sm text-error-500'>{errorMessage}</p> : null}
    </div>
  )

  const modalTitle =
    isResolvingSetup
      ? 'Preparing your setup'
      : currentStep === 'request-otp'
      ? 'Verify it’s you'
      : isPasswordStep
      ? 'Create your password'
      : 'Create your transaction PIN'

  const modalFooter =
    isResolvingSetup || currentStep === 'request-otp' ? null : (
      <div className='space-y-3'>
        <button
          type='button'
          onClick={handleSubmit}
          disabled={isLoading || !currentPurpose}
          className='w-full rounded-[12px] border border-primary-500 bg-linear-to-r from-primary-400 to-primary-600 px-4 py-3 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60'
        >
          {isLoading ? (
            <span className='inline-flex items-center justify-center gap-2'>
              <span className='h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin' />
              <span>Please wait...</span>
            </span>
          ) : isPasswordStep ? (
            'Create Password'
          ) : (
            'Create PIN'
          )}
        </button>

        {requiresOtp ? (
          <button
            type='button'
            onClick={handleRequestOtp}
            disabled={requestOtpMutation.isPending || otpCountdown > 0}
            className='w-full text-sm font-medium text-primary-500 underline underline-offset-2 disabled:opacity-50'
          >
            {requestOtpMutation.isPending ? (
              <span className='inline-flex items-center gap-2'>
                <span className='h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin' />
                <span>Sending OTP...</span>
              </span>
            ) : (
              otpButtonLabel
            )}
          </button>
        ) : null}
      </div>
    )

  return (
    <>
      <ResponsiveModal
        isOpen={true}
        onClose={handleCloseSetup}
        desktopMaxWidthClass='max-w-[560px]'
        mobileTopOffsetClass='top-[88px]'
        header={
          <div className='space-y-3 text-center'>
            <p className='text-sm font-medium uppercase tracking-[0.18em] text-primary-500'>
              Account Setup
            </p>
            <h1 className='text-3xl font-semibold leading-tight text-blackish sm:text-4xl'>
              {modalTitle}
            </h1>
          </div>
        }
        body={
          isResolvingSetup
            ? renderLoadingStep()
            : currentStep === 'request-otp'
            ? renderRequestOtpStep()
            : renderCompleteStep()
        }
        footer={modalFooter}
        desktopPanelClassName='max-h-[88vh]'
        mobilePanelClassName='rounded-t-[24px]'
      />
      <SuccessModal
        isOpen={successStage !== null}
        onClose={handleCloseSuccess}
        title={successStage === 'password' ? 'Password Created' : 'PIN Created'}
        message={
          successStage === 'password'
            ? needsPinAfterPassword
              ? 'Your password has been set successfully. Continue to create your transaction PIN.'
              : 'Your password has been set successfully.'
            : 'Your transaction PIN has been set successfully.'
        }
      />
    </>
  )
}

export default AccountSetupPage
