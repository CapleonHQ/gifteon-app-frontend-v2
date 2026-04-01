import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  buyAirtime,
  buyData,
  cancelSentGiftBill,
  claimGiftBill,
  createGiftBillPaymentLink,
  deleteGiftBillBeneficiary,
  getAirtimeNetworks,
  getCableProviderPackages,
  getCableProviders,
  getDataNetworkPlans,
  getDataNetworks,
  getElectricityDiscos,
  getGiftBillPaymentLinkByToken,
  getReceivedGiftBills,
  getSentGiftBills,
  listGiftBillBeneficiaries,
  listGiftBillPaymentLinks,
  payElectricityBill,
  payGiftBillPaymentLink,
  revokeGiftBillPaymentLink,
  sendGiftBillSingle,
  sendGiftBillToMultipleRecipients,
  subscribeCableTv,
  updateGiftBillBeneficiaryNickname,
  verifyCableIuc,
  verifyElectricityMeter,
} from '@/api/services/bills'
import type {
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

const BILLS_METADATA_STALE_TIME = 1000 * 60 * 60 * 6 // 6 hours
const BILLS_METADATA_GC_TIME = 1000 * 60 * 60 * 24 // 24 hours

export const useCreateGiftBillPaymentLink = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateGiftBillPaymentLinkRequestBody) =>
      createGiftBillPaymentLink(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gift-bills', 'payment-links'] })
    },
  })
}

export const useGiftBillPaymentLinks = (params?: GiftBillPaymentLinksParams) => {
  return useQuery({
    queryKey: ['gift-bills', 'payment-links', params],
    queryFn: () => listGiftBillPaymentLinks(params),
  })
}

export const useGiftBillPaymentLinkByToken = (paymentLinkToken: string) => {
  return useQuery({
    queryKey: ['gift-bills', 'payment-link-token', paymentLinkToken],
    queryFn: () => getGiftBillPaymentLinkByToken(paymentLinkToken),
    enabled: paymentLinkToken.length > 0,
  })
}

export const usePayGiftBillPaymentLink = () => {
  return useMutation({
    mutationFn: (paymentLinkToken: string) =>
      payGiftBillPaymentLink(paymentLinkToken),
  })
}

export const useRevokeGiftBillPaymentLink = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (paymentLinkId: string) => revokeGiftBillPaymentLink(paymentLinkId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gift-bills', 'payment-links'] })
    },
  })
}

export const useReceivedGiftBills = (params?: GiftBillPaginationParams) => {
  return useQuery({
    queryKey: ['gift-bills', 'received', params],
    queryFn: () => getReceivedGiftBills(params),
  })
}

export const useClaimGiftBill = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      giftBillId,
      data,
    }: {
      giftBillId: string
      data: ClaimGiftBillRequestBody
    }) => claimGiftBill(giftBillId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gift-bills', 'received'] })
      queryClient.invalidateQueries({ queryKey: ['gift-bills', 'sent'] })
    },
  })
}

export const useSendGiftBillSingle = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: SendGiftBillSingleRequestBody) => sendGiftBillSingle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gift-bills', 'sent'] })
    },
  })
}

export const useSendGiftBillToMultipleRecipients = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: SendGiftBillToMultipleRecipientsRequestBody) =>
      sendGiftBillToMultipleRecipients(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gift-bills', 'sent'] })
    },
  })
}

export const useSentGiftBills = (params?: GiftBillPaginationParams) => {
  return useQuery({
    queryKey: ['gift-bills', 'sent', params],
    queryFn: () => getSentGiftBills(params),
  })
}

export const useCancelSentGiftBill = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (giftBillId: string) => cancelSentGiftBill(giftBillId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gift-bills', 'sent'] })
    },
  })
}

export const useGiftBillBeneficiaries = (params?: GiftBillPaginationParams) => {
  return useQuery({
    queryKey: ['gift-bills', 'beneficiaries', params],
    queryFn: () => listGiftBillBeneficiaries(params),
  })
}

export const useUpdateGiftBillBeneficiaryNickname = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      beneficiaryId,
      data,
    }: {
      beneficiaryId: string
      data: UpdateGiftBillBeneficiaryNicknameRequestBody
    }) => updateGiftBillBeneficiaryNickname(beneficiaryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gift-bills', 'beneficiaries'] })
    },
  })
}

export const useDeleteGiftBillBeneficiary = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (beneficiaryId: string) => deleteGiftBillBeneficiary(beneficiaryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gift-bills', 'beneficiaries'] })
    },
  })
}

export const useAirtimeNetworks = () => {
  return useQuery({
    queryKey: ['bills', 'airtime-networks'],
    queryFn: getAirtimeNetworks,
    staleTime: BILLS_METADATA_STALE_TIME,
    gcTime: BILLS_METADATA_GC_TIME,
    refetchOnWindowFocus: false,
  })
}

export const useDataNetworks = () => {
  return useQuery({
    queryKey: ['bills', 'data-networks'],
    queryFn: getDataNetworks,
    staleTime: BILLS_METADATA_STALE_TIME,
    gcTime: BILLS_METADATA_GC_TIME,
    refetchOnWindowFocus: false,
  })
}

export const useDataNetworkPlans = (network: string) => {
  return useQuery({
    queryKey: ['bills', 'data-network-plans', network],
    queryFn: () => getDataNetworkPlans(network),
    enabled: network.length > 0,
    staleTime: BILLS_METADATA_STALE_TIME,
    gcTime: BILLS_METADATA_GC_TIME,
    refetchOnWindowFocus: false,
  })
}

export const useCableProviders = () => {
  return useQuery({
    queryKey: ['bills', 'cable-providers'],
    queryFn: getCableProviders,
    staleTime: BILLS_METADATA_STALE_TIME,
    gcTime: BILLS_METADATA_GC_TIME,
    refetchOnWindowFocus: false,
  })
}

export const useCableProviderPackages = (provider: string) => {
  return useQuery({
    queryKey: ['bills', 'cable-provider-packages', provider],
    queryFn: () => getCableProviderPackages(provider),
    enabled: provider.length > 0,
    staleTime: BILLS_METADATA_STALE_TIME,
    gcTime: BILLS_METADATA_GC_TIME,
    refetchOnWindowFocus: false,
  })
}

export const useElectricityDiscos = () => {
  return useQuery({
    queryKey: ['bills', 'electricity-discos'],
    queryFn: getElectricityDiscos,
    staleTime: BILLS_METADATA_STALE_TIME,
    gcTime: BILLS_METADATA_GC_TIME,
    refetchOnWindowFocus: false,
  })
}

export const useBuyAirtime = () => {
  return useMutation({
    mutationFn: (data: AirtimePurchaseRequestBody) => buyAirtime(data),
  })
}

export const useBuyData = () => {
  return useMutation({
    mutationFn: (data: DataPurchaseRequestBody) => buyData(data),
  })
}

export const useVerifyCableIuc = () => {
  return useMutation({
    mutationFn: (data: VerifyCableIucRequestBody) => verifyCableIuc(data),
  })
}

export const useVerifyElectricityMeter = () => {
  return useMutation({
    mutationFn: (data: VerifyElectricityMeterRequestBody) =>
      verifyElectricityMeter(data),
  })
}

export const useSubscribeCableTv = () => {
  return useMutation({
    mutationFn: (data: SubscribeCableTvRequestBody) => subscribeCableTv(data),
  })
}

export const usePayElectricityBill = () => {
  return useMutation({
    mutationFn: (data: PayElectricityBillRequestBody) => payElectricityBill(data),
  })
}
