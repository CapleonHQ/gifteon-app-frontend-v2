'use client'

import { motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import TemplateSelectionFooter from '@/components/Gifts/CreateNewGiftPage/TemplateSelectionFooter'
import { CATEGORY_META } from '@/components/Giveaways/utils'
import { formatCurrency } from '@/lib/utils/currency'
import type { GiveawayDraft } from './types'

type ReviewStepProps = {
  totalSteps: number
  draft: GiveawayDraft
  isSubmitting: boolean
  onBack: () => void
  onSubmit: () => void
}

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className='flex items-center justify-between gap-3 py-2.5 border-b border-grey-50 last:border-0'>
    <span className='text-sm text-grey-500'>{label}</span>
    <span className='text-sm font-medium text-grey-900 text-right'>{value}</span>
  </div>
)

const ReviewStep = ({
  totalSteps,
  draft,
  isSubmitting,
  onBack,
  onSubmit,
}: ReviewStepProps) => {
  const meta = draft.category ? CATEGORY_META[draft.category] : null
  const prizeValue = Number(draft.prizeValue)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='w-full pb-10'
    >
      <div className='mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <p className='text-xs font-medium uppercase tracking-[0.18em] text-primary-500'>
            Step {totalSteps} of {totalSteps}
          </p>
          <h2 className='mt-2 text-2xl font-semibold text-blackish'>
            Review &amp; create
          </h2>
          <p className='mt-2 max-w-2xl text-sm leading-6 text-grey-700'>
            Confirm the details below, then enter your PIN to create.
          </p>
        </div>
        <button
          type='button'
          onClick={onBack}
          className='inline-flex w-fit items-center gap-1 self-start rounded-[10px] border border-grey-200 bg-white px-3 py-2 text-sm font-medium text-grey-700 hover:bg-grey-50 sm:self-auto'
        >
          <ChevronLeft className='h-4 w-4' />
          Back
        </button>
      </div>

      <div className='mb-5 rounded-[20px] border border-grey-100 bg-white p-5 flex flex-col'>
        <Row
          label='Type'
          value={<span className={meta?.accentText}>{meta?.label}</span>}
        />
        <Row label='Title' value={draft.title} />
        <Row label='Prize' value={draft.prizeDescription} />
        <Row
          label='Prize value'
          value={
            Number.isFinite(prizeValue) && prizeValue > 0
              ? formatCurrency(prizeValue, {
                  currency: draft.prizeCurrency,
                  maximumFractionDigits: 0,
                })
              : '—'
          }
        />
        <Row label='Winners' value={draft.winnerCount} />
        <Row
          label='Max participants'
          value={Number(draft.maxParticipants).toLocaleString()}
        />
        <Row
          label='Starts'
          value={
            draft.startsAt ? new Date(draft.startsAt).toLocaleString() : '—'
          }
        />
        <Row
          label='Ends'
          value={draft.endsAt ? new Date(draft.endsAt).toLocaleString() : '—'}
        />
        {draft.category === 'trivia' ? (
          <Row label='Questions' value={draft.questions.length} />
        ) : null}
        {draft.category === 'task' ? (
          <Row label='Tasks' value={draft.tasks.length} />
        ) : null}
      </div>

      <TemplateSelectionFooter
        canContinue={!isSubmitting}
        onContinue={onSubmit}
        ctaLabel={isSubmitting ? 'Creating…' : 'Create giveaway'}
      />
    </motion.div>
  )
}

export default ReviewStep
