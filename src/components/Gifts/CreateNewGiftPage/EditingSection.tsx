import { GiftPageData, Recipient } from '@/types/gifts'
import { useEffect, useState } from 'react'
import { useMobileBack } from '@/components/Layout/MobileTitleContext'
import EditingHeader from './EditingHeader'
import EditingFooter from './EditingFooter'
import CustomizeStep from './CustomizeStep'
import SettingsStep from './SettingsStep'

type Step = 'customize' | 'settings'
type CustomGiftForm = {
  title: string
  price: string
  imageName: string
  imageUrl?: string
  quantity: string
}

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
  const { setOnBack } = useMobileBack()
  const [giftFor, setGiftFor] = useState<'me' | 'someone' | ''>('')
  const [giftType, setGiftType] = useState<'cash' | 'items' | ''>('')
  const [currency, setCurrency] = useState('')
  const [cashAmount, setCashAmount] = useState('')
  const [minAmount, setMinAmount] = useState('')
  const [maxAmount, setMaxAmount] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [customGifts, setCustomGifts] = useState<'yes' | 'no' | ''>('')
  const [addMusic, setAddMusic] = useState<'yes' | 'no' | ''>('')
  const [privacy, setPrivacy] = useState<
    'public' | 'shareable' | 'private' | ''
  >('')
  const [receiverName, setReceiverName] = useState('')
  const [receiverEmail, setReceiverEmail] = useState('')
  const [allowJoinGifting, setAllowJoinGifting] = useState<'yes' | 'no' | ''>('')
  const [joinTargetAmount, setJoinTargetAmount] = useState('')
  const [joinMinAmount, setJoinMinAmount] = useState('')
  const [setTimeframe, setSetTimeframe] = useState<'yes' | 'no' | ''>('')
  const [giftingEndDate, setGiftingEndDate] = useState<Date | undefined>(
    undefined
  )
  const [giftingEndTime, setGiftingEndTime] = useState('')
  const [recipients, setRecipients] = useState<Recipient[]>([])
  const [recipientForm, setRecipientForm] = useState<Recipient>({
    name: '',
    email: '',
  })
  const [editingRecipientIndex, setEditingRecipientIndex] = useState<
    number | null
  >(null)
  const [customGiftForm, setCustomGiftForm] = useState<CustomGiftForm>({
    title: '',
    price: '',
    imageName: '',
    imageUrl: '',
    quantity: '1',
  })
  const [customGiftItems, setCustomGiftItems] = useState<CustomGiftForm[]>([])
  const [editingCustomGiftIndex, setEditingCustomGiftIndex] = useState<
    number | null
  >(null)

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

  const handleRecipientChange = (field: keyof Recipient, value: string) => {
    setRecipientForm((prev) => ({ ...prev, [field]: value }))
  }

  const saveRecipient = () => {
    const trimmedName = recipientForm.name.trim()
    const trimmedEmail = recipientForm.email.trim()

    if (!trimmedName || !trimmedEmail) return

    if (editingRecipientIndex !== null) {
      const updated = recipients.map((recipient, index) =>
        index === editingRecipientIndex
          ? { name: trimmedName, email: trimmedEmail }
          : recipient
      )
      setRecipients(updated)
    } else {
      setRecipients([
        ...recipients.filter((recipient) => recipient.name || recipient.email),
        { name: trimmedName, email: trimmedEmail },
      ])
    }

    setRecipientForm({ name: '', email: '' })
    setEditingRecipientIndex(null)
  }

  const removeRecipient = (index: number) => {
    setRecipients(recipients.filter((_, i) => i !== index))
  }

  const handleEditRecipient = (index: number) => {
    setRecipientForm(recipients[index])
    setEditingRecipientIndex(index)
  }

  const cancelEditRecipient = () => {
    setRecipientForm({ name: '', email: '' })
    setEditingRecipientIndex(null)
  }

  const handleCustomGiftChange = (
    field: keyof CustomGiftForm,
    value: string
  ) => {
    setCustomGiftForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleCustomGiftImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return
    const imageUrl = file.type.startsWith('image/')
      ? URL.createObjectURL(file)
      : ''
    setCustomGiftForm((prev) => ({
      ...prev,
      imageName: file.name,
      imageUrl,
    }))
  }

  const handleCustomGiftRemoveImage = () => {
    setCustomGiftForm((prev) => ({ ...prev, imageName: '', imageUrl: '' }))
  }

  const saveCustomGift = () => {
    const trimmedTitle = customGiftForm.title.trim()
    const trimmedPrice = customGiftForm.price.trim()

    if (!trimmedTitle || !trimmedPrice) return

    if (editingCustomGiftIndex !== null) {
      const updated = customGiftItems.map((item, index) =>
        index === editingCustomGiftIndex
          ? { ...customGiftForm, title: trimmedTitle, price: trimmedPrice }
          : item
      )
      setCustomGiftItems(updated)
    } else {
      setCustomGiftItems([
        ...customGiftItems,
        { ...customGiftForm, title: trimmedTitle, price: trimmedPrice },
      ])
    }

    setCustomGiftForm({
      title: '',
      price: '',
      imageName: '',
      imageUrl: '',
      quantity: '1',
    })
    setEditingCustomGiftIndex(null)
  }

  const editCustomGift = (index: number) => {
    setCustomGiftForm(customGiftItems[index])
    setEditingCustomGiftIndex(index)
  }

  const removeCustomGift = (index: number) => {
    setCustomGiftItems(customGiftItems.filter((_, i) => i !== index))
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

  useEffect(() => {
    setOnBack(() => () => {
      if (step === 'settings') {
        setStep('customize')
      } else {
        onClose()
      }
    })

    return () => setOnBack(undefined)
  }, [onClose, setOnBack, step])

  return (
    <div className='h-full relative lg:rounded-t-3xl lg:shadow-[0px_-5px_13px_5px_#1019280F] bg-white flex flex-col overflow-hidden'>
      <EditingHeader step={step} onClose={onClose} />

      {/* Content */}
      <div className='flex-1 overflow-y-auto sm:px-6 sm:py-5'>
        {step === 'customize' ? (
          <CustomizeStep
            data={data}
            onDataChange={onDataChange}
            onMediaUpload={handleMediaUpload}
            onMediaRemove={handleMediaRemove}
          />
        ) : (
          <SettingsStep
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
            customGiftItems={customGiftItems}
            customGiftForm={customGiftForm}
            editingCustomGiftIndex={editingCustomGiftIndex}
            recipients={recipients}
            recipientForm={recipientForm}
            editingRecipientIndex={editingRecipientIndex}
            onGiftForChange={(value) => setGiftFor(value as any)}
            onGiftTypeChange={(value) => setGiftType(value as any)}
            onCurrencyChange={(value) => {
              if (value !== 'placeholder') {
                setCurrency(value)
              }
            }}
            onCashAmountChange={setCashAmount}
            onMinAmountChange={setMinAmount}
            onMaxAmountChange={setMaxAmount}
            onTargetAmountChange={setTargetAmount}
            onCustomGiftsChange={(value) => setCustomGifts(value as any)}
            onAddMusicChange={(value) => setAddMusic(value as any)}
            onPrivacyChange={(value) => setPrivacy(value as any)}
            onReceiverNameChange={setReceiverName}
            onReceiverEmailChange={setReceiverEmail}
            onAllowJoinGiftingChange={(value) => setAllowJoinGifting(value as any)}
            onJoinTargetAmountChange={setJoinTargetAmount}
            onJoinMinAmountChange={setJoinMinAmount}
            onSetTimeframeChange={(value) => setSetTimeframe(value as any)}
            onGiftingEndDateChange={setGiftingEndDate}
            onGiftingEndTimeChange={setGiftingEndTime}
            onCustomGiftChange={handleCustomGiftChange}
            onCustomGiftImageChange={handleCustomGiftImageChange}
            onCustomGiftRemoveImage={handleCustomGiftRemoveImage}
            onSaveCustomGift={saveCustomGift}
            onEditCustomGift={editCustomGift}
            onRemoveCustomGift={removeCustomGift}
            onRecipientChange={handleRecipientChange}
            onSaveRecipient={saveRecipient}
            onCancelEditRecipient={cancelEditRecipient}
            onEditRecipient={handleEditRecipient}
            onRemoveRecipient={removeRecipient}
            onSocialLinkChange={(key, value) =>
              onDataChange({
                ...data,
                socialLinks: { ...data.socialLinks, [key]: value },
              })
            }
            socialLinks={data.socialLinks}
          />
        )}
      </div>

      <EditingFooter
        step={step}
        onBack={handleBack}
        onClose={onClose}
        onNext={handleNext}
      />
    </div>
  )
}

export default EditingSection
