'use client'

import { useCallback, useReducer } from 'react'
import { type GiftPageData } from '@/types/gifts'

type GiftSettingsState = {
  giftPageData: GiftPageData
  giftFor: 'for_me' | 'someone_else' | ''
  giftType: 'cash' | 'items' | 'cash_items' | ''
  currency: string
  cashAmount: string
  minAmount: string
  targetAmount: string
  customGifts: 'yes' | 'no' | ''
  addMusic: 'yes' | 'no' | ''
  privacy: 'public' | 'shareable' | 'private' | ''
  receiverName: string
  receiverEmail: string
  allowJoinGifting: 'yes' | 'no' | ''
  joinTargetAmount: string
  joinMinAmount: string
  setTimeframe: 'yes' | 'no' | ''
  giftingEndDate: Date | undefined
  giftingEndTime: string
}

type GiftSettingsAction =
  | { type: 'SET_GIFT_PAGE_DATA'; value: GiftPageData }
  | { type: 'UPDATE_TITLE'; value: GiftPageData['title'] }
  | { type: 'UPDATE_DESCRIPTION'; value: GiftPageData['description'] }
  | { type: 'UPDATE_BUTTON'; value: GiftPageData['button'] }
  | {
      type: 'UPDATE_SOCIAL_LINK'
      key: keyof GiftPageData['socialLinks']
      value: string
    }
  | {
      type: 'SET_FIELD'
      field: Exclude<keyof GiftSettingsState, 'giftPageData'>
      value: GiftSettingsState[Exclude<keyof GiftSettingsState, 'giftPageData'>]
    }

const giftSettingsReducer = (
  state: GiftSettingsState,
  action: GiftSettingsAction
): GiftSettingsState => {
  switch (action.type) {
    case 'SET_GIFT_PAGE_DATA':
      return { ...state, giftPageData: action.value }
    case 'UPDATE_TITLE':
      return {
        ...state,
        giftPageData: { ...state.giftPageData, title: action.value },
      }
    case 'UPDATE_DESCRIPTION':
      return {
        ...state,
        giftPageData: { ...state.giftPageData, description: action.value },
      }
    case 'UPDATE_BUTTON':
      return {
        ...state,
        giftPageData: { ...state.giftPageData, button: action.value },
      }
    case 'UPDATE_SOCIAL_LINK':
      return {
        ...state,
        giftPageData: {
          ...state.giftPageData,
          socialLinks: {
            ...state.giftPageData.socialLinks,
            [action.key]: action.value,
          },
        },
      }
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value }
    default:
      return state
  }
}

const initialGiftSettingsState: GiftSettingsState = {
  giftPageData: {
    media: { type: 'image', url: '' },
    title: {
      text: 'Title here',
      font: 'Clash Display',
      color: '#121212',
      alignment: 'left',
      size: '32px',
      bold: false,
      italic: false,
      underline: false,
    },
    description: {
      text: 'You can include the description of the celebration here. You can include the description of the celebration here.',
      font: 'Inter',
      color: '#4B5563',
      alignment: 'left',
      size: '14px',
      bold: false,
      italic: false,
      underline: false,
    },
    button: {
      label: 'Say something nice 😊',
      backgroundColor: '#F3F2F2',
      textColor: '#121212',
    },
    socialLinks: {
      instagram: '',
      twitter: '',
      linkedin: '',
      facebook: '',
    },
  },
  giftFor: '',
  giftType: '',
  currency: '',
  cashAmount: '',
  minAmount: '',
  targetAmount: '',
  customGifts: '',
  addMusic: 'no',
  privacy: '',
  receiverName: '',
  receiverEmail: '',
  allowJoinGifting: '',
  joinTargetAmount: '',
  joinMinAmount: '',
  setTimeframe: '',
  giftingEndDate: undefined,
  giftingEndTime: '',
}

type UseGiftSettingsReturn = {
  giftSettings: GiftSettingsState
  setGiftPageData: (data: GiftPageData) => void
  updateTitle: (title: GiftPageData['title']) => void
  updateDescription: (description: GiftPageData['description']) => void
  updateButton: (button: GiftPageData['button']) => void
  updateSocialLink: (key: keyof GiftPageData['socialLinks'], value: string) => void
  setGiftFor: (value: GiftSettingsState['giftFor']) => void
  setGiftType: (value: GiftSettingsState['giftType']) => void
  setCurrency: (value: string) => void
  setCashAmount: (value: string) => void
  setMinAmount: (value: string) => void
  setTargetAmount: (value: string) => void
  setCustomGifts: (value: GiftSettingsState['customGifts']) => void
  setAddMusic: (value: GiftSettingsState['addMusic']) => void
  setPrivacy: (value: GiftSettingsState['privacy']) => void
  setReceiverName: (value: string) => void
  setReceiverEmail: (value: string) => void
  setAllowJoinGifting: (
    value: GiftSettingsState['allowJoinGifting']
  ) => void
  setJoinTargetAmount: (value: string) => void
  setJoinMinAmount: (value: string) => void
  setSetTimeframe: (value: GiftSettingsState['setTimeframe']) => void
  setGiftingEndDate: (value: Date | undefined) => void
  setGiftingEndTime: (value: string) => void
}

