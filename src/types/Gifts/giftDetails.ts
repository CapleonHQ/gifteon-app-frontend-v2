import type { ComponentType } from 'react'

export type SummaryCard = {
  id: string
  title: string
  value: string
  icon: ComponentType
  borderColor: string
  accent: string
  iconColor: string
  svgColor: string
}

export type WishItem = {
  id: string
  name: string
  time: string
  message: string
  private: boolean
}
