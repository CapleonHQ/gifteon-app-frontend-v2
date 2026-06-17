import { PaginationParams } from '@/types/Common'

export type GiveawayCategory = 'trivia' | 'task' | 'lottery'

export type GiveawayStatus =
  | 'pending'
  | 'active'
  | 'closed'
  | 'completed'
  | 'disbursed'
  | 'cancelled'

export type GiveawayPrizeType = 'cash' | 'gift' | 'voucher'

export type WinnerSelectionMethod = 'highest_score' | 'random'

export type GiveawayTaskType =
  | 'follow_social'
  | 'upload_proof'
  | 'visit_link'
  | 'share'
  | string

export type TaskVerificationMethod = 'honor_system' | 'manual_review'

export interface WinnerSelectionRule {
  method: WinnerSelectionMethod
  minScore?: number
  tieBreak?: string
}

export interface EligibilityRules {
  minAge?: number
  region?: string
  accountAgeDays?: number
}

export interface Giveaway {
  id: string
  creatorId: string
  title: string
  category: GiveawayCategory
  prizeType: GiveawayPrizeType
  prizeValue: string
  prizeCurrency: string
  prizeDescription: string
  winnerCount: number
  winnerSelectionRule: WinnerSelectionRule
  eligibilityRules: EligibilityRules | null
  maxParticipants: number
  startsAt: string
  endsAt: string
  status: GiveawayStatus
  leaderboardRevealedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface GiveawayQuestion {
  id: string
  giveawayId: string
  questionText: string
  options: string[]
  correctOptionIndex?: number
  points?: number
  timeLimitSeconds?: number
  sortOrder?: number
}

export interface GiveawayTask {
  id: string
  giveawayId: string
  taskType: GiveawayTaskType
  description: string
  verificationMethod: TaskVerificationMethod
  isRequired: boolean
  sortOrder?: number
}

export interface GiveawayDetailData {
  giveaway: Giveaway
  questions?: GiveawayQuestion[]
  tasks?: GiveawayTask[]
}

export interface LeaderboardEntry {
  userGiftseonTag: string
  userProfilePicture: string | null
  score: number
  rank: number
  isWinner: boolean
  enteredAt: string
}

export interface GiveawayLeaderboardData {
  participantCount: number
  revealed: boolean
  entries: LeaderboardEntry[]
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ApiListResponse<T> {
  status?: string
  success?: boolean
  message: string
  data: T[]
  meta?: { pagination?: PaginationMeta }
}

export interface GiveawayQueryParams extends PaginationParams {
  status?: GiveawayStatus
  category?: GiveawayCategory
}

// ---- Request bodies ----

export interface GiveawayBaseBody {
  title: string
  prizeType: GiveawayPrizeType
  prizeValue: number
  prizeCurrency: string
  prizeDescription: string
  winnerCount: number
  maxParticipants: number
  startsAt: string
  endsAt: string
  pin: string
  winnerSelectionRule: WinnerSelectionRule
  eligibilityRules?: EligibilityRules
}

export interface CreateTriviaQuestionInput {
  questionText: string
  options: string[]
  correctOptionIndex: number
  points?: number
  timeLimitSeconds?: number
  sortOrder: number
}

export interface CreateTriviaGiveawayBody extends GiveawayBaseBody {
  category: 'trivia'
  questions: CreateTriviaQuestionInput[]
}

export interface CreateTaskInput {
  taskType: GiveawayTaskType
  description: string
  verificationMethod: TaskVerificationMethod
  isRequired: boolean
  sortOrder: number
}

export interface CreateTaskGiveawayBody extends GiveawayBaseBody {
  category: 'task'
  tasks: CreateTaskInput[]
}

export interface CreateLotteryGiveawayBody extends GiveawayBaseBody {
  category: 'lottery'
}

export type CreateGiveawayBody =
  | CreateTriviaGiveawayBody
  | CreateTaskGiveawayBody
  | CreateLotteryGiveawayBody

export interface UpdateGiveawayBody {
  title?: string
  prizeDescription?: string
  winnerCount?: number
  maxParticipants?: number
  startsAt?: string
  endsAt?: string
  winnerSelectionRule?: WinnerSelectionRule
  eligibilityRules?: EligibilityRules
}

export interface PinActionBody {
  pin: string
}

export interface SubmitTriviaAnswer {
  questionId: string
  selectedIndex: number
}

export interface SubmitTriviaBody {
  answers: SubmitTriviaAnswer[]
}

export interface SubmitTaskProofBody {
  taskId: string
  proofUrl?: string
  proofText?: string
}

// ---- Response payloads for mutations ----

export interface GiveawayEntry {
  id: string
  status: string
  score: number
  isWinner: boolean
  giveawayId: string
  userId: string
  createdAt: string
  submissionData: unknown
  submittedAt: string | null
}

export interface TriviaSubmitResult {
  score: number
}

export interface SelectWinnersResult {
  winners: string[]
}
