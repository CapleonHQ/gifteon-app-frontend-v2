import { PaginationParams } from '@/types/Common'

export type GiftBillType = 'airtime' | 'data' | 'cable_tv' | 'electricity'
export type GiftBillMeterType = 'prepaid' | 'postpaid'
export type GiftBillFrequency = 'daily' | 'weekly' | 'monthly' | 'custom'
export type GiftBillStatus =
  | 'pending_claim'
  | 'pending_schedule'
  | 'processing'
  | 'processed'
  | 'failed'
  | 'cancelled'
  | 'expired'

export interface GiftBillPaginationParams extends PaginationParams {
  status?: GiftBillStatus
  billType?: GiftBillType
}

export type GiftBillPaymentLinksParams = PaginationParams

export type GiftBillRecurringConfig =
  | {
      frequency: Exclude<GiftBillFrequency, 'custom'>
      endDate?: string
      maxRuns?: number
    }
  | {
      frequency: 'custom'
      cronExpression: string
      endDate?: string
      maxRuns?: number
    }

export interface GiftBillBasePayload {
  billType: GiftBillType
  provider: string
  amount: number
  recipient?: string
  planCode?: string
  meterType?: GiftBillMeterType
}

export interface GiftBillRecurringBase {
  scheduledAt?: string
  isRecurring?: boolean
  recurringConfig?: GiftBillRecurringConfig
}

export type GiftBillPayload = GiftBillBasePayload

export interface CreateGiftBillPaymentLinkRequestBody extends GiftBillPayload {
  title?: string
  description?: string
  expiresAt?: string
}

export interface ClaimGiftBillRequestBody {
  recipient: string
  planCode?: string
  meterType?: GiftBillMeterType
}

export interface SendGiftBillRecipientInput {
  recipientTag?: string
  recipientName?: string
  recipientPhone?: string
  recipientEmail?: string
  bill: GiftBillPayload
  isAnonymous?: boolean
  senderNote?: string
  notifySms?: boolean
  notifyEmail?: boolean
}

export type SendGiftBillSingleRequestBody = SendGiftBillRecipientInput &
  GiftBillRecurringBase & {
    pin?: string
  }

export interface SendGiftBillToMultipleRecipientsRequestBody
  extends GiftBillRecurringBase {
  groupName?: string
  groupDescription?: string
  recipients: SendGiftBillRecipientInput[]
  pin?: string
}

export interface UpdateGiftBillBeneficiaryNicknameRequestBody {
  nickname: string
}

export interface AirtimePurchaseRequestBody {
  network: string
  phoneNumber: string
  amount: number
  pin?: string
}

export interface DataPurchaseRequestBody {
  network: string
  phoneNumber: string
  amount: number
  planCode: string
  pin?: string
}

export interface VerifyCableIucRequestBody {
  provider: string
  iucNumber: string
}

export interface VerifyElectricityMeterRequestBody {
  meterNumber: string
  meterType: GiftBillMeterType
  plan: string
}

export interface SubscribeCableTvRequestBody {
  provider: string
  iucNumber: string
  packageCode: string
  amount: number
  pin?: string
}

export interface PayElectricityBillRequestBody {
  provider?: string
  meterNumber: string
  meterType: GiftBillMeterType
  amount: number
  pin?: string
}

export interface AirtimeNetworkItem {
  id: string
  name: string
}

export interface AirtimeNetworksData {
  networks: AirtimeNetworkItem[]
}

export interface DataNetworkItem {
  identifier: string
  name: string
}

export interface DataNetworksData {
  networks: DataNetworkItem[]
}

export interface DataNetworkPlanItem {
  plan_code: string
  amount: number
  label: string
}

export interface DataNetworkPlansData {
  status?: string
  provider?: string
  identifier?: string
  plans: DataNetworkPlanItem[]
}

export interface CableProviderItem {
  identifier: string
  name: string
}

export interface CableProvidersData {
  status: string
  providers: CableProviderItem[]
}

export interface CableProviderPackagesData {
  status: string
  provider: string
  identifier: string
  plans: CablePackagePlanItem[]
}

export interface CablePackagePlanItem {
  plan_code: string
  amount: number | string
  display: string
  description: string
}

export interface ElectricityDiscosData {
  status: string
  provider: string
  identifier: string
  plans: ElectricityDiscoPlanItem[]
}

export interface ElectricityDiscoPlanItem {
  plan_id: string
  plan_code: string
  plan_name: string
  min_amount: number
  max_amount: number
}
