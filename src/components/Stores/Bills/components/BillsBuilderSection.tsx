import { Plus, Trash2 } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import DatePickerField from '@/components/Gifts/CreateNewGiftPage/Components/DatePickerField'
import TimePickerField from '@/components/Gifts/CreateNewGiftPage/Components/TimePickerField'
import ShakeOnError from '@/components/common/ShakeOnError'
import {
  useAirtimeNetworks,
  useCableProviders,
  useDataNetworks,
  useElectricityDiscos,
  useGiftBillBeneficiaries,
} from '@/hooks/tanstack/bills'
import { BillsTabKey, METER_TYPES } from '../constants'
import { formatAmountDigits, formatTimingSummary } from '../models'
import { useBillsFlow } from '../context/BillsFlowContext'
import {
  mapAirtimeNetworkOptions,
  mapCableProviderOptions,
  mapDataNetworkOptions,
  mapElectricityDiscoOptions,
} from '../utils'

const EMPTY = '__none'
const QUICK_AMOUNTS: Record<BillsTabKey, number[]> = {
  airtime: [500, 1000, 2000, 5000],
  data: [1000, 1500, 2000, 5000],
  electricity: [2000, 5000, 10000, 20000],
  cable_tv: [2500, 3500, 5000, 10000],
}

const InlineError = ({ message }: { message?: string }) =>
  message ? (
    <ShakeOnError active={true}>
      <p className='text-xs text-error-600 mt-1'>{message}</p>
    </ShakeOnError>
  ) : null

