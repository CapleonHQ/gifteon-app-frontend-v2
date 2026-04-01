import { useState, type RefObject } from 'react'
import { toApiError } from '@/api/errorHelpers'
import {
  useAirtimeNetworks,
  useCableProviders,
  useDataNetworks,
  useElectricityDiscos,
  useGiftBillBeneficiaries,
  useVerifyCableIuc,
  useVerifyElectricityMeter,
} from '@/hooks/tanstack/bills'
import type { BillsTabKey } from '../constants'
import type { CardValidationIssue, RecipientCard } from '../models'
import {
  extractRecentBeneficiaries,
  mapAirtimeNetworkOptions,
  mapCableProviderOptions,
  mapDataNetworkOptions,
  mapElectricityDiscoOptions,
} from '../utils'
import { useBillsPlanCatalog } from '../hooks/useBillsPlanCatalog'
import BillsRecipientCard from './BillsRecipientCard'
import BillsQuickActions from './BillsQuickActions'

type BillsBuilderSectionProps = {
  activeTab: BillsTabKey
  activeCards: RecipientCard[]
  cardErrors: Array<CardValidationIssue | null>
  showValidationErrors: boolean
  recipientRefs: RefObject<Record<string, HTMLDivElement | null>>
  isActionBusy: boolean
  onUpdateCard: (cardId: string, updater: (card: RecipientCard) => RecipientCard) => void
  onRemoveRecipientCard: (cardId: string) => void
  onAddRecipientCard: () => void
}

const extractVerifiedCustomerName = (payload: unknown): string | null => {
  if (!payload || typeof payload !== 'object') return null
  const root = payload as Record<string, unknown>
  const data =
    root.data && typeof root.data === 'object'
      ? (root.data as Record<string, unknown>)
      : null
  if (!data) return null
  const candidate = data.customer_name
  if (typeof candidate !== 'string') return null
  const normalized = candidate.trim()
  return normalized.length > 0 ? normalized : null
}

