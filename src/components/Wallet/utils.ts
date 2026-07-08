import type { ConnectedBank } from '@/types/Banks'

export const WALLET_BALANCE_VISIBILITY_KEY = 'wallet-balance-hidden'

export const maskAccountNumber = (value: string): string => {
  if (value.length <= 4) return value

  const suffix = value.slice(-4)
  return `${'*'.repeat(Math.max(0, value.length - 4))}${suffix}`
}

export const mapWalletBankAccounts = (banks: ConnectedBank[]) =>
  banks.map((bank) => ({
    id: bank.id,
    label: `${bank.bankName} - ${maskAccountNumber(bank.accountNumber)}`,
    bankName: bank.bankName,
    accountNumber: bank.accountNumber,
    accountName: bank.accountName,
  }))
