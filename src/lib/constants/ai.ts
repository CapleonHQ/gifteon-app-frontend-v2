import type { AiDifficulty } from '@/types/Ai'

export const AI_DEFAULT_LANGUAGE = 'English'
export const AI_TRIVIA_MIN_COUNT = 1
export const AI_TRIVIA_MAX_COUNT = 10

export const AI_DIFFICULTIES: Array<{ value: AiDifficulty; label: string }> = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
]

export const TRIVIA_CATEGORIES: string[] = [
  'Afrobeats & Music',
  'Nigerian Pop Culture',
  'Football & Sports',
  'Movies & TV',
  'General Knowledge',
  'Science & Technology',
  'History',
  'Geography',
  'Religion & Faith',
  'Food & Lifestyle',
]
