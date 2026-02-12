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

type GiftPageDataContextValue = {
  giftPageData: GiftPageData
  setGiftPageData: (data: GiftPageData) => void
  updateTitle: (title: GiftPageData['title']) => void
  updateDescription: (description: GiftPageData['description']) => void
  updateButton: (button: GiftPageData['button']) => void
  updateSocialLink: (key: keyof GiftPageData['socialLinks'], value: string) => void
  handleMediaUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleMediaRemove: () => void
}

type GiftSettingsContextValue = {
  giftFor: 'for_me' | 'someone_else' | ''
  setGiftFor: (value: 'for_me' | 'someone_else' | '') => void
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
}

type RecipientsContextValue = {
  recipients: Recipient[]
  recipientForm: Recipient
  editingRecipientIndex: number | null
  handleRecipientChange: (field: keyof Recipient, value: string) => void
  saveRecipient: () => void
  removeRecipient: (index: number) => void
  editRecipient: (index: number) => void
  cancelEditRecipient: () => void
}

type CustomGiftsContextValue = {
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

const GiftPageDataContext = createContext<GiftPageDataContextValue | null>(null)
const GiftSettingsContext = createContext<GiftSettingsContextValue | null>(null)
const RecipientsContext = createContext<RecipientsContextValue | null>(null)
const CustomGiftsContext = createContext<CustomGiftsContextValue | null>(null)

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
            file,
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
      media: { type: 'image', url: '', file: undefined },
    })
  }, [giftSettings.giftPageData, setGiftPageData])

  const giftPageDataValue = useMemo(
    () => ({
      giftPageData: giftSettings.giftPageData,
      setGiftPageData,
      updateTitle,
      updateDescription,
      updateButton,
      updateSocialLink,
      handleMediaUpload,
      handleMediaRemove,
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
    ]
  )

  const giftSettingsValue = useMemo(
    () => ({
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
    }),
    [
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
    ]
  )

  const recipientsValue = useMemo(
    () => ({
      recipients,
      recipientForm,
      editingRecipientIndex,
      handleRecipientChange,
      saveRecipient,
      removeRecipient,
      editRecipient,
      cancelEditRecipient,
    }),
    [
      recipients,
      recipientForm,
      editingRecipientIndex,
      handleRecipientChange,
      saveRecipient,
      removeRecipient,
      editRecipient,
      cancelEditRecipient,
    ]
  )

  const customGiftsValue = useMemo(
    () => ({
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
    <GiftPageDataContext.Provider value={giftPageDataValue}>
      <GiftSettingsContext.Provider value={giftSettingsValue}>
        <RecipientsContext.Provider value={recipientsValue}>
          <CustomGiftsContext.Provider value={customGiftsValue}>
            {children}
          </CustomGiftsContext.Provider>
        </RecipientsContext.Provider>
      </GiftSettingsContext.Provider>
    </GiftPageDataContext.Provider>
  )
}

export const useGiftPageData = () => {
  const context = useContext(GiftPageDataContext)
  if (!context) {
    throw new Error('useGiftPageData must be used within CreateGiftProvider')
  }
  return context
}

export const useGiftSettingsContext = () => {
  const context = useContext(GiftSettingsContext)
  if (!context) {
    throw new Error('useGiftSettingsContext must be used within CreateGiftProvider')
  }
  return context
}

export const useRecipientsContext = () => {
  const context = useContext(RecipientsContext)
  if (!context) {
    throw new Error('useRecipientsContext must be used within CreateGiftProvider')
  }
  return context
}

export const useCustomGiftsContext = () => {
  const context = useContext(CustomGiftsContext)
  if (!context) {
    throw new Error('useCustomGiftsContext must be used within CreateGiftProvider')
  }
  return context
}
