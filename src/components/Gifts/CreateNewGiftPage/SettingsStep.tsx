import type { ChangeEvent } from 'react'
import { GiftPageData, Recipient } from '@/types/gifts'
import SettingsGiftDetails from './SettingsGiftDetails'
import SettingsCustomGifts from './SettingsCustomGifts'
import SettingsRecipients from './SettingsRecipients'
import SettingsSocialLinks from './SettingsSocialLinks'

type SettingsStepProps = {
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
  customGiftItems: {
    title: string
    price: string
    imageName: string
    imageUrl?: string
    quantity: string
  }[]
  customGiftForm: {
    title: string
    price: string
    imageName: string
    imageUrl?: string
    quantity: string
  }
  editingCustomGiftIndex: number | null
  recipients: Recipient[]
  recipientForm: Recipient
  editingRecipientIndex: number | null
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
  onCustomGiftChange: (
    field: keyof SettingsStepProps['customGiftForm'],
    value: string
  ) => void
  onCustomGiftImageChange: (event: ChangeEvent<HTMLInputElement>) => void
  onCustomGiftRemoveImage: () => void
  onSaveCustomGift: () => void
  onEditCustomGift: (index: number) => void
  onRemoveCustomGift: (index: number) => void
  onRecipientChange: (field: keyof Recipient, value: string) => void
  onSaveRecipient: () => void
  onCancelEditRecipient: () => void
  onEditRecipient: (index: number) => void
  onRemoveRecipient: (index: number) => void
  onSocialLinkChange: (
    key: keyof GiftPageData['socialLinks'],
    value: string
  ) => void
  socialLinks: GiftPageData['socialLinks']
}

const SettingsStep = ({
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
  customGiftItems,
  customGiftForm,
  editingCustomGiftIndex,
  recipients,
  recipientForm,
  editingRecipientIndex,
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
  onCustomGiftChange,
  onCustomGiftImageChange,
  onCustomGiftRemoveImage,
  onSaveCustomGift,
  onEditCustomGift,
  onRemoveCustomGift,
  onRecipientChange,
  onSaveRecipient,
  onCancelEditRecipient,
  onEditRecipient,
  onRemoveRecipient,
  onSocialLinkChange,
  socialLinks,
}: SettingsStepProps) => {
  return (
    <div className='space-y-6'>
      <SettingsGiftDetails
        giftFor={giftFor}
        giftType={giftType}
        currency={currency}
        cashAmount={cashAmount}
        minAmount={minAmount}
        maxAmount={maxAmount}
        targetAmount={targetAmount}
        customGifts={customGifts}
        addMusic={addMusic}
        privacy={privacy}
        receiverName={receiverName}
        receiverEmail={receiverEmail}
        allowJoinGifting={allowJoinGifting}
        joinTargetAmount={joinTargetAmount}
        joinMinAmount={joinMinAmount}
        setTimeframe={setTimeframe}
        giftingEndDate={giftingEndDate}
        giftingEndTime={giftingEndTime}
        onGiftForChange={onGiftForChange}
        onGiftTypeChange={onGiftTypeChange}
        onCurrencyChange={onCurrencyChange}
        onCashAmountChange={onCashAmountChange}
        onMinAmountChange={onMinAmountChange}
        onMaxAmountChange={onMaxAmountChange}
        onTargetAmountChange={onTargetAmountChange}
        onCustomGiftsChange={onCustomGiftsChange}
        onAddMusicChange={onAddMusicChange}
        onPrivacyChange={onPrivacyChange}
        onReceiverNameChange={onReceiverNameChange}
        onReceiverEmailChange={onReceiverEmailChange}
        onAllowJoinGiftingChange={onAllowJoinGiftingChange}
        onJoinTargetAmountChange={onJoinTargetAmountChange}
        onJoinMinAmountChange={onJoinMinAmountChange}
        onSetTimeframeChange={onSetTimeframeChange}
        onGiftingEndDateChange={onGiftingEndDateChange}
        onGiftingEndTimeChange={onGiftingEndTimeChange}
        customGiftsSection={
          <SettingsCustomGifts
            enabled={customGifts === 'yes'}
            form={customGiftForm}
            editingIndex={editingCustomGiftIndex}
            customGifts={customGiftItems}
            onChange={onCustomGiftChange}
            onImageChange={onCustomGiftImageChange}
            onRemoveImage={onCustomGiftRemoveImage}
            onSave={onSaveCustomGift}
            onEdit={onEditCustomGift}
            onRemove={onRemoveCustomGift}
          />
        }
      />
      <SettingsRecipients
        title={
          giftFor === 'someone' && giftType === 'cash'
            ? 'GIFT PAGE PARTICIPANTS'
            : undefined
        }
        listTitle={
          giftFor === 'someone' && giftType === 'cash'
            ? 'Gift Page Participants'
            : undefined
        }
        recipients={recipients}
        recipientForm={recipientForm}
        editingRecipientIndex={editingRecipientIndex}
        onRecipientChange={onRecipientChange}
        onSaveRecipient={onSaveRecipient}
        onCancelEditRecipient={onCancelEditRecipient}
        onEditRecipient={onEditRecipient}
        onRemoveRecipient={onRemoveRecipient}
      />
      <SettingsSocialLinks
        socialLinks={socialLinks}
        onSocialLinkChange={onSocialLinkChange}
      />
    </div>
  )
}

export default SettingsStep
