import type { ComponentType, ReactNode } from 'react'
import {
  PreviewClassicSplit,
  PreviewHaloPortrait,
  PreviewStorySplit,
  PreviewSpotlightGrid,
} from './preview'
import {
  RenderClassicSplit,
  RenderHaloPortrait,
  RenderStorySplit,
  RenderSpotlightGrid,
} from './render'
import {
  ClassicSplitSelection,
  HaloPortraitSelection,
  StorySplitSelection,
  SpotlightGridSelection,
  TEMPLATES,
} from './selection'
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
  classicSplit: PreviewClassicSplit,
  haloPortrait: PreviewHaloPortrait,
  storySplit: PreviewStorySplit,
  spotlightGrid: PreviewSpotlightGrid,
}

const SELECTION_BY_LAYOUT: Record<TemplateMeta['layout'], SelectionComponent> = {
  classicSplit: ClassicSplitSelection,
  haloPortrait: HaloPortraitSelection,
  storySplit: StorySplitSelection,
  spotlightGrid: SpotlightGridSelection,
}

const RENDER_BY_LAYOUT: Record<TemplateMeta['layout'], RenderComponent> = {
  classicSplit: RenderClassicSplit,
  haloPortrait: RenderHaloPortrait,
  storySplit: RenderStorySplit,
  spotlightGrid: RenderSpotlightGrid,
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
