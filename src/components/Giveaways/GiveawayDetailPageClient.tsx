'use client'

import { useRef, useState } from 'react'
import {
  Calendar,
  Gift,
  Lock,
  Pencil,
  Share2,
  Shuffle,
  Trophy,
  Upload,
  Users,
  XCircle,
  type LucideIcon,
} from 'lucide-react'
import { toApiError } from '@/api/errorHelpers'
import { useSuccessModal } from '@/context/SuccessModalContext'
import {
  useCloseGiveaway,
  useGiveawayDetail,
  useGiveawayLeaderboard,
  usePublishGiveaway,
  useSelectWinners,
} from '@/hooks/tanstack/giveaways'
import { analytics } from '@/lib/analytics/events'
import CategoryBadge from '@/components/Giveaways/components/CategoryBadge'
import GiveawayStatusPill from '@/components/Giveaways/components/GiveawayStatusPill'
import GiveawayCountdown from '@/components/Giveaways/components/GiveawayCountdown'
import LeaderboardList from '@/components/Giveaways/components/LeaderboardList'
import EditGiveawayModal from '@/components/Giveaways/EditGiveawayModal'
import GiveawayPinModal from '@/components/Giveaways/GiveawayPinModal'
import GiveawayShareModal from '@/components/Giveaways/GiveawayShareModal'
import GiveawayDetailsErrorState from '@/components/Giveaways/GiveawayDetailsErrorState'
import { CATEGORY_META, formatPrize } from '@/components/Giveaways/utils'
import { formatDateTimeShort } from '@/lib/utils/dateTime'
import GiveawaySummaryCard from './GiveawaySummaryCard'

type PinAction = 'close' | 'select-winners' | null

