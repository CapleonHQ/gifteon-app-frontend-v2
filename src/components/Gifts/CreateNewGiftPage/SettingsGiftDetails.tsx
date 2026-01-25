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
import { useCreateGift } from './CreateGiftContext'

const SettingsGiftDetails = () => {
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
  } = useCreateGift()

  return (
    <div className='space-y-5'>
      <RadioField
        label='Who is this gift for?'
        value={giftFor}
        onChange={(value) => setGiftFor(value as any)}
        options={[
          { value: 'me', label: 'For me' },
          { value: 'someone', label: 'Someone else' },
        ]}
      />

      <RadioField
        label='Gift Type'
        value={giftType}
        onChange={(value) => setGiftType(value as any)}
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
            <Select value={currency} onValueChange={setCurrency}>
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
              onChange={setMinAmount}
              placeholder='Set your minimum amount'
              formatAsAmount
            />
            <InputField
              label='Maximum Amount'
              value={maxAmount}
              onChange={setMaxAmount}
              placeholder='Set your maximum amount'
              formatAsAmount
            />
          </div>

          <InputField
            label='Target Amount'
            value={targetAmount}
            onChange={setTargetAmount}
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
            <Select value={currency} onValueChange={setCurrency}>
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
            onChange={setCashAmount}
            placeholder='Enter amount'
            formatAsAmount
          />
          <InputField
            label='Who are you sending this gift to?'
            value={receiverName}
            onChange={setReceiverName}
            placeholder='Enter recipient name'
          />
          <InputField
            label="Receiver's Email Address"
            value={receiverEmail}
            onChange={setReceiverEmail}
            placeholder='Enter recipient email address'
            type='email'
          />
        </>
      )}

      <RadioField
        label='Do you want to add custom gifts?'
        value={customGifts}
        onChange={(value) => setCustomGifts(value as any)}
        options={[
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ]}
      />

      <SettingsCustomGifts />

      <RadioField
        label='Do you want to add music?'
        value={addMusic}
        onChange={(value) => setAddMusic(value as any)}
        options={[
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ]}
      />

      <div>
        <RadioField
          label='Gift Page Privacy Control'
          value={privacy}
          onChange={(value) => setPrivacy(value as any)}
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
            onChange={(value) => setAllowJoinGifting(value as any)}
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
                onChange={setJoinTargetAmount}
                placeholder='Enter your target amount'
                formatAsAmount
              />
              <InputField
                label='Minimum Amount'
                value={joinMinAmount}
                onChange={setJoinMinAmount}
                placeholder='Set your minimum amount'
                formatAsAmount
              />
            </>
          )}

          <RadioField
            label='Do you want to set a timeframe for this gifting?'
            value={setTimeframe}
            onChange={(value) => setSetTimeframe(value as any)}
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
                  onChange={setGiftingEndDate}
                  placeholder='Select date'
                />
                <TimePickerField
                  label='Time'
                  value={giftingEndTime}
                  onChange={setGiftingEndTime}
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
