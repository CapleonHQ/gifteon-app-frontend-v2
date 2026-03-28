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
  GiftBillRecurringBase

export interface SendGiftBillToMultipleRecipientsRequestBody
  extends GiftBillRecurringBase {
  groupName?: string
  groupDescription?: string
  recipients: SendGiftBillRecipientInput[]
}

export interface UpdateGiftBillBeneficiaryNicknameRequestBody {
  nickname: string
}

export interface AirtimePurchaseRequestBody {
  network: string
  phoneNumber: string
  amount: number
}

export interface DataPurchaseRequestBody {
  network: string
  phoneNumber: string
  amount: number
  planCode: string
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
  phoneNumber: string
}

export interface PayElectricityBillRequestBody {
  provider?: string
  meterNumber: string
  meterType: GiftBillMeterType
  amount: number
  phoneNumber: string
}
