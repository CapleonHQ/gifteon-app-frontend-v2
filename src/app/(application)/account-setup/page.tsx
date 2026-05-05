'use client'

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
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
import { getAuthTokenIssuedAt } from '@/api/token'
import {
  INITIAL_SETUP_WINDOW_MS,
  sanitizeOtp,
  sanitizePin,
  STRONG_PASSWORD_REGEX,
} from '@/lib/utils/security'

const AccountSetupPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { status, refreshUser } = useAuth()
  const profileQuery = useProfile()
  const requestOtpMutation = useRequestAccountOtp()
  const setPasswordMutation = useSetPassword()
  const setPinMutation = useSetPin()
  const requestedPurposeRef = useRef<'change-password' | 'change-pin' | null>(null)
  const [otp, setOtp] = useState('')
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
  const [otpRequestedFor, setOtpRequestedFor] = useState<
    'change-password' | 'change-pin' | null
  >(null)
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

  const currentPurpose =
    !profile || profileQuery.isLoading
      ? null
      : !profile.pinActivated
      ? 'change-pin'
      : !profile.passwordActivated
      ? 'change-password'
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

  const handleResendOtp = async () => {
    if (!currentPurpose || !requiresOtp) return
    try {
      setErrorMessage('')
      setOtpError('')
      setPasswordError('')
      setConfirmPasswordError('')
      setPinError('')
      setConfirmPinError('')
      requestedPurposeRef.current = currentPurpose
      await requestOtpMutation.mutateAsync({ purpose: currentPurpose })
      setOtp('')
      setOtpRequestedFor(currentPurpose)
    } catch (error: unknown) {
      requestedPurposeRef.current = null
      setErrorMessage(
        toApiError(error).message || 'Unable to resend OTP right now.'
      )
    }
  }

  const handleSubmit = async () => {
    if (!currentPurpose) return
    setOtpError('')
    setPasswordError('')
    setConfirmPasswordError('')
    setPinError('')
    setConfirmPinError('')

    if (requiresOtp && !hasRequestedOtp) {
      setErrorMessage('Request an OTP to continue with setup.')
      return
    }
    if (requiresOtp && otp.length !== 6) {
      setOtpError('Enter the 6-digit OTP sent to your email.')
      return
    }

    try {
      setErrorMessage('')
      setOtpError('')
      const submittedPurpose = currentPurpose

      if (submittedPurpose === 'change-password') {
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
          otp: requiresOtp ? otp : undefined,
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
          otp: requiresOtp ? otp : undefined,
          pin,
        })
        setPin('')
        setConfirmPin('')
      }

      setIsCompletingSetup(true)
      setOtp('')
      requestedPurposeRef.current = null
      await refreshUser()
      setIsCompletingSetup(false)
      setSuccessStage(submittedPurpose === 'change-password' ? 'password' : 'pin')
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

  const isPasswordStep = currentPurpose === 'change-password'
  const isPinRequired = profile?.pinActivated === false
  const handleCloseSuccess = () => {
    if (successStage === 'password') {
      setSuccessStage(null)
      requestedPurposeRef.current = null
      setOtpRequestedFor(null)
      return
    }

    setSuccessStage(null)
    router.replace(nextPath)
  }
  const handleCloseSetup = () => {
    if (isPinRequired) return
    router.replace(nextPath)
  }
  const modalBody = (
    <div className='space-y-5'>
      {requiresOtp ? (
        <label className='flex flex-col gap-2'>
          <span className='text-sm font-medium text-grey-900'>OTP</span>
          <input
            type='text'
            inputMode='numeric'
            autoComplete='one-time-code'
            value={otp}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setOtp(sanitizeOtp(event.target.value))
              if (otpError) setOtpError('')
              if (errorMessage) setErrorMessage('')
            }}
            placeholder='Enter 6-digit OTP'
            className='w-full rounded-[12px] border border-grey-100 px-4 py-3 text-blackish outline-none transition focus:border-primary-400 focus:ring-1 focus:ring-primary-400'
          />
          {otpError ? <p className='text-sm text-error-500'>{otpError}</p> : null}
        </label>
      ) : (
        <p className='text-sm text-grey-600'>
          You are still within the secure setup window. You can complete this step
          without requesting an OTP.
        </p>
      )}

      {isPasswordStep ? (
        <>
          <label className='flex flex-col gap-2'>
            <span className='text-sm font-medium text-grey-900'>Password</span>
            <input
              type='password'
              autoComplete='new-password'
              value={password}
              onChange={(event) => {
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
              onChange={(event) => {
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
              onChange={(event) => {
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
              onChange={(event) => {
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

  const modalFooter = (
    <div className='space-y-3'>
      <button
        type='button'
        onClick={handleSubmit}
        disabled={isLoading || !currentPurpose}
        className='w-full rounded-[12px] border border-primary-500 bg-linear-to-r from-primary-400 to-primary-600 px-4 py-3 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60'
      >
        {isLoading
          ? 'Please wait...'
          : isPasswordStep
          ? 'Create Password'
          : 'Create PIN'}
      </button>

      <button
        type='button'
        onClick={handleResendOtp}
        disabled={requestOtpMutation.isPending || !currentPurpose || !requiresOtp}
        className='w-full text-sm font-medium text-primary-500 underline underline-offset-2 disabled:opacity-50'
      >
        {hasRequestedOtp ? 'Resend OTP' : 'Request OTP'}
      </button>
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
              {isPasswordStep
                ? 'Create your password'
                : 'Create your transaction PIN'}
            </h1>
            <p className='text-sm leading-6 text-grey-600 sm:text-base'>
              {isPasswordStep
                ? 'We sent a one-time code to your registered email. Enter it below and create your password to continue.'
                : 'We sent a one-time code to your registered email. Enter it below and create your 4-digit PIN to continue.'}
            </p>
          </div>
        }
        body={modalBody}
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
            ? 'Your password has been set successfully. Continue to create your transaction PIN.'
            : 'Your transaction PIN has been set successfully.'
        }
      />
    </>
  )
}

export default AccountSetupPage
