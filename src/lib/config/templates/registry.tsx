import type { ComponentType, ReactNode } from 'react'
import {
  PreviewTemplate1,
  PreviewTemplate2,
  PreviewTemplate3,
  PreviewTemplate4,
} from './preview'
import { RenderTemplate1, RenderTemplate2, RenderTemplate3, RenderTemplate4 } from './render'
import { Template1Selection, Template2Selection, Template3Selection, Template4Selection, TEMPLATES } from './selection'
import type { PreviewTemplateProps, RenderTemplateProps, TemplateMeta } from './types'

type SelectionComponent = ComponentType
type PreviewComponent = ComponentType<PreviewTemplateProps>
type RenderComponent = ComponentType<RenderTemplateProps>

export type TemplateModeComponents = {
  selection: SelectionComponent
  preview: PreviewComponent
  render: RenderComponent
}

export type TemplateRegistryItem = TemplateMeta & TemplateModeComponents

const PREVIEW_BY_LAYOUT: Record<TemplateMeta['layout'], PreviewComponent> = {
  template1: PreviewTemplate1,
  template2: PreviewTemplate2,
  template3: PreviewTemplate3,
  template4: PreviewTemplate4,
}

const SELECTION_BY_LAYOUT: Record<TemplateMeta['layout'], SelectionComponent> = {
  template1: Template1Selection,
  template2: Template2Selection,
  template3: Template3Selection,
  template4: Template4Selection,
}

const RENDER_BY_LAYOUT: Record<TemplateMeta['layout'], RenderComponent> = {
  template1: RenderTemplate1,
  template2: RenderTemplate2,
  template3: RenderTemplate3,
  template4: RenderTemplate4,
}

export const TEMPLATE_REGISTRY: TemplateRegistryItem[] = TEMPLATES.map((template) => ({
  ...template,
  selection: SELECTION_BY_LAYOUT[template.layout],
  preview: PREVIEW_BY_LAYOUT[template.layout],
  render: RENDER_BY_LAYOUT[template.layout],
}))

export const DEFAULT_TEMPLATE_REGISTRY_ITEM = TEMPLATE_REGISTRY[0]

export const getTemplateRegistryItem = (
  templateId?: string | null
): TemplateRegistryItem => {
  if (!templateId) return DEFAULT_TEMPLATE_REGISTRY_ITEM
  return (
    TEMPLATE_REGISTRY.find((template) => template.id === templateId) ??
    DEFAULT_TEMPLATE_REGISTRY_ITEM
  )
}

export const getTemplateSelectionComponent = (layout: TemplateMeta['layout']) => {
  return SELECTION_BY_LAYOUT[layout] ?? DEFAULT_TEMPLATE_REGISTRY_ITEM.selection
}

export const getTemplatePreviewComponent = (templateId?: string | null) => {
  return getTemplateRegistryItem(templateId).preview
}

export const getTemplateRenderComponent = (templateId?: string | null) => {
  return getTemplateRegistryItem(templateId).render
}

export const renderSelectionTemplate = (layout: TemplateMeta['layout']): ReactNode => {
  const Selection = getTemplateSelectionComponent(layout)
  return <Selection />
}

export const renderPreviewTemplate = (
  templateId: string | null | undefined,
  props: PreviewTemplateProps
): ReactNode => {
  const Preview = getTemplatePreviewComponent(templateId)
  return <Preview {...props} />
}

export const renderRenderTemplate = (
  templateId: string | null | undefined,
  props: RenderTemplateProps
): ReactNode => {
  const Render = getTemplateRenderComponent(templateId)
  return <Render {...props} />
}