const GiveawayDetailPageClient = ({ giveawayId }: { giveawayId: string }) => {
  const { openSuccess } = useSuccessModal()
  const detailQuery = useGiveawayDetail(giveawayId)
  const giveaway = detailQuery.data?.data?.giveaway
  const questions = detailQuery.data?.data?.questions ?? []
  const tasks = detailQuery.data?.data?.tasks ?? []

  const leaderboardQuery = useGiveawayLeaderboard(giveawayId, Boolean(giveaway))
  const leaderboard = leaderboardQuery.data?.data

  const publishMutation = usePublishGiveaway(giveawayId)
  const closeMutation = useCloseGiveaway(giveawayId)
  const selectWinnersMutation = useSelectWinners(giveawayId)

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [pinAction, setPinAction] = useState<PinAction>(null)
  const [pinError, setPinError] = useState('')
  const [pinActionError, setPinActionError] = useState('')
  const [apiError, setApiError] = useState('')
  const topRef = useRef<HTMLDivElement | null>(null)

  const showApiError = (message: string) => {
    setApiError(message)
    requestAnimationFrame(() =>
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    )
  }

  const pageError = detailQuery.isError ? toApiError(detailQuery.error) : null

  if (detailQuery.isLoading && !giveaway) {
    return (
      <div className='w-full min-h-[500px] lg:min-h-[700px] flex items-center justify-center'>
        <div className='flex flex-col items-center gap-3'>
          <div className='h-8 w-8 animate-spin rounded-full border-2 border-primary-200 border-t-primary-500' />
          <p className='text-sm text-grey-700'>Loading giveaway details...</p>
        </div>
      </div>
    )
  }

  if (pageError || !giveaway) {
    const isMissing =
      pageError?.code === 'NOT_FOUND' ||
      pageError?.status === 404 ||
      (!pageError && !giveaway)
    return (
      <GiveawayDetailsErrorState
        title={
          isMissing
            ? 'This giveaway can’t be found'
            : 'Unable to load this giveaway'
        }
        description={
          isMissing
            ? 'This giveaway may have been removed, moved, or the link is no longer valid.'
            : 'Something went wrong while loading this giveaway. Please try again.'
        }
        onRetry={() => detailQuery.refetch()}
        isRetrying={detailQuery.isFetching}
      />
    )
  }

  const handlePublish = async () => {
    setApiError('')
    try {
      await publishMutation.mutateAsync()
      analytics.trackGiveawayPublished({ giveaway_id: giveawayId })
      openSuccess({
        title: 'Giveaway published',
        message: 'Your giveaway is now live and open for entries.',
      })
    } catch (err) {
      showApiError(toApiError(err).message || 'Unable to publish giveaway.')
    }
  }

  const handleShare = () => {
    analytics.trackGiveawayShareOpened({
      giveaway_id: giveawayId,
      source: 'owner_detail',
    })
    setIsShareOpen(true)
  }

  const handlePinConfirm = async (pin: string) => {
    setPinError('')
    setPinActionError('')
    try {
      if (pinAction === 'close') {
        await closeMutation.mutateAsync({ pin })
        setPinAction(null)
        openSuccess({
          title: 'Giveaway closed',
          message: 'Entries are now closed. You can select winners.',
        })
      } else if (pinAction === 'select-winners') {
        const res = await selectWinnersMutation.mutateAsync({ pin })
        const count = res.data?.winners?.length ?? giveaway.winnerCount
        analytics.trackGiveawayWinnersSelected({
          giveaway_id: giveawayId,
          winner_count: count,
        })
        setPinAction(null)
        openSuccess({
          title: 'Winners selected',
          message: `${count} winner(s) selected and notified.`,
        })
      }
    } catch (err) {
      const message =
        toApiError(err).message || 'Something went wrong. Try again.'
      if (message.toLowerCase().includes('pin')) {
        setPinError(message)
      } else {
        setPinActionError(message)
      }
    }
  }

  const canEdit = giveaway.status === 'pending'
  const canPublish = giveaway.status === 'pending'
  const canClose = giveaway.status === 'active'
  const canSelectWinners =
    giveaway.status === 'closed' || giveaway.status === 'active'
  const canShare = giveaway.status === 'active' || giveaway.status === 'closed'

  const meta = CATEGORY_META[giveaway.category]
  const participantCount = leaderboard?.participantCount ?? 0
  const maxParticipants = Math.max(1, giveaway.maxParticipants)
  const participantPct = Math.min(
    100,
    (participantCount / maxParticipants) * 100
  )
  const selectionLabel =
    giveaway.winnerSelectionRule.method === 'random'
      ? 'Random draw'
      : 'Highest score'

  const nextStep: { icon: LucideIcon; text: string } | null =
    giveaway.status === 'pending'
      ? {
          icon: Upload,
          text: 'This giveaway is a draft. Publish it to open entries.',
        }
      : giveaway.status === 'active'
      ? {
          icon: Share2,
          text: 'Live now — share it to reach more participants.',
        }
      : giveaway.status === 'closed'
      ? {
          icon: Trophy,
          text: 'Entries are closed — select winners to pay out prizes.',
        }
      : null

  const actionBtn =
    'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] text-sm font-medium transition-colors'

  return (
    <div className='w-full flex flex-col gap-5 mt-2 mb-10 lg:mt-0 lg:mb-0 px-4 lg:px-0'>
      <div ref={topRef} />
      {apiError ? (
        <div className='rounded-lg px-3 py-2.5 text-sm bg-error-50 text-error-700'>
          {apiError}
        </div>
      ) : null}

      <div
        className={`relative overflow-hidden rounded-[20px] border border-grey-50 bg-linear-to-br ${meta.gradient} p-5 lg:p-6`}
      >
        <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
          <div className='flex flex-col gap-3'>
            <div className='flex items-center gap-2 flex-wrap'>
              <CategoryBadge category={giveaway.category} />
              <GiveawayStatusPill status={giveaway.status} />
            </div>
            <h1 className='text-2xl font-semibold text-grey-900'>
              {giveaway.title}
            </h1>
            <div className='flex flex-wrap items-center gap-x-4 gap-y-2'>
              <span className='inline-flex items-center gap-1.5 text-sm text-grey-700'>
                <Gift className='h-4 w-4 text-grey-500' />
                {formatPrize(giveaway)}
              </span>
              <GiveawayCountdown giveaway={giveaway} />
            </div>
          </div>

          <div className='flex flex-wrap items-center gap-2'>
            {canShare ? (
              <button
                type='button'
                onClick={handleShare}
                className={`${actionBtn} border border-grey-200 bg-white/70 text-grey-700 hover:bg-white`}
              >
                <Share2 className='h-4 w-4' />
                Share
              </button>
            ) : null}
            {canEdit ? (
              <button
                type='button'
                onClick={() => setIsEditOpen(true)}
                className={`${actionBtn} border border-grey-200 bg-white/70 text-grey-700 hover:bg-white`}
              >
                <Pencil className='h-4 w-4' />
                Edit
              </button>
            ) : null}
            {canPublish ? (
              <button
                type='button'
                onClick={() => void handlePublish()}
                disabled={publishMutation.isPending}
                className={`${actionBtn} bg-primary-500 hover:bg-primary-600 disabled:bg-primary-200 text-white`}
              >
                <Upload className='h-4 w-4' />
                {publishMutation.isPending ? 'Publishing...' : 'Publish'}
              </button>
            ) : null}
            {canClose ? (
              <button
                type='button'
                onClick={() => {
                  setPinError('')
                  setPinActionError('')
                  setPinAction('close')
                }}
                className={`${actionBtn} border border-error-200 bg-white/70 text-error-600 hover:bg-error-50`}
              >
                <XCircle className='h-4 w-4' />
                Close entries
              </button>
            ) : null}
            {canSelectWinners ? (
              <button
                type='button'
                onClick={() => {
                  setPinError('')
                  setPinActionError('')
                  setPinAction('select-winners')
                }}
                className={`${actionBtn} bg-success-500 hover:bg-success-600 text-white`}
              >
                <Trophy className='h-4 w-4' />
                Select winners
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Next-step hint */}
      {nextStep ? (
        <div className='flex items-center gap-2.5 rounded-[12px] border border-grey-50 bg-white px-4 py-3 text-sm text-grey-700'>
          <span className={`shrink-0 ${meta.accentText}`}>
            <nextStep.icon className='h-4 w-4' />
          </span>
          {nextStep.text}
        </div>
      ) : null}

      {/* Summary cards */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
        <GiveawaySummaryCard
          icon={Gift}
          label='Prize'
          value={<span className='text-base'>{formatPrize(giveaway)}</span>}
          hint={`${giveaway.winnerCount} winner(s)`}
        />
        <GiveawaySummaryCard
          icon={Users}
          label='Participants'
          value={`${participantCount.toLocaleString()} / ${giveaway.maxParticipants.toLocaleString()}`}
        >
          <div className='h-1.5 w-full rounded-full bg-grey-50 overflow-hidden'>
            <div
              className='h-full rounded-full bg-primary-500'
              style={{ width: `${participantPct}%` }}
            />
          </div>
        </GiveawaySummaryCard>
        <GiveawaySummaryCard
          icon={
            giveaway.winnerSelectionRule.method === 'random' ? Shuffle : Trophy
          }
          label='Selection'
          value={<span className='text-base'>{selectionLabel}</span>}
          hint={`${giveaway.winnerCount} winner(s)`}
        />
        <GiveawaySummaryCard
          icon={Calendar}
          label='Schedule'
          value={
            <span className='text-sm font-medium'>
              {formatDateTimeShort(giveaway.startsAt)}
            </span>
          }
          hint={`Ends ${formatDateTimeShort(giveaway.endsAt)}`}
        />
      </div>

      <div className='grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,360px)] gap-4'>
        {/* Questions / tasks preview */}
        <div className='flex flex-col gap-4'>
          {giveaway.category === 'trivia' ? (
            <div className='rounded-[16px] bg-white border border-grey-50 p-4 lg:p-5'>
              <div className='flex items-center gap-2 mb-3'>
                <h2 className='text-sm font-semibold text-grey-900'>
                  Questions
                </h2>
                <span className='text-xs font-medium px-2 py-0.5 rounded-full bg-grey-50 text-grey-600'>
                  {questions.length}
                </span>
              </div>
              <div className='flex flex-col gap-3'>
                {questions.map((q, index) => (
                  <div
                    key={q.id}
                    className='rounded-[12px] border border-grey-50 p-3'
                  >
                    <p className='text-sm font-medium text-grey-800'>
                      {index + 1}. {q.questionText}
                    </p>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2'>
                      {q.options.map((opt, optIndex) => (
                        <span
                          key={optIndex}
                          className={`text-xs px-2.5 py-1.5 rounded-[8px] border ${
                            q.correctOptionIndex === optIndex
                              ? 'border-success-200 bg-success-50 text-success-700'
                              : 'border-grey-50 bg-grey-50/60 text-grey-600'
                          }`}
                        >
                          {opt}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
                {questions.length === 0 ? (
                  <p className='text-sm text-grey-500'>No questions added.</p>
                ) : null}
              </div>
            </div>
          ) : null}

          {giveaway.category === 'task' ? (
            <div className='rounded-[16px] bg-white border border-grey-50 p-4 lg:p-5'>
              <div className='flex items-center gap-2 mb-3'>
                <h2 className='text-sm font-semibold text-grey-900'>Tasks</h2>
                <span className='text-xs font-medium px-2 py-0.5 rounded-full bg-grey-50 text-grey-600'>
                  {tasks.length}
                </span>
              </div>
              <div className='flex flex-col gap-3'>
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className='rounded-[12px] border border-grey-50 p-3 flex items-start justify-between gap-3'
                  >
                    <div>
                      <p className='text-sm font-medium text-grey-800'>
                        {task.description}
                      </p>
                      <p className='text-xs text-grey-500 mt-0.5 capitalize'>
                        {task.verificationMethod.replace(/_/g, ' ')}
                      </p>
                    </div>
                    {task.isRequired ? (
                      <span className='text-[11px] px-2 py-0.5 rounded-full bg-warning-50 text-warning-600 shrink-0'>
                        Required
                      </span>
                    ) : null}
                  </div>
                ))}
                {tasks.length === 0 ? (
                  <p className='text-sm text-grey-500'>No tasks added.</p>
                ) : null}
              </div>
            </div>
          ) : null}

          {giveaway.category === 'lottery' ? (
            <div className='rounded-[16px] bg-white border border-grey-50 p-4 lg:p-5'>
              <h2 className='text-sm font-semibold text-grey-900 mb-2'>
                Lottery draw
              </h2>
              <p className='text-sm text-grey-600'>
                Winners are picked at random from all valid entries when you
                select winners.
              </p>
            </div>
          ) : null}
        </div>

        {/* Leaderboard */}
        <div className='rounded-[16px] bg-white border border-grey-50 p-4 lg:p-5 xl:sticky xl:top-4 h-fit'>
          <div className='flex items-center justify-between mb-3'>
            <h2 className='text-sm font-semibold text-grey-900'>Leaderboard</h2>
            <span className='text-xs text-grey-500'>
              {leaderboard?.participantCount ?? 0} entrants
            </span>
          </div>
          {leaderboardQuery.isLoading ? (
            <div className='flex flex-col gap-2 animate-pulse'>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className='h-12 rounded-[12px] bg-grey-100' />
              ))}
            </div>
          ) : !leaderboard || !leaderboard.revealed ? (
            <div className='flex flex-col items-center justify-center text-center gap-2 py-10'>
              <Lock className='h-7 w-7 text-grey-400' />
              <p className='text-sm text-grey-600'>
                Winners revealed after the draw.
              </p>
            </div>
          ) : leaderboard.entries.length === 0 ? (
            <p className='text-sm text-grey-500 text-center py-8'>
              No entries yet.
            </p>
          ) : (
            <LeaderboardList
              entries={leaderboard.entries}
              showScore={giveaway.category === 'trivia'}
            />
          )}
        </div>
      </div>

      {isEditOpen ? (
        <EditGiveawayModal
          isOpen={isEditOpen}
          giveaway={giveaway}
          onClose={() => setIsEditOpen(false)}
          onUpdated={() =>
            openSuccess({
              title: 'Giveaway updated',
              message: 'Your changes have been saved.',
            })
          }
        />
      ) : null}

      <GiveawayShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title={giveaway.title}
        subtitle={giveaway.prizeDescription}
        shareUrl={`/g/${giveawayId}`}
      />

      <GiveawayPinModal
        isOpen={pinAction !== null}
        title={pinAction === 'close' ? 'Close entries?' : 'Select winners?'}
        description={
          pinAction === 'close' ? (
            <div className='space-y-2'>
              <p>
                This ends the giveaway and stops new entries so you can pick
                winners. Participants will no longer be able to join.
              </p>
              <p>Enter your transaction PIN to confirm.</p>
            </div>
          ) : (
            <div className='space-y-2'>
              <p>
                We&apos;ll pick{' '}
                <span className='font-medium text-grey-800'>
                  {giveaway.winnerCount} winner
                  {giveaway.winnerCount > 1 ? 's' : ''}
                </span>{' '}
                by {selectionLabel.toLowerCase()} and disburse the prize
                {giveaway.winnerCount > 1 ? 's' : ''} automatically to{' '}
                {giveaway.winnerCount > 1 ? 'their' : 'the'} wallet
                {giveaway.winnerCount > 1 ? 's' : ''}.
              </p>
              <p className='font-medium text-warning-700'>
                This can&apos;t be undone.
              </p>
              <p>Enter your transaction PIN to confirm.</p>
            </div>
          )
        }
        confirmLabel={
          pinAction === 'close' ? 'Close entries' : 'Select winners'
        }
        submittingLabel={
          pinAction === 'close' ? 'Closing entries...' : 'Selecting winners...'
        }
        pinError={pinError}
        actionError={pinActionError}
        isSubmitting={
          closeMutation.isPending || selectWinnersMutation.isPending
        }
        onClose={() => {
          setPinAction(null)
          setPinError('')
          setPinActionError('')
        }}
        onConfirm={handlePinConfirm}
        onClearError={() => {
          setPinError('')
          setPinActionError('')
        }}
      />
    </div>
  )
}

export default GiveawayDetailPageClient
