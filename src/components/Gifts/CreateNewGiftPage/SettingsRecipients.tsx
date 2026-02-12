import InputField from './Components/InputField'
import RecipientItem from './Components/ReceipientItem'
import {
  useGiftSettingsContext,
  useRecipientsContext,
} from './CreateGiftContext'

const SettingsRecipients = ({
  error,
  onClearError,
  nameError,
  emailError,
}: {
  error?: string
  onClearError?: (key: string) => void
  nameError?: string
  emailError?: string
}) => {
  const { giftFor, giftType, privacy } = useGiftSettingsContext()

  const {
    recipients,
    recipientForm,
    editingRecipientIndex,
    handleRecipientChange,
    saveRecipient,
    cancelEditRecipient,
    editRecipient,
    removeRecipient,
  } = useRecipientsContext()

  const title =
    giftFor === 'someone_else' && giftType === 'cash'
      ? 'GIFT PAGE PARTICIPANTS'
      : 'GIFT PAGE RECIPIENTS'
  const listTitle =
    giftFor === 'someone_else' && giftType === 'cash'
      ? 'Gift Page Participants'
      : 'Gift Page Recipients'

  if (privacy !== 'private') {
    return null
  }

  return (
    <div>
      <h4 className='text-sm text-grey-700 font-medium mb-2'>{title}</h4>
      {error && <p className='text-xs text-error-600 mb-2'>{error}</p>}
      <div className='space-y-4'>
        <InputField
          label='Name'
          value={recipientForm.name}
          onChange={(value) => {
            handleRecipientChange('name', value)
            onClearError?.('recipients')
            onClearError?.('recipientName')
          }}
          placeholder='Enter recipient name'
          error={nameError}
        />
        <InputField
          label='Email Address'
          value={recipientForm.email}
          onChange={(value) => {
            handleRecipientChange('email', value)
            onClearError?.('recipients')
            onClearError?.('recipientEmail')
          }}
          placeholder='Enter recipient email address'
          type='email'
          error={emailError}
        />
      </div>
      <div className='flex items-center justify-end gap-3 mt-4'>
        {editingRecipientIndex !== null && (
          <button
            type='button'
            onClick={cancelEditRecipient}
            className='text-sm text-grey-600 hover:text-grey-800 transition-colors'
          >
            Cancel edit
          </button>
        )}
        <button
          type='button'
          onClick={() => {
            saveRecipient()
            onClearError?.('recipients')
            onClearError?.('recipientName')
            onClearError?.('recipientEmail')
          }}
          disabled={!recipientForm.name.trim() || !recipientForm.email.trim()}
          className='py-2.5 px-5 border border-success-500 rounded-[12px] text-sm font-medium text-success-600 bg-[#E1F9EA4D] hover:bg-success-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed'
        >
          {editingRecipientIndex !== null
            ? 'Update recipient'
            : '+ Add recipient'}
        </button>
      </div>
      {recipients.length > 0 && (
        <div className='mt-6'>
          <p className='text-sm text-grey-700 mb-3'>
            {listTitle} ({recipients.length})
          </p>
          <div className='space-y-3'>
            {recipients.map((recipient, index) => (
              <RecipientItem
                key={`${recipient.email}-${index}`}
                recipient={recipient}
                onEdit={() => editRecipient(index)}
                onRemove={() => removeRecipient(index)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SettingsRecipients
