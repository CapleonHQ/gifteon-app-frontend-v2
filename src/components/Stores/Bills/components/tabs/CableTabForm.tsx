import { FormEvent, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SelectOption } from '../../utils'

type CableTabFormProps = {
  cableProvider: string
  setCableProvider: (value: string) => void
  cablePackage: string
  setCablePackage: (value: string) => void
  cableIuc: string
  setCableIuc: (value: string) => void
  cableAmount: string
  setCableAmount: (value: string) => void
  identifierMode: 'direct' | 'tag'
  setIdentifierMode: (mode: 'direct' | 'tag') => void
  cablePhone: string
  setCablePhone: (value: string) => void
  cableProviderOptions: SelectOption[]
  cablePackageOptions: SelectOption[]
  giftOptionsFields: ReactNode
  sendAsGift: boolean
  canSendGift: boolean
  isBusy: boolean
  onSubscribeCable: (event: FormEvent<HTMLFormElement>) => Promise<void>
  onVerifyCable: () => Promise<void>
  verifyCablePending: boolean
  subscribeCablePending: boolean
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

const CableTabForm = ({
  cableProvider,
  setCableProvider,
  cablePackage,
  setCablePackage,
  cableIuc,
  setCableIuc,
  cableAmount,
  setCableAmount,
  identifierMode,
  setIdentifierMode,
  cablePhone,
  setCablePhone,
  cableProviderOptions,
  cablePackageOptions,
  giftOptionsFields,
  sendAsGift,
  canSendGift,
  isBusy,
  onSubscribeCable,
  onVerifyCable,
  verifyCablePending,
  subscribeCablePending,
  sendGiftPending,
  ctaLabel,
}: CableTabFormProps) => {
  return (
    <form className='grid gap-3' onSubmit={onSubscribeCable}>
      <div className='space-y-1.5'>
        <p className='text-xs font-medium text-grey-700'>Provider</p>
        <Select
          value={cableProvider || EMPTY}
          onValueChange={(value) => {
            const next = value === EMPTY ? '' : value
            setCableProvider(next)
            setCablePackage('')
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
      </div>

      <div className='space-y-1.5'>
        <p className='text-xs font-medium text-grey-700'>Package</p>
        <Select value={cablePackage || EMPTY} onValueChange={(value) => setCablePackage(value === EMPTY ? '' : value)}>
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Select package' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={EMPTY}>Select package</SelectItem>
            {cablePackageOptions.map((option) => (
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
              IUC Number
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
          {sendAsGift && identifierMode === 'tag' ? 'Giftseon Tag' : 'IUC Number'}
        </p>
        <input
          type='text'
          value={cableIuc}
          onChange={(event) => setCableIuc(event.target.value)}
          placeholder={
            sendAsGift && identifierMode === 'tag'
              ? 'e.g. johndoe'
              : 'Enter IUC number'
          }
          className='w-full px-3 py-3 border border-grey-50 rounded-xl text-sm text-grey-800 placeholder:text-grey-500 bg-white focus:outline-none focus:ring-1 focus:ring-primary-300'
        />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
        <div className='space-y-1.5'>
          <p className='text-xs font-medium text-grey-700'>Amount</p>
          <input
            type='text'
            value={formatAmountDigits(cableAmount)}
            onChange={(event) => setCableAmount(event.target.value.replace(/\D/g, ''))}
            inputMode='numeric'
            placeholder='e.g. 3500'
            className='w-full px-3 py-3 border border-grey-50 rounded-xl text-sm text-grey-800 placeholder:text-grey-500 bg-white focus:outline-none focus:ring-1 focus:ring-primary-300'
          />
        </div>
        <div className='space-y-1.5'>
          <p className='text-xs font-medium text-grey-700'>Phone Number</p>
          <input
            type='text'
            value={cablePhone}
            onChange={(event) => setCablePhone(event.target.value)}
            placeholder='e.g. 08012345678'
            className='w-full px-3 py-3 border border-grey-50 rounded-xl text-sm text-grey-800 placeholder:text-grey-500 bg-white focus:outline-none focus:ring-1 focus:ring-primary-300'
          />
        </div>
      </div>

      <div className='flex flex-wrap gap-2'>
        {[2500, 3500, 5000, 10000].map((value) => (
          <button
            key={value}
            type='button'
            onClick={() => setCableAmount(String(value))}
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
            disabled={isBusy || !cableProvider || !cableIuc}
            onClick={onVerifyCable}
            className='h-11 px-4 rounded-xl text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed bg-white text-grey-800 border border-grey-200 hover:bg-grey-50 sm:min-w-[160px]'
          >
            {verifyCablePending ? (
              <span className='inline-flex items-center gap-2'>
                <Loader2 className='h-4 w-4 animate-spin' />
                Verifying...
              </span>
            ) : (
              'Verify Account'
            )}
          </button>
        ) : null}

        <button
          type='submit'
          disabled={
            sendAsGift
              ? !canSendGift || isBusy
              : isBusy ||
                !cableProvider ||
                !cablePackage ||
                !cableIuc ||
                !cableAmount ||
                !cablePhone
          }
          className='h-11 px-4 rounded-xl text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed bg-primary-500 text-white hover:bg-primary-600 sm:min-w-[140px]'
        >
          {sendAsGift && sendGiftPending ? (
            <span className='inline-flex items-center gap-2'>
              <Loader2 className='h-4 w-4 animate-spin' />
              Sending...
            </span>
          ) : subscribeCablePending ? (
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

export default CableTabForm