export const useGiftSettings = (): UseGiftSettingsReturn => {
  const [giftSettings, dispatch] = useReducer(
    giftSettingsReducer,
    initialGiftSettingsState
  )

  const setGiftPageData = useCallback((data: GiftPageData) => {
    dispatch({ type: 'SET_GIFT_PAGE_DATA', value: data })
  }, [])

  const updateTitle = useCallback((title: GiftPageData['title']) => {
    dispatch({ type: 'UPDATE_TITLE', value: title })
  }, [])

  const updateDescription = useCallback(
    (description: GiftPageData['description']) => {
      dispatch({ type: 'UPDATE_DESCRIPTION', value: description })
    },
    []
  )

  const updateButton = useCallback((button: GiftPageData['button']) => {
    dispatch({ type: 'UPDATE_BUTTON', value: button })
  }, [])

  const updateSocialLink = useCallback(
    (key: keyof GiftPageData['socialLinks'], value: string) => {
      dispatch({ type: 'UPDATE_SOCIAL_LINK', key, value })
    },
    []
  )

  const setGiftFor = useCallback((value: GiftSettingsState['giftFor']) => {
    dispatch({ type: 'SET_FIELD', field: 'giftFor', value })
  }, [])
  const setGiftType = useCallback((value: GiftSettingsState['giftType']) => {
    dispatch({ type: 'SET_FIELD', field: 'giftType', value })
  }, [])
  const setCurrency = useCallback((value: string) => {
    const normalizedValue = value.trim().toUpperCase()
    const mappedValue =
      normalizedValue === 'NAIRA' ? 'NGN' : normalizedValue
    dispatch({ type: 'SET_FIELD', field: 'currency', value: mappedValue })
  }, [])
  const setCashAmount = useCallback((value: string) => {
    dispatch({ type: 'SET_FIELD', field: 'cashAmount', value })
  }, [])
  const setMinAmount = useCallback((value: string) => {
    dispatch({ type: 'SET_FIELD', field: 'minAmount', value })
  }, [])
  const setTargetAmount = useCallback((value: string) => {
    dispatch({ type: 'SET_FIELD', field: 'targetAmount', value })
  }, [])
  const setCustomGifts = useCallback(
    (value: GiftSettingsState['customGifts']) => {
      dispatch({ type: 'SET_FIELD', field: 'customGifts', value })
    },
    []
  )
  const setAddMusic = useCallback(
    (value: GiftSettingsState['addMusic']) => {
      dispatch({ type: 'SET_FIELD', field: 'addMusic', value })
    },
    []
  )
  const setPrivacy = useCallback((value: GiftSettingsState['privacy']) => {
    dispatch({ type: 'SET_FIELD', field: 'privacy', value })
  }, [])
  const setReceiverName = useCallback((value: string) => {
    dispatch({ type: 'SET_FIELD', field: 'receiverName', value })
  }, [])
  const setReceiverEmail = useCallback((value: string) => {
    dispatch({ type: 'SET_FIELD', field: 'receiverEmail', value })
  }, [])
  const setAllowJoinGifting = useCallback(
    (value: GiftSettingsState['allowJoinGifting']) => {
      dispatch({ type: 'SET_FIELD', field: 'allowJoinGifting', value })
    },
    []
  )
  const setJoinTargetAmount = useCallback((value: string) => {
    dispatch({ type: 'SET_FIELD', field: 'joinTargetAmount', value })
  }, [])
  const setJoinMinAmount = useCallback((value: string) => {
    dispatch({ type: 'SET_FIELD', field: 'joinMinAmount', value })
  }, [])
  const setSetTimeframe = useCallback(
    (value: GiftSettingsState['setTimeframe']) => {
      dispatch({ type: 'SET_FIELD', field: 'setTimeframe', value })
    },
    []
  )
  const setGiftingEndDate = useCallback((value: Date | undefined) => {
    dispatch({ type: 'SET_FIELD', field: 'giftingEndDate', value })
  }, [])
  const setGiftingEndTime = useCallback((value: string) => {
    dispatch({ type: 'SET_FIELD', field: 'giftingEndTime', value })
  }, [])

  return {
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
  }
}
