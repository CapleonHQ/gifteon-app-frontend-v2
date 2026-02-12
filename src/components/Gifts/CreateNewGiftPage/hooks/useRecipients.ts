'use client'

import { useCallback, useState } from 'react'
import { type Recipient } from '@/types/gifts'

type UseRecipientsReturn = {
  recipients: Recipient[]
  recipientForm: Recipient
  editingRecipientIndex: number | null
  handleRecipientChange: (field: keyof Recipient, value: string) => void
  saveRecipient: () => void
  removeRecipient: (index: number) => void
  editRecipient: (index: number) => void
  cancelEditRecipient: () => void
}

export const useRecipients = (): UseRecipientsReturn => {
  const [recipients, setRecipients] = useState<Recipient[]>([])
  const [recipientForm, setRecipientForm] = useState<Recipient>({
    name: '',
    email: '',
  })
  const [editingRecipientIndex, setEditingRecipientIndex] = useState<
    number | null
  >(null)

  const handleRecipientChange = useCallback(
    (field: keyof Recipient, value: string) => {
      setRecipientForm((prev) => ({ ...prev, [field]: value }))
    },
    []
  )

  const saveRecipient = useCallback(() => {
    const trimmedName = recipientForm.name.trim()
    const trimmedEmail = recipientForm.email.trim()
    if (!trimmedName || !trimmedEmail) return

    if (editingRecipientIndex !== null) {
      setRecipients((prev) =>
        prev.map((recipient, index) =>
          index === editingRecipientIndex
            ? { name: trimmedName, email: trimmedEmail }
            : recipient
        )
      )
    } else {
      setRecipients((prev) => [
        ...prev.filter((recipient) => recipient.name || recipient.email),
        { name: trimmedName, email: trimmedEmail },
      ])
    }

    setRecipientForm({ name: '', email: '' })
    setEditingRecipientIndex(null)
  }, [editingRecipientIndex, recipientForm])

  const removeRecipient = useCallback((index: number) => {
    setRecipients((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const editRecipient = useCallback(
    (index: number) => {
      setRecipientForm(recipients[index])
      setEditingRecipientIndex(index)
    },
    [recipients]
  )

  const cancelEditRecipient = useCallback(() => {
    setRecipientForm({ name: '', email: '' })
    setEditingRecipientIndex(null)
  }, [])

  return {
    recipients,
    recipientForm,
    editingRecipientIndex,
    handleRecipientChange,
    saveRecipient,
    removeRecipient,
    editRecipient,
    cancelEditRecipient,
  }
}
