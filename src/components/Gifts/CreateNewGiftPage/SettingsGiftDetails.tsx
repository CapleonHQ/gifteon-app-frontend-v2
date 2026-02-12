import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import RadioField from './Components/RadioField'
import InputField from './Components/InputField'
import DatePickerField from './Components/DatePickerField'
import TimePickerField from './Components/TimePickerField'
import AlertIcon from '@/assets/icons/AlertIcon'
import SettingsCustomGifts from './SettingsCustomGifts'
import { useGiftSettingsContext } from './CreateGiftContext'

const SettingsGiftDetails = ({
  errors,
  onClearError,
}: {
  errors?: {
    giftFor?: string
    giftType?: string
    currency?: string
    cashAmount?: string
    minAmount?: string
    maxAmount?: string
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
  onClearError?: (key: string) => void
}) => {
  const {
    giftFor,
    giftType,
    currency,
    cashAmount,
    minAmount,
    maxAmount,
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
    setMaxAmount,
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

  return (
    <div className='space-y-5'>
      <RadioField
        label='Who is this gift for?'
        value={giftFor}
        onChange={(value) => {
          setGiftFor(value as any)
          onClearError?.('giftFor')
        }}
        options={[
          { value: 'for_me', label: 'For me' },
          { value: 'someone_else', label: 'Someone else' },
        ]}
        error={errors?.giftFor}
      />

      <RadioField
        label='Gift Type'
        value={giftType}
        onChange={(value) => {
          setGiftType(value as any)
          onClearError?.('giftType')
        }}
        options={[
          { value: 'cash', label: 'Cash' },
          {
            value: 'items',
            label: 'Gift Items on Giftseon (Coming soon)',
            disabled: true,
          },
        ]}
        helper={
          giftType === 'cash' && giftFor === 'someone_else'
            ? "Cash will be deposited into the user's Giftseon Wallet for withdrawal anytime."
            : giftType === 'cash'
              ? 'Cash will be deposited into your Giftseon Wallet for withdrawal anytime.'
              : giftType === 'items'
                ? 'Gift items on Giftseon are temporarily unavailable.'
              : undefined
        }
        error={errors?.giftType}
      />
      {giftType === 'cash' && giftFor === 'someone_else' && (
        <div className='flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-warning-50/50 text-warning-500 text-xs font-medium'>
          <span className='w-4 h-4 text-warning-500'>
            <AlertIcon />
          </span>
          <span>The receiver has to own a Giftseon account</span>
        </div>
      )}

      {giftType === 'cash' && giftFor !== 'someone_else' && (
        <>
          <div>
            <label className='text-sm font-medium mb-2 block'>Currency</label>
            <Select
              value={currency}
              onValueChange={(value) => {
                setCurrency(value)
                onClearError?.('currency')
              }}
            >
              <SelectTrigger className='w-full px-3 py-3.5 border border-grey-50 rounded-lg outline-hidden focus:outline-hidden text-sm text-blackish font-medium h-auto!'>
                <SelectValue placeholder='Select an option' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='placeholder' disabled>
                  Select an option
                </SelectItem>
                <SelectItem value='naira'>Naira</SelectItem>
                <SelectItem value='usd'>USD</SelectItem>
                <SelectItem value='eur'>EUR</SelectItem>
              </SelectContent>
            </Select>
            {errors?.currency && (
              <p className='text-xs text-error-600 mt-1'>{errors.currency}</p>
            )}
          </div>

          <div className='grid grid-cols-2 gap-4'>
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
              label='Maximum Amount'
              value={maxAmount}
              onChange={(value) => {
                setMaxAmount(value)
                onClearError?.('maxAmount')
              }}
              placeholder='Set your maximum amount'
              formatAsAmount
              error={errors?.maxAmount}
            />
          </div>

          <InputField
            label='Target Amount'
            value={targetAmount}
            onChange={(value) => {
              setTargetAmount(value)
              onClearError?.('targetAmount')
            }}
            placeholder='Enter your target amount'
            helper='Optional'
            formatAsAmount
            error={errors?.targetAmount}
          />
        </>
      )}

      {giftType === 'cash' && giftFor === 'someone_else' && (
        <>
          <div className='space-y-2'>
            <label className='text-sm font-medium mb-2 block'>Currency</label>
            <Select
              value={currency}
              onValueChange={(value) => {
                setCurrency(value)
                onClearError?.('currency')
              }}
            >
              <SelectTrigger className='w-full px-3 py-3.5 border border-grey-50 rounded-lg outline-hidden focus:outline-hidden text-sm text-blackish font-medium h-auto!'>
                <SelectValue placeholder='Select an option' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='placeholder' disabled>
                  Select an option
                </SelectItem>
                <SelectItem value='naira'>Naira</SelectItem>
                <SelectItem value='usd'>USD</SelectItem>
                <SelectItem value='eur'>EUR</SelectItem>
              </SelectContent>
            </Select>
            {errors?.currency && (
              <p className='text-xs text-error-600 mt-1'>{errors.currency}</p>
            )}
          </div>
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
      )}

      <RadioField
        label='Do you want to add custom gifts?'
        value={customGifts}
        onChange={(value) => {
          setCustomGifts(value as any)
          onClearError?.('customGifts')
        }}
        options={[
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ]}
        error={errors?.customGifts}
      />

      <SettingsCustomGifts error={errors?.customGifts} onClearError={onClearError} />

      <RadioField
        label='Do you want to add music?'
        value={addMusic}
        onChange={(value) => {
          setAddMusic(value as any)
          onClearError?.('addMusic')
        }}
        options={[
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ]}
        error={errors?.addMusic}
      />

      <div>
        <RadioField
          label='Gift Page Privacy Control'
          value={privacy}
          onChange={(value) => {
            setPrivacy(value as any)
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
        <div className='text-xs text-grey-500 mt-1 space-y-1'>
          <p>Public: Visible to everyone on Giftseon and shareable anywhere.</p>
          <p>Shareable: Visible to anyone with the link and QR code.</p>
          <p>Private: Visible only to people you add as recipients.</p>
        </div>
      </div>

      {giftType === 'cash' && giftFor === 'someone_else' && (
        <>
          <RadioField
            label='Do you want others to join this gifting?'
            value={allowJoinGifting}
            onChange={(value) => {
              setAllowJoinGifting(value as any)
              onClearError?.('allowJoinGifting')
            }}
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ]}
            error={errors?.allowJoinGifting}
          />

          {allowJoinGifting === 'yes' && (
            <>
              <InputField
                label='Target Amount'
                value={joinTargetAmount}
                onChange={(value) => {
                  setJoinTargetAmount(value)
                  onClearError?.('joinTargetAmount')
                }}
                placeholder='Enter your target amount'
                formatAsAmount
                error={errors?.joinTargetAmount}
              />
              <InputField
                label='Minimum Amount'
                value={joinMinAmount}
                onChange={(value) => {
                  setJoinMinAmount(value)
                  onClearError?.('joinMinAmount')
                }}
                placeholder='Set your minimum amount'
                formatAsAmount
                error={errors?.joinMinAmount}
              />
            </>
          )}

          <RadioField
            label='Do you want to set a timeframe for this gifting?'
            value={setTimeframe}
            onChange={(value) => {
              setSetTimeframe(value as any)
              onClearError?.('setTimeframe')
            }}
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ]}
            error={errors?.setTimeframe}
          />

          {setTimeframe === 'yes' && (
            <div className='space-y-3'>
              <p className='text-sm text-grey-700 uppercase tracking-wide'>
                When should the gifting end?
              </p>
              <div className='grid grid-cols-2 gap-4'>
                <DatePickerField
                  label='Date'
                  value={giftingEndDate}
                  onChange={(value) => {
                    setGiftingEndDate(value)
                    onClearError?.('giftingEndDate')
                  }}
                  placeholder='Select date'
                />
                {errors?.giftingEndDate && (
                  <p className='text-xs text-error-600 mt-1'>
                    {errors.giftingEndDate}
                  </p>
                )}
                <TimePickerField
                  label='Time'
                  value={giftingEndTime}
                  onChange={(value) => {
                    setGiftingEndTime(value)
                    onClearError?.('giftingEndTime')
                  }}
                  placeholder='Select time'
                />
                {errors?.giftingEndTime && (
                  <p className='text-xs text-error-600 mt-1'>
                    {errors.giftingEndTime}
                  </p>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default SettingsGiftDetails
