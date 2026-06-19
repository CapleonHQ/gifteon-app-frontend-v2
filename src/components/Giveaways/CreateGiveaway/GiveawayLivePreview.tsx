'use client'

import { Gift, HelpCircle, ListChecks, Sparkles, Trophy, Users } from 'lucide-react'
import CategoryBadge from '@/components/Giveaways/components/CategoryBadge'
import { CATEGORY_META } from '@/components/Giveaways/utils'
import { CURRENCY_SYMBOL_MAP, formatAmountDigits } from '@/lib/utils/currency'
import type { GiveawayDraft } from './types'

const GiveawayLivePreview = ({ draft }: { draft: GiveawayDraft }) => {
  const symbol = CURRENCY_SYMBOL_MAP[draft.prizeCurrency] ?? draft.prizeCurrency
  const prizeText = draft.prizeDescription.trim()
    ? draft.prizeDescription
    : draft.prizeValue
    ? `${symbol}${formatAmountDigits(draft.prizeValue)}`
    : 'Your prize'

  const meta = draft.category ? CATEGORY_META[draft.category] : null
  const winners = Number(draft.winnerCount) || 0
  const maxParticipants = Number(draft.maxParticipants) || 0
  const contentCount =
    draft.category === 'task' ? draft.tasks.length : draft.questions.length
  const contentLabel = draft.category === 'task' ? 'tasks' : 'questions'

  return (
    <div className='flex flex-col gap-3'>
      <p className='text-[11px] font-medium uppercase tracking-wide text-grey-400'>
        Live preview
      </p>

      <div
        className={`relative overflow-hidden rounded-[24px] border border-white/60 bg-linear-to-br ${
          meta ? meta.gradient : 'from-grey-50 to-white'
        } p-6`}
      >
        <div className='flex flex-col gap-5'>
          <div className='flex items-center justify-between gap-2'>
            {draft.category ? (
              <CategoryBadge category={draft.category} />
            ) : (
              <span className='inline-flex items-center rounded-full bg-white/70 px-2.5 py-1 text-xs font-medium text-grey-500'>
                Giveaway
              </span>
            )}
            <span className='inline-flex items-center gap-1 rounded-full bg-white/70 px-2.5 py-1 text-xs font-medium text-grey-600'>
              <Sparkles className='h-3.5 w-3.5 text-primary-500' />
              {winners || 1} winner{winners > 1 ? 's' : ''}
            </span>
          </div>

          <div className='flex flex-col gap-1.5'>
            <span className='text-xs uppercase tracking-wide text-grey-500'>
              Win
            </span>
            <p className='text-2xl font-semibold leading-tight text-grey-900'>
              {prizeText}
            </p>
            <h3 className='text-sm text-grey-700'>
              {draft.title.trim() || 'Untitled giveaway'}
            </h3>
          </div>

          {draft.category ? (
            <p className='text-xs text-grey-600'>{meta?.description}</p>
          ) : null}
        </div>
      </div>

      <div className='grid grid-cols-2 gap-2'>
        <PreviewStat
          icon={Gift}
          label='Prize'
          value={
            draft.prizeValue || draft.prizeDescription.trim() ? prizeText : '—'
          }
        />
        <PreviewStat
          icon={Trophy}
          label='Winners'
          value={winners ? String(winners) : '—'}
        />
        <PreviewStat
          icon={Users}
          label='Max entries'
          value={maxParticipants ? maxParticipants.toLocaleString() : '—'}
        />
        {draft.category === 'lottery' ? (
          <PreviewStat icon={Sparkles} label='Type' value='Random draw' />
        ) : (
          <PreviewStat
            icon={draft.category === 'task' ? ListChecks : HelpCircle}
            label={draft.category === 'task' ? 'Tasks' : 'Questions'}
            value={contentCount ? `${contentCount} ${contentLabel}` : '—'}
          />
        )}
      </div>

      <p className='text-xs text-grey-400'>
        This is how your giveaway will appear to participants.
      </p>
    </div>
  )
}

const PreviewStat = ({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Gift
  label: string
  value: string
}) => (
  <div className='flex flex-col gap-1 rounded-[14px] border border-grey-50 bg-white p-3'>
    <div className='flex items-center gap-1.5 text-grey-500'>
      <Icon className='h-3.5 w-3.5' />
      <span className='text-[11px]'>{label}</span>
    </div>
    <span className='truncate text-sm font-semibold text-grey-900'>{value}</span>
  </div>
)

export default GiveawayLivePreview
