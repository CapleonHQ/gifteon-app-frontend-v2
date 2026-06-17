'use client'

import { useState } from 'react'
import ResponsiveModal from '@/components/common/ResponsiveModal'
import { InlineError } from '@/components/Stores/Bills/config'
import BillsDatePickerField from '@/components/Stores/Bills/components/BillsDatePickerField'
import BillsTimePickerField from '@/components/Stores/Bills/components/BillsTimePickerField'
import { formatAmountDigits } from '@/lib/utils/currency'
import { combineDateTime, isoToDate, isoToTime } from '@/lib/utils/dateTime'
import { toApiError } from '@/api/errorHelpers'
import { useUpdateGiveaway } from '@/hooks/tanstack/giveaways'
import type { Giveaway, UpdateGiveawayBody } from '@/types/Giveaways'

type EditGiveawayModalProps = {
  isOpen: boolean
  giveaway: Giveaway
  onClose: () => void
  onUpdated: () => void
}

const INPUT_CLASS =
  'w-full px-3 py-3 border border-grey-50 rounded-xl text-sm text-grey-800 placeholder:text-grey-500 bg-white focus:outline-none focus:ring-1 focus:ring-primary-300'
const LABEL_CLASS = 'text-xs font-medium text-grey-700'

const EditGiveawayModal = ({
  isOpen,
  giveaway,
  onClose,
  onUpdated,
}: EditGiveawayModalProps) => {
  const [title, setTitle] = useState(giveaway.title)
  const [prizeDescription, setPrizeDescription] = useState(
    giveaway.prizeDescription
  )
  const [winnerCount, setWinnerCount] = useState(String(giveaway.winnerCount))
  const [maxParticipants, setMaxParticipants] = useState(
    String(giveaway.maxParticipants)
  )
  const [startsAt, setStartsAt] = useState(giveaway.startsAt)
  const [endsAt, setEndsAt] = useState(giveaway.endsAt)
  const [fieldErrors, setFieldErrors] = useState<{
    title?: string
    endsAt?: string
  }>({})
  const [apiError, setApiError] = useState('')

  const updateMutation = useUpdateGiveaway(giveaway.id)

  const handleSubmit = async () => {
    setApiError('')
    const errors: { title?: string; endsAt?: string } = {}
    if (!title.trim()) errors.title = 'Add a giveaway title.'
    if (new Date(endsAt).getTime() <= new Date(startsAt).getTime())
      errors.endsAt = 'End must be after the start time.'
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    setFieldErrors({})
    const body: UpdateGiveawayBody = {
      title: title.trim(),
      prizeDescription: prizeDescription.trim(),
      winnerCount: Number(winnerCount) || giveaway.winnerCount,
      maxParticipants: Number(maxParticipants) || giveaway.maxParticipants,
      startsAt: new Date(startsAt).toISOString(),
      endsAt: new Date(endsAt).toISOString(),
    }
    try {
      await updateMutation.mutateAsync(body)
      onUpdated()
      onClose()
    } catch (err) {
      setApiError(toApiError(err).message || 'Unable to update giveaway.')
    }
  }

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      header={
        <div>
          <h3 className='text-lg font-medium text-blackish'>Edit giveaway</h3>
          <p className='text-sm text-grey-600'>
            Update details before the giveaway goes live.
          </p>
        </div>
      }
      body={
        <div className='flex flex-col gap-4'>
          {apiError ? (
            <div className='rounded-lg px-3 py-2.5 text-sm bg-error-50 text-error-700'>
              {apiError}
            </div>
          ) : null}
          <div className='space-y-1.5'>
            <p className={LABEL_CLASS}>Title</p>
            <input
              type='text'
              className={`${INPUT_CLASS} ${
                fieldErrors.title ? 'border-error-300!' : ''
              }`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <InlineError message={fieldErrors.title} />
          </div>
          <div className='space-y-1.5'>
            <p className={LABEL_CLASS}>Prize description</p>
            <input
              type='text'
              className={INPUT_CLASS}
              value={prizeDescription}
              onChange={(e) => setPrizeDescription(e.target.value)}
            />
          </div>
          <div className='grid grid-cols-2 gap-3'>
            <div className='space-y-1.5'>
              <p className={LABEL_CLASS}>Winners</p>
              <input
                type='text'
                inputMode='numeric'
                className={INPUT_CLASS}
                value={formatAmountDigits(winnerCount)}
                onChange={(e) =>
                  setWinnerCount(e.target.value.replace(/\D/g, ''))
                }
              />
            </div>
            <div className='space-y-1.5'>
              <p className={LABEL_CLASS}>Max participants</p>
              <input
                type='text'
                inputMode='numeric'
                className={INPUT_CLASS}
                value={formatAmountDigits(maxParticipants)}
                onChange={(e) =>
                  setMaxParticipants(e.target.value.replace(/\D/g, ''))
                }
              />
            </div>
          </div>

          <div className='space-y-2'>
            <p className={LABEL_CLASS}>Starts at</p>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
              <BillsDatePickerField
                label=''
                value={isoToDate(startsAt)}
                minDate={new Date()}
                onChange={(date) =>
                  setStartsAt(combineDateTime(date, isoToTime(startsAt)))
                }
              />
              <BillsTimePickerField
                label=''
                value={isoToTime(startsAt)}
                onChange={(time) =>
                  setStartsAt(combineDateTime(isoToDate(startsAt), time))
                }
              />
            </div>
          </div>

          <div className='space-y-2'>
            <p className={LABEL_CLASS}>Ends at</p>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
              <BillsDatePickerField
                label=''
                value={isoToDate(endsAt)}
                minDate={isoToDate(startsAt) ?? new Date()}
                onChange={(date) =>
                  setEndsAt(combineDateTime(date, isoToTime(endsAt)))
                }
              />
              <BillsTimePickerField
                label=''
                value={isoToTime(endsAt)}
                onChange={(time) =>
                  setEndsAt(combineDateTime(isoToDate(endsAt), time))
                }
              />
            </div>
            <InlineError message={fieldErrors.endsAt} />
          </div>
        </div>
      }
      footer={
        <div className='flex items-center gap-3'>
          <button
            type='button'
            onClick={onClose}
            className='flex-1 py-2.5 rounded-[10px] border border-grey-200 text-grey-700 font-medium bg-grey-50/70 hover:bg-grey-100/70 transition-colors'
          >
            Cancel
          </button>
          <button
            type='button'
            onClick={() => void handleSubmit()}
            disabled={updateMutation.isPending}
            className={`flex-1 py-2.5 rounded-[10px] font-medium text-white transition-colors ${
              updateMutation.isPending
                ? 'bg-primary-200 cursor-not-allowed'
                : 'bg-primary-500 hover:bg-primary-600'
            }`}
          >
            {updateMutation.isPending ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      }
    />
  )
}

export default EditGiveawayModal
