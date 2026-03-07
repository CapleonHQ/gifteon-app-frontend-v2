import type { GiftPageData } from '@/types/gifts'
import type { ReactNode } from 'react'

export type TemplateLayout =
  | 'classicSplit'
  | 'haloPortrait'
  | 'storySplit'
  | 'spotlightGrid'

export type TemplateMeta = {
  id: string
  title: string
  description: string
  layout: TemplateLayout
}

export type SelectionTemplateProps = {
  template: TemplateMeta
}

export type PreviewTemplateProps = {
  data: GiftPageData
}

export type RenderSocialLinks = {
  instagram?: string
  twitter?: string
  linkedin?: string
}

export type RenderCommentItem = {
  id: string
  fullName: string
  anonymous: boolean
  comment: string
  createdAt: string
}

export type RenderActivityItem = {
  id: string
  label: string
  time: string
}

export type RenderTemplateData = {
  id: string
  templateId: string
  title: string
  description: string
  mediaUrl: string
  mediaType: 'image' | 'video'
  buttonLabel: string
  buttonTextColor: string
  buttonBackgroundColor: string
  titleStyle: {
    fontFamily: string
    color: string
    size: number
    alignment: 'left' | 'middle' | 'right'
    bold: boolean
    italic: boolean
    underline: boolean
  }
  descriptionStyle: {
    fontFamily: string
    color: string
    size: number
    alignment: 'left' | 'middle' | 'right'
  }
  socialLinks: RenderSocialLinks
}

export type RenderTemplateProps = {
  data: RenderTemplateData
  engagementSection?: ReactNode
  mobileShareAction?: ReactNode
}
