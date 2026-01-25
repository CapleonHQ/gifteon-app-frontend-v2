'use client'

import { useCallback, useState } from 'react'
import { type CustomGiftForm } from '../types'

type UseCustomGiftsReturn = {
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

export const useCustomGifts = (): UseCustomGiftsReturn => {
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

  const handleCustomGiftChange = useCallback(
    (field: keyof CustomGiftForm, value: string) => {
      setCustomGiftForm((prev) => ({ ...prev, [field]: value }))
    },
    []
  )

  const handleCustomGiftImageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
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
    },
    []
  )

  const handleCustomGiftRemoveImage = useCallback(() => {
    setCustomGiftForm((prev) => ({ ...prev, imageName: '', imageUrl: '' }))
  }, [])

  const saveCustomGift = useCallback(() => {
    const trimmedTitle = customGiftForm.title.trim()
    const trimmedPrice = customGiftForm.price.trim()
    if (!trimmedTitle || !trimmedPrice) return

    if (editingCustomGiftIndex !== null) {
      setCustomGiftItems((prev) =>
        prev.map((item, index) =>
          index === editingCustomGiftIndex
            ? { ...customGiftForm, title: trimmedTitle, price: trimmedPrice }
            : item
        )
      )
    } else {
      setCustomGiftItems((prev) => [
        ...prev,
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
  }, [customGiftForm, editingCustomGiftIndex])

  const editCustomGift = useCallback(
    (index: number) => {
      setCustomGiftForm(customGiftItems[index])
      setEditingCustomGiftIndex(index)
    },
    [customGiftItems]
  )

  const removeCustomGift = useCallback((index: number) => {
    setCustomGiftItems((prev) => prev.filter((_, i) => i !== index))
  }, [])

  return {
    customGiftForm,
    customGiftItems,
    editingCustomGiftIndex,
    handleCustomGiftChange,
    handleCustomGiftImageChange,
    handleCustomGiftRemoveImage,
    saveCustomGift,
    editCustomGift,
    removeCustomGift,
  }
}
