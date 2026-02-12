import SettingsGiftDetails from './SettingsGiftDetails'
import SettingsRecipients from './SettingsRecipients'
import SettingsSocialLinks from './SettingsSocialLinks'

const SettingsStep = ({
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
    recipients?: string
    recipientName?: string
    recipientEmail?: string
    form?: string
  }
  onClearError?: (key: string) => void
}) => {
  return (
    <div className='space-y-6'>
      {errors?.form && (
        <div
          className='mt-2.5 lg:mt-0 rounded-lg border border-error-100 bg-error-50/60 px-3 py-2 text-sm text-error-700'
          data-form-error='true'
        >
          {errors.form}
        </div>
      )}
      <SettingsGiftDetails errors={errors} onClearError={onClearError} />
      <SettingsRecipients
        error={errors?.recipients}
        nameError={errors?.recipientName}
        emailError={errors?.recipientEmail}
        onClearError={onClearError}
      />
      <SettingsSocialLinks />
    </div>
  )
}

export default SettingsStep
