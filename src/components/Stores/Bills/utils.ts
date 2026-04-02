import type {
  AirtimeNetworksData,
  CableProviderPackagesData,
  CableProvidersData,
  DataNetworkPlansData,
  DataNetworksData,
  GiftBillBeneficiary,
  ElectricityDiscosData,
} from '@/types/Bills'
import type { ApiResponse } from '@/types/Common'
import type { BillsTabKey } from './constants'

export type SelectOption = {
  value: string
  label: string
}

const dedupeOptions = (options: SelectOption[]) => {
  const deduped = new Map<string, SelectOption>()
  for (const option of options) {
    if (!option.value) continue
    if (!deduped.has(option.value)) {
      deduped.set(option.value, option)
    }
  }
  return Array.from(deduped.values())
}

export const mapAirtimeNetworkOptions = (
  payload?: ApiResponse<AirtimeNetworksData>
): SelectOption[] =>
  dedupeOptions(
    (payload?.data?.networks ?? []).map((network) => ({
      value: network.id,
      label: network.name,
    }))
  )

export const mapDataNetworkOptions = (
  payload?: ApiResponse<DataNetworksData>
): SelectOption[] =>
  dedupeOptions(
    (payload?.data?.networks ?? []).map((network) => ({
      value: network.identifier,
      label: network.name,
    }))
  )

export const mapElectricityDiscoOptions = (
  payload?: ApiResponse<ElectricityDiscosData>
): SelectOption[] =>
  dedupeOptions(
    (payload?.data?.plans ?? []).map((plan) => ({
      value: plan.plan_code,
      label: plan.plan_name,
    }))
  )

export const mapCableProviderOptions = (
  payload?: ApiResponse<CableProvidersData>
): SelectOption[] =>
  dedupeOptions(
    (payload?.data?.providers ?? []).map((provider) => ({
      value: provider.identifier,
      label: provider.name,
    }))
  )

export const mapDataPlanOptions = (
  payload?: ApiResponse<DataNetworkPlansData>
): SelectOption[] =>
  dedupeOptions(
    (payload?.data?.plans ?? []).map((plan) => ({
      value: plan.plan_code,
      label: plan.label || plan.plan_code || 'Unknown',
    }))
  )

export const mapCablePackageOptions = (
  payload?: ApiResponse<CableProviderPackagesData>
): SelectOption[] => {
  const rawPlans = payload?.data?.plans ?? []
  return dedupeOptions(
    rawPlans.map((plan) => ({
      value: plan.plan_code,
      label: plan.description || plan.display || plan.plan_code,
    }))
  )
}

export const extractRecentBeneficiaries = (payload: unknown): string[] => {
  const root =
    payload && typeof payload === 'object'
      ? (payload as Record<string, unknown>)
      : {}
  const data =
    root.data && typeof root.data === 'object'
      ? (root.data as Record<string, unknown>)
      : root
  const rawList = [data.beneficiaries, data.items, data.results, data.data].find(
    (value) => Array.isArray(value)
  ) as unknown[] | undefined
  if (!rawList || rawList.length === 0) return []

  const names = rawList
    .map((item) => {
      if (!item || typeof item !== 'object') return ''
      const record = item as Record<string, unknown>
      return String(
        record.nickname ||
          record.name ||
          record.recipientName ||
          record.recipient ||
          ''
      ).trim()
    })
    .filter(Boolean)

  return Array.from(new Set(names))
}

export type BeneficiaryRecipientMapping = {
  matchedBy: 'tag' | 'phone' | 'none'
  identifierValue?: string
}

export const getBeneficiaryIdentifiersForContext = (
  activeTab: BillsTabKey,
  sendAsGift: boolean,
  beneficiary: GiftBillBeneficiary
): string[] => {
  const identifiers: string[] = []
  const tag = (beneficiary.recipientTag || '').replace(/^@+/, '').trim()
  const phone = (beneficiary.recipientPhone || '').trim()
  const direct = (beneficiary.recipient || '').trim()
  const isBillTypeMatch = !beneficiary.billType || beneficiary.billType === activeTab

  if (activeTab === 'airtime' || activeTab === 'data') {
    if (phone) identifiers.push(phone)
    if (sendAsGift && tag) identifiers.push(`@${tag}`)
    return identifiers
  }

  if (activeTab === 'electricity' || activeTab === 'cable_tv') {
    if (isBillTypeMatch && direct) identifiers.push(direct)
    if (sendAsGift && tag) identifiers.push(`@${tag}`)
  }

  return identifiers
}

export const mapBeneficiaryToRecipient = (
  activeTab: BillsTabKey,
  sendAsGift: boolean,
  beneficiary: GiftBillBeneficiary
): BeneficiaryRecipientMapping => {
  const identifiers = getBeneficiaryIdentifiersForContext(
    activeTab,
    sendAsGift,
    beneficiary
  )
  if (identifiers.length > 0) {
    const selected = identifiers[0]
    return {
      matchedBy: selected.startsWith('@') ? 'tag' : 'phone',
      identifierValue: selected,
    }
  }

  return {
    matchedBy: 'none',
  }
}
