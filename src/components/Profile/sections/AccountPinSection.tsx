import SectionCard from '@/components/Profile/components/SectionCard'
import InputField from '@/components/Profile/components/InputField'
import { useState } from 'react'
import { useChangePin } from '@/hooks/tanstack/account'
import { useSuccessModal } from '@/context/SuccessModalContext'
import { toApiError } from '@/api/errorHelpers'

type AccountPinSectionProps = {
  pinActivated: boolean
  onRequestSetPin?: () => void
}

const AccountPinSection = ({
  pinActivated,
  onRequestSetPin,
}: AccountPinSectionProps) => {
  const { openSuccess } = useSuccessModal()
  const changePinMutation = useChangePin()
  const [isEditingPin, setIsEditingPin] = useState(false)
  const [pinForm, setPinForm] = useState({
    currentPin: '',
    newPin: '',
    confirmPin: '',
  })
  const [pinErrors, setPinErrors] = useState<{
    currentPin?: string
    newPin?: string
    confirmPin?: string
    form?: string
  }>({})

  const sanitizePinInput = (value: string) => value.replace(/\D/g, '').slice(0, 4)

  const handleCancel = () => {
    setIsEditingPin(false)
    setPinForm({
      currentPin: '',
      newPin: '',
      confirmPin: '',
    })
    setPinErrors({})
  }

  const handleSave = async () => {
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
      handleCancel()
      openSuccess({ message: 'Your PIN has been successfully updated.' })
    } catch (error: unknown) {
      const apiError = toApiError(error)
      setPinErrors({
        form: apiError.message?.trim() || 'Unable to update PIN. Please try again.',
      })
    }
  }

  return (
    <SectionCard
      title='Account PIN'
      description='This is the PIN you will use for all your withdrawals'
      action={
        !pinActivated ? (
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
              onClick={handleCancel}
              className='rounded-[8px] border border-grey-200 bg-white text-grey-700 px-3 py-1.5 text-sm leading-[18px] hover:bg-grey-50 transition-colors min-w-[84px]'
            >
              Cancel
            </button>
            <button
              type='button'
              onClick={handleSave}
              disabled={changePinMutation.isPending}
              className='rounded-[8px] bg-primary-50 text-primary-500 px-3 py-1.5 text-sm leading-[18px] hover:bg-primary-100 transition-colors min-w-[106px] disabled:opacity-60'
            >
              {changePinMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        ) : (
          <button
            type='button'
            onClick={() => {
              setIsEditingPin(true)
              setPinErrors({})
            }}
            className='rounded-[8px] bg-primary-50 text-primary-500 px-3 py-1.5 text-sm leading-[18px] hover:bg-primary-100 transition-colors min-w-[106px]'
          >
            Change PIN
          </button>
        )
      }
    >
      <div className='border-t border-grey-50 px-3 lg:px-6 pb-3 lg:pb-6 pt-3 space-y-6 max-w-[476px]'>
        {!pinActivated ? (
          <p className='text-sm text-warning-700 bg-warning-50 border border-warning-100 rounded-[10px] px-3 py-2'>
            Set your transaction PIN first to enable PIN updates.
          </p>
        ) : null}
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
          <p className='text-xs text-error-500 -mt-4'>{pinErrors.currentPin}</p>
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
          <p className='text-xs text-error-500 -mt-4'>{pinErrors.confirmPin}</p>
        ) : null}
        {pinErrors?.form ? (
          <p className='text-xs text-error-500 -mt-2'>{pinErrors.form}</p>
        ) : null}
        {pinActivated && isEditingPin ? (
          <div className='lg:hidden flex items-center gap-3 pt-2'>
            <button
              type='button'
              onClick={handleCancel}
              className='flex-1 py-3 rounded-[10px] border border-grey-200 text-grey-700 font-medium bg-grey-50/70'
            >
              Cancel
            </button>
            <button
              type='button'
              onClick={handleSave}
              disabled={changePinMutation.isPending}
              className='flex-1 py-3 rounded-[10px] bg-linear-to-b from-primary-400 from-[17.5%] to-primary-600 border border-primary-500 text-white font-medium disabled:opacity-60 disabled:cursor-not-allowed'
            >
              {changePinMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        ) : null}
      </div>
    </SectionCard>
  )
}

export default AccountPinSection
