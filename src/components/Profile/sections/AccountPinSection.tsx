import SectionCard from '@/components/Profile/components/SectionCard'
import InputField from '@/components/Profile/components/InputField'
import { useState } from 'react'
import { useChangePassword, useChangePin } from '@/hooks/tanstack/account'
import { useSuccessModal } from '@/context/SuccessModalContext'
import { toApiError } from '@/api/errorHelpers'
import { STRONG_PASSWORD_REGEX } from '@/lib/utils/security'
import ShakeOnError from '@/components/common/ShakeOnError'

type AccountPinSectionProps = {
  passwordActivated: boolean
  pinActivated: boolean
  onRequestSetPin?: () => void
  onRequestSetPassword?: () => void
}

const AccountPinSection = ({
  passwordActivated,
  pinActivated,
  onRequestSetPin,
  onRequestSetPassword,
}: AccountPinSectionProps) => {
  const { openSuccess } = useSuccessModal()
  const changePasswordMutation = useChangePassword()
  const changePinMutation = useChangePin()
  const [isEditingPassword, setIsEditingPassword] = useState(false)
  const [isEditingPin, setIsEditingPin] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [pinForm, setPinForm] = useState({
    currentPin: '',
    newPin: '',
    confirmPin: '',
  })
  const [passwordErrors, setPasswordErrors] = useState<{
    currentPassword?: string
    newPassword?: string
    confirmPassword?: string
    form?: string
  }>({})
  const [pinErrors, setPinErrors] = useState<{
    currentPin?: string
    newPin?: string
    confirmPin?: string
    form?: string
  }>({})

  const sanitizePinInput = (value: string) =>
    value.replace(/\D/g, '').slice(0, 4)
  const strongPasswordMessage =
    'New password must be at least 8 characters and include uppercase, lowercase, number, and special character.'
  const formatApiErrorMessage = (message: string) => {
    const cleaned = message.replace(/"([^"]+)"/g, '$1').trim()
    if (!cleaned) return message
    return `${cleaned.charAt(0).toUpperCase()}${cleaned.slice(1)}`
  }

  const handleCancelPassword = () => {
    setIsEditingPassword(false)
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
    setPasswordErrors({})
  }

  const handleCancelPin = () => {
    setIsEditingPin(false)
    setPinForm({
      currentPin: '',
      newPin: '',
      confirmPin: '',
    })
    setPinErrors({})
  }

  const handleStartPasswordEdit = () => {
    handleCancelPin()
    setIsEditingPassword(true)
    setPasswordErrors({})
  }

  const handleStartPinEdit = () => {
    handleCancelPassword()
    setIsEditingPin(true)
    setPinErrors({})
  }

  const handleSavePassword = async () => {
    const nextErrors: {
      currentPassword?: string
      newPassword?: string
      confirmPassword?: string
      form?: string
    } = {}

    if (!passwordForm.currentPassword) {
      nextErrors.currentPassword = 'Current password is required.'
    }
    if (!STRONG_PASSWORD_REGEX.test(passwordForm.newPassword)) {
      nextErrors.newPassword = strongPasswordMessage
    }
    if (!passwordForm.confirmPassword) {
      nextErrors.confirmPassword = 'Confirm your new password.'
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      nextErrors.confirmPassword =
        'New password and confirm password do not match.'
    }
    if (
      passwordForm.currentPassword &&
      passwordForm.newPassword &&
      passwordForm.currentPassword === passwordForm.newPassword
    ) {
      nextErrors.newPassword =
        'New password must be different from current password.'
    }

    if (Object.keys(nextErrors).length > 0) {
      setPasswordErrors(nextErrors)
      return
    }

    try {
      await changePasswordMutation.mutateAsync({
        oldPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })
      handleCancelPassword()
      openSuccess({ message: 'Your password has been successfully updated.' })
    } catch (error: unknown) {
      const apiError = toApiError(error)
      setPasswordErrors({
        form:
          formatApiErrorMessage(apiError.message?.trim()) ||
          'Unable to update password. Please try again.',
      })
    }
  }

  const handleSavePin = async () => {
    const nextErrors: {
      currentPin?: string
      newPin?: string
      confirmPin?: string
      form?: string
    } = {}

    if (pinForm.currentPin.length !== 4) {
      nextErrors.currentPin = 'Current PIN must be exactly 4 digits.'
    }
    if (pinForm.newPin.length !== 4) {
      nextErrors.newPin = 'New PIN must be exactly 4 digits.'
    }
    if (pinForm.confirmPin.length !== 4) {
      nextErrors.confirmPin = 'Confirm PIN must be exactly 4 digits.'
    }
    if (
      pinForm.newPin.length === 4 &&
      pinForm.confirmPin.length === 4 &&
      pinForm.newPin !== pinForm.confirmPin
    ) {
      nextErrors.confirmPin = 'New PIN and confirm PIN do not match.'
    }
    if (
      pinForm.currentPin.length === 4 &&
      pinForm.newPin.length === 4 &&
      pinForm.currentPin === pinForm.newPin
    ) {
      nextErrors.newPin = 'New PIN must be different from current PIN.'
    }

    if (Object.keys(nextErrors).length > 0) {
      setPinErrors(nextErrors)
      return
    }

    try {
      await changePinMutation.mutateAsync({
        oldPin: pinForm.currentPin,
        newPin: pinForm.newPin,
      })
      handleCancelPin()
      openSuccess({ message: 'Your PIN has been successfully updated.' })
    } catch (error: unknown) {
      const apiError = toApiError(error)
      setPinErrors({
        form:
          formatApiErrorMessage(apiError.message?.trim()) ||
          'Unable to update PIN. Please try again.',
      })
    }
  }

  return (
    <SectionCard
      title='Security'
      description='Manage your account password and transaction PIN.'
    >
      <div className='border-t border-grey-50 px-3 lg:px-6 pb-3 lg:pb-6 pt-3 space-y-8'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between gap-3'>
            <div>
              <h3 className='text-base font-medium text-blackish'>Password</h3>
              <p className='text-sm text-grey-600'>
                Use your password to sign in securely.
              </p>
            </div>
            {!passwordActivated ? (
              <button
                type='button'
                onClick={onRequestSetPassword}
                className='rounded-[8px] bg-primary-50 text-primary-500 px-3 py-1.5 text-sm leading-[18px] hover:bg-primary-100 transition-colors min-w-[126px]'
              >
                Set Password
              </button>
            ) : isEditingPassword ? (
              <div className='hidden lg:inline-flex items-center gap-2'>
                <button
                  type='button'
                  onClick={handleCancelPassword}
                  className='rounded-[8px] border border-grey-200 bg-white text-grey-700 px-3 py-1.5 text-sm leading-[18px] hover:bg-grey-50 transition-colors min-w-[84px]'
                >
                  Cancel
                </button>
                <button
                  type='button'
                  onClick={handleSavePassword}
                  disabled={changePasswordMutation.isPending}
                  className='rounded-[8px] bg-primary-50 text-primary-500 px-3 py-1.5 text-sm leading-[18px] hover:bg-primary-100 transition-colors min-w-[126px] disabled:opacity-60'
                >
                  {changePasswordMutation.isPending ? (
                    <span className='inline-flex items-center gap-2'>
                      <span className='h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin' />
                      <span>Saving...</span>
                    </span>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            ) : (
              <button
                type='button'
                onClick={handleStartPasswordEdit}
                className='rounded-[8px] bg-primary-50 text-primary-500 px-3 py-1.5 text-sm leading-[18px] hover:bg-primary-100 transition-colors min-w-[126px]'
              >
                <span className='hidden md:block'>Change Password</span>
                <span className='md:hidden'>Change</span>
              </button>
            )}
          </div>

          {!passwordActivated ? (
            <p className='text-sm text-warning-700 bg-warning-50 border border-warning-100 rounded-[10px] px-3 py-2'>
              Set your password first to enable password updates.
            </p>
          ) : null}
          <ShakeOnError active={Boolean(passwordErrors.form)}>
            {passwordErrors.form ? (
              <p className='text-sm text-error-500'>{passwordErrors.form}</p>
            ) : null}
          </ShakeOnError>
          <div className='w-full max-w-[476px] space-y-4'>
            <InputField
              label='Current Password'
              placeholder='Enter your current password'
              value={passwordForm.currentPassword}
              onChange={(value) => {
                setPasswordForm((prev) => ({
                  ...prev,
                  currentPassword: value,
                }))
                setPasswordErrors((prev) => ({
                  ...prev,
                  currentPassword: undefined,
                  form: undefined,
                }))
              }}
              disabled={!isEditingPassword || !passwordActivated}
              type='password'
            />
            {passwordErrors.currentPassword ? (
              <p className='text-xs text-error-500 -mt-4'>
                {passwordErrors.currentPassword}
              </p>
            ) : null}
            <InputField
              label='New Password'
              placeholder='Enter your new password'
              value={passwordForm.newPassword}
              onChange={(value) => {
                setPasswordForm((prev) => ({
                  ...prev,
                  newPassword: value,
                }))
                setPasswordErrors((prev) => ({
                  ...prev,
                  newPassword:
                    value && !STRONG_PASSWORD_REGEX.test(value)
                      ? strongPasswordMessage
                      : undefined,
                  confirmPassword:
                    passwordForm.confirmPassword &&
                    passwordForm.confirmPassword.length >= value.length &&
                    value !== passwordForm.confirmPassword
                      ? 'New password and confirm password do not match.'
                      : undefined,
                  form: undefined,
                }))
              }}
              disabled={!isEditingPassword || !passwordActivated}
              type='password'
            />
            {passwordErrors.newPassword ? (
              <p className='text-xs text-error-500 -mt-4'>
                {passwordErrors.newPassword}
              </p>
            ) : null}
            <InputField
              label='Confirm Password'
              placeholder='Confirm your new password'
              value={passwordForm.confirmPassword}
              onChange={(value) => {
                setPasswordForm((prev) => ({
                  ...prev,
                  confirmPassword: value,
                }))
                setPasswordErrors((prev) => ({
                  ...prev,
                  confirmPassword: !value
                    ? undefined
                    : value.length < passwordForm.newPassword.length
                    ? undefined
                    : value !== passwordForm.newPassword
                    ? 'New password and confirm password do not match.'
                    : undefined,
                  form: undefined,
                }))
              }}
              disabled={!isEditingPassword || !passwordActivated}
              type='password'
            />
            {passwordErrors.confirmPassword ? (
              <p className='text-xs text-error-500 -mt-4'>
                {passwordErrors.confirmPassword}
              </p>
            ) : null}
          </div>
          {passwordActivated && isEditingPassword ? (
            <div className='lg:hidden flex items-center gap-3 pt-2'>
              <button
                type='button'
                onClick={handleCancelPassword}
                className='flex-1 py-3 rounded-[10px] border border-grey-200 text-grey-700 font-medium bg-grey-50/70'
              >
                Cancel
              </button>
              <button
                type='button'
                onClick={handleSavePassword}
                disabled={changePasswordMutation.isPending}
                className='flex-1 py-3 rounded-[10px] bg-linear-to-b from-primary-400 from-[17.5%] to-primary-600 border border-primary-500 text-white font-medium disabled:opacity-60 disabled:cursor-not-allowed'
              >
                {changePasswordMutation.isPending ? (
                  <span className='inline-flex items-center justify-center gap-2'>
                    <span className='h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin' />
                    <span>Saving...</span>
                  </span>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          ) : null}
        </div>

        <div className='border-t border-grey-50 pt-8 space-y-4'>
          <div className='flex items-center justify-between gap-3'>
            <div>
              <h3 className='text-base font-medium text-blackish'>
                Transaction PIN
              </h3>
              <p className='text-sm text-grey-600'>
                Use your PIN to authorize withdrawals and sensitive actions.
              </p>
            </div>
            {!pinActivated ? (
              <button
                type='button'
                onClick={onRequestSetPin}
                className='rounded-[8px] bg-primary-50 text-primary-500 px-3 py-1.5 text-sm leading-[18px] hover:bg-primary-100 transition-colors min-w-[106px]'
              >
                Set PIN
              </button>
            ) : isEditingPin ? (
              <div className='hidden lg:inline-flex items-center gap-2'>
                <button
                  type='button'
                  onClick={handleCancelPin}
                  className='rounded-[8px] border border-grey-200 bg-white text-grey-700 px-3 py-1.5 text-sm leading-[18px] hover:bg-grey-50 transition-colors min-w-[84px]'
                >
                  Cancel
                </button>
                <button
                  type='button'
                  onClick={handleSavePin}
                  disabled={changePinMutation.isPending}
                  className='rounded-[8px] bg-primary-50 text-primary-500 px-3 py-1.5 text-sm leading-[18px] hover:bg-primary-100 transition-colors min-w-[106px] disabled:opacity-60'
                >
                  {changePinMutation.isPending ? (
                    <span className='inline-flex items-center gap-2'>
                      <span className='h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin' />
                      <span>Saving...</span>
                    </span>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            ) : (
              <button
                type='button'
                onClick={handleStartPinEdit}
                className='rounded-[8px] bg-primary-50 text-primary-500 px-3 py-1.5 text-sm leading-[18px] hover:bg-primary-100 transition-colors min-w-[106px]'
              >
                Change PIN
              </button>
            )}
          </div>

          {!pinActivated ? (
            <p className='text-sm text-warning-700 bg-warning-50 border border-warning-100 rounded-[10px] px-3 py-2'>
              Set your transaction PIN first to enable PIN updates.
            </p>
          ) : null}
          <ShakeOnError active={Boolean(pinErrors.form)}>
            {pinErrors.form ? (
              <p className='text-sm text-error-500'>{pinErrors.form}</p>
            ) : null}
          </ShakeOnError>
          <div className='w-full max-w-[476px] space-y-4'>
            <InputField
              label='Current PIN'
              placeholder='Enter your current PIN'
              value={pinForm.currentPin}
              onChange={(value) => {
                setPinForm((prev) => ({
                  ...prev,
                  currentPin: sanitizePinInput(value),
                }))
                setPinErrors((prev) => ({
                  ...prev,
                  currentPin: undefined,
                  form: undefined,
                }))
              }}
              disabled={!isEditingPin || !pinActivated}
              type='password'
            />
            {pinErrors?.currentPin ? (
              <p className='text-xs text-error-500 -mt-4'>
                {pinErrors.currentPin}
              </p>
            ) : null}
            <InputField
              label='New PIN'
              placeholder='Enter your new PIN'
              value={pinForm.newPin}
              onChange={(value) => {
                setPinForm((prev) => ({
                  ...prev,
                  newPin: sanitizePinInput(value),
                }))
                setPinErrors((prev) => ({
                  ...prev,
                  newPin: undefined,
                  confirmPin: undefined,
                  form: undefined,
                }))
              }}
              disabled={!isEditingPin || !pinActivated}
              type='password'
            />
            {pinErrors?.newPin ? (
              <p className='text-xs text-error-500 -mt-4'>{pinErrors.newPin}</p>
            ) : null}
            <InputField
              label='Confirm PIN'
              placeholder='Confirm your new PIN'
              value={pinForm.confirmPin}
              onChange={(value) => {
                setPinForm((prev) => ({
                  ...prev,
                  confirmPin: sanitizePinInput(value),
                }))
                setPinErrors((prev) => ({
                  ...prev,
                  confirmPin: undefined,
                  form: undefined,
                }))
              }}
              disabled={!isEditingPin || !pinActivated}
              type='password'
            />
            {pinErrors?.confirmPin ? (
              <p className='text-xs text-error-500 -mt-4'>
                {pinErrors.confirmPin}
              </p>
            ) : null}
          </div>
          {pinActivated && isEditingPin ? (
            <div className='lg:hidden flex items-center gap-3 pt-2'>
              <button
                type='button'
                onClick={handleCancelPin}
                className='flex-1 py-3 rounded-[10px] border border-grey-200 text-grey-700 font-medium bg-grey-50/70'
              >
                Cancel
              </button>
              <button
                type='button'
                onClick={handleSavePin}
                disabled={changePinMutation.isPending}
                className='flex-1 py-3 rounded-[10px] bg-linear-to-b from-primary-400 from-[17.5%] to-primary-600 border border-primary-500 text-white font-medium disabled:opacity-60 disabled:cursor-not-allowed'
              >
                {changePinMutation.isPending ? (
                  <span className='inline-flex items-center justify-center gap-2'>
                    <span className='h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin' />
                    <span>Saving...</span>
                  </span>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </SectionCard>
  )
}

export default AccountPinSection
