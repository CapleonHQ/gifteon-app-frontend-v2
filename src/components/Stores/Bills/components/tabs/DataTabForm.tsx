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

type DataTabFormProps = {
  dataNetwork: string
  setDataNetwork: (value: string) => void
  dataPlan: string
  setDataPlan: (value: string) => void
  dataPhone: string
  setDataPhone: (value: string) => void
  dataAmount: string
  setDataAmount: (value: string) => void
  identifierMode: 'direct' | 'tag'
  setIdentifierMode: (mode: 'direct' | 'tag') => void
  dataNetworkOptions: SelectOption[]
  dataPlanOptions: SelectOption[]
  giftOptionsFields: ReactNode
  sendAsGift: boolean
  canSendGift: boolean
  isBusy: boolean
  onBuyData: (event: FormEvent<HTMLFormElement>) => Promise<void>
  buyDataPending: boolean
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

const DataTabForm = ({
  dataNetwork,
  setDataNetwork,
  dataPlan,
  setDataPlan,
  dataPhone,
  setDataPhone,
  dataAmount,
  setDataAmount,
  identifierMode,
  setIdentifierMode,
  dataNetworkOptions,
  dataPlanOptions,
  giftOptionsFields,
  sendAsGift,
  canSendGift,
  isBusy,
  onBuyData,
  buyDataPending,
  sendGiftPending,
  ctaLabel,
}: DataTabFormProps) => {
  return (
    <form className='grid gap-3' onSubmit={onBuyData}>
      <div className='space-y-1.5'>
        <p className='text-xs font-medium text-grey-700'>Network</p>
        <Select
          value={dataNetwork || EMPTY}
          onValueChange={(value) => {
            const next = value === EMPTY ? '' : value
            setDataNetwork(next)
            setDataPlan('')
          }}
        >
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Select network' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={EMPTY}>Select network</SelectItem>
            {dataNetworkOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-1.5'>
        <p className='text-xs font-medium text-grey-700'>Plan</p>
        <Select value={dataPlan || EMPTY} onValueChange={(value) => setDataPlan(value === EMPTY ? '' : value)}>
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Select plan' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={EMPTY}>Select plan</SelectItem>
            {dataPlanOptions.map((option) => (
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
              Phone Number
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
          {sendAsGift && identifierMode === 'tag' ? 'Giftseon Tag' : 'Phone Number'}
        </p>
        <input
          type='text'
          value={dataPhone}
          onChange={(event) => setDataPhone(event.target.value)}
          placeholder={
            sendAsGift && identifierMode === 'tag'
              ? 'e.g. johndoe'
              : 'e.g. 08012345678'
          }
          className='w-full px-3 py-3 border border-grey-50 rounded-xl text-sm text-grey-800 placeholder:text-grey-500 bg-white focus:outline-none focus:ring-1 focus:ring-primary-300'
        />
      </div>

      <div className='space-y-1.5'>
        <p className='text-xs font-medium text-grey-700'>Amount</p>
        <input
          type='text'
          value={formatAmountDigits(dataAmount)}
          onChange={(event) => setDataAmount(event.target.value.replace(/\D/g, ''))}
          inputMode='numeric'
          placeholder='e.g. 1500'
          className='w-full px-3 py-3 border border-grey-50 rounded-xl text-sm text-grey-800 placeholder:text-grey-500 bg-white focus:outline-none focus:ring-1 focus:ring-primary-300'
        />
      </div>

      <div className='flex flex-wrap gap-2'>
        {[1000, 1500, 2000, 5000].map((value) => (
          <button
            key={value}
            type='button'
            onClick={() => setDataAmount(String(value))}
            className='rounded-full border border-grey-200 bg-white px-2.5 py-1 text-xs font-medium text-grey-700 hover:border-primary-200 hover:text-primary-600 transition'
          >
            {value.toLocaleString()}
          </button>
        ))}
      </div>

      {giftOptionsFields}

      <button
        type='submit'
        disabled={
          sendAsGift
            ? !canSendGift || isBusy
            : isBusy || !dataNetwork || !dataPlan || !dataPhone || !dataAmount
        }
        className='h-11 px-4 rounded-xl text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed bg-primary-500 text-white hover:bg-primary-600'
      >
        {sendAsGift && sendGiftPending ? (
          <span className='inline-flex items-center gap-2'>
            <Loader2 className='h-4 w-4 animate-spin' />
            Sending...
          </span>
        ) : buyDataPending ? (
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
    </form>
  )
}

export default DataTabForm
