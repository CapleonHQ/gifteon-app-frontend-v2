'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from 'react'
import { GiftPageData, Recipient } from '@/types/gifts'
import { useCustomGifts } from './hooks/useCustomGifts'
import { useGiftSettings } from './hooks/useGiftSettings'
import { useRecipients } from './hooks/useRecipients'
import { type CustomGiftForm } from './types'

export type { CustomGiftForm } from './types'

type CreateGiftContextValue = {
  giftPageData: GiftPageData
  setGiftPageData: (data: GiftPageData) => void
  updateTitle: (title: GiftPageData['title']) => void
  updateDescription: (description: GiftPageData['description']) => void
  updateButton: (button: GiftPageData['button']) => void
  updateSocialLink: (key: keyof GiftPageData['socialLinks'], value: string) => void
  handleMediaUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleMediaRemove: () => void
  giftFor: 'me' | 'someone' | ''
  setGiftFor: (value: 'me' | 'someone' | '') => void
  giftType: 'cash' | 'items' | ''
  setGiftType: (value: 'cash' | 'items' | '') => void
  currency: string
  setCurrency: (value: string) => void
  cashAmount: string
  setCashAmount: (value: string) => void
  minAmount: string
  setMinAmount: (value: string) => void
  maxAmount: string
  setMaxAmount: (value: string) => void
  targetAmount: string
  setTargetAmount: (value: string) => void
  customGifts: 'yes' | 'no' | ''
  setCustomGifts: (value: 'yes' | 'no' | '') => void
  addMusic: 'yes' | 'no' | ''
  setAddMusic: (value: 'yes' | 'no' | '') => void
  privacy: 'public' | 'shareable' | 'private' | ''
  setPrivacy: (value: 'public' | 'shareable' | 'private' | '') => void
  receiverName: string
  setReceiverName: (value: string) => void
  receiverEmail: string
  setReceiverEmail: (value: string) => void
  allowJoinGifting: 'yes' | 'no' | ''
  setAllowJoinGifting: (value: 'yes' | 'no' | '') => void
  joinTargetAmount: string
  setJoinTargetAmount: (value: string) => void
  joinMinAmount: string
  setJoinMinAmount: (value: string) => void
  setTimeframe: 'yes' | 'no' | ''
  setSetTimeframe: (value: 'yes' | 'no' | '') => void
  giftingEndDate: Date | undefined
  setGiftingEndDate: (value: Date | undefined) => void
  giftingEndTime: string
  setGiftingEndTime: (value: string) => void
  recipients: Recipient[]
  recipientForm: Recipient
  editingRecipientIndex: number | null
  handleRecipientChange: (field: keyof Recipient, value: string) => void
  saveRecipient: () => void
  removeRecipient: (index: number) => void
  editRecipient: (index: number) => void
  cancelEditRecipient: () => void
  customGiftForm: CustomGiftForm
  customGiftItems: CustomGiftForm[]
  editingCustomGiftIndex: number | null
  handleCustomGiftChange: (field: keyof CustomGiftForm, value: string) => void
  handleCustomGiftImageChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void
  handleCustomGiftRemoveImage: () => void
  saveCustomGift: () => void
  editCustomGift: (index: number) => void
  removeCustomGift: (index: number) => void
}

const CreateGiftContext = createContext<CreateGiftContextValue | null>(null)

