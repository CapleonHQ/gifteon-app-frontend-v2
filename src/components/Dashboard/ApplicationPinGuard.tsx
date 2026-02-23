'use client'

import { useEffect, useState } from 'react'
import { useSuccessModal } from '@/context/SuccessModalContext'
import { useProfile, useSetPin } from '@/hooks/tanstack/account'
import SetPinRequiredModal from './SetPinRequiredModal'

const ApplicationPinGuard = () => {
  const { openSuccess } = useSuccessModal()
  const profileQuery = useProfile()
  const setPinMutation = useSetPin()
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [pinError, setPinError] = useState('')
  const [isGuardDismissed, setIsGuardDismissed] = useState(false)
  const mustSetPinFromProfile = profileQuery.data?.data?.pinActivated === true
  const mustSetPin = mustSetPinFromProfile && !isGuardDismissed

  useEffect(() => {
    const handleOpenPinModal = () => {
      setIsGuardDismissed(false)
    }
    window.addEventListener('open-transaction-pin-modal', handleOpenPinModal)
    return () => {
      window.removeEventListener(
        'open-transaction-pin-modal',
        handleOpenPinModal
      )
    }
  }, [])

  const handleSetPin = async () => {
    if (pin.length !== 4 || confirmPin.length !== 4) {
      setPinError('Transaction PIN must be exactly 4 digits.')
      return
    }
    if (pin !== confirmPin) {
      setPinError('Transaction PINs do not match.')
      return
    }

    try {
      await setPinMutation.mutateAsync({ pin })
      setIsGuardDismissed(true)
      setPin('')
      setConfirmPin('')
      setPinError('')
      window.setTimeout(() => {
        openSuccess({ message: 'Your account PIN has been set successfully.' })
      }, 0)
    } catch (error: any) {
      console.log(error.message)

      const apiMessage =
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as { response?: unknown }).response === 'object' &&
        (error as { response?: unknown }).response !== null &&
        'data' in
          ((error as { response?: { data?: unknown } }).response ?? {}) &&
        typeof (error as { response?: { data?: { message?: unknown } } })
          .response?.data?.message === 'string'
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : undefined

      setPinError(apiMessage?.trim() || 'Unable to set PIN. Please try again.')
    }
  }

  return (
    <SetPinRequiredModal
      isOpen={mustSetPin}
      pin={pin}
      confirmPin={confirmPin}
      onPinChange={(value) => {
        setPin(value)
        setPinError('')
      }}
      onConfirmPinChange={(value) => {
        setConfirmPin(value)
        setPinError('')
      }}
      onSubmit={handleSetPin}
      isSubmitting={setPinMutation.isPending}
      errorMessage={pinError}
    />
  )
}

export default ApplicationPinGuard
