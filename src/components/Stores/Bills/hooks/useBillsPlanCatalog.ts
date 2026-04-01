import { useMemo, useState } from 'react'
import {
  getCableProviderPackages as fetchCableProviderPackages,
  getDataNetworkPlans as fetchDataNetworkPlans,
} from '@/api/services/bills'
import { useElectricityDiscos } from '@/hooks/tanstack/bills'
import { mapCablePackageOptions, mapDataPlanOptions, SelectOption } from '../utils'

const parseNumericAmount = (value: unknown) => {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const parsed = Number(value.replace(/[^\d.]/g, ''))
    return Number.isNaN(parsed) ? 0 : parsed
  }
  return 0
}

export const useBillsPlanCatalog = () => {
  const electricityDiscosQuery = useElectricityDiscos()
  const [dataPlansByNetwork, setDataPlansByNetwork] = useState<
    Record<string, SelectOption[]>
  >({})
  const [dataPlanAmountByNetwork, setDataPlanAmountByNetwork] = useState<
    Record<string, Record<string, number>>
  >({})
  const [cablePackagesByProvider, setCablePackagesByProvider] = useState<
    Record<string, SelectOption[]>
  >({})
  const [cablePlanAmountByProvider, setCablePlanAmountByProvider] = useState<
    Record<string, Record<string, number>>
  >({})

  const ensureDataPlans = async (network: string) => {
    if (!network || dataPlansByNetwork[network]) return
    try {
      const resp = await fetchDataNetworkPlans(network)
      const plans = resp.data?.plans ?? []
      const amountMap: Record<string, number> = {}
      for (const plan of plans) {
        amountMap[plan.plan_code] = plan.amount
      }
      setDataPlansByNetwork((prev) => ({
        ...prev,
        [network]: mapDataPlanOptions(resp),
      }))
      setDataPlanAmountByNetwork((prev) => ({
        ...prev,
        [network]: amountMap,
      }))
    } catch {
      setDataPlansByNetwork((prev) => ({ ...prev, [network]: [] }))
      setDataPlanAmountByNetwork((prev) => ({ ...prev, [network]: {} }))
    }
  }

  const ensureCablePackages = async (provider: string) => {
    if (!provider || cablePackagesByProvider[provider]) return
    try {
      const resp = await fetchCableProviderPackages(provider)
      const plans = resp.data?.plans ?? []
      const amountMap: Record<string, number> = {}
      for (const plan of plans) {
        const code = plan.plan_code
        const numericAmount = parseNumericAmount(plan.amount)
        if (numericAmount > 0) {
          amountMap[code] = numericAmount
        }
      }
      setCablePackagesByProvider((prev) => ({
        ...prev,
        [provider]: mapCablePackageOptions(resp),
      }))
      setCablePlanAmountByProvider((prev) => ({
        ...prev,
        [provider]: amountMap,
      }))
    } catch {
      setCablePackagesByProvider((prev) => ({ ...prev, [provider]: [] }))
      setCablePlanAmountByProvider((prev) => ({ ...prev, [provider]: {} }))
    }
  }

  const getDataPlanOptions = (network: string) => dataPlansByNetwork[network] || []
  const getCablePackageOptions = (provider: string) =>
    cablePackagesByProvider[provider] || []

  const getDataPlanAmount = (network: string, code: string) =>
    dataPlanAmountByNetwork[network]?.[code]
  const getCablePlanAmount = (provider: string, code: string) =>
    cablePlanAmountByProvider[provider]?.[code]

  const getDataPlanLabel = (network: string, code: string) =>
    dataPlansByNetwork[network]?.find((option) => option.value === code)?.label || code
  const getCablePackageLabel = (provider: string, code: string) =>
    cablePackagesByProvider[provider]?.find((option) => option.value === code)
      ?.label || code

  const electricityAmountLimitsByProvider = useMemo(() => {
    const limits = new Map<string, { min: number; max: number }>()
    for (const plan of electricityDiscosQuery.data?.data?.plans ?? []) {
      const key = plan.plan_code
      const min =
        typeof plan.min_amount === 'number' ? plan.min_amount : Number.NaN
      const max =
        typeof plan.max_amount === 'number' ? plan.max_amount : Number.NaN
      if (Number.isNaN(min) || Number.isNaN(max)) continue
      limits.set(key, { min, max })
    }
    return limits
  }, [electricityDiscosQuery.data])

  const getElectricityAmountLimits = (provider: string) =>
    electricityAmountLimitsByProvider.get(provider)

  return {
    ensureDataPlans,
    ensureCablePackages,
    getDataPlanOptions,
    getCablePackageOptions,
    getDataPlanAmount,
    getCablePlanAmount,
    getDataPlanLabel,
    getCablePackageLabel,
    getElectricityAmountLimits,
  }
}
