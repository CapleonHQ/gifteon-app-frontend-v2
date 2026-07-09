'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Lock, Sparkles, Users } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { toApiError } from '@/api/errorHelpers'
import {
  useEnterGiveaway,
  useGiveawayDetail,
  useGiveawayLeaderboard,
  useSubmitTaskProof,
  useSubmitTrivia,
} from '@/hooks/tanstack/giveaways'
import { analytics } from '@/lib/analytics/events'
import CategoryBadge from '@/components/Giveaways/components/CategoryBadge'
import LeaderboardList from '@/components/Giveaways/components/LeaderboardList'
import { CATEGORY_META, formatPrize } from '@/components/Giveaways/utils'
import HeroCountdown from '@/components/PublicGiveaway/components/HeroCountdown'
import PublicGiveawayStats from '@/components/PublicGiveaway/components/PublicGiveawayStats'
import {
  PublicGiveawayErrorState,
  PublicGiveawayLoadingView,
} from '@/components/PublicGiveaway/PublicGiveawayStates'
import TriviaPlay from '@/components/PublicGiveaway/stages/TriviaPlay'
import TaskPlay from '@/components/PublicGiveaway/stages/TaskPlay'
import ResultStage from '@/components/PublicGiveaway/stages/ResultStage'
import PublicPageAttributionBadge from '@/components/PublicGiftPage/PublicPageAttributionBadge'
import type { SubmitTaskProofBody, SubmitTriviaAnswer } from '@/types/Giveaways'

type Stage = 'intro' | 'playing' | 'result'