const extractRecentBeneficiaries = (payload: unknown): string[] => {
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

const BillsBuilderSection = () => {
  const {
    activeTab,
    activeCards,
    cardErrors,
    showValidationErrors,
    recipientRefs,
    verifyErrorByCard,
    verifiedNameByCard,
    isActionBusy,
    isVerifyingElectricity,
    isVerifyingCable,
    onUpdateCard,
    onRemoveRecipientCard,
    onAddRecipientCard,
    onEnsureDataPlans,
    onEnsureCablePackages,
    getDataPlanOptions,
    getCablePackageOptions,
    getDataPlanAmount,
    getCablePlanAmount,
    onSetVerifyError,
    onSetVerifiedName,
    onHandleVerifyCard,
    onApplyQuickRecipient,
  } = useBillsFlow()
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
    onSetVerifyError(cardId, '')
    onSetVerifiedName(cardId, '')
  }

  return (
    <section className='space-y-4'>
      <div className='rounded-xl border border-grey-100 bg-white p-4 lg:p-5 space-y-4'>
        {activeCards.map((card, index) => {
          const cardError = cardErrors[index]
          const visibleCardError = showValidationErrors ? cardError : null
          const isTag = card.sendAsGift && card.identifierValue.trim().startsWith('@')
          const planOptions =
            activeTab === 'data'
              ? getDataPlanOptions(card.network)
              : activeTab === 'cable_tv'
              ? getCablePackageOptions(card.provider)
              : []

          return (
            <div
              key={card.id}
              ref={(node) => {
                recipientRefs.current[card.id] = node
              }}
              className='rounded-xl border border-grey-100 bg-white p-4 space-y-3'
            >
              {activeCards.length > 1 && (
                <div className='flex items-center justify-between gap-3 min-h-8'>
                  <p className='text-sm font-semibold text-grey-900'>
                    Recipient {index + 1}
                  </p>

                  <button
                    type='button'
                    onClick={() => onRemoveRecipientCard(card.id)}
                    className='h-8 w-8 rounded-lg border border-grey-200 text-grey-600 hover:bg-grey-50 flex items-center justify-center'
                    aria-label='Remove recipient'
                  >
                    <Trash2 className='h-4 w-4' />
                  </button>
                </div>
              )}
              {activeTab === 'airtime' || activeTab === 'data' ? (
                <div className='space-y-1.5'>
                  <p className='text-xs font-medium text-grey-700'>Network</p>
                  <div className='flex flex-wrap gap-2'>
                    {(activeTab === 'airtime' ? airtimeOptions : dataNetworkOptions).map(
                      (option) => (
                        <button
                          key={option.value}
                          type='button'
                          onClick={() => {
                            onUpdateCard(card.id, (current) => ({
                              ...current,
                              network: option.value,
                              ...(activeTab === 'data'
                                ? { planCode: '', amount: '' }
                                : {}),
                            }))
                            if (activeTab === 'data') {
                              void onEnsureDataPlans(option.value)
                            }
                          }}
                          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                            card.network === option.value
                              ? 'border-primary-500 text-primary-700'
                              : 'border-grey-200 text-grey-700 hover:border-primary-200 hover:text-primary-600'
                          }`}
                        >
                          {option.label}
                        </button>
                      )
                    )}
                  </div>
                  {visibleCardError?.field === 'network' ? (
                    <InlineError message={visibleCardError.message} />
                  ) : null}
                </div>
              ) : null}
              {activeTab === 'electricity' ? (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                  <div className='space-y-1.5'>
                    <p className='text-xs font-medium text-grey-700'>Disco</p>
                    <Select
                      value={card.provider || EMPTY}
                      onValueChange={(value) => {
                        onUpdateCard(card.id, (current) => ({
                          ...current,
                          provider: value === EMPTY ? '' : value,
                          recipientVerified: false,
                        }))
                        clearVerificationState(card.id)
                      }}
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select disco' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={EMPTY}>Select disco</SelectItem>
                        {electricityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {visibleCardError?.field === 'provider' ? (
                      <InlineError message={visibleCardError.message} />
                    ) : null}
                  </div>

                  <div className='space-y-1.5'>
                    <p className='text-xs font-medium text-grey-700'>Meter Type</p>
                    <Select
                      value={card.meterType}
                      onValueChange={(value: 'prepaid' | 'postpaid') => {
                        onUpdateCard(card.id, (current) => ({
                          ...current,
                          meterType: value,
                          recipientVerified: false,
                        }))
                        clearVerificationState(card.id)
                      }}
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select meter type' />
                      </SelectTrigger>
                      <SelectContent>
                        {METER_TYPES.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : null}
              {activeTab === 'cable_tv' ? (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                  <div className='space-y-1.5'>
                    <p className='text-xs font-medium text-grey-700'>Provider</p>
                    <Select
                      value={card.provider || EMPTY}
                      onValueChange={(value) => {
                        const next = value === EMPTY ? '' : value
                        onUpdateCard(card.id, (current) => ({
                          ...current,
                          provider: next,
                          planCode: '',
                          recipientVerified: false,
                        }))
                        clearVerificationState(card.id)
                        if (next) {
                          void onEnsureCablePackages(next)
                        }
                      }}
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select provider' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={EMPTY}>Select provider</SelectItem>
                        {cableProviderOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {visibleCardError?.field === 'provider' ? (
                      <InlineError message={visibleCardError.message} />
                    ) : null}
                  </div>

                  <div className='space-y-1.5'>
                    <p className='text-xs font-medium text-grey-700'>Package</p>
                    <Select
                      value={card.planCode || EMPTY}
                      onValueChange={(value) => {
                        onUpdateCard(card.id, (current) => ({
                          ...current,
                          planCode: value === EMPTY ? '' : value,
                          amount:
                            value !== EMPTY && getCablePlanAmount(current.provider, value)
                              ? String(getCablePlanAmount(current.provider, value))
                              : current.amount,
                          recipientVerified: false,
                        }))
                        clearVerificationState(card.id)
                      }}
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select package' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={EMPTY}>Select package</SelectItem>
                        {planOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {visibleCardError?.field === 'planCode' ? (
                      <InlineError message={visibleCardError.message} />
                    ) : null}
                  </div>
                </div>
              ) : null}
              {activeTab === 'data' ? (
                <div className='space-y-1.5'>
                  <p className='text-xs font-medium text-grey-700'>Plan</p>
                  <Select
                    value={card.planCode || EMPTY}
                    onValueChange={(value) =>
                      onUpdateCard(card.id, (current) => ({
                        ...current,
                        planCode: value === EMPTY ? '' : value,
                        amount:
                          value !== EMPTY && getDataPlanAmount(current.network, value)
                            ? String(getDataPlanAmount(current.network, value))
                            : '',
                      }))
                    }
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select plan' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={EMPTY}>Select plan</SelectItem>
                      {planOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {visibleCardError?.field === 'planCode' ? (
                    <InlineError message={visibleCardError.message} />
                  ) : null}
                </div>
              ) : null}
              <div className='space-x-1.5 flex items-center'>
                <p className='text-xs font-medium text-grey-700'>Send as gift</p>
                <div className='flex items-center justify-between'>
                  <Switch
                    checked={card.sendAsGift}
                    onCheckedChange={(checked) => {
                      onUpdateCard(card.id, (current) => ({
                        ...current,
                        sendAsGift: checked,
                        recipientVerified: false,
                      }))
                      clearVerificationState(card.id)
                    }}
                    className='data-[state=checked]:bg-primary-500 data-[state=unchecked]:bg-grey-200'
                  />
                </div>
              </div>
              <div className='space-y-1.5'>
                <p className='text-xs font-medium text-grey-700'>
                  {activeTab === 'electricity'
                    ? card.sendAsGift
                      ? 'Meter Number or @Giftseon Tag'
                      : 'Meter Number'
                    : activeTab === 'cable_tv'
                    ? card.sendAsGift
                      ? 'IUC Number or @Giftseon Tag'
                      : 'IUC Number'
                    : card.sendAsGift
                    ? 'Phone Number or @Giftseon Tag'
                    : 'Phone Number'}
                </p>
                <input
                  type='text'
                  value={card.identifierValue}
                  onChange={(event) => {
                    onUpdateCard(card.id, (current) => ({
                      ...current,
                      identifierValue: event.target.value,
                      selfTagError: undefined,
                      ...(activeTab === 'electricity' || activeTab === 'cable_tv'
                        ? { recipientVerified: false }
                        : {}),
                    }))
                    if (activeTab === 'electricity' || activeTab === 'cable_tv') {
                      clearVerificationState(card.id)
                    }
                  }}
                  placeholder={
                    activeTab === 'electricity'
                      ? card.sendAsGift
                        ? 'Enter meter number or @giftseonTag'
                        : 'Enter meter number'
                      : activeTab === 'cable_tv'
                      ? card.sendAsGift
                        ? 'Enter IUC number or @giftseonTag'
                        : 'Enter IUC number'
                      : card.sendAsGift
                      ? 'Enter phone number or @giftseonTag'
                      : 'e.g. 08012345678'
                  }
                  className={`w-full px-3 py-3 border rounded-xl text-sm text-grey-800 placeholder:text-grey-500 bg-white focus:outline-none focus:ring-1 focus:ring-primary-300 ${
                    verifyErrorByCard[card.id] || visibleCardError?.field === 'identifierValue'
                      ? 'border-error-300'
                      : 'border-grey-50'
                  }`}
                />
                {verifyErrorByCard[card.id] || visibleCardError?.field === 'identifierValue' ? (
                  <InlineError
                    message={verifyErrorByCard[card.id] || visibleCardError?.message}
                  />
                ) : null}
                {(activeTab === 'electricity' || activeTab === 'cable_tv') && !isTag ? (
                  <div className='flex items-center justify-between gap-3 mt-2'>
                    {card.recipientVerified ? (
                      <span className='text-xs font-medium text-success-600'>
                        {verifiedNameByCard[card.id] || 'Verified'}
                      </span>
                    ) : (
                      <button
                        type='button'
                        onClick={() => void onHandleVerifyCard(card)}
                        disabled={isActionBusy || !card.identifierValue.trim() || !card.provider}
                        className='text-xs font-medium text-primary-600 hover:text-primary-700 disabled:opacity-50 disabled:cursor-not-allowed'
                      >
                        {activeTab === 'electricity'
                          ? isVerifyingElectricity
                            ? 'Verifying...'
                            : 'Verify meter'
                          : isVerifyingCable
                          ? 'Verifying...'
                          : 'Verify IUC'}
                      </button>
                    )}
                  </div>
                ) : null}
              </div>
              <div className='space-y-1.5'>
                <p className='text-xs font-medium text-grey-700'>Amount</p>
                <input
                  type='text'
                  value={formatAmountDigits(card.amount)}
                  onChange={
                    activeTab === 'data' || activeTab === 'cable_tv'
                      ? undefined
                      : (event) =>
                          onUpdateCard(card.id, (current) => ({
                            ...current,
                            amount: event.target.value.replace(/\D/g, ''),
                          }))
                  }
                  readOnly={activeTab === 'data' || activeTab === 'cable_tv'}
                  inputMode='numeric'
                  placeholder={
                    activeTab === 'airtime' || activeTab === 'electricity'
                      ? 'e.g. 1000'
                      : '0'
                  }
                  className='w-full px-3 py-3 border border-grey-50 rounded-xl text-sm text-grey-800 placeholder:text-grey-500 bg-white focus:outline-none focus:ring-1 focus:ring-primary-300 read-only:bg-grey-50 read-only:text-grey-600'
                />
                {visibleCardError?.field === 'amount' ? (
                  <InlineError message={visibleCardError.message} />
                ) : null}
                {activeTab === 'airtime' || activeTab === 'electricity' ? (
                  <div className='flex flex-wrap gap-2'>
                    {QUICK_AMOUNTS[activeTab].map((quick) => (
                      <button
                        key={quick}
                        type='button'
                        onClick={() =>
                          onUpdateCard(card.id, (current) => ({
                            ...current,
                            amount: String(quick),
                          }))
                        }
                        className='rounded-full border border-grey-200 bg-white px-2.5 py-1 text-xs font-medium text-grey-700 hover:border-primary-200 hover:text-primary-600 transition'
                      >
                        {quick.toLocaleString()}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
              {card.sendAsGift ? (
                <div className='space-y-3 bg-white'>
                  <div className='flex items-center gap-2'>
                    <Checkbox
                      id={`anonymous-${card.id}`}
                      checked={card.isAnonymous}
                      onCheckedChange={(checked) =>
                        onUpdateCard(card.id, (current) => ({
                          ...current,
                          isAnonymous: Boolean(checked),
                        }))
                      }
                      className='data-[state=checked]:bg-primary-500 data-[state=checked]:border-primary-500 data-[state=indeterminate]:bg-primary-500 data-[state=indeterminate]:border-primary-500 focus-visible:ring-primary-200/60'
                    />
                    <label
                      htmlFor={`anonymous-${card.id}`}
                      className='text-sm text-grey-700 cursor-pointer'
                    >
                      Send anonymously
                    </label>
                  </div>

                  {!card.isAnonymous && !isTag ? (
                    <>
                      <p className='text-xs text-grey-600'>Notify recipient via</p>
                      <div className='flex flex-wrap gap-4'>
                        <label className='inline-flex items-center gap-2 text-sm text-grey-700'>
                          <Checkbox
                            checked={card.notifySms}
                            onCheckedChange={(checked) =>
                              onUpdateCard(card.id, (current) => ({
                                ...current,
                                notifySms: Boolean(checked),
                              }))
                            }
                            className='data-[state=checked]:bg-primary-500 data-[state=checked]:border-primary-500 data-[state=indeterminate]:bg-primary-500 data-[state=indeterminate]:border-primary-500 focus-visible:ring-primary-200/60'
                          />
                          SMS
                        </label>
                        <label className='inline-flex items-center gap-2 text-sm text-grey-700'>
                          <Checkbox
                            checked={card.notifyEmail}
                            onCheckedChange={(checked) =>
                              onUpdateCard(card.id, (current) => ({
                                ...current,
                                notifyEmail: Boolean(checked),
                              }))
                            }
                            className='data-[state=checked]:bg-primary-500 data-[state=checked]:border-primary-500 data-[state=indeterminate]:bg-primary-500 data-[state=indeterminate]:border-primary-500 focus-visible:ring-primary-200/60'
                          />
                          Email
                        </label>
                      </div>
                      {visibleCardError?.field === 'notifyMethod' ? (
                        <InlineError message={visibleCardError.message} />
                      ) : null}

                      {card.notifySms ? (
                        <div className='space-y-1.5'>
                          <p className='text-xs font-medium text-grey-700'>
                            Notification Phone
                          </p>
                          <input
                            type='text'
                            value={card.notificationPhone}
                            onChange={(event) =>
                              onUpdateCard(card.id, (current) => ({
                                ...current,
                                notificationPhone: event.target.value,
                              }))
                            }
                            placeholder='e.g. 08012345678'
                            className='w-full px-3 py-3 border border-grey-50 rounded-xl text-sm text-grey-800 placeholder:text-grey-500 bg-white focus:outline-none focus:ring-1 focus:ring-primary-300'
                          />
                          {visibleCardError?.field === 'notificationPhone' ? (
                            <InlineError message={visibleCardError.message} />
                          ) : null}
                        </div>
                      ) : null}

                      {card.notifyEmail ? (
                        <div className='space-y-1.5'>
                          <p className='text-xs font-medium text-grey-700'>
                            Notification Email
                          </p>
                          <input
                            type='email'
                            value={card.notificationEmail}
                            onChange={(event) =>
                              onUpdateCard(card.id, (current) => ({
                                ...current,
                                notificationEmail: event.target.value,
                              }))
                            }
                            placeholder='e.g. name@email.com'
                            className='w-full px-3 py-3 border border-grey-50 rounded-xl text-sm text-grey-800 placeholder:text-grey-500 bg-white focus:outline-none focus:ring-1 focus:ring-primary-300'
                          />
                          {visibleCardError?.field === 'notificationEmail' ? (
                            <InlineError message={visibleCardError.message} />
                          ) : null}
                        </div>
                      ) : null}
                    </>
                  ) : null}

                  {!card.isAnonymous ? (
                    <>
                      <div className='space-y-1.5'>
                        <p className='text-xs font-medium text-grey-700'>
                          Recipient Name (optional)
                        </p>
                        <input
                          type='text'
                          value={card.recipientName}
                          onChange={(event) =>
                            onUpdateCard(card.id, (current) => ({
                              ...current,
                              recipientName: event.target.value,
                            }))
                          }
                          placeholder='e.g. Adeola'
                          className='w-full px-3 py-3 border border-grey-50 rounded-xl text-sm text-grey-800 placeholder:text-grey-500 bg-white focus:outline-none focus:ring-1 focus:ring-primary-300'
                        />
                      </div>

                      <div className='space-y-1.5'>
                        <p className='text-xs font-medium text-grey-700'>Sender Note (optional)</p>
                        <textarea
                          value={card.senderNote}
                          onChange={(event) =>
                            onUpdateCard(card.id, (current) => ({
                              ...current,
                              senderNote: event.target.value,
                            }))
                          }
                          className='w-full min-h-[80px] px-3 py-3 border border-grey-50 rounded-xl text-sm text-grey-800 placeholder:text-grey-500 bg-white focus:outline-none focus:ring-1 focus:ring-primary-300 resize-none'
                          placeholder='Write a note...'
                        />
                      </div>
                    </>
                  ) : null}
                </div>
              ) : null}
              <div className='space-y-2 border-t border-grey-100 pt-3'>
                <div className='flex items-center justify-between gap-3'>
                  <p className='text-xs font-medium text-grey-700'>Timing</p>
                  {card.timingMode === 'instant' ? (
                    <span className='text-xs text-grey-500'>Instant</span>
                  ) : (
                    <button
                      type='button'
                      onClick={() =>
                        onUpdateCard(card.id, (current) => ({
                          ...current,
                          timingMode: 'instant',
                          scheduledDate: undefined,
                          scheduledTime: '',
                          recurringEndDate: undefined,
                        }))
                      }
                      className='text-xs font-medium text-primary-600 hover:text-primary-700'
                    >
                      Reset to instant
                    </button>
                  )}
                </div>

                {card.timingMode === 'instant' ? (
                  <div className='flex flex-wrap gap-2'>
                    <button
                      type='button'
                      onClick={() =>
                        onUpdateCard(card.id, (current) => ({
                          ...current,
                          timingMode: 'scheduled',
                        }))
                      }
                      className='h-8 px-3 rounded-lg border border-grey-200 text-grey-700 text-xs font-medium hover:bg-grey-50'
                    >
                      Schedule
                    </button>
                    <button
                      type='button'
                      onClick={() =>
                        onUpdateCard(card.id, (current) => ({
                          ...current,
                          timingMode: 'recurring',
                        }))
                      }
                      className='h-8 px-3 rounded-lg border border-grey-200 text-grey-700 text-xs font-medium hover:bg-grey-50'
                    >
                      Recurring
                    </button>
                  </div>
                ) : (
                  <div className='flex flex-wrap gap-2'>
                    {card.timingMode === 'scheduled' ? (
                      <button
                        type='button'
                        onClick={() =>
                          onUpdateCard(card.id, (current) => ({
                            ...current,
                            timingMode: 'recurring',
                          }))
                        }
                        className='h-8 px-3 rounded-lg border border-grey-200 text-grey-700 text-xs font-medium hover:bg-grey-50'
                      >
                        Switch to recurring
                      </button>
                    ) : (
                      <button
                        type='button'
                        onClick={() =>
                          onUpdateCard(card.id, (current) => ({
                            ...current,
                            timingMode: 'scheduled',
                          }))
                        }
                        className='h-8 px-3 rounded-lg border border-grey-200 text-grey-700 text-xs font-medium hover:bg-grey-50'
                      >
                        Switch to schedule
                      </button>
                    )}
                  </div>
                )}

                {card.timingMode !== 'instant' ? (
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                    <DatePickerField
                      label={card.timingMode === 'recurring' ? 'Start date' : 'Date'}
                      value={card.scheduledDate}
                      onChange={(value) =>
                        onUpdateCard(card.id, (current) => ({
                          ...current,
                          scheduledDate: value,
                        }))
                      }
                      minDate={new Date()}
                    />
                    <TimePickerField
                      label='Time'
                      value={card.scheduledTime}
                      onChange={(value) =>
                        onUpdateCard(card.id, (current) => ({
                          ...current,
                          scheduledTime: value,
                        }))
                      }
                    />
                  </div>
                ) : null}
                {visibleCardError?.field === 'scheduledDateTime' ? (
                  <InlineError message={visibleCardError.message} />
                ) : null}

                {card.timingMode === 'recurring' ? (
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                    <div className='space-y-1.5'>
                      <p className='text-xs font-medium text-grey-700'>Frequency</p>
                      <Select
                        value={card.recurringFrequency}
                        onValueChange={(value: 'daily' | 'weekly' | 'monthly') =>
                          onUpdateCard(card.id, (current) => ({
                            ...current,
                            recurringFrequency: value,
                          }))
                        }
                      >
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Select frequency' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='daily'>Daily</SelectItem>
                          <SelectItem value='weekly'>Weekly</SelectItem>
                          <SelectItem value='monthly'>Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className='space-y-1.5'>
                      <p className='text-xs font-medium text-grey-700'>End condition</p>
                      <Select
                        value={card.recurringEndType}
                        onValueChange={(value: 'never' | 'date') =>
                          onUpdateCard(card.id, (current) => ({
                            ...current,
                            recurringEndType: value,
                          }))
                        }
                      >
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Select end condition' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='never'>Never</SelectItem>
                          <SelectItem value='date'>End date</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {card.recurringEndType === 'date' ? (
                      <div>
                        <DatePickerField
                          label='End date'
                          value={card.recurringEndDate}
                          onChange={(value) =>
                            onUpdateCard(card.id, (current) => ({
                              ...current,
                              recurringEndDate: value,
                            }))
                          }
                          minDate={card.scheduledDate ?? new Date()}
                        />
                        {visibleCardError?.field === 'recurringEndDate' ? (
                          <InlineError message={visibleCardError.message} />
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {card.timingMode !== 'instant' ? (
                  <p className='text-xs font-medium text-grey-700 bg-grey-100 rounded-lg px-2 py-1 inline-flex'>
                    {formatTimingSummary(card)}
                  </p>
                ) : null}
              </div>
            </div>
          )
        })}

        <div className='flex justify-end'>
          <button
            type='button'
            onClick={onAddRecipientCard}
            className='h-9 px-3 rounded-lg border border-grey-200 text-grey-700 bg-white hover:bg-grey-50 inline-flex items-center justify-center gap-2 text-sm font-medium'
          >
            <Plus className='h-4 w-4' />
            Add new recipient
          </button>
        </div>

        {recentBeneficiaries.length > 0 ? (
          <div className='space-y-2'>
            <p className='text-xs font-medium text-grey-700'>Quick actions</p>
            <div className='flex flex-wrap gap-2'>
              {recentBeneficiaries.map((item) => (
                <button
                  key={item}
                  type='button'
                  onClick={() => onApplyQuickRecipient(item.startsWith('@') ? item : item)}
                  className='rounded-full border border-grey-200 bg-white px-3 py-1.5 text-xs text-grey-700 hover:border-primary-200 hover:text-primary-600'
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default BillsBuilderSection
