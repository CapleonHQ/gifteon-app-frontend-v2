import type { WalletTransactionMetadata } from '@/types/Wallet'

export type WalletMetadataDetail = {
  label: string
  value: string
}

export const getBillMetadataDetails = (
  metadata: WalletTransactionMetadata | null
): WalletMetadataDetail[] => {
  if (!metadata) return []

  if (metadata.type === 'airtime') {
    return [
      { label: 'Bill Type', value: 'Airtime' },
      { label: 'Network', value: metadata.network },
      { label: 'Phone Number', value: metadata.phoneNumber },
      { label: 'Bill Transaction ID', value: metadata.billTransactionId },
    ]
  }

  if (metadata.type === 'data') {
    return [
      { label: 'Bill Type', value: 'Data' },
      { label: 'Network', value: metadata.network },
      { label: 'Phone Number', value: metadata.phoneNumber },
      { label: 'Plan Code', value: metadata.planCode },
      { label: 'Bill Transaction ID', value: metadata.billTransactionId },
    ]
  }

  if (metadata.type === 'electricity') {
    return [
      { label: 'Bill Type', value: 'Electricity' },
      { label: 'Provider', value: metadata.provider },
      { label: 'Meter Number', value: metadata.meterNumber },
      { label: 'Meter Type', value: metadata.meterType },
      { label: 'Units', value: metadata.units },
      { label: 'Bill Transaction ID', value: metadata.billTransactionId },
    ]
  }

  return [
    { label: 'Bill Type', value: 'Cable TV' },
    { label: 'Provider', value: metadata.provider },
    { label: 'IUC Number', value: metadata.iucNumber },
    { label: 'Package Code', value: metadata.packageCode },
    { label: 'Bill Transaction ID', value: metadata.billTransactionId },
  ]
}

