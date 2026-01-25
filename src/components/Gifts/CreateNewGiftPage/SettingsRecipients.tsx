import InputField from './Components/InputField'
import RecipientItem from './Components/ReceipientItem'
import { Recipient } from '@/types/gifts'

type SettingsRecipientsProps = {
  title?: string
  listTitle?: string
  recipients: Recipient[]
  recipientForm: Recipient
  editingRecipientIndex: number | null
  onRecipientChange: (field: keyof Recipient, value: string) => void
  onSaveRecipient: () => void
  onCancelEditRecipient: () => void
  onEditRecipient: (index: number) => void
  onRemoveRecipient: (index: number) => void
}

const SettingsRecipients = ({
  title = 'GIFT PAGE RECIPIENTS',
  listTitle = 'Gift Page Recipients',
  recipients,
  recipientForm,
  editingRecipientIndex,
  onRecipientChange,
  onSaveRecipient,
  onCancelEditRecipient,
  onEditRecipient,
  onRemoveRecipient,
}: SettingsRecipientsProps) => {
  return (
    <div>
      <h4 className='text-sm text-grey-700 font-medium mb-2'>
        {title}
      </h4>
      <div className='space-y-4'>
        <InputField
          label='Name'
          value={recipientForm.name}
          onChange={(value) => onRecipientChange('name', value)}
          placeholder='Enter recipient name'
        />
        <InputField
          label='Email Address'
          value={recipientForm.email}
          onChange={(value) => onRecipientChange('email', value)}
          placeholder='Enter recipient email address'
          type='email'
        />
      </div>
      <div className='flex items-center justify-end gap-3 mt-4'>
        {editingRecipientIndex !== null && (
          <button
            type='button'
            onClick={onCancelEditRecipient}
            className='text-sm text-grey-600 hover:text-grey-800 transition-colors'
          >
            Cancel edit
          </button>
        )}
        <button
          type='button'
          onClick={onSaveRecipient}
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
                onEdit={() => onEditRecipient(index)}
                onRemove={() => onRemoveRecipient(index)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SettingsRecipients
