import { FormEvent, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { METER_TYPES } from '../../constants'
import { SelectOption } from '../../utils'

type ElectricityTabFormProps = {
  electricityProvider: string
  setElectricityProvider: (value: string) => void
  electricityMeter: string
  setElectricityMeter: (value: string) => void
  electricityMeterType: 'prepaid' | 'postpaid'
  setElectricityMeterType: (value: 'prepaid' | 'postpaid') => void
  electricityAmount: string
  setElectricityAmount: (value: string) => void
  identifierMode: 'direct' | 'tag'
  setIdentifierMode: (mode: 'direct' | 'tag') => void
  electricityPhone: string
  setElectricityPhone: (value: string) => void
  electricityOptions: SelectOption[]
  giftOptionsFields: ReactNode
  sendAsGift: boolean
  canSendGift: boolean
  isBusy: boolean
  onPayElectricity: (event: FormEvent<HTMLFormElement>) => Promise<void>
  onVerifyElectricity: () => Promise<void>
  verifyElectricityPending: boolean
  payElectricityPending: boolean
  sendGiftPending: boolean
  ctaLabel: string
}

const EMPTY = '__none'

const formatAmountDigits = (value: string) => {
  if (!value) return ''
  const numeric = value.replace(/\D/g, '')
  if (!numeric) return ''
  return Number(numeric).toLocaleString('en-US')
}

const ElectricityTabForm = ({
  electricityProvider,
  setElectricityProvider,
  electricityMeter,
  setElectricityMeter,
  electricityMeterType,
  setElectricityMeterType,
  electricityAmount,
  setElectricityAmount,
  identifierMode,
  setIdentifierMode,
  electricityPhone,
  setElectricityPhone,
  electricityOptions,
  giftOptionsFields,
  sendAsGift,
  canSendGift,
  isBusy,
  onPayElectricity,
  onVerifyElectricity,
  verifyElectricityPending,
  payElectricityPending,
  sendGiftPending,
  ctaLabel,
}: ElectricityTabFormProps) => {
  return (
    <form className='grid gap-3' onSubmit={onPayElectricity}>
      <div className='space-y-1.5'>
        <p className='text-xs font-medium text-grey-700'>Disco</p>
        <Select
          value={electricityProvider || EMPTY}
          onValueChange={(value) => setElectricityProvider(value === EMPTY ? '' : value)}
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
      </div>

      {sendAsGift ? (
        <div className='space-y-1.5'>
          <p className='text-xs font-medium text-grey-700'>Recipient Type</p>
          <div className='rounded-xl border border-grey-100 bg-grey-50/30 p-1 grid grid-cols-2 gap-1'>
            <button
              type='button'
              onClick={() => setIdentifierMode('direct')}
              className={`h-9 rounded-lg text-xs font-medium transition ${
                identifierMode === 'direct'
                  ? 'bg-white text-grey-900 shadow-sm'
                  : 'text-grey-600'
              }`}
            >
              Meter Number
            </button>
            <button
              type='button'
              onClick={() => setIdentifierMode('tag')}
              className={`h-9 rounded-lg text-xs font-medium transition ${
                identifierMode === 'tag'
                  ? 'bg-white text-grey-900 shadow-sm'
                  : 'text-grey-600'
              }`}
            >
              Giftseon Tag
            </button>
          </div>
        </div>
      ) : null}

      <div className='space-y-1.5'>
        <p className='text-xs font-medium text-grey-700'>
          {sendAsGift && identifierMode === 'tag' ? 'Giftseon Tag' : 'Meter Number'}
        </p>
        <input
          type='text'
          value={electricityMeter}
          onChange={(event) => setElectricityMeter(event.target.value)}
          placeholder={
            sendAsGift && identifierMode === 'tag'
              ? 'e.g. johndoe'
              : 'Enter meter number'
          }
          className='w-full px-3 py-3 border border-grey-50 rounded-xl text-sm text-grey-800 placeholder:text-grey-500 bg-white focus:outline-none focus:ring-1 focus:ring-primary-300'
        />
      </div>

      <div className='space-y-1.5'>
        <p className='text-xs font-medium text-grey-700'>Meter Type</p>
        <Select
          value={electricityMeterType}
          onValueChange={(value: 'prepaid' | 'postpaid') => setElectricityMeterType(value)}
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

      <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
        <div className='space-y-1.5'>
          <p className='text-xs font-medium text-grey-700'>Amount</p>
          <input
            type='text'
            value={formatAmountDigits(electricityAmount)}
            onChange={(event) =>
              setElectricityAmount(event.target.value.replace(/\D/g, ''))
            }
            inputMode='numeric'
            placeholder='e.g. 5000'
            className='w-full px-3 py-3 border border-grey-50 rounded-xl text-sm text-grey-800 placeholder:text-grey-500 bg-white focus:outline-none focus:ring-1 focus:ring-primary-300'
          />
        </div>
        <div className='space-y-1.5'>
          <p className='text-xs font-medium text-grey-700'>Phone Number</p>
          <input
            type='text'
            value={electricityPhone}
            onChange={(event) => setElectricityPhone(event.target.value)}
            placeholder='e.g. 08012345678'
            className='w-full px-3 py-3 border border-grey-50 rounded-xl text-sm text-grey-800 placeholder:text-grey-500 bg-white focus:outline-none focus:ring-1 focus:ring-primary-300'
          />
        </div>
      </div>

      <div className='flex flex-wrap gap-2'>
        {[2000, 5000, 10000, 20000].map((value) => (
          <button
            key={value}
            type='button'
            onClick={() => setElectricityAmount(String(value))}
            className='rounded-full border border-grey-200 bg-white px-2.5 py-1 text-xs font-medium text-grey-700 hover:border-primary-200 hover:text-primary-600 transition'
          >
            {value.toLocaleString()}
          </button>
        ))}
      </div>

      {giftOptionsFields}

      <div className='flex flex-col sm:flex-row gap-2 pt-1'>
        {!sendAsGift || identifierMode === 'direct' ? (
          <button
            type='button'
            disabled={isBusy || !electricityMeter || !electricityProvider}
            onClick={onVerifyElectricity}
            className='h-11 px-4 rounded-xl text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed bg-white text-grey-800 border border-grey-200 hover:bg-grey-50 sm:min-w-[140px]'
          >
            {verifyElectricityPending ? (
              <span className='inline-flex items-center gap-2'>
                <Loader2 className='h-4 w-4 animate-spin' />
                Verifying...
              </span>
            ) : (
              'Verify Meter'
            )}
          </button>
        ) : null}

        <button
          type='submit'
          disabled={
            sendAsGift
              ? !canSendGift || isBusy
              : isBusy ||
                !electricityProvider ||
                !electricityMeter ||
                !electricityAmount ||
                !electricityPhone
          }
          className='h-11 px-4 rounded-xl text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed bg-primary-500 text-white hover:bg-primary-600 sm:min-w-[140px]'
        >
          {sendAsGift && sendGiftPending ? (
            <span className='inline-flex items-center gap-2'>
              <Loader2 className='h-4 w-4 animate-spin' />
              Sending...
            </span>
          ) : payElectricityPending ? (
            <span className='inline-flex items-center gap-2'>
              <Loader2 className='h-4 w-4 animate-spin' />
              Processing...
            </span>
          ) : sendAsGift ? (
            'Send Gift Bill'
          ) : (
            ctaLabel
          )}
        </button>
      </div>
    </form>
  )
}

export default ElectricityTabForm
