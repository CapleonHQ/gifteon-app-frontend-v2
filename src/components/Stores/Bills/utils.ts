import type {
  AirtimeNetworksData,
  CableProviderPackagesData,
  CableProvidersData,
  DataNetworkPlansData,
  DataNetworksData,
  ElectricityDiscosData,
} from '@/types/Bills'
import type { ApiResponse } from '@/types/Common'

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

  return Array.from(new Set(names)).slice(0, 6)
}
