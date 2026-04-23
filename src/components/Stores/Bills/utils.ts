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

export type BeneficiaryRecipientMapping = {
  matchedBy: 'tag' | 'phone' | 'none'
  identifierValue?: string
}

export const getBeneficiaryIdentifiersForContext = (
  activeTab: BillsTabKey,
  beneficiary: GiftBillBeneficiary
): string[] => {
  const identifiers: string[] = []
  const direct = (beneficiary.recipient || '').trim()
  const isBillTypeMatch = beneficiary.billType === activeTab

  if (activeTab === 'airtime' || activeTab === 'data') {
    if (isBillTypeMatch && direct) identifiers.push(direct)
    return identifiers
  }

  if (activeTab === 'electricity' || activeTab === 'cable_tv') {
    if (isBillTypeMatch && direct) identifiers.push(direct)
  }

  return identifiers
}

export const mapBeneficiaryToRecipient = (
  activeTab: BillsTabKey,
  beneficiary: GiftBillBeneficiary
): BeneficiaryRecipientMapping => {
  const identifiers = getBeneficiaryIdentifiersForContext(activeTab, beneficiary)
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
