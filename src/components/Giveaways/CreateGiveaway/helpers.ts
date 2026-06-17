import type { CreateGiveawayBody, WinnerSelectionRule } from '@/types/Giveaways'
import type { GiveawayDraft } from './types'

export type DraftFieldErrors = Record<string, string>

export const questionTextKey = (id: string) => `q:${id}:text`
export const questionOptionsKey = (id: string) => `q:${id}:options`
export const taskDescKey = (id: string) => `t:${id}:desc`

export const validateDetails = (draft: GiveawayDraft): DraftFieldErrors => {
  const errors: DraftFieldErrors = {}
  if (!draft.title.trim()) errors.title = 'Add a giveaway title.'
  const prize = Number(draft.prizeValue)
  if (!Number.isFinite(prize) || prize <= 0)
    errors.prizeValue = 'Enter a valid prize value.'
  if (!draft.prizeDescription.trim())
    errors.prizeDescription = 'Add a prize description.'
  const winners = Number(draft.winnerCount)
  if (!Number.isFinite(winners) || winners < 1)
    errors.winnerCount = 'Enter at least 1 winner.'
  const maxP = Number(draft.maxParticipants)
  if (!Number.isFinite(maxP) || maxP < 1)
    errors.maxParticipants = 'Enter a max participant count.'
  if (!draft.startsAt) errors.startsAt = 'Pick a start date and time.'
  if (!draft.endsAt) errors.endsAt = 'Pick an end date and time.'
  else if (
    draft.startsAt &&
    new Date(draft.endsAt).getTime() <= new Date(draft.startsAt).getTime()
  )
    errors.endsAt = 'End must be after the start time.'
  return errors
}

export const validateContent = (draft: GiveawayDraft): DraftFieldErrors => {
  const errors: DraftFieldErrors = {}
  if (draft.category === 'trivia') {
    for (const q of draft.questions) {
      if (!q.questionText.trim())
        errors[questionTextKey(q.id)] = 'Add a question.'
      const filled = q.options.filter((opt) => opt.trim().length > 0)
      if (filled.length < 2)
        errors[questionOptionsKey(q.id)] = 'Add at least 2 options.'
      else if (!q.options[q.correctOptionIndex]?.trim())
        errors[questionOptionsKey(q.id)] = 'Mark a valid correct answer.'
    }
  }
  if (draft.category === 'task') {
    for (const t of draft.tasks) {
      if (!t.description.trim())
        errors[taskDescKey(t.id)] = 'Add a description.'
    }
  }
  return errors
}

const buildSelectionRule = (draft: GiveawayDraft): WinnerSelectionRule => {
  if (draft.category === 'trivia') {
    return {
      method: 'highest_score',
      tieBreak: 'earliest_submission',
      ...(draft.minScore ? { minScore: Number(draft.minScore) } : {}),
    }
  }
  return { method: 'random' }
}

export const buildCreatePayload = (
  draft: GiveawayDraft,
  pin: string
): CreateGiveawayBody => {
  const base = {
    title: draft.title.trim(),
    prizeType: draft.prizeType,
    prizeValue: Number(draft.prizeValue),
    prizeCurrency: draft.prizeCurrency,
    prizeDescription: draft.prizeDescription.trim(),
    winnerCount: Number(draft.winnerCount),
    maxParticipants: Number(draft.maxParticipants),
    startsAt: new Date(draft.startsAt).toISOString(),
    endsAt: new Date(draft.endsAt).toISOString(),
    pin,
    winnerSelectionRule: buildSelectionRule(draft),
  }

  if (draft.category === 'trivia') {
    return {
      ...base,
      category: 'trivia',
      questions: draft.questions.map((q, index) => ({
        questionText: q.questionText.trim(),
        options: q.options.filter((opt) => opt.trim().length > 0),
        correctOptionIndex: q.correctOptionIndex,
        timeLimitSeconds: Number(q.timeLimitSeconds) || 30,
        points: Number(q.points) || 10,
        sortOrder: index + 1,
      })),
    }
  }

  if (draft.category === 'task') {
    return {
      ...base,
      category: 'task',
      tasks: draft.tasks.map((t, index) => ({
        taskType: t.taskType,
        description: t.description.trim(),
        verificationMethod: t.verificationMethod,
        isRequired: t.isRequired,
        sortOrder: index + 1,
      })),
    }
  }

  return { ...base, category: 'lottery' }
}
