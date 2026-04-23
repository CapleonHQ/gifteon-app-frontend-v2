import { TEMPLATES } from './selection'
import type { TemplateLayout, TemplateMeta } from './types'

export const DEFAULT_TEMPLATE_LAYOUT: TemplateLayout = 'classicSplit'

export const DEFAULT_TEMPLATE: TemplateMeta = TEMPLATES[0]

export const resolveTemplateById = (
  templateId?: string | null
): TemplateMeta => {
  if (!templateId) return DEFAULT_TEMPLATE
  return TEMPLATES.find((item) => item.id === templateId) ?? DEFAULT_TEMPLATE
}

export const resolveTemplateLayout = (
  templateId?: string | null
): TemplateLayout => {
  return resolveTemplateById(templateId).layout
}

export const isKnownTemplateId = (templateId?: string | null): boolean => {
  if (!templateId) return false
  return TEMPLATES.some((item) => item.id === templateId)
}
