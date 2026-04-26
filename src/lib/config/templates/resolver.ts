import { getTemplateLayoutByName, getTemplateMetaByName, TEMPLATES } from './selection'
import type { TemplateLayout, TemplateMeta } from './types'

export const DEFAULT_TEMPLATE_LAYOUT: TemplateLayout = 'classicSplit'

export const DEFAULT_TEMPLATE: TemplateMeta = TEMPLATES[0]

export const resolveTemplateByName = (
  templateName?: string | null
): TemplateMeta => {
  if (!templateName) return DEFAULT_TEMPLATE
  return getTemplateMetaByName(templateName) ?? DEFAULT_TEMPLATE
}

export const resolveTemplateLayout = (
  templateName?: string | null
): TemplateLayout => {
  return getTemplateLayoutByName(templateName) ?? DEFAULT_TEMPLATE_LAYOUT
}

export const isKnownTemplateName = (templateName?: string | null): boolean => {
  if (!templateName) return false
  return Boolean(getTemplateMetaByName(templateName))
}
