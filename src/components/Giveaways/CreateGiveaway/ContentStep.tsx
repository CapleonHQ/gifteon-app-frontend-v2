'use client'

import { motion } from 'framer-motion'
import { Check, ChevronLeft, Plus, Trash2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { InlineError } from '@/components/Stores/Bills/config'
import TemplateSelectionFooter from '@/components/Gifts/CreateNewGiftPage/TemplateSelectionFooter'
import {
  createEmptyQuestion,
  createEmptyTask,
  type GiveawayDraft,
  type QuestionDraft,
  type TaskDraft,
} from './types'
import {
  questionOptionsKey,
  questionTextKey,
  taskDescKey,
  type DraftFieldErrors,
} from './helpers'
import {
  GIVEAWAY_TASK_TYPES,
  GIVEAWAY_TASK_VERIFICATION_METHODS,
} from '@/lib/constants/giveaways'
import type { GiveawayTaskType, TaskVerificationMethod } from '@/types/Giveaways'

type ContentStepProps = {
  totalSteps: number
  draft: GiveawayDraft
  update: (patch: Partial<GiveawayDraft>) => void
  errors: DraftFieldErrors
  onBack: () => void
  onContinue: () => void
}

const LABEL_CLASS = 'text-xs font-medium text-grey-700'
const fieldClass = (hasError?: boolean) =>
  `w-full px-3 py-3 border ${
    hasError ? 'border-error-300' : 'border-grey-50'
  } rounded-xl text-sm text-grey-800 placeholder:text-grey-500 bg-white focus:outline-none focus:ring-1 focus:ring-primary-300`

const ContentStep = ({
  totalSteps,
  draft,
  update,
  errors,
  onBack,
  onContinue,
}: ContentStepProps) => {
  const isTrivia = draft.category === 'trivia'

  const updateQuestion = (id: string, patch: Partial<QuestionDraft>) =>
    update({
      questions: draft.questions.map((q) =>
        q.id === id ? { ...q, ...patch } : q
      ),
    })
  const updateOption = (id: string, index: number, value: string) =>
    update({
      questions: draft.questions.map((q) =>
        q.id === id
          ? { ...q, options: q.options.map((o, i) => (i === index ? value : o)) }
          : q
      ),
    })
  const updateTask = (id: string, patch: Partial<TaskDraft>) =>
    update({
      tasks: draft.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    })

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
            Step 3 of {totalSteps}
          </p>
          <h2 className='mt-2 text-2xl font-semibold text-blackish'>
            {isTrivia ? 'Trivia questions' : 'Entry tasks'}
          </h2>
          <p className='mt-2 max-w-2xl text-sm leading-6 text-grey-700'>
            {isTrivia
              ? 'Add the questions players answer. Tap the circle to mark the correct option.'
              : 'Add the tasks players must complete to enter your giveaway.'}
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

      {isTrivia ? (
        <div className='mb-5 flex flex-col gap-4'>
          {draft.questions.map((q, qIndex) => (
            <div
              key={q.id}
              className='rounded-[20px] border border-grey-100 bg-white p-5 flex flex-col gap-4'
            >
              <div className='flex items-center justify-between'>
                <span className='text-sm font-semibold text-grey-900'>
                  Question {qIndex + 1}
                </span>
                {draft.questions.length > 1 ? (
                  <button
                    type='button'
                    onClick={() =>
                      update({
                        questions: draft.questions.filter((x) => x.id !== q.id),
                      })
                    }
                    className='inline-flex items-center gap-1 text-xs font-medium text-error-500 hover:text-error-600'
                  >
                    <Trash2 className='h-3.5 w-3.5' />
                    Remove
                  </button>
                ) : null}
              </div>

              <div className='space-y-1.5'>
                <p className={LABEL_CLASS}>Question</p>
                <input
                  type='text'
                  value={q.questionText}
                  onChange={(e) =>
                    updateQuestion(q.id, { questionText: e.target.value })
                  }
                  placeholder='e.g. What is the capital of Nigeria?'
                  className={fieldClass(Boolean(errors[questionTextKey(q.id)]))}
                />
                <InlineError message={errors[questionTextKey(q.id)]} />
              </div>

              <div className='space-y-1.5'>
                <p className={LABEL_CLASS}>
                  Options{' '}
                  <span className='font-normal text-grey-400'>
                    (mark the correct one)
                  </span>
                </p>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                  {q.options.map((option, optIndex) => {
                    const correct = q.correctOptionIndex === optIndex
                    const hasOptionError = Boolean(
                      errors[questionOptionsKey(q.id)]
                    )
                    return (
                      <div
                        key={optIndex}
                        className={`flex items-center gap-2 rounded-xl border bg-white pl-2 pr-3 ${
                          correct
                            ? 'border-success-300'
                            : hasOptionError
                              ? 'border-error-300'
                              : 'border-grey-50'
                        }`}
                      >
                        <button
                          type='button'
                          aria-label='Mark correct'
                          onClick={() =>
                            updateQuestion(q.id, { correctOptionIndex: optIndex })
                          }
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                            correct
                              ? 'border-success-400 bg-success-400 text-white'
                              : 'border-grey-200 text-transparent hover:border-success-300'
                          }`}
                        >
                          <Check className='h-3 w-3' strokeWidth={3} />
                        </button>
                        <input
                          type='text'
                          value={option}
                          onChange={(e) =>
                            updateOption(q.id, optIndex, e.target.value)
                          }
                          placeholder={`Option ${optIndex + 1}`}
                          className='flex-1 min-w-0 bg-transparent py-2.5 text-sm text-grey-800 placeholder:text-grey-500 focus:outline-none'
                        />
                      </div>
                    )
                  })}
                </div>
                <InlineError message={errors[questionOptionsKey(q.id)]} />
              </div>

              <div className='grid grid-cols-2 gap-3'>
                <div className='space-y-1.5'>
                  <p className={LABEL_CLASS}>Time limit (seconds)</p>
                  <input
                    type='text'
                    inputMode='numeric'
                    value={q.timeLimitSeconds}
                    onChange={(e) =>
                      updateQuestion(q.id, {
                        timeLimitSeconds: e.target.value.replace(/\D/g, ''),
                      })
                    }
                    placeholder='30'
                    className={fieldClass()}
                  />
                </div>
                <div className='space-y-1.5'>
                  <p className={LABEL_CLASS}>Points</p>
                  <input
                    type='text'
                    inputMode='numeric'
                    value={q.points}
                    onChange={(e) =>
                      updateQuestion(q.id, {
                        points: e.target.value.replace(/\D/g, ''),
                      })
                    }
                    placeholder='10'
                    className={fieldClass()}
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type='button'
            onClick={() =>
              update({ questions: [...draft.questions, createEmptyQuestion()] })
            }
            className='inline-flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-grey-200 py-3.5 text-sm font-medium text-grey-600 hover:border-primary-200 hover:text-primary-600 transition-colors'
          >
            <Plus className='h-4 w-4' />
            Add question
          </button>
        </div>
      ) : (
        <div className='mb-5 flex flex-col gap-4'>
          {draft.tasks.map((t, tIndex) => (
            <div
              key={t.id}
              className='rounded-[20px] border border-grey-100 bg-white p-5 flex flex-col gap-4'
            >
              <div className='flex items-center justify-between'>
                <span className='text-sm font-semibold text-grey-900'>
                  Task {tIndex + 1}
                </span>
                {draft.tasks.length > 1 ? (
                  <button
                    type='button'
                    onClick={() =>
                      update({ tasks: draft.tasks.filter((x) => x.id !== t.id) })
                    }
                    className='inline-flex items-center gap-1 text-xs font-medium text-error-500 hover:text-error-600'
                  >
                    <Trash2 className='h-3.5 w-3.5' />
                    Remove
                  </button>
                ) : null}
              </div>

              <div className='space-y-1.5'>
                <p className={LABEL_CLASS}>Description</p>
                <input
                  type='text'
                  value={t.description}
                  onChange={(e) =>
                    updateTask(t.id, { description: e.target.value })
                  }
                  placeholder='e.g. Follow @gifteon on Instagram'
                  className={fieldClass(Boolean(errors[taskDescKey(t.id)]))}
                />
                <InlineError message={errors[taskDescKey(t.id)]} />
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                <div className='space-y-1.5'>
                  <p className={LABEL_CLASS}>Task type</p>
                  <Select
                    value={t.taskType}
                    onValueChange={(value) =>
                      updateTask(t.id, { taskType: value as GiveawayTaskType })
                    }
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select task type' />
                    </SelectTrigger>
                    <SelectContent>
                      {GIVEAWAY_TASK_TYPES.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className='space-y-1.5'>
                  <p className={LABEL_CLASS}>Verification</p>
                  <Select
                    value={t.verificationMethod}
                    onValueChange={(value) =>
                      updateTask(t.id, {
                        verificationMethod: value as TaskVerificationMethod,
                      })
                    }
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select method' />
                    </SelectTrigger>
                    <SelectContent>
                      {GIVEAWAY_TASK_VERIFICATION_METHODS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <label className='flex items-center gap-2 text-sm text-grey-700'>
                <Checkbox
                  checked={t.isRequired}
                  onCheckedChange={(checked) =>
                    updateTask(t.id, { isRequired: checked === true })
                  }
                />
                Required to enter
              </label>
            </div>
          ))}

          <button
            type='button'
            onClick={() => update({ tasks: [...draft.tasks, createEmptyTask()] })}
            className='inline-flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-grey-200 py-3.5 text-sm font-medium text-grey-600 hover:border-primary-200 hover:text-primary-600 transition-colors'
          >
            <Plus className='h-4 w-4' />
            Add task
          </button>
        </div>
      )}

      <TemplateSelectionFooter
        canContinue
        onContinue={onContinue}
        ctaLabel='Continue'
      />
    </motion.div>
  )
}

export default ContentStep
