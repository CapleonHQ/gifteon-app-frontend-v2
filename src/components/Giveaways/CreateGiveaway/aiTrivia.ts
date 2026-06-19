import { createEmptyQuestion, type QuestionDraft } from './types'
import type { AiTriviaQuestion } from '@/types/Ai'

const OPTION_SLOTS = 4

const resolveCorrectIndex = (
  correctAnswer: unknown,
  orderedKeys: string[],
  options: string[]
): number => {
  if (correctAnswer == null) return 0
  const raw = String(correctAnswer).trim()
  if (!raw) return 0
  const upper = raw.toUpperCase()

  const keyIdx = orderedKeys.findIndex((k) => k.toUpperCase() === upper)
  if (keyIdx >= 0) return keyIdx

  const textIdx = options.findIndex(
    (o) => o.trim().toLowerCase() === raw.toLowerCase()
  )
  if (textIdx >= 0) return textIdx

  if (/^\d+$/.test(raw)) {
    const n = Number(raw)
    if (n >= 0 && n < options.length) return n
    if (n >= 1 && n <= options.length) return n - 1
  }

  const lead = upper.match(/(?:^|\s)([A-Z])(?=[).:\s-]|$)/)?.[1]
  if (lead) {
    const li = orderedKeys.findIndex((k) => k.toUpperCase() === lead)
    if (li >= 0) return li
  }

  return 0
}

export const mapAiQuestionToDraft = (q: AiTriviaQuestion): QuestionDraft => {
  const base = createEmptyQuestion()

  const orderedKeys = Object.keys(q.options ?? {}).sort()
  const orderedValues = orderedKeys.map((key) => q.options[key] ?? '')
  const options = Array.from(
    { length: OPTION_SLOTS },
    (_, i) => orderedValues[i] ?? ''
  )

  const correctOptionIndex = Math.min(
    OPTION_SLOTS - 1,
    resolveCorrectIndex(q.correctAnswer, orderedKeys, options)
  )

  return {
    ...base,
    questionText: q.question ?? '',
    options,
    correctOptionIndex,
  }
}
