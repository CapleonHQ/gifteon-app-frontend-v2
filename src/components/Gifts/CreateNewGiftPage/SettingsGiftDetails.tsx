import AlertIcon from '@/assets/icons/AlertIcon'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import DatePickerField from './Components/DatePickerField'
import InputField from './Components/InputField'
import RadioField from './Components/RadioField'
import TimePickerField from './Components/TimePickerField'
import { useGiftSettingsContext } from './CreateGiftContext'
import SettingsCustomGifts from './SettingsCustomGifts'
import { hasCashGiftType, hasStoreGiftType } from './utils/validation'

type SettingsErrors = {
  giftFor?: string
  giftType?: string
  currency?: string
  cashAmount?: string
  minAmount?: string
  targetAmount?: string
  customGifts?: string
  addMusic?: string
  privacy?: string
  receiverName?: string
  receiverEmail?: string
  allowJoinGifting?: string
  joinTargetAmount?: string
  joinMinAmount?: string
  setTimeframe?: string
  giftingEndDate?: string
  giftingEndTime?: string
}

const resolveGiftType = (hasCash: boolean, hasItems: boolean) => {
  if (hasCash && hasItems) return 'cash_items'
  if (hasCash) return 'cash'
  if (hasItems) return 'items'
  return ''
}

const GiftTypeOption = ({
  checked,
  title,
  description,
  onCheckedChange,
}: {
  checked: boolean
  title: string
  description: string
  onCheckedChange: (checked: boolean) => void
}) => (
  <label className='flex cursor-pointer items-start gap-3 bg-white transition-colors'>
    <Checkbox
      checked={checked}
      onCheckedChange={(value) => onCheckedChange(Boolean(value))}
    />
    <span className='space-y-1'>
      <span className='block text-sm font-medium text-blackish'>{title}</span>
      <span className='block text-xs leading-5 text-grey-500'>
        {description}
      </span>
    </span>
  </label>
)

const CurrencyField = ({
  value,
  error,
  onChange,
}: {
  value: string
  error?: string
  onChange: (value: string) => void
}) => (
  <div>
    <label className='mb-2 block text-sm font-medium'>Currency</label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className='h-auto! w-full rounded-lg border border-grey-50 px-3 py-3.5 text-sm font-medium text-blackish outline-hidden focus:outline-hidden'>
        <SelectValue placeholder='Select an option' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='placeholder' disabled>
          Select an option
        </SelectItem>
        <SelectItem value='NGN'>Naira (₦)</SelectItem>
        <SelectItem value='USD' disabled>
          US Dollar ($)
        </SelectItem>
        <SelectItem value='EUR' disabled>
          Euro (€)
        </SelectItem>
      </SelectContent>
    </Select>
    {error ? <p className='mt-1 text-xs text-error-600'>{error}</p> : null}
  </div>
)

