'use client'

import { useMemo, useState } from 'react'
import AddAccountModal from '@/components/Profile/modals/AddAccountModal'
import DeletePaymentModal from '@/components/Profile/modals/DeletePaymentModal'
import PaymentMethodsSection from '@/components/Profile/sections/PaymentMethodsSection'
import { useSuccessModal } from '@/context/SuccessModalContext'
import {
  useConnectedBanks,
  useDisconnectBank,
  useSetDefaultConnectedBank,
} from '@/hooks/tanstack/banks'
import type { PaymentMethod } from '@/types/Profile/payment'

const maskAccountNumber = (value: string): string => {
  if (value.length <= 4) return value
  const suffix = value.slice(-4)
  return `${'*'.repeat(Math.max(0, value.length - 4))}${suffix}`
}

const PaymentMethodsManagerSection = () => {
  const { openSuccess } = useSuccessModal()
  const connectedBanksQuery = useConnectedBanks()
  const disconnectBankMutation = useDisconnectBank()
  const setDefaultBankMutation = useSetDefaultConnectedBank()
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<PaymentMethod | null>(null)

  const paymentMethods = useMemo<PaymentMethod[]>(
    () =>
      (connectedBanksQuery.data?.data?.banks ?? []).map((bank) => ({
        id: bank.id,
        bank: bank.bankName,
        account: maskAccountNumber(bank.accountNumber),
        accountName: bank.accountName,
        accountNumber: bank.accountNumber,
        bankCode: bank.bankCode,
        isDefault: bank.isDefault,
      })),
    [connectedBanksQuery.data?.data?.banks]
  )

  const handleDeletePayment = async () => {
    if (!deleteTarget) return
    try {
      await disconnectBankMutation.mutateAsync(deleteTarget.id)
      setDeleteTarget(null)
      openSuccess({
        message: 'The payment method has been successfully deleted.',
      })
    } catch {
      openSuccess({
        message: 'Unable to delete payment method. Please try again.',
      })
    }
  }

  const handleSetDefaultPayment = async (method: PaymentMethod) => {
    try {
      await setDefaultBankMutation.mutateAsync(method.id)
      openSuccess({
        message: 'Default payment method updated successfully.',
      })
    } catch {
      openSuccess({
        message: 'Unable to update default payment method. Please try again.',
      })
    }
  }

  return (
    <>
      <PaymentMethodsSection
        methods={paymentMethods}
        onAddAccount={() => setIsAddAccountOpen(true)}
        onDelete={(method) => setDeleteTarget(method)}
        onSetDefault={handleSetDefaultPayment}
        isLoading={connectedBanksQuery.isLoading}
        hasError={connectedBanksQuery.isError}
        onRetry={() => connectedBanksQuery.refetch()}
      />

      <AddAccountModal
        isOpen={isAddAccountOpen}
        onClose={() => setIsAddAccountOpen(false)}
      />

      <DeletePaymentModal
        target={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onDelete={handleDeletePayment}
      />
    </>
  )
}

export default PaymentMethodsManagerSection