const BillsBuilderSection = ({
  activeTab,
  activeCards,
  cardErrors,
  showValidationErrors,
  recipientRefs,
  isActionBusy,
  onUpdateCard,
  onRemoveRecipientCard,
  onAddRecipientCard,
}: BillsBuilderSectionProps) => {
  const [verifyErrorByCard, setVerifyErrorByCard] = useState<Record<string, string>>({})
  const [verifiedNameByCard, setVerifiedNameByCard] = useState<Record<string, string>>({})

  const plansCatalog = useBillsPlanCatalog()
  const verifyElectricityMutation = useVerifyElectricityMeter()
  const verifyCableMutation = useVerifyCableIuc()

  const airtimeNetworksQuery = useAirtimeNetworks()
  const dataNetworksQuery = useDataNetworks()
  const electricityDiscosQuery = useElectricityDiscos()
  const cableProvidersQuery = useCableProviders()
  const beneficiariesQuery = useGiftBillBeneficiaries({ page: 1, limit: 6 })

  const airtimeOptions = mapAirtimeNetworkOptions(airtimeNetworksQuery.data)
  const dataNetworkOptions = mapDataNetworkOptions(dataNetworksQuery.data)
  const electricityOptions = mapElectricityDiscoOptions(electricityDiscosQuery.data)
  const cableProviderOptions = mapCableProviderOptions(cableProvidersQuery.data)
  const recentBeneficiaries = extractRecentBeneficiaries(beneficiariesQuery.data)

  const clearVerificationState = (cardId: string) => {
    setVerifyErrorByCard((prev) => ({ ...prev, [cardId]: '' }))
    setVerifiedNameByCard((prev) => ({ ...prev, [cardId]: '' }))
  }

  const handleVerifyCard = async (card: RecipientCard) => {
    try {
      if (
        activeTab === 'electricity' &&
        (!card.sendAsGift || !card.identifierValue.trim().startsWith('@'))
      ) {
        setVerifyErrorByCard((prev) => ({ ...prev, [card.id]: '' }))
        const resp = await verifyElectricityMutation.mutateAsync({
          meterNumber: card.identifierValue.trim(),
          meterType: card.meterType,
          plan: card.provider,
        })
        const customerName =
          extractVerifiedCustomerName(resp) || 'Meter verified successfully'
        onUpdateCard(card.id, (current) => ({ ...current, recipientVerified: true }))
        setVerifiedNameByCard((prev) => ({ ...prev, [card.id]: customerName }))
      }

      if (
        activeTab === 'cable_tv' &&
        (!card.sendAsGift || !card.identifierValue.trim().startsWith('@'))
      ) {
        setVerifyErrorByCard((prev) => ({ ...prev, [card.id]: '' }))
        const resp = await verifyCableMutation.mutateAsync({
          provider: card.provider,
          iucNumber: card.identifierValue.trim(),
        })
        const customerName =
          extractVerifiedCustomerName(resp) || 'IUC verified successfully'
        onUpdateCard(card.id, (current) => ({ ...current, recipientVerified: true }))
        setVerifiedNameByCard((prev) => ({ ...prev, [card.id]: customerName }))
      }
    } catch (error) {
      const message = toApiError(error).message || 'Verification failed.'
      onUpdateCard(card.id, (current) => ({ ...current, recipientVerified: false }))
      setVerifyErrorByCard((prev) => ({ ...prev, [card.id]: message }))
      setVerifiedNameByCard((prev) => ({ ...prev, [card.id]: '' }))
    }
  }

  const applyQuickRecipient = (value: string) => {
    const firstCard = activeCards[0]
    if (!firstCard) return
    onUpdateCard(firstCard.id, (current) => ({
      ...current,
      identifierValue: value,
      sendAsGift: value.startsWith('@') ? true : current.sendAsGift,
      ...(activeTab === 'electricity' || activeTab === 'cable_tv'
        ? { recipientVerified: false }
        : {}),
    }))
    if (activeTab === 'electricity' || activeTab === 'cable_tv') {
      clearVerificationState(firstCard.id)
    }
  }

  return (
    <section className='space-y-4'>
      <div className='rounded-xl border border-grey-100 bg-white p-4 lg:p-5 space-y-4'>
        {activeCards.map((card, index) => {
          const planOptions =
            activeTab === 'data'
              ? plansCatalog.getDataPlanOptions(card.network)
              : activeTab === 'cable_tv'
              ? plansCatalog.getCablePackageOptions(card.provider)
              : []

          return (
            <div
              key={card.id}
              ref={(node) => {
                recipientRefs.current[card.id] = node
              }}
            >
              <BillsRecipientCard
                activeTab={activeTab}
                card={card}
                index={index}
                totalCards={activeCards.length}
                cardError={cardErrors[index]}
                showValidationErrors={showValidationErrors}
                isActionBusy={isActionBusy}
                airtimeOptions={airtimeOptions}
                dataNetworkOptions={dataNetworkOptions}
                electricityOptions={electricityOptions}
                cableProviderOptions={cableProviderOptions}
                planOptions={planOptions}
                verifyError={verifyErrorByCard[card.id]}
                verifiedName={verifiedNameByCard[card.id]}
                isVerifyingElectricity={verifyElectricityMutation.isPending}
                isVerifyingCable={verifyCableMutation.isPending}
                onUpdateCard={onUpdateCard}
                onRemoveRecipientCard={onRemoveRecipientCard}
                onVerifyCard={handleVerifyCard}
                onClearVerificationState={clearVerificationState}
                onEnsureDataPlans={plansCatalog.ensureDataPlans}
                onEnsureCablePackages={plansCatalog.ensureCablePackages}
                getDataPlanAmount={plansCatalog.getDataPlanAmount}
                getCablePlanAmount={plansCatalog.getCablePlanAmount}
              />
            </div>
          )
        })}

        <BillsQuickActions
          recentBeneficiaries={recentBeneficiaries}
          onAddRecipientCard={onAddRecipientCard}
          onApplyQuickRecipient={applyQuickRecipient}
        />
      </div>
    </section>
  )
}

export default BillsBuilderSection
