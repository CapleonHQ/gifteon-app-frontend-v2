import { useState, type RefObject } from 'react'
import { analytics } from '@/lib/analytics/events'
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
  getBeneficiaryIdentifiersForContext,
  mapBeneficiaryToRecipient,
  mapAirtimeNetworkOptions,
  mapCableProviderOptions,
  mapDataNetworkOptions,
  mapElectricityDiscoOptions,
} from '../utils'
import { useBillsPlanCatalog } from '../hooks/useBillsPlanCatalog'
import BillsRecipientCard from './BillsRecipientCard'
// import BillsQuickActions from './BillsQuickActions'
import BillsBeneficiariesModal from './BillsBeneficiariesModal'
import type { GiftBillBeneficiary } from '@/types/Bills'

type BillsBuilderSectionProps = {
  activeTab: BillsTabKey
  activeCards: RecipientCard[]
  cardErrors: Array<CardValidationIssue | null>
  showValidationErrors: boolean
  recipientRefs: RefObject<Record<string, HTMLDivElement | null>>
  isActionBusy: boolean
  onUpdateCard: (
    cardId: string,
    updater: (card: RecipientCard) => RecipientCard
  ) => void
  onRemoveRecipientCard: (cardId: string) => void
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
}: BillsBuilderSectionProps) => {
  const [verifyErrorByCard, setVerifyErrorByCard] = useState<
    Record<string, string>
  >({})
  const [verifiedNameByCard, setVerifiedNameByCard] = useState<
    Record<string, string>
  >({})
  const [isBeneficiariesModalOpen, setIsBeneficiariesModalOpen] =
    useState(false)
  const [beneficiariesModalSession, setBeneficiariesModalSession] = useState(0)
  const [selectedBeneficiaryCardId, setSelectedBeneficiaryCardId] = useState('')

  const plansCatalog = useBillsPlanCatalog()
  const verifyElectricityMutation = useVerifyElectricityMeter()
  const verifyCableMutation = useVerifyCableIuc()

  const airtimeNetworksQuery = useAirtimeNetworks()
  const dataNetworksQuery = useDataNetworks()
  const electricityDiscosQuery = useElectricityDiscos()
  const cableProvidersQuery = useCableProviders()
  const beneficiariesQuery = useGiftBillBeneficiaries({ page: 1, limit: 100 })

  const airtimeOptions = mapAirtimeNetworkOptions(airtimeNetworksQuery.data)
  const dataNetworkOptions = mapDataNetworkOptions(dataNetworksQuery.data)
  const electricityOptions = mapElectricityDiscoOptions(
    electricityDiscosQuery.data
  )
  const cableProviderOptions = mapCableProviderOptions(cableProvidersQuery.data)
  const beneficiaries = beneficiariesQuery.data?.data?.beneficiaries ?? []

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
        onUpdateCard(card.id, (current) => ({
          ...current,
          recipientVerified: true,
        }))
        setVerifiedNameByCard((prev) => ({ ...prev, [card.id]: customerName }))
        analytics.trackBillsVerifySucceeded({
          bill_type: activeTab,
          verify_type: 'meter',
        })
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
        onUpdateCard(card.id, (current) => ({
          ...current,
          recipientVerified: true,
        }))
        setVerifiedNameByCard((prev) => ({ ...prev, [card.id]: customerName }))
        analytics.trackBillsVerifySucceeded({
          bill_type: activeTab,
          verify_type: 'iuc',
        })
      }
    } catch {
      const message =
        activeTab === 'electricity'
          ? 'Could not verify meter number.'
          : 'Could not verify IUC number.'
      analytics.trackBillsVerifyFailed({
        bill_type: activeTab,
        verify_type: activeTab === 'electricity' ? 'meter' : 'iuc',
        error_message: message,
      })
      onUpdateCard(card.id, (current) => ({
        ...current,
        recipientVerified: false,
      }))
      setVerifyErrorByCard((prev) => ({ ...prev, [card.id]: message }))
      setVerifiedNameByCard((prev) => ({ ...prev, [card.id]: '' }))
    }
  }

  const openBeneficiaryPicker = (cardId: string) => {
    setSelectedBeneficiaryCardId(cardId)
    setBeneficiariesModalSession((prev) => prev + 1)
    setIsBeneficiariesModalOpen(true)
    analytics.trackBillsBeneficiaryPickerOpened({ bill_type: activeTab })
  }

  const getCardIdentifierSuggestions = (card: RecipientCard) => {
    const query = card.identifierValue.trim().toLowerCase()
    if (query.length < 2) return []

    const unique = new Set<string>()
    for (const beneficiary of beneficiaries) {
      const identifiers = getBeneficiaryIdentifiersForContext(
        activeTab,
        beneficiary
      )
      for (const identifier of identifiers) {
        if (identifier.toLowerCase().includes(query)) {
          unique.add(identifier)
        }
      }
    }
    return Array.from(unique).slice(0, 8)
  }

  const applyIdentifierSuggestion = (cardId: string, identifier: string) => {
    analytics.trackBillsIdentifierSuggestionSelected({ bill_type: activeTab })
    onUpdateCard(cardId, (current) => ({
      ...current,
      identifierValue: identifier,
      ...(activeTab === 'electricity' || activeTab === 'cable_tv'
        ? { recipientVerified: false }
        : {}),
    }))
    if (activeTab === 'electricity' || activeTab === 'cable_tv') {
      clearVerificationState(cardId)
    }
  }

  const applyBeneficiaryToCard = (beneficiary: GiftBillBeneficiary) => {
    const targetCardId = selectedBeneficiaryCardId || activeCards[0]?.id
    if (!targetCardId) return
    if (!activeCards.some((card) => card.id === targetCardId)) return

    const mapped = mapBeneficiaryToRecipient(activeTab, beneficiary)
    const identifier = mapped.identifierValue
    if (mapped.matchedBy === 'none' || !identifier) return
    const beneficiaryProvider = (beneficiary.provider || '').trim()
    const shouldApplyNetwork =
      (activeTab === 'airtime' || activeTab === 'data') &&
      beneficiaryProvider.length > 0

    analytics.trackBillsBeneficiarySelected({
      bill_type: activeTab,
      matched_by: mapped.matchedBy,
    })

    onUpdateCard(targetCardId, (current) => {
      const didNetworkChange =
        shouldApplyNetwork && current.network !== beneficiaryProvider

      return {
        ...current,
        identifierValue: identifier,
        ...(shouldApplyNetwork
          ? {
              network: beneficiaryProvider,
              ...(activeTab === 'data' && didNetworkChange
                ? { planCode: '', amount: '' }
                : {}),
            }
          : {}),
        ...(activeTab === 'electricity' || activeTab === 'cable_tv'
          ? { recipientVerified: false }
          : {}),
      }
    })

    if (activeTab === 'data' && shouldApplyNetwork) {
      void plansCatalog.ensureDataPlans(beneficiaryProvider)
    }

    if (activeTab === 'electricity' || activeTab === 'cable_tv') {
      clearVerificationState(targetCardId)
    }

    setIsBeneficiariesModalOpen(false)
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
                onOpenBeneficiaryPicker={openBeneficiaryPicker}
                onVerifyCard={handleVerifyCard}
                onClearVerificationState={clearVerificationState}
                onEnsureDataPlans={plansCatalog.ensureDataPlans}
                onEnsureCablePackages={plansCatalog.ensureCablePackages}
                getDataPlanAmount={plansCatalog.getDataPlanAmount}
                getCablePlanAmount={plansCatalog.getCablePlanAmount}
                identifierSuggestions={getCardIdentifierSuggestions(card)}
                onSelectIdentifierSuggestion={applyIdentifierSuggestion}
              />
            </div>
          )
        })}

        {/* <BillsQuickActions /> */}
      </div>

      <BillsBeneficiariesModal
        key={`beneficiaries-picker-${beneficiariesModalSession}`}
        isOpen={isBeneficiariesModalOpen}
        onClose={() => setIsBeneficiariesModalOpen(false)}
        onPickBeneficiary={applyBeneficiaryToCard}
        activeTab={activeTab}
      />
    </section>
  )
}

export default BillsBuilderSection
