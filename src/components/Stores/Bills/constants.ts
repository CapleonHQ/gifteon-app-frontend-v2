export type BillsTabKey = 'airtime' | 'data' | 'electricity' | 'cable_tv'

export const BILLS_TABS: Array<{ key: BillsTabKey; label: string }> = [
  { key: 'airtime', label: 'Airtime' },
  { key: 'data', label: 'Data' },
  { key: 'electricity', label: 'Electricity' },
  { key: 'cable_tv', label: 'Cable TV' },
]

export const METER_TYPES = [
  { value: 'prepaid', label: 'Prepaid' },
  { value: 'postpaid', label: 'Postpaid' },
] as const

