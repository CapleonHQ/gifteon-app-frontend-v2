import { AxiosResponse } from 'axios'
import apiService from '../'
import { ApiResponse } from '@/types/Common'
import {
  AirtimePurchaseRequestBody,
  ClaimGiftBillRequestBody,
  CreateGiftBillPaymentLinkRequestBody,
  DataPurchaseRequestBody,
  GiftBillPaginationParams,
  GiftBillPaymentLinksParams,
  PayElectricityBillRequestBody,
  SendGiftBillSingleRequestBody,
  SendGiftBillToMultipleRecipientsRequestBody,
  SubscribeCableTvRequestBody,
  UpdateGiftBillBeneficiaryNicknameRequestBody,
  VerifyCableIucRequestBody,
  VerifyElectricityMeterRequestBody,
} from '@/types/Bills'

export const createGiftBillPaymentLink = async (
  data: CreateGiftBillPaymentLinkRequestBody
): Promise<ApiResponse<Record<string, unknown>>> => {
  const resp: AxiosResponse<ApiResponse<Record<string, unknown>>> =
    await apiService.appPrivate.post('/gift-bills/payment-links', data)
  return resp.data
}

export const listGiftBillPaymentLinks = async (
  params?: GiftBillPaymentLinksParams
): Promise<ApiResponse<Record<string, unknown>>> => {
  const resp: AxiosResponse<ApiResponse<Record<string, unknown>>> =
    await apiService.appPrivate.get('/gift-bills/payment-links', { params })
  return resp.data
}

export const getGiftBillPaymentLinkByToken = async (
  paymentLinkToken: string
): Promise<ApiResponse<Record<string, unknown>>> => {
  const resp: AxiosResponse<ApiResponse<Record<string, unknown>>> =
    await apiService.appPublic.get(`/gift-bills/payment-links/${paymentLinkToken}`)
  return resp.data
}

export const payGiftBillPaymentLink = async (
  paymentLinkToken: string
): Promise<ApiResponse<Record<string, unknown>>> => {
  const resp: AxiosResponse<ApiResponse<Record<string, unknown>>> =
    await apiService.appPublic.post(`/gift-bills/payment-links/${paymentLinkToken}/pay`)
  return resp.data
}

export const revokeGiftBillPaymentLink = async (
  paymentLinkId: string
): Promise<ApiResponse<Record<string, unknown>>> => {
  const resp: AxiosResponse<ApiResponse<Record<string, unknown>>> =
    await apiService.appPrivate.delete(
      `/gift-bills/payment-links/${paymentLinkId}/revoke`
    )
  return resp.data
}

export const getReceivedGiftBills = async (
  params?: GiftBillPaginationParams
): Promise<ApiResponse<Record<string, unknown>>> => {
  const resp: AxiosResponse<ApiResponse<Record<string, unknown>>> =
    await apiService.appPrivate.get('/gift-bills/received', { params })
  return resp.data
}

export const claimGiftBill = async (
  giftBillId: string,
  data: ClaimGiftBillRequestBody
): Promise<ApiResponse<Record<string, unknown>>> => {
  const resp: AxiosResponse<ApiResponse<Record<string, unknown>>> =
    await apiService.appPrivate.post(`/gift-bills/${giftBillId}/claim`, data)
  return resp.data
}

export const sendGiftBillSingle = async (
  data: SendGiftBillSingleRequestBody
): Promise<ApiResponse<Record<string, unknown>>> => {
  const resp: AxiosResponse<ApiResponse<Record<string, unknown>>> =
    await apiService.appPrivate.post('/gift-bills/send/single', data)
  return resp.data
}

export const sendGiftBillToMultipleRecipients = async (
  data: SendGiftBillToMultipleRecipientsRequestBody
): Promise<ApiResponse<Record<string, unknown>>> => {
  const resp: AxiosResponse<ApiResponse<Record<string, unknown>>> =
    await apiService.appPrivate.post('/gift-bills/send/multiple-recipients', data)
  return resp.data
}

export const getSentGiftBills = async (
  params?: GiftBillPaginationParams
): Promise<ApiResponse<Record<string, unknown>>> => {
  const resp: AxiosResponse<ApiResponse<Record<string, unknown>>> =
    await apiService.appPrivate.get('/gift-bills/sent', { params })
  return resp.data
}

export const cancelSentGiftBill = async (
  giftBillId: string
): Promise<ApiResponse<Record<string, unknown>>> => {
  const resp: AxiosResponse<ApiResponse<Record<string, unknown>>> =
    await apiService.appPrivate.delete(`/gift-bills/${giftBillId}/cancel`)
  return resp.data
}

