'use client'

import { useState } from 'react'
import { Coins, Minus, Plus, Sparkles, X } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import ResponsiveModal from '@/components/common/ResponsiveModal'
import { toApiError } from '@/api/errorHelpers'
import { useAiCredits, useGenerateTrivia } from '@/hooks/tanstack/ai'
import {
  AI_DEFAULT_LANGUAGE,
  AI_DIFFICULTIES,
  AI_TRIVIA_MAX_COUNT,
  AI_TRIVIA_MIN_COUNT,
  TRIVIA_CATEGORIES,
} from '@/lib/constants/ai'
import { mapAiQuestionToDraft } from './aiTrivia'
import type { QuestionDraft } from './types'
import type { AiDifficulty } from '@/types/Ai'

type GenerateTriviaModalProps = {
  isOpen: boolean
  onClose: () => void
  onGenerated: (questions: QuestionDraft[], creditsUsed?: number) => void
  onTopUp: () => void
}

const LABEL_CLASS = 'text-xs font-medium text-grey-700'
const PRIMARY_BTN =
  'bg-linear-to-b from-[17.5%] from-primary-400 to-primary-600 hover:from-primary-500 hover:to-primary-700'

const GenerateTriviaModal = ({
  isOpen,
  onClose,
  onGenerated,
  onTopUp,
}: GenerateTriviaModalProps) => {
  const creditsQuery = useAiCredits(isOpen)
  const credits = creditsQuery.data?.data?.credits
  const generateMutation = useGenerateTrivia()

  const [category, setCategory] = useState('')
  const [refine, setRefine] = useState('')
  const [count, setCount] = useState(3)
  const [difficulty, setDifficulty] = useState<AiDifficulty>('medium')
  const [error, setError] = useState('')

  const outOfCredits = typeof credits === 'number' && credits <= 0

  const reset = () => {
    setCategory('')
    setRefine('')
    setCount(3)
    setDifficulty('medium')
    setError('')
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const adjustCount = (delta: number) =>
    setCount((c) =>
      Math.min(AI_TRIVIA_MAX_COUNT, Math.max(AI_TRIVIA_MIN_COUNT, c + delta))
    )

  const handleGenerate = async () => {
    setError('')
    if (!category) {
      setError('Pick a category to keep questions on topic.')
      return
    }
    try {
      const res = await generateMutation.mutateAsync({
        topic: category,
        count,
        difficulty,
        language: AI_DEFAULT_LANGUAGE,
        ...(refine.trim() ? { contextHint: refine.trim() } : {}),
      })
      const mapped = (res.data?.questions ?? []).map(mapAiQuestionToDraft)
      if (mapped.length === 0) {
        setError('No questions were generated. Try a different topic.')
        return
      }
      onGenerated(mapped, res.data?.creditsUsed)
      handleClose()
    } catch (err) {
      setError(
        toApiError(err).message || 'Could not generate questions. Try again.'
      )
    }
  }

  const header = (
    <div className='flex items-start justify-between gap-4'>
      <div className='flex items-start gap-3'>
        <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600'>
          <Sparkles className='h-5 w-5' />
        </span>
        <div>
          <h2 className='text-lg font-semibold text-blackish'>
            Generate with AI
          </h2>
          <p className='mt-0.5 text-sm text-grey-600'>
            Draft quiz questions in seconds — edit anything after.
          </p>
        </div>
      </div>
      <button
        type='button'
        onClick={handleClose}
        aria-label='Close'
        className='text-grey-400 hover:text-grey-600'
      >
        <X className='h-5 w-5' />
      </button>
    </div>
  )

  const body = outOfCredits ? (
    <div className='flex flex-col items-center gap-3 py-6 text-center'>
      <span className='flex h-14 w-14 items-center justify-center rounded-full bg-warning-50 text-warning-600'>
        <Coins className='h-6 w-6' />
      </span>
      <h3 className='text-base font-semibold text-grey-900'>
        You&apos;re out of AI credits
      </h3>
      <p className='max-w-xs text-sm text-grey-600'>
        Top up your AI credits to generate trivia questions.
      </p>
    </div>
  ) : (
    <div className='flex flex-col gap-4'>
      {error ? (
        <div className='rounded-lg bg-error-50 px-3 py-2.5 text-sm text-error-700'>
          {error}
        </div>
      ) : null}

      <div className='space-y-1.5'>
        <p className={LABEL_CLASS}>Category</p>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Choose a category' />
          </SelectTrigger>
          <SelectContent>
            {TRIVIA_CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-1.5'>
        <p className={LABEL_CLASS}>
          Refine <span className='font-normal text-grey-400'>(optional)</span>
        </p>
        <input
          type='text'
          value={refine}
          onChange={(e) => setRefine(e.target.value)}
          placeholder='e.g. 2020s Afrobeats hits'
          className='w-full rounded-xl border border-grey-50 bg-white px-3 py-3 text-sm text-grey-800 placeholder:text-grey-500 focus:outline-none focus:ring-1 focus:ring-primary-300'
        />
      </div>

      <div className='grid grid-cols-2 gap-3'>
        <div className='space-y-1.5'>
          <p className={LABEL_CLASS}>Questions</p>
          <div className='flex items-center justify-between rounded-xl border border-grey-50 bg-white px-2 py-1.5'>
            <button
              type='button'
              onClick={() => adjustCount(-1)}
              disabled={count <= AI_TRIVIA_MIN_COUNT}
              aria-label='Fewer questions'
              className='flex h-8 w-8 items-center justify-center rounded-lg text-grey-600 hover:bg-grey-50 disabled:opacity-40'
            >
              <Minus className='h-4 w-4' />
            </button>
            <span className='text-sm font-semibold tabular-nums text-grey-900'>
              {count}
            </span>
            <button
              type='button'
              onClick={() => adjustCount(1)}
              disabled={count >= AI_TRIVIA_MAX_COUNT}
              aria-label='More questions'
              className='flex h-8 w-8 items-center justify-center rounded-lg text-grey-600 hover:bg-grey-50 disabled:opacity-40'
            >
              <Plus className='h-4 w-4' />
            </button>
          </div>
        </div>

        <div className='space-y-1.5'>
          <p className={LABEL_CLASS}>Difficulty</p>
          <div className='grid grid-cols-3 gap-1 rounded-xl border border-grey-50 bg-grey-50/50 p-1'>
            {AI_DIFFICULTIES.map((d) => (
              <button
                key={d.value}
                type='button'
                onClick={() => setDifficulty(d.value)}
                className={`rounded-lg py-2 text-xs font-medium transition-colors ${
                  difficulty === d.value
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-grey-600 hover:text-grey-800'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className='flex items-center justify-between rounded-xl bg-primary-50/60 px-3 py-2.5'>
        <span className='text-xs text-grey-600'>Your AI balance</span>
        <span className='inline-flex items-center gap-1.5 text-xs font-semibold text-primary-700'>
          <Sparkles className='h-3.5 w-3.5' />
          {creditsQuery.isLoading
            ? '…'
            : `${(credits ?? 0).toLocaleString()} credits`}
        </span>
      </div>
    </div>
  )

  const footer = outOfCredits ? (
    <button
      type='button'
      onClick={onTopUp}
      className={`w-full rounded-[14px] py-3.5 text-base font-medium text-white ${PRIMARY_BTN}`}
    >
      Top up credits
    </button>
  ) : (
    <button
      type='button'
      onClick={() => void handleGenerate()}
      disabled={generateMutation.isPending}
      className={`inline-flex w-full items-center justify-center gap-2 rounded-[14px] py-3.5 text-base font-medium text-white transition-colors ${
        generateMutation.isPending ? 'cursor-wait bg-primary-300' : PRIMARY_BTN
      }`}
    >
      <Sparkles className='h-4 w-4' />
      {generateMutation.isPending ? 'Generating…' : 'Generate questions'}
    </button>
  )

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={handleClose}
      header={header}
      body={body}
      footer={footer}
      desktopMaxWidthClass='max-w-[480px]'
    />
  )
}

export default GenerateTriviaModal
