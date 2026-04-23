'use client'

import { useMemo, useState } from 'react'
import { MoreVertical, X } from 'lucide-react'
import { toApiError } from '@/api/errorHelpers'
import ResponsiveModal from '@/components/common/ResponsiveModal'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  useDeleteGiftBillBeneficiary,
  useGiftBillBeneficiaries,
  useUpdateGiftBillBeneficiaryNickname,
} from '@/hooks/tanstack/bills'
import type { GiftBillBeneficiary } from '@/types/Bills'
import type { BillsTabKey } from '../constants'
import { getBeneficiaryIdentifiersForContext } from '../utils'

type BillsBeneficiariesModalProps = {
  isOpen: boolean
  onClose: () => void
  onPickBeneficiary: (beneficiary: GiftBillBeneficiary) => void
  activeTab: BillsTabKey
}

const BillsBeneficiariesModal = ({
  isOpen,
  onClose,
  onPickBeneficiary,
  activeTab,
}: BillsBeneficiariesModalProps) => {
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState('')
  const [editingNickname, setEditingNickname] = useState('')
  const [feedback, setFeedback] = useState<{
    tone: 'success' | 'error'
    text: string
  } | null>(null)

  const beneficiariesQuery = useGiftBillBeneficiaries({
    page: 1,
    limit: 100,
  })
  const updateNicknameMutation = useUpdateGiftBillBeneficiaryNickname()
  const deleteBeneficiaryMutation = useDeleteGiftBillBeneficiary()

  const beneficiaries = useMemo(() => {
    const liveBeneficiaries = beneficiariesQuery.data?.data?.beneficiaries ?? []
    const source = liveBeneficiaries
    const term = search.trim().toLowerCase()

    const matchesContext = (beneficiary: GiftBillBeneficiary) => {
      return getBeneficiaryIdentifiersForContext(activeTab, beneficiary).length > 0
    }

    const searchable = source.filter(matchesContext)
    if (!term) return searchable

    return searchable.filter((beneficiary) => {
      const identifiers = getBeneficiaryIdentifiersForContext(
        activeTab,
        beneficiary
      )
      const searchableValues: string[] = []
      searchableValues.push(...identifiers)
      searchableValues.push(beneficiary.nickname || '', beneficiary.recipient || '')
      return searchableValues.join(' ').toLowerCase().includes(term)
    })
  }, [beneficiariesQuery.data?.data?.beneficiaries, search, activeTab])

  const isBusy =
    updateNicknameMutation.isPending || deleteBeneficiaryMutation.isPending

  const handleEdit = (beneficiary: GiftBillBeneficiary) => {
    setEditingId(beneficiary.id)
    setEditingNickname(beneficiary.nickname || beneficiary.recipient || '')
    setFeedback(null)
  }

  const handleSave = async () => {
    const nickname = editingNickname.trim()
    if (!editingId || !nickname) return
    setFeedback(null)
    try {
      await updateNicknameMutation.mutateAsync({
        beneficiaryId: editingId,
        data: { nickname },
      })
      setEditingId('')
      setEditingNickname('')
      setFeedback({ tone: 'success', text: 'Beneficiary name updated.' })
    } catch (error) {
      setFeedback({
        tone: 'error',
        text: toApiError(error).message || 'Unable to update beneficiary.',
      })
    }
  }

  const handleDelete = async (beneficiaryId: string) => {
    setFeedback(null)
    try {
      await deleteBeneficiaryMutation.mutateAsync(beneficiaryId)
      if (editingId === beneficiaryId) {
        setEditingId('')
        setEditingNickname('')
      }
      setFeedback({ tone: 'success', text: 'Beneficiary deleted.' })
    } catch (error) {
      setFeedback({
        tone: 'error',
        text: toApiError(error).message || 'Unable to delete beneficiary.',
      })
    }
  }

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      desktopMaxWidthClass='max-w-[760px]'
      desktopPanelClassName='min-h-[540px]'
      header={
        <div className='space-y-3'>
          <div className='flex items-center justify-between gap-3'>
            <h3 className='text-lg font-semibold text-grey-900'>
              Select Beneficiary
            </h3>
            <button
              type='button'
              onClick={onClose}
              aria-label='Close beneficiaries picker'
              className='h-8 w-8 rounded-full text-grey-600 hover:text-grey-800 hover:bg-grey-50 inline-flex items-center justify-center'
            >
              <X className='h-4 w-4' />
            </button>
          </div>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder='Search beneficiaries'
            className='w-full px-3 py-3 border border-grey-50 rounded-xl text-sm text-grey-800 placeholder:text-grey-500 bg-white focus:outline-none focus:ring-1 focus:ring-primary-300'
          />
        </div>
      }
      body={
        <div className='space-y-3'>
          {feedback ? (
            <div
              className={`rounded-lg px-3 py-2 text-sm ${
                feedback.tone === 'error'
                  ? 'bg-error-50 text-error-700'
                  : 'bg-success-50 text-success-700'
              }`}
            >
              {feedback.text}
            </div>
          ) : null}
          {beneficiariesQuery.isLoading ? (
            <p className='text-sm text-grey-600'>Loading beneficiaries...</p>
          ) : beneficiariesQuery.isError ? (
            <p className='text-sm text-error-700'>
              {toApiError(beneficiariesQuery.error).message ||
                'Unable to load beneficiaries.'}
            </p>
          ) : beneficiaries.length === 0 ? (
            <p className='text-sm text-grey-600'>No beneficiaries found.</p>
          ) : (
            beneficiaries.map((beneficiary) => {
              const identifiers = getBeneficiaryIdentifiersForContext(
                activeTab,
                beneficiary
              )
              const primaryIdentifier = identifiers[0] || ''
              const secondaryIdentifier = identifiers[1] || ''
              const displayName =
                beneficiary.nickname ||
                beneficiary.recipient ||
                primaryIdentifier ||
                secondaryIdentifier ||
                'Beneficiary'
              const detail = [primaryIdentifier, secondaryIdentifier]
                .filter(Boolean)
                .join('  •  ')

              return (
                <div
                  key={beneficiary.id}
                  className='rounded-lg border border-grey-100 px-3 py-2 flex items-center justify-between gap-3'
                >
                  <div className='min-w-0'>
                    {editingId === beneficiary.id ? (
                      <input
                        value={editingNickname}
                        onChange={(event) =>
                          setEditingNickname(event.target.value)
                        }
                        className='w-full px-3 py-2 border border-grey-50 rounded-xl text-sm text-grey-800 placeholder:text-grey-500 bg-white focus:outline-none focus:ring-1 focus:ring-primary-300'
                      />
                    ) : (
                      <p className='text-sm font-medium text-grey-900 truncate'>
                        {displayName}
                      </p>
                    )}
                    {detail ? (
                      <p className='text-xs text-grey-600 truncate'>{detail}</p>
                    ) : null}
                  </div>
                  <div className='flex items-center gap-2'>
                    {editingId === beneficiary.id ? (
                      <>
                        <button
                          type='button'
                          onClick={() => void handleSave()}
                          disabled={isBusy || !editingNickname.trim()}
                          className='h-8 px-3 rounded-lg bg-primary-500 text-white text-xs font-medium disabled:opacity-50'
                        >
                          Save
                        </button>
                        <button
                          type='button'
                          onClick={() => {
                            setEditingId('')
                            setEditingNickname('')
                          }}
                          disabled={isBusy}
                          className='h-8 px-2 rounded-lg border border-grey-200 text-grey-700 text-xs disabled:opacity-50'
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type='button'
                          onClick={() => onPickBeneficiary(beneficiary)}
                          className='h-8 px-3 rounded-lg bg-primary-500 text-white text-xs font-medium'
                        >
                          Use
                        </button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              type='button'
                              aria-label='More beneficiary actions'
                              className='h-8 w-8 rounded-lg border border-grey-200 text-grey-600 hover:bg-grey-50 inline-flex items-center justify-center'
                            >
                              <MoreVertical className='h-4 w-4' />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuItem
                              onClick={() => handleEdit(beneficiary)}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              variant='destructive'
                              onClick={() => void handleDelete(beneficiary.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      }
    />
  )
}

export default BillsBeneficiariesModal
