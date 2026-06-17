import type {
  GiveawayCategory,
  GiveawayPrizeType,
  GiveawayTaskType,
  TaskVerificationMethod,
  WinnerSelectionMethod,
} from '@/types/Giveaways'

export type CreateStep = 'category' | 'details' | 'content' | 'review'

export type QuestionDraft = {
  id: string
  questionText: string
  options: string[]
  correctOptionIndex: number
  timeLimitSeconds: string
  points: string
}

export type TaskDraft = {
  id: string
  taskType: GiveawayTaskType
  description: string
  verificationMethod: TaskVerificationMethod
  isRequired: boolean
}

export type GiveawayDraft = {
  category: GiveawayCategory | null
  title: string
  prizeType: GiveawayPrizeType
  prizeValue: string
  prizeCurrency: string
  prizeDescription: string
  winnerCount: string
  maxParticipants: string
  startsAt: string
  endsAt: string
  selectionMethod: WinnerSelectionMethod
  minScore: string
  questions: QuestionDraft[]
  tasks: TaskDraft[]
}

export const createEmptyQuestion = (): QuestionDraft => ({
  id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  questionText: '',
  options: ['', '', '', ''],
  correctOptionIndex: 0,
  timeLimitSeconds: '30',
  points: '10',
})

export const createEmptyTask = (): TaskDraft => ({
  id: `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  taskType: 'follow_social',
  description: '',
  verificationMethod: 'honor_system',
  isRequired: true,
})

export const createInitialDraft = (): GiveawayDraft => ({
  category: null,
  title: '',
  prizeType: 'cash',
  prizeValue: '',
  prizeCurrency: 'NGN',
  prizeDescription: '',
  winnerCount: '1',
  maxParticipants: '100',
  startsAt: '',
  endsAt: '',
  selectionMethod: 'random',
  minScore: '',
  questions: [createEmptyQuestion()],
  tasks: [createEmptyTask()],
})
