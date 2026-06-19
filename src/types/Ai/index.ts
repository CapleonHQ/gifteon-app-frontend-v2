export type AiDifficulty = 'easy' | 'medium' | 'hard'

export type AiPlan = 'free' | 'pro' | 'enterprise' | (string & {})

export interface GenerateTriviaBody {
  topic: string
  count: number
  difficulty: AiDifficulty
  language: string
  contextHint?: string
}

export interface AiTriviaQuestion {
  question: string
  options: Record<string, string>
  correctAnswer: string
  difficulty: AiDifficulty
  explanation?: string
  category?: string
}

export interface GenerateTriviaData {
  questions: AiTriviaQuestion[]
  creditsUsed: number
}

export interface AiCredits {
  credits: number
  plan: AiPlan
  lifetimeCredits: number
  lifetimeUsed: number
}

export interface AiUsageLog {
  id: string
  segment: string
  creditsUsed: number
  status: string
  createdAt: string
}

export interface AiUsageHistory {
  logs: AiUsageLog[]
  total: number
}

export interface AiCreditPack {
  id: string
  label: string
  credits: number
  priceUsd: number
}

export interface AiPlanOption {
  id: string
  label: string
  priceUsd: number
  billingCycle: string
}

export interface AiCatalogue {
  packs: AiCreditPack[]
  plans: AiPlanOption[]
  currentPlan: AiPlan
  currentCredits: number
  walletBalance: number
  walletCurrency: string
  note?: string
}

export interface PurchasePackBody {
  packId: string
  pin: string
}

export interface PurchasePackResult {
  credits: number
  plan: AiPlan
  creditsAdded: number
  amountCharged: number
  currency: string
  reference: string
}

export interface ExchangeRateQuery {
  from: string
  to: string
  amount: number
}

export interface ExchangeRateData {
  from: string
  to: string
  amount: number
  rate: number
  converted: number
}
