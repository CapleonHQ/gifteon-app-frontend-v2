import { GiftPageData, Recipient } from '@/types/gifts'
import { X } from 'lucide-react'
import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import MediaUpload from './Components/MediaUpload'
import TextStyleEditor from './Components/TextStyleEditor'
import ButtonSettings from './Components/ButtonSettings'
import InputField from './Components/InputField'
import RadioField from './Components/RadioField'
import RecipientItem from './Components/ReceipientItem'

type Step = 'customize' | 'settings'

interface EditingSectionProps {
  data: GiftPageData
  onDataChange: (data: GiftPageData) => void
  onClose: () => void
  onSave: () => void
}

const EditingSection = ({
  data,
  onDataChange,
  onClose,
  onSave,
}: EditingSectionProps) => {
  const [step, setStep] = useState<Step>('customize')
  const [giftFor, setGiftFor] = useState<'me' | 'someone'>('me')
  const [giftType, setGiftType] = useState<'cash' | 'items'>('cash')
  const [currency, setCurrency] = useState('naira')
  const [minAmount, setMinAmount] = useState('2000')
  const [maxAmount, setMaxAmount] = useState('200000')
  const [targetAmount, setTargetAmount] = useState('270000')
  const [customGifts, setCustomGifts] = useState<'yes' | 'no'>('no')
  const [addMusic, setAddMusic] = useState<'yes' | 'no'>('no')
  const [privacy, setPrivacy] = useState<'public' | 'shareable' | 'private'>(
    'private'
  )
  const [recipients, setRecipients] = useState<Recipient[]>([
    { name: '', email: '' },
  ])

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        onDataChange({
          ...data,
          media: {
            type: file.type.startsWith('video') ? 'video' : 'image',
            url: reader.result as string,
          },
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleMediaRemove = () => {
    onDataChange({ ...data, media: { type: 'image', url: '' } })
  }

  const handleRecipientChange = (
    index: number,
    field: keyof Recipient,
    value: string
  ) => {
    const newRecipients = [...recipients]
    newRecipients[index][field] = value
    setRecipients(newRecipients)
  }

  const addRecipient = () => {
    setRecipients([...recipients, { name: '', email: '' }])
  }

  const removeRecipient = (index: number) => {
    setRecipients(recipients.filter((_, i) => i !== index))
  }

  const handleNext = () => {
    if (step === 'customize') {
      setStep('settings')
    } else {
      onSave()
    }
  }

  const handleBack = () => {
    if (step === 'settings') {
      setStep('customize')
    }
  }

  return (
    <div className='h-full relative overflow-y-auto rounded-md shadow-lg'>
      {/* Header */}
      <div className='hidden lg:flex justify-between p-2.5 sm:px-6 sm:py-5 border-b'>
        <span className='text-xl font-medium'>
          {step === 'customize' ? 'Customize Page' : 'Gift Page Settings'}
        </span>
        <button type='button' onClick={onClose}>
          <X />
        </button>
      </div>

      {/* Content */}
      <div className='sm:px-6 sm:py-5'>
        {step === 'customize' ? (
          <>
            <MediaUpload
              media={data.media}
              onUpload={handleMediaUpload}
              onRemove={handleMediaRemove}
            />

            <TextStyleEditor
              label='Title Settings'
              value={data.title}
              onChange={(newTitle) =>
                onDataChange({ ...data, title: newTitle })
              }
            />

            <ButtonSettings
              button={data.button}
              onChange={(newButton) =>
                onDataChange({ ...data, button: newButton })
              }
            />

            <TextStyleEditor
              label='Celebratory Message'
              value={data.description}
              onChange={(newDescription) =>
                onDataChange({ ...data, description: newDescription })
              }
            />
          </>
        ) : (
          <div className='space-y-5'>
            <RadioField
              label='Who is this gift for?'
              value={giftFor}
              onChange={(v) => setGiftFor(v as any)}
              options={[
                { value: 'me', label: 'For me' },
                { value: 'someone', label: 'Someone else' },
              ]}
            />

            <RadioField
              label='Gift Type'
              value={giftType}
              onChange={(v) => setGiftType(v as any)}
              options={[
                { value: 'cash', label: 'Cash' },
                { value: 'items', label: 'Gift Items on Giftseon' },
              ]}
              helper={
                giftType === 'cash'
                  ? 'Cash will be deposited into your Giftseon Wallet for withdrawal anytime.'
                  : undefined
              }
            />

            {giftType === 'cash' && (
              <>
                <div>
                  <label className='text-sm font-medium mb-2 block'>
                    Currency
                  </label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className='w-full px-3 py-3.5 border border-grey-50 rounded-lg outline-hidden focus:outline-hidden text-sm text-blackish font-medium h-auto!'>
                      <SelectValue placeholder='Select an option' />
                    </SelectTrigger>
                    <SelectContent>
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
                  />
                  <InputField
                    label='Maximum Amount'
                    value={maxAmount}
                    onChange={setMaxAmount}
                    placeholder='Set your maximum amount'
                  />
                </div>

                <InputField
                  label='Target Amount'
                  value={targetAmount}
                  onChange={setTargetAmount}
                  placeholder='Enter your target amount'
                  helper='Optional'
                />
              </>
            )}

            <RadioField
              label='Do you want to add custom gifts?'
              value={customGifts}
              onChange={(v) => setCustomGifts(v as any)}
              options={[
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
              ]}
            />

            <RadioField
              label='Do you want to add music?'
              value={addMusic}
              onChange={(v) => setAddMusic(v as any)}
              options={[
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
              ]}
            />

            <div>
              <RadioField
                label='Gift Page Privacy Control'
                value={privacy}
                onChange={(v) => setPrivacy(v as any)}
                options={[
                  { value: 'public', label: 'Public' },
                  { value: 'shareable', label: 'Shareable' },
                  { value: 'private', label: 'Private' },
                ]}
                grid='grid-cols-3'
              />
              <div className='text-xs text-grey-500 mt-1 space-y-1'>
                <p>
                  Public: Visible to everyone on Giftseon and shareable
                  anywhere.
                </p>
                <p>Shareable: Visible to anyone with the link and QR code.</p>
                <p>Private: Visible only to people you add as recipients.</p>
              </div>
            </div>

            {/* Recipients */}
            <div>
              <h4 className='text-sm text-grey-700 font-medium mb-2'>
                GIFT PAGE RECIPIENTS
              </h4>
              {recipients.map((recipient, index) => (
                <RecipientItem
                  key={index}
                  recipient={recipient}
                  index={index}
                  onChange={handleRecipientChange}
                  onRemove={removeRecipient}
                  canRemove={recipients.length > 1}
                />
              ))}
              <div className='flex justify-end'>
                <button
                  type='button'
                  onClick={addRecipient}
                  className='py-2.5 px-5 border border-success-500 rounded-[12px] text-sm font-medium text-success-600 bg-[#E1F9EA4D] hover:bg-success-50 transition-colors'
                >
                  + Add recipient
                </button>
              </div>
            </div>

            {/* Social Links */}
            <div className='mb-6'>
              <h4 className='font-medium text-grey-700 mb-2 text-sm'>
                SOCIAL MEDIA LINKS
              </h4>
              <div className='space-y-3'>
                <InputField
                  label='Instagram'
                  value={data.socialLinks.instagram || ''}
                  onChange={(value) =>
                    onDataChange({
                      ...data,
                      socialLinks: { ...data.socialLinks, instagram: value },
                    })
                  }
                  placeholder='https://instagram.com/username'
                />
                <InputField
                  label='Twitter'
                  value={data.socialLinks.twitter || ''}
                  onChange={(value) =>
                    onDataChange({
                      ...data,
                      socialLinks: { ...data.socialLinks, twitter: value },
                    })
                  }
                  placeholder='https://twitter.com/username'
                />
                <InputField
                  label='LinkedIn'
                  value={data.socialLinks.linkedin || ''}
                  onChange={(value) =>
                    onDataChange({
                      ...data,
                      socialLinks: { ...data.socialLinks, linkedin: value },
                    })
                  }
                  placeholder='https://linkedin.com/in/username'
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className='flex gap-3 py-4 lg:px-6 border-t border-grey-100 bg-white'>
        <button
          type='button'
          onClick={step === 'settings' ? handleBack : onClose}
          className='flex-1 py-3 px-4 border border-grey-300 rounded-lg font-medium text-grey-700 hover:bg-grey-50 transition-colors'
        >
          {step === 'settings' ? 'Back' : 'Cancel'}
        </button>
        <button
          type='button'
          onClick={handleNext}
          className='flex-1 py-3 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors'
        >
          {step === 'customize' ? 'Continue' : 'Create gift page'}
        </button>
      </div>
    </div>
  )
}

export default EditingSection
