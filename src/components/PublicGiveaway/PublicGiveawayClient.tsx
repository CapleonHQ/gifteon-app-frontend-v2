'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Gift, Lock } from 'lucide-react'
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

  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const leaderboardQuery = useGiveawayLeaderboard(
    giveawayId,
    Boolean(giveaway) && showLeaderboard
  )
  const leaderboard = leaderboardQuery.data?.data

  const enterMutation = useEnterGiveaway(giveawayId)
  const triviaMutation = useSubmitTrivia(giveawayId)
  const taskMutation = useSubmitTaskProof(giveawayId)

  const [stage, setStage] = useState<Stage>('intro')
  const [score, setScore] = useState<number | undefined>(undefined)
  const [enterError, setEnterError] = useState('')
  const resumeHandled = useRef(false)

  const trackedView = useRef(false)
  useEffect(() => {
    if (giveaway && !trackedView.current) {
      trackedView.current = true
    }
  }, [giveaway])

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

  if (detailQuery.isLoading) {
    return (
      <div className='min-h-screen bg-base-bg flex items-center justify-center'>
        <div className='w-full max-w-xl mx-auto px-4 animate-pulse flex flex-col gap-4'>
          <div className='h-40 rounded-[20px] bg-grey-100' />
          <div className='h-12 rounded-[12px] bg-grey-100' />
          <div className='h-12 rounded-[12px] bg-grey-100' />
        </div>
      </div>
    )
  }

  if (detailQuery.isError || !giveaway) {
    return (
      <div className='min-h-screen bg-base-bg flex items-center justify-center px-4'>
        <div className='text-center'>
          <p className='text-sm text-grey-600'>This giveaway is unavailable.</p>
        </div>
      </div>
    )
  }

  const meta = CATEGORY_META[giveaway.category]
  const isActive = giveaway.status === 'active'

  return (
    <div className='min-h-screen bg-base-bg pb-20'>
      <div className='max-w-2xl mx-auto px-4 py-8 lg:py-12'>
        {/* Hero */}
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
          <div className='relative flex flex-col gap-4'>
            <div className='flex items-center justify-between'>
              <CategoryBadge category={giveaway.category} />
              <span className='text-xs text-grey-500'>
                up to {giveaway.maxParticipants.toLocaleString()} entries
              </span>
            </div>
            <h1 className='text-2xl lg:text-3xl font-semibold text-grey-900'>
              {giveaway.title}
            </h1>
            <div className='flex items-center gap-2 text-grey-700'>
              <Gift className='h-5 w-5 text-grey-500' />
              <span className='text-lg font-medium'>
                {formatPrize(giveaway)}
              </span>
            </div>
            <HeroCountdown giveaway={giveaway} />
          </div>
        </div>

        {/* Body */}
        <div className='mt-6 bg-white rounded-[20px] border border-grey-50 p-5 lg:p-7'>
          <AnimatePresence mode='wait'>
            {stage === 'intro' ? (
              <motion.div
                key='intro'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='flex flex-col gap-4'
              >
                <p className='text-sm text-grey-600'>{meta.description}</p>

                {!isActive ? (
                  <div className='rounded-[12px] bg-grey-50 px-4 py-3 text-sm text-grey-600'>
                    {giveaway.status === 'pending'
                      ? 'This giveaway has not started yet. Check back soon.'
                      : 'Entries for this giveaway are closed.'}
                  </div>
                ) : null}

                <motion.button
                  type='button'
                  disabled={!isActive || enterMutation.isPending}
                  onClick={() => void handleEnter()}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3.5 rounded-[14px] text-white text-base font-medium transition-colors ${
                    isActive && !enterMutation.isPending
                      ? 'bg-linear-to-b from-[17.5%] from-primary-400 to-primary-600 hover:from-primary-500 hover:to-primary-700'
                      : 'bg-primary-200 cursor-not-allowed'
                  }`}
                >
                  {enterMutation.isPending
                    ? 'Entering…'
                    : status !== 'authenticated'
                    ? 'Sign in to enter'
                    : 'Enter giveaway'}
                </motion.button>

                {enterError ? (
                  <p className='text-xs text-error-500 text-center'>
                    {enterError}
                  </p>
                ) : null}

                <button
                  type='button'
                  onClick={() => setShowLeaderboard((prev) => !prev)}
                  className='text-sm text-primary-600 font-medium hover:underline self-center'
                >
                  {showLeaderboard ? 'Hide leaderboard' : 'View leaderboard'}
                </button>
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
                  onViewLeaderboard={() => {
                    setShowLeaderboard(true)
                    setStage('intro')
                  }}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* Leaderboard panel */}
          <AnimatePresence>
            {showLeaderboard ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className='overflow-hidden mt-6 pt-6 border-t border-grey-50'
              >
                <h2 className='text-sm font-semibold text-grey-900 mb-3'>
                  Leaderboard
                </h2>
                {leaderboardQuery.isLoading ? (
                  <div className='flex flex-col gap-2 animate-pulse'>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className='h-12 rounded-[12px] bg-grey-100'
                      />
                    ))}
                  </div>
                ) : !leaderboard || !leaderboard.revealed ? (
                  <div className='flex flex-col items-center text-center gap-2 py-8'>
                    <Lock className='h-7 w-7 text-grey-400' />
                    <p className='text-sm text-grey-600'>
                      Winners are revealed after the draw.
                    </p>
                  </div>
                ) : leaderboard.entries.length === 0 ? (
                  <p className='text-sm text-grey-500 text-center py-6'>
                    No entries yet — be the first!
                  </p>
                ) : (
                  <LeaderboardList
                    entries={leaderboard.entries}
                    showScore={giveaway.category === 'trivia'}
                    currentUserTag={user?.giftseonTag ?? null}
                  />
                )}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      <PublicPageAttributionBadge />
    </div>
  )
}

export default PublicGiveawayClient