const PublicGiveawayClient = ({ giveawayId }: { giveawayId: string }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { status, user } = useAuth()

  const detailQuery = useGiveawayDetail(giveawayId)
  const giveaway = detailQuery.data?.data?.giveaway
  const questions = detailQuery.data?.data?.questions ?? []
  const tasks = detailQuery.data?.data?.tasks ?? []

  const leaderboardQuery = useGiveawayLeaderboard(giveawayId, Boolean(giveaway))
  const leaderboard = leaderboardQuery.data?.data
  const participantCount = leaderboard?.participantCount ?? 0

  const enterMutation = useEnterGiveaway(giveawayId)
  const triviaMutation = useSubmitTrivia(giveawayId)
  const taskMutation = useSubmitTaskProof(giveawayId)

  const [stage, setStage] = useState<Stage>('intro')
  const [score, setScore] = useState<number | undefined>(undefined)
  const [enterError, setEnterError] = useState('')
  const resumeHandled = useRef(false)
  const leaderboardRef = useRef<HTMLDivElement | null>(null)

  const trackedView = useRef(false)
  useEffect(() => {
    if (giveaway && !trackedView.current) {
      trackedView.current = true
      analytics.trackGiveawayViewed({
        giveaway_id: giveawayId,
        category: giveaway.category,
        status: giveaway.status,
      })
    }
  }, [giveaway, giveawayId])

  const beginPlay = () => {
    if (!giveaway) return
    if (giveaway.category === 'lottery') {
      setStage('result')
    } else {
      setStage('playing')
    }
  }

  const handleEnter = async () => {
    if (!giveaway) return
    setEnterError('')

    if (status !== 'authenticated') {
      const next = encodeURIComponent(`/g/${giveawayId}?resume=1`)
      router.push(`/login?next=${next}`)
      return
    }

    try {
      await enterMutation.mutateAsync()
      analytics.trackGiveawayEntered({
        giveaway_id: giveawayId,
        category: giveaway.category,
      })
      beginPlay()
    } catch (err) {
      setEnterError(toApiError(err).message || 'Could not enter the giveaway.')
    }
  }

  useEffect(() => {
    if (resumeHandled.current) return
    if (searchParams.get('resume') !== '1') return
    if (status !== 'authenticated' || !giveaway) return
    resumeHandled.current = true
    void handleEnter()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, giveaway, searchParams])

  const handleTriviaComplete = async (answers: SubmitTriviaAnswer[]) => {
    try {
      const res = await triviaMutation.mutateAsync({ answers })
      const finalScore = res.data?.score ?? 0
      setScore(finalScore)
      analytics.trackGiveawayTriviaSubmitted({
        giveaway_id: giveawayId,
        score: finalScore,
      })
    } catch {
      setScore(0)
    } finally {
      setStage('result')
    }
  }

  const handleTaskProof = async (body: SubmitTaskProofBody) => {
    await taskMutation.mutateAsync(body)
    analytics.trackGiveawayTaskSubmitted({
      giveaway_id: giveawayId,
      task_id: body.taskId,
    })
  }

  const handleShare = async () => {
    analytics.trackGiveawayShareOpened({
      giveaway_id: giveawayId,
      source: 'public_page',
    })
    try {
      await navigator.clipboard.writeText(window.location.href.split('?')[0])
    } catch {
      // ignore
    }
  }

  const scrollToLeaderboard = () => {
    setStage('intro')
    requestAnimationFrame(() =>
      leaderboardRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    )
  }

  if (detailQuery.isLoading && !giveaway) {
    return <PublicGiveawayLoadingView />
  }

  if (detailQuery.isError || !giveaway) {
    const pageError = detailQuery.isError ? toApiError(detailQuery.error) : null
    const isMissing =
      pageError?.code === 'NOT_FOUND' ||
      pageError?.status === 404 ||
      (!pageError && !giveaway)
    return (
      <PublicGiveawayErrorState
        variant={isMissing ? 'not-found' : 'error'}
        onRetry={() => detailQuery.refetch()}
        isRetrying={detailQuery.isFetching}
      />
    )
  }

  const meta = CATEGORY_META[giveaway.category]

  const hasWinners = Boolean(leaderboard?.revealed)
  const isActive = giveaway.status === 'active' && !hasWinners

  const ctaLabel = enterMutation.isPending
    ? 'Entering…'
    : status !== 'authenticated'
    ? 'Sign in to enter'
    : 'Enter giveaway'

  return (
    <div className='min-h-screen bg-base-bg pb-24'>
      {/* Brand header */}
      <header className='sticky top-0 z-20 border-b border-grey-50 bg-base-bg/80 backdrop-blur'>
        <div className='max-w-2xl mx-auto px-4 h-14 flex items-center justify-between'>
          <Link href='/' aria-label='Giftseon home'>
            <Image
              src='/assets/images/logo/logo.svg'
              alt='Giftseon'
              width={104}
              height={28}
              className='h-7 w-auto'
              priority
            />
          </Link>
          {participantCount > 0 ? (
            <span className='inline-flex items-center gap-1.5 text-xs font-medium text-grey-600'>
              <Users className='h-3.5 w-3.5 text-grey-400' />
              {participantCount.toLocaleString()} entered
            </span>
          ) : null}
        </div>
      </header>

      <main className='max-w-2xl mx-auto px-4 py-6 lg:py-10 flex flex-col gap-5'>
        {/* Hero — prize-led */}
        <div
          className={`relative overflow-hidden rounded-[24px] border border-white/60 bg-linear-to-br ${meta.gradient} p-6 lg:p-8`}
        >
          <motion.div
            aria-hidden
            initial={{ opacity: 0.6, scale: 1 }}
            animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.15, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
            className='pointer-events-none absolute -top-16 -right-12 w-48 h-48 rounded-full bg-white/40 blur-2xl'
          />
          <div className='relative flex flex-col gap-5'>
            <div className='flex items-center justify-between gap-2'>
              <CategoryBadge category={giveaway.category} />
              <span className='inline-flex items-center gap-1 text-xs font-medium text-grey-600 bg-white/70 rounded-full px-2.5 py-1'>
                <Sparkles className='h-3.5 w-3.5 text-primary-500' />
                {giveaway.winnerCount} winner
                {giveaway.winnerCount > 1 ? 's' : ''}
              </span>
            </div>

            <div className='flex flex-col gap-1.5'>
              <span className='text-xs uppercase tracking-wide text-grey-500'>
                Win
              </span>
              <p className='text-3xl lg:text-4xl font-semibold text-grey-900 leading-tight'>
                {formatPrize(giveaway)}
              </p>
              <h1 className='text-base lg:text-lg text-grey-700'>
                {giveaway.title}
              </h1>
            </div>

            <HeroCountdown giveaway={giveaway} concluded={hasWinners} />
          </div>
        </div>

        {/* Stats */}
        <PublicGiveawayStats
          giveaway={giveaway}
          participantCount={participantCount}
        />

        {/* Body — stage machine */}
        <div className='bg-white rounded-[20px] border border-grey-50 p-5 lg:p-7'>
          <AnimatePresence mode='wait'>
            {stage === 'intro' ? (
              <motion.div
                key='intro'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='flex flex-col gap-4'
              >
                <div>
                  <h2 className='text-lg font-semibold text-grey-900'>
                    How it works
                  </h2>
                  <p className='text-sm text-grey-600 mt-1'>
                    {meta.description}
                  </p>
                </div>

                {!isActive ? (
                  <div className='rounded-[12px] bg-grey-50 px-4 py-3 text-sm text-grey-600'>
                    {giveaway.status === 'pending'
                      ? 'This giveaway hasn’t started yet — check back soon.'
                      : giveaway.status === 'cancelled'
                      ? 'This giveaway was cancelled.'
                      : hasWinners
                      ? 'Winners have been announced — see the leaderboard below.'
                      : 'Entries for this giveaway are closed.'}
                  </div>
                ) : null}

                <motion.button
                  type='button'
                  disabled={!isActive || enterMutation.isPending}
                  onClick={() => void handleEnter()}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 rounded-[14px] text-white text-base font-medium transition-colors ${
                    isActive && !enterMutation.isPending
                      ? 'bg-linear-to-b from-[17.5%] from-primary-400 to-primary-600 hover:from-primary-500 hover:to-primary-700'
                      : 'bg-primary-200 cursor-not-allowed'
                  }`}
                >
                  {ctaLabel}
                </motion.button>

                {enterError ? (
                  <p className='text-xs text-error-500 text-center'>
                    {enterError}
                  </p>
                ) : null}

                {status !== 'authenticated' && isActive ? (
                  <p className='text-xs text-grey-500 text-center'>
                    Free to enter — sign in takes a few seconds.
                  </p>
                ) : null}
              </motion.div>
            ) : null}

            {stage === 'playing' && giveaway.category === 'trivia' ? (
              <motion.div
                key='trivia'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <TriviaPlay
                  questions={questions}
                  isSubmitting={triviaMutation.isPending}
                  onComplete={handleTriviaComplete}
                />
              </motion.div>
            ) : null}

            {stage === 'playing' && giveaway.category === 'task' ? (
              <motion.div
                key='task'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <TaskPlay
                  tasks={tasks}
                  submitProof={handleTaskProof}
                  onComplete={() => setStage('result')}
                />
              </motion.div>
            ) : null}

            {stage === 'result' ? (
              <motion.div
                key='result'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ResultStage
                  category={giveaway.category}
                  score={score}
                  celebrate
                  onShare={() => void handleShare()}
                  onViewLeaderboard={scrollToLeaderboard}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Leaderboard — always visible social proof */}
        <div
          ref={leaderboardRef}
          className='bg-white rounded-[20px] border border-grey-50 p-5 lg:p-7 scroll-mt-20'
        >
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-base font-semibold text-grey-900'>
              Leaderboard
            </h2>
            <span className='text-xs text-grey-500'>
              {participantCount.toLocaleString()} entrant
              {participantCount === 1 ? '' : 's'}
            </span>
          </div>

          {leaderboardQuery.isLoading ? (
            <div className='flex flex-col items-center justify-center gap-2 py-10 text-grey-500'>
              <div className='h-6 w-6 rounded-full border-2 border-primary-200 border-t-primary-500 animate-spin' />
              <p className='text-sm'>Loading leaderboard…</p>
            </div>
          ) : !leaderboard || !leaderboard.revealed ? (
            <div className='flex flex-col items-center text-center gap-2 py-10'>
              <Lock className='h-7 w-7 text-grey-400' />
              <p className='text-sm text-grey-600'>
                Winners are revealed after the draw.
              </p>
            </div>
          ) : leaderboard.entries.length === 0 ? (
            <p className='text-sm text-grey-500 text-center py-8'>
              No entries yet — be the first!
            </p>
          ) : (
            <LeaderboardList
              entries={leaderboard.entries}
              showScore={giveaway.category === 'trivia'}
              currentUserTag={user?.giftseonTag ?? null}
            />
          )}
        </div>
      </main>

      <PublicPageAttributionBadge />
    </div>
  )
}

export default PublicGiveawayClient