export const listGiftBillBeneficiaries = async (
  params?: GiftBillPaginationParams
): Promise<ApiResponse<Record<string, unknown>>> => {
  const resp: AxiosResponse<ApiResponse<Record<string, unknown>>> =
    await apiService.appPrivate.get('/gift-bills/beneficiaries', { params })
  return resp.data
}

export const updateGiftBillBeneficiaryNickname = async (
  beneficiaryId: string,
  data: UpdateGiftBillBeneficiaryNicknameRequestBody
): Promise<ApiResponse<Record<string, unknown>>> => {
  const resp: AxiosResponse<ApiResponse<Record<string, unknown>>> =
    await apiService.appPrivate.post(
      `/gift-bills/beneficiaries/${beneficiaryId}`,
      data
    )
  return resp.data
}

export const deleteGiftBillBeneficiary = async (
  beneficiaryId: string
): Promise<ApiResponse<Record<string, unknown>>> => {
  const resp: AxiosResponse<ApiResponse<Record<string, unknown>>> =
    await apiService.appPrivate.delete(`/gift-bills/beneficiaries/${beneficiaryId}`)
  return resp.data
}

export const getAirtimeNetworks = async (): Promise<
  ApiResponse<Record<string, unknown>>
> => {
  const resp: AxiosResponse<ApiResponse<Record<string, unknown>>> =
    await apiService.appPrivate.get('/bills/airtime/networks')
  return resp.data
}

export const getDataNetworks = async (): Promise<
  ApiResponse<Record<string, unknown>>
> => {
  const resp: AxiosResponse<ApiResponse<Record<string, unknown>>> =
    await apiService.appPrivate.get('/bills/data/networks')
  return resp.data
}

export const getDataNetworkPlans = async (
  network: string
): Promise<ApiResponse<Record<string, unknown>>> => {
  const resp: AxiosResponse<ApiResponse<Record<string, unknown>>> =
    await apiService.appPrivate.get(`/bills/data/plans/${network}`)
  return resp.data
}

export const getCableProviders = async (): Promise<
  ApiResponse<Record<string, unknown>>
> => {
  const resp: AxiosResponse<ApiResponse<Record<string, unknown>>> =
    await apiService.appPrivate.get('/bills/cable/providers')
  return resp.data
}

export const getCableProviderPackages = async (
  provider: string
): Promise<ApiResponse<Record<string, unknown>>> => {
  const resp: AxiosResponse<ApiResponse<Record<string, unknown>>> =
    await apiService.appPrivate.get(`/bills/cable/packages/${provider}`)
  return resp.data
}

export const getElectricityDiscos = async (): Promise<
  ApiResponse<Record<string, unknown>>
> => {
  const resp: AxiosResponse<ApiResponse<Record<string, unknown>>> =
    await apiService.appPrivate.get('/bills/electricity/discos')
  return resp.data
}

export const buyAirtime = async (
  data: AirtimePurchaseRequestBody
): Promise<ApiResponse<Record<string, unknown>>> => {
  const resp: AxiosResponse<ApiResponse<Record<string, unknown>>> =
    await apiService.appPrivate.post('/bills/airtime/purchase', data)
  return resp.data
}

export const buyData = async (
  data: DataPurchaseRequestBody
): Promise<ApiResponse<Record<string, unknown>>> => {
  const resp: AxiosResponse<ApiResponse<Record<string, unknown>>> =
    await apiService.appPrivate.post('/bills/data/purchase', data)
  return resp.data
}

export const verifyCableIuc = async (
  data: VerifyCableIucRequestBody
): Promise<ApiResponse<Record<string, unknown>>> => {
  const resp: AxiosResponse<ApiResponse<Record<string, unknown>>> =
    await apiService.appPrivate.post('/bills/cable/verify-iuc', data)
  return resp.data
}

export const verifyElectricityMeter = async (
  data: VerifyElectricityMeterRequestBody
): Promise<ApiResponse<Record<string, unknown>>> => {
  const resp: AxiosResponse<ApiResponse<Record<string, unknown>>> =
    await apiService.appPrivate.post('/bills/electricity/verify-meter', data)
  return resp.data
}

export const subscribeCableTv = async (
  data: SubscribeCableTvRequestBody
): Promise<ApiResponse<Record<string, unknown>>> => {
  const resp: AxiosResponse<ApiResponse<Record<string, unknown>>> =
    await apiService.appPrivate.post('/bills/cable/subscribe', data)
  return resp.data
}

export const payElectricityBill = async (
  data: PayElectricityBillRequestBody
): Promise<ApiResponse<Record<string, unknown>>> => {
  const resp: AxiosResponse<ApiResponse<Record<string, unknown>>> =
    await apiService.appPrivate.post('/bills/electricity/pay', data)
  return resp.data
}
