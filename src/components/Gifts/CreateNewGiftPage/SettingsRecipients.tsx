import InputField from './Components/InputField'
import RecipientItem from './Components/ReceipientItem'
import { useCreateGift } from './CreateGiftContext'

const SettingsRecipients = () => {
  const {
    giftFor,
    giftType,
    recipients,
    recipientForm,
    editingRecipientIndex,
    handleRecipientChange,
    saveRecipient,
    cancelEditRecipient,
    editRecipient,
    removeRecipient,
  } = useCreateGift()

  const title =
    giftFor === 'someone' && giftType === 'cash'
      ? 'GIFT PAGE PARTICIPANTS'
      : 'GIFT PAGE RECIPIENTS'
  const listTitle =
    giftFor === 'someone' && giftType === 'cash'
      ? 'Gift Page Participants'
      : 'Gift Page Recipients'

  return (
    <div>
      <h4 className='text-sm text-grey-700 font-medium mb-2'>{title}</h4>
      <div className='space-y-4'>
        <InputField
          label='Name'
          value={recipientForm.name}
          onChange={(value) => handleRecipientChange('name', value)}
          placeholder='Enter recipient name'
        />
        <InputField
          label='Email Address'
          value={recipientForm.email}
          onChange={(value) => handleRecipientChange('email', value)}
          placeholder='Enter recipient email address'
          type='email'
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
          onClick={saveRecipient}
          disabled={!recipientForm.name.trim() || !recipientForm.email.trim()}
          className='py-2.5 px-5 border border-success-500 rounded-[12px] text-sm font-medium text-success-600 bg-[#E1F9EA4D] hover:bg-success-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed'
        >
          {editingRecipientIndex !== null ? 'Update recipient' : '+ Add recipient'}
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
