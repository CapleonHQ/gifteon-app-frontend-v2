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

type SettingsGiftDetailsProps = {
  giftFor: string
  giftType: string
  currency: string
  cashAmount: string
  minAmount: string
  maxAmount: string
  targetAmount: string
  customGifts: string
  addMusic: string
  privacy: string
  receiverName: string
  receiverEmail: string
  allowJoinGifting: string
  joinTargetAmount: string
  joinMinAmount: string
  setTimeframe: string
  giftingEndDate: Date | undefined
  giftingEndTime: string
  onGiftForChange: (value: string) => void
  onGiftTypeChange: (value: string) => void
  onCurrencyChange: (value: string) => void
  onCashAmountChange: (value: string) => void
  onMinAmountChange: (value: string) => void
  onMaxAmountChange: (value: string) => void
  onTargetAmountChange: (value: string) => void
  onCustomGiftsChange: (value: string) => void
  onAddMusicChange: (value: string) => void
  onPrivacyChange: (value: string) => void
  onReceiverNameChange: (value: string) => void
  onReceiverEmailChange: (value: string) => void
  onAllowJoinGiftingChange: (value: string) => void
  onJoinTargetAmountChange: (value: string) => void
  onJoinMinAmountChange: (value: string) => void
  onSetTimeframeChange: (value: string) => void
  onGiftingEndDateChange: (value?: Date) => void
  onGiftingEndTimeChange: (value: string) => void
  customGiftsSection?: React.ReactNode
}

const SettingsGiftDetails = ({
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
  onGiftForChange,
  onGiftTypeChange,
  onCurrencyChange,
  onCashAmountChange,
  onMinAmountChange,
  onMaxAmountChange,
  onTargetAmountChange,
  onCustomGiftsChange,
  onAddMusicChange,
  onPrivacyChange,
  onReceiverNameChange,
  onReceiverEmailChange,
  onAllowJoinGiftingChange,
  onJoinTargetAmountChange,
  onJoinMinAmountChange,
  onSetTimeframeChange,
  onGiftingEndDateChange,
  onGiftingEndTimeChange,
  customGiftsSection,
}: SettingsGiftDetailsProps) => {
  return (
    <div className='space-y-5'>
      <RadioField
        label='Who is this gift for?'
        value={giftFor}
        onChange={onGiftForChange}
        options={[
          { value: 'me', label: 'For me' },
          { value: 'someone', label: 'Someone else' },
        ]}
      />

      <RadioField
        label='Gift Type'
        value={giftType}
        onChange={onGiftTypeChange}
        options={[
          { value: 'cash', label: 'Cash' },
          { value: 'items', label: 'Gift Items on Giftseon' },
        ]}
        helper={
          giftType === 'cash' && giftFor === 'someone'
            ? "Cash will be deposited into the user's Giftseon Wallet for withdrawal anytime."
            : giftType === 'cash'
            ? 'Cash will be deposited into your Giftseon Wallet for withdrawal anytime.'
            : undefined
        }
      />
      {giftType === 'cash' && giftFor === 'someone' && (
        <div className='flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-warning-50/50 text-warning-500 text-xs font-medium'>
          <span className='w-4 h-4 text-warning-500'>
            <AlertIcon />
          </span>
          <span>The receiver has to own a Giftseon account</span>
        </div>
      )}

      {giftType === 'cash' && giftFor !== 'someone' && (
        <>
          <div>
            <label className='text-sm font-medium mb-2 block'>Currency</label>
            <Select value={currency} onValueChange={onCurrencyChange}>
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
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <InputField
              label='Minimum Amount'
              value={minAmount}
              onChange={onMinAmountChange}
              placeholder='Set your minimum amount'
              formatAsAmount
            />
            <InputField
              label='Maximum Amount'
              value={maxAmount}
              onChange={onMaxAmountChange}
              placeholder='Set your maximum amount'
              formatAsAmount
            />
          </div>

          <InputField
            label='Target Amount'
            value={targetAmount}
            onChange={onTargetAmountChange}
            placeholder='Enter your target amount'
            helper='Optional'
            formatAsAmount
          />
        </>
      )}

      {giftType === 'cash' && giftFor === 'someone' && (
        <>
          <div className='space-y-2'>
            <label className='text-sm font-medium mb-2 block'>Currency</label>
            <Select value={currency} onValueChange={onCurrencyChange}>
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
          </div>
          <InputField
            label='Enter Amount'
            value={cashAmount}
            onChange={onCashAmountChange}
            placeholder='Enter amount'
            formatAsAmount
          />
          <InputField
            label='Who are you sending this gift to?'
            value={receiverName}
            onChange={onReceiverNameChange}
            placeholder='Enter recipient name'
          />
          <InputField
            label="Receiver's Email Address"
            value={receiverEmail}
            onChange={onReceiverEmailChange}
            placeholder='Enter recipient email address'
            type='email'
          />
        </>
      )}

      <RadioField
        label='Do you want to add custom gifts?'
        value={customGifts}
        onChange={onCustomGiftsChange}
        options={[
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ]}
      />

      {customGiftsSection}

      <RadioField
        label='Do you want to add music?'
        value={addMusic}
        onChange={onAddMusicChange}
        options={[
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ]}
      />

      <div>
        <RadioField
          label='Gift Page Privacy Control'
          value={privacy}
          onChange={onPrivacyChange}
          options={[
            { value: 'public', label: 'Public' },
            { value: 'shareable', label: 'Shareable' },
            { value: 'private', label: 'Private' },
          ]}
          grid='grid-cols-3'
        />
        <div className='text-xs text-grey-500 mt-1 space-y-1'>
          <p>Public: Visible to everyone on Giftseon and shareable anywhere.</p>
          <p>Shareable: Visible to anyone with the link and QR code.</p>
          <p>Private: Visible only to people you add as recipients.</p>
        </div>
      </div>

      {giftType === 'cash' && giftFor === 'someone' && (
        <>
          <RadioField
            label='Do you want others to join this gifting?'
            value={allowJoinGifting}
            onChange={onAllowJoinGiftingChange}
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ]}
          />

          {allowJoinGifting === 'yes' && (
            <>
              <InputField
                label='Target Amount'
                value={joinTargetAmount}
                onChange={onJoinTargetAmountChange}
                placeholder='Enter your target amount'
                formatAsAmount
              />
              <InputField
                label='Minimum Amount'
                value={joinMinAmount}
                onChange={onJoinMinAmountChange}
                placeholder='Set your minimum amount'
                formatAsAmount
              />
            </>
          )}

          <RadioField
            label='Do you want to set a timeframe for this gifting?'
            value={setTimeframe}
            onChange={onSetTimeframeChange}
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ]}
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
                  onChange={onGiftingEndDateChange}
                  placeholder='Select date'
                />
                <TimePickerField
                  label='Time'
                  value={giftingEndTime}
                  onChange={onGiftingEndTimeChange}
                  placeholder='Select time'
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default SettingsGiftDetails
