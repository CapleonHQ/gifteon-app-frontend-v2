'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import TimerRing from '@/components/PublicGiveaway/components/TimerRing'
import type { GiveawayQuestion, SubmitTriviaAnswer } from '@/types/Giveaways'

type TriviaPlayProps = {
  questions: GiveawayQuestion[]
  isSubmitting: boolean
  onComplete: (answers: SubmitTriviaAnswer[]) => void
}

const TriviaPlay = ({ questions, isSubmitting, onComplete }: TriviaPlayProps) => {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [locked, setLocked] = useState(false)
  const answersRef = useRef<SubmitTriviaAnswer[]>([])

  const question = questions[index]
  const total = question?.timeLimitSeconds ?? 30
  const [remaining, setRemaining] = useState(total)

  const advance = useCallback(
    (selectedIndex: number | null) => {
      const current = questions[index]
      if (current && selectedIndex !== null) {
        answersRef.current = [
          ...answersRef.current.filter((a) => a.questionId !== current.id),
          { questionId: current.id, selectedIndex },
        ]
      }
      if (index + 1 >= questions.length) {
        onComplete(answersRef.current)
        return
      }
      setIndex((prev) => prev + 1)
      setSelected(null)
      setLocked(false)
    },
    [index, questions, onComplete]
  )

  // Per-question countdown
  useEffect(() => {
    setRemaining(total)
    if (!question) return
    const start = Date.now()
    const interval = window.setInterval(() => {
      const elapsed = (Date.now() - start) / 1000
      const left = Math.max(0, total - elapsed)
      setRemaining(left)
      if (left <= 0) {
        window.clearInterval(interval)
        setLocked(true)
        window.setTimeout(() => advance(null), 600)
      }
    }, 100)
    return () => window.clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  const handleSelect = (optionIndex: number) => {
    if (locked) return
    setSelected(optionIndex)
    setLocked(true)
    window.setTimeout(() => advance(optionIndex), 700)
  }

  if (!question) return null

  const revealCorrect = typeof question.correctOptionIndex === 'number'

  return (
    <div className='flex flex-col gap-6 max-w-xl mx-auto w-full'>
      {/* Progress + timer */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-1.5'>
          {questions.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === index
                  ? 'w-6 bg-primary-500'
                  : i < index
                    ? 'w-3 bg-primary-300'
                    : 'w-3 bg-grey-100'
              }`}
            />
          ))}
        </div>
        <TimerRing remaining={remaining} total={total} />
      </div>

      <AnimatePresence mode='wait'>
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
          className='flex flex-col gap-5'
        >
          <div>
            <span className='text-xs font-medium text-grey-400'>
              Question {index + 1} of {questions.length}
            </span>
            <h2 className='text-xl font-semibold text-grey-900 mt-1'>
              {question.questionText}
            </h2>
          </div>

          <div className='grid grid-cols-1 gap-3'>
            {question.options.map((option, optionIndex) => {
              const isSelected = selected === optionIndex
              const isCorrect = revealCorrect
                ? question.correctOptionIndex === optionIndex
                : false
              const showWrong = locked && isSelected && revealCorrect && !isCorrect

              let toneClass =
                'border-grey-100 bg-white hover:border-primary-200'
              if (locked && revealCorrect && isCorrect)
                toneClass = 'border-success-300 bg-success-50'
              else if (showWrong) toneClass = 'border-error-300 bg-error-50'
              else if (isSelected && !revealCorrect)
                toneClass = 'border-primary-300 bg-primary-50'

              return (
                <motion.button
                  key={optionIndex}
                  type='button'
                  disabled={locked}
                  onClick={() => handleSelect(optionIndex)}
                  whileTap={{ scale: 0.98 }}
                  animate={
                    showWrong
                      ? { x: [0, -6, 6, -4, 4, 0] }
                      : locked && isCorrect
                        ? { scale: [1, 1.03, 1] }
                        : {}
                  }
                  transition={{ duration: 0.4 }}
                  className={`flex items-center justify-between gap-3 text-left px-4 py-3.5 rounded-[12px] border-2 transition-colors ${toneClass}`}
                >
                  <span className='text-sm font-medium text-grey-800'>
                    {option}
                  </span>
                  {locked && revealCorrect && isCorrect ? (
                    <Check className='h-4 w-4 text-success-600' strokeWidth={3} />
                  ) : showWrong ? (
                    <X className='h-4 w-4 text-error-500' strokeWidth={3} />
                  ) : null}
                </motion.button>
              )
            })}
          </div>

          {isSubmitting && index + 1 >= questions.length ? (
            <p className='text-sm text-grey-500 text-center'>Submitting…</p>
          ) : null}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default TriviaPlay