export const CreateGiftProvider = ({ children }: { children: ReactNode }) => {
  const {
    giftSettings,
    setGiftPageData,
    updateTitle,
    updateDescription,
    updateButton,
    updateSocialLink,
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
  } = useGiftSettings()
  const {
    recipients,
    recipientForm,
    editingRecipientIndex,
    handleRecipientChange,
    saveRecipient,
    removeRecipient,
    editRecipient,
    cancelEditRecipient,
  } = useRecipients()
  const {
    customGiftForm,
    customGiftItems,
    editingCustomGiftIndex,
    handleCustomGiftChange,
    handleCustomGiftImageChange,
    handleCustomGiftRemoveImage,
    saveCustomGift,
    editCustomGift,
    removeCustomGift,
  } = useCustomGifts()

  const handleMediaUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onloadend = () => {
        setGiftPageData({
          ...giftSettings.giftPageData,
          media: {
            type: file.type.startsWith('video') ? 'video' : 'image',
            url: reader.result as string,
          },
        })
      }
      reader.readAsDataURL(file)
    },
    [giftSettings.giftPageData, setGiftPageData]
  )

  const handleMediaRemove = useCallback(() => {
    setGiftPageData({
      ...giftSettings.giftPageData,
      media: { type: 'image', url: '' },
    })
  }, [giftSettings.giftPageData, setGiftPageData])

  const value = useMemo(
    () => ({
      giftPageData: giftSettings.giftPageData,
      setGiftPageData,
      updateTitle,
      updateDescription,
      updateButton,
      updateSocialLink,
      handleMediaUpload,
      handleMediaRemove,
      giftFor: giftSettings.giftFor,
      setGiftFor,
      giftType: giftSettings.giftType,
      setGiftType,
      currency: giftSettings.currency,
      setCurrency,
      cashAmount: giftSettings.cashAmount,
      setCashAmount,
      minAmount: giftSettings.minAmount,
      setMinAmount,
      maxAmount: giftSettings.maxAmount,
      setMaxAmount,
      targetAmount: giftSettings.targetAmount,
      setTargetAmount,
      customGifts: giftSettings.customGifts,
      setCustomGifts,
      addMusic: giftSettings.addMusic,
      setAddMusic,
      privacy: giftSettings.privacy,
      setPrivacy,
      receiverName: giftSettings.receiverName,
      setReceiverName,
      receiverEmail: giftSettings.receiverEmail,
      setReceiverEmail,
      allowJoinGifting: giftSettings.allowJoinGifting,
      setAllowJoinGifting,
      joinTargetAmount: giftSettings.joinTargetAmount,
      setJoinTargetAmount,
      joinMinAmount: giftSettings.joinMinAmount,
      setJoinMinAmount,
      setTimeframe: giftSettings.setTimeframe,
      setSetTimeframe,
      giftingEndDate: giftSettings.giftingEndDate,
      setGiftingEndDate,
      giftingEndTime: giftSettings.giftingEndTime,
      setGiftingEndTime,
      recipients,
      recipientForm,
      editingRecipientIndex,
      handleRecipientChange,
      saveRecipient,
      removeRecipient,
      editRecipient,
      cancelEditRecipient,
      customGiftForm,
      customGiftItems,
      editingCustomGiftIndex,
      handleCustomGiftChange,
      handleCustomGiftImageChange,
      handleCustomGiftRemoveImage,
      saveCustomGift,
      editCustomGift,
      removeCustomGift,
    }),
    [
      giftSettings.giftPageData,
      setGiftPageData,
      updateTitle,
      updateDescription,
      updateButton,
      updateSocialLink,
      handleMediaUpload,
      handleMediaRemove,
      giftSettings.giftFor,
      setGiftFor,
      giftSettings.giftType,
      setGiftType,
      giftSettings.currency,
      setCurrency,
      giftSettings.cashAmount,
      setCashAmount,
      giftSettings.minAmount,
      setMinAmount,
      giftSettings.maxAmount,
      setMaxAmount,
      giftSettings.targetAmount,
      setTargetAmount,
      giftSettings.customGifts,
      setCustomGifts,
      giftSettings.addMusic,
      setAddMusic,
      giftSettings.privacy,
      setPrivacy,
      giftSettings.receiverName,
      setReceiverName,
      giftSettings.receiverEmail,
      setReceiverEmail,
      giftSettings.allowJoinGifting,
      setAllowJoinGifting,
      giftSettings.joinTargetAmount,
      setJoinTargetAmount,
      giftSettings.joinMinAmount,
      setJoinMinAmount,
      giftSettings.setTimeframe,
      setSetTimeframe,
      giftSettings.giftingEndDate,
      setGiftingEndDate,
      giftSettings.giftingEndTime,
      setGiftingEndTime,
      recipients,
      recipientForm,
      editingRecipientIndex,
      handleRecipientChange,
      saveRecipient,
      removeRecipient,
      editRecipient,
      cancelEditRecipient,
      customGiftForm,
      customGiftItems,
      editingCustomGiftIndex,
      handleCustomGiftChange,
      handleCustomGiftImageChange,
      handleCustomGiftRemoveImage,
      saveCustomGift,
      editCustomGift,
      removeCustomGift,
    ]
  )

  return (
    <CreateGiftContext.Provider value={value}>
      {children}
    </CreateGiftContext.Provider>
  )
}

export const useCreateGift = () => {
  const context = useContext(CreateGiftContext)
  if (!context) {
    throw new Error('useCreateGift must be used within CreateGiftProvider')
  }
  return context
}