const SettingsGiftDetails = ({
  errors,
  onClearError,
}: {
  errors?: SettingsErrors
  onClearError?: (key: string) => void
}) => {
  const {
    giftFor,
    giftType,
    currency,
    cashAmount,
    minAmount,
    targetAmount,
    customGifts,
    addMusic,
    privacy,
    receiverName,
    receiverEmail,
    allowJoinGifting,
    joinTargetAmount,
    joinMinAmount,
    setTimeframe,
    giftingEndDate,
    giftingEndTime,
    setGiftFor,
    setGiftType,
    setCurrency,
    setCashAmount,
    setMinAmount,
    setTargetAmount,
    setCustomGifts,
    setAddMusic,
    setPrivacy,
    setReceiverName,
    setReceiverEmail,
    setAllowJoinGifting,
    setJoinTargetAmount,
    setJoinMinAmount,
    setSetTimeframe,
    setGiftingEndDate,
    setGiftingEndTime,
  } = useGiftSettingsContext()

  const hasCash = hasCashGiftType(giftType)
  const hasItems = hasStoreGiftType(giftType)

  const toggleGiftType = (type: 'cash' | 'items', checked: boolean) => {
    const nextHasCash = type === 'cash' ? checked : hasCash
    const nextHasItems = type === 'items' ? checked : hasItems
    setGiftType(resolveGiftType(nextHasCash, nextHasItems) as typeof giftType)
    onClearError?.('giftType')
  }

  return (
    <div className='space-y-5'>
      <RadioField
        label='Who is this gift for?'
        value={giftFor}
        onChange={(value) => {
          setGiftFor(value as 'for_me' | 'someone_else')
          onClearError?.('giftFor')
        }}
        options={[
          { value: 'for_me', label: 'For me' },
          { value: 'someone_else', label: 'Someone else' },
        ]}
        error={errors?.giftFor}
      />

      <div className='space-y-3'>
        <div>
          <p className='text-sm font-medium text-blackish'>Gift Type</p>
          <p className='mt-1 text-xs leading-5 text-grey-500'>
            Choose one or both gift formats for this page.
          </p>
        </div>

        <div className='space-y-3'>
          <GiftTypeOption
            checked={hasCash}
            title='Cash gift'
            description={
              giftFor === 'someone_else'
                ? "Cash will be deposited into the receiver's Giftseon wallet."
                : 'Cash will be deposited into your Giftseon wallet.'
            }
            onCheckedChange={(checked) => toggleGiftType('cash', checked)}
          />
          <GiftTypeOption
            checked={hasItems}
            title='Store gifts'
            description='Allow supporters to send items from stores on Giftseon.'
            onCheckedChange={(checked) => toggleGiftType('items', checked)}
          />
        </div>

        {errors?.giftType ? (
          <p className='text-xs text-error-600'>{errors.giftType}</p>
        ) : null}
      </div>

      {hasCash && giftFor === 'someone_else' ? (
        <div className='flex items-center gap-1.5 rounded-full bg-warning-50/50 px-2.5 py-1.5 text-xs font-medium text-warning-500'>
          <span className='h-4 w-4 text-warning-500'>
            <AlertIcon />
          </span>
          <span>The receiver has to own a Giftseon account</span>
        </div>
      ) : null}

      {hasCash && giftFor !== 'someone_else' ? (
        <>
          <CurrencyField
            value={currency}
            error={errors?.currency}
            onChange={(value) => {
              setCurrency(value)
              onClearError?.('currency')
            }}
          />

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <InputField
              label='Minimum Amount'
              value={minAmount}
              onChange={(value) => {
                setMinAmount(value)
                onClearError?.('minAmount')
              }}
              placeholder='Set your minimum amount'
              formatAsAmount
              error={errors?.minAmount}
            />
            <InputField
              label='Target Amount'
              value={targetAmount}
              onChange={(value) => {
                setTargetAmount(value)
                onClearError?.('targetAmount')
              }}
              placeholder='Enter your target amount'
              formatAsAmount
              error={errors?.targetAmount}
            />
          </div>
        </>
      ) : null}

      {hasCash && giftFor === 'someone_else' ? (
        <>
          <CurrencyField
            value={currency}
            error={errors?.currency}
            onChange={(value) => {
              setCurrency(value)
              onClearError?.('currency')
            }}
          />
          <InputField
            label='Enter Amount'
            value={cashAmount}
            onChange={(value) => {
              setCashAmount(value)
              onClearError?.('cashAmount')
            }}
            placeholder='Enter amount'
            formatAsAmount
            error={errors?.cashAmount}
          />
          <InputField
            label='Who are you sending this gift to?'
            value={receiverName}
            onChange={(value) => {
              setReceiverName(value)
              onClearError?.('receiverName')
            }}
            placeholder='Enter recipient name'
            error={errors?.receiverName}
          />
          <InputField
            label="Receiver's Email Address"
            value={receiverEmail}
            onChange={(value) => {
              setReceiverEmail(value)
              onClearError?.('receiverEmail')
            }}
            placeholder='Enter recipient email address'
            type='email'
            error={errors?.receiverEmail}
          />
        </>
      ) : null}

      <RadioField
        label='Do you want to add custom gifts?'
        value={customGifts}
        onChange={(value) => {
          setCustomGifts(value as 'yes' | 'no')
          onClearError?.('customGifts')
        }}
        options={[
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ]}
        error={errors?.customGifts}
      />

      <SettingsCustomGifts
        error={errors?.customGifts}
        onClearError={onClearError}
      />

      <RadioField
        label='Do you want to add music?'
        value={addMusic}
        onChange={(value) => {
          if (value === 'yes') return
          setAddMusic(value as 'yes' | 'no')
          onClearError?.('addMusic')
        }}
        options={[
          { value: 'yes', label: 'Yes (Coming soon)', disabled: true },
          { value: 'no', label: 'No' },
        ]}
        error={errors?.addMusic}
      />

      <div>
        <RadioField
          label='Gift Page Privacy Control'
          value={privacy}
          onChange={(value) => {
            setPrivacy(value as 'public' | 'shareable' | 'private')
            onClearError?.('privacy')
          }}
          options={[
            { value: 'public', label: 'Public' },
            { value: 'shareable', label: 'Shareable' },
            { value: 'private', label: 'Private' },
          ]}
          grid='grid-cols-3'
          error={errors?.privacy}
        />
        <div className='mt-1 space-y-1 text-xs text-grey-500'>
          <p>Public: Visible to everyone on Giftseon and shareable anywhere.</p>
          <p>Shareable: Visible to anyone with the link and QR code.</p>
          <p>Private: Visible only to people you add as recipients.</p>
        </div>
      </div>

      {hasCash && giftFor === 'someone_else' ? (
        <>
          <RadioField
            label='Allow Join Gifting?'
            value={allowJoinGifting}
            onChange={(value) => {
              setAllowJoinGifting(value as 'yes' | 'no')
              onClearError?.('allowJoinGifting')
            }}
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ]}
            error={errors?.allowJoinGifting}
          />

          {allowJoinGifting === 'yes' ? (
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <InputField
                label='Join Target Amount'
                value={joinTargetAmount}
                onChange={(value) => {
                  setJoinTargetAmount(value)
                  onClearError?.('joinTargetAmount')
                }}
                placeholder='Enter target amount'
                formatAsAmount
                error={errors?.joinTargetAmount}
              />
              <InputField
                label='Join Minimum Amount'
                value={joinMinAmount}
                onChange={(value) => {
                  setJoinMinAmount(value)
                  onClearError?.('joinMinAmount')
                }}
                placeholder='Enter minimum amount'
                formatAsAmount
                error={errors?.joinMinAmount}
              />
            </div>
          ) : null}

          <RadioField
            label='Set Gifting Timeframe?'
            value={setTimeframe}
            onChange={(value) => {
              setSetTimeframe(value as 'yes' | 'no')
              onClearError?.('setTimeframe')
            }}
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ]}
            error={errors?.setTimeframe}
          />

          {setTimeframe === 'yes' ? (
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <div>
                <DatePickerField
                  label='Gifting End Date'
                  value={giftingEndDate}
                  onChange={(value) => {
                    setGiftingEndDate(value)
                    onClearError?.('giftingEndDate')
                  }}
                />
                {errors?.giftingEndDate ? (
                  <p className='mt-1 text-xs text-error-600'>
                    {errors.giftingEndDate}
                  </p>
                ) : null}
              </div>
              <div>
                <TimePickerField
                  label='Gifting End Time'
                  value={giftingEndTime}
                  onChange={(value) => {
                    setGiftingEndTime(value)
                    onClearError?.('giftingEndTime')
                  }}
                />
                {errors?.giftingEndTime ? (
                  <p className='mt-1 text-xs text-error-600'>
                    {errors.giftingEndTime}
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  )
}

export default SettingsGiftDetails
