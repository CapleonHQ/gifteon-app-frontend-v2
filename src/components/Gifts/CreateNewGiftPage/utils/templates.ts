import {
  getTemplateMetaByName,
  TEMPLATES,
} from '@/lib/config/templates/selection'
import { type ApiTemplateOption } from '@/lib/config/templates/types'

export const extractTemplateOptions = (payload: unknown): ApiTemplateOption[] => {
  const response = payload as { data?: unknown[] | null } | undefined
  const rawItems = Array.isArray(response?.data) ? response.data : []

  return rawItems
    .map((item) => {
      const raw = item as { id?: unknown; name?: unknown }
      const id = String(raw.id || '').trim()
      const name = String(raw.name || '').trim()
      if (!id || !name) return null

      const meta = getTemplateMetaByName(name)
      if (!meta) return null

      return {
        id,
        name,
        title: meta.title,
        description: meta.description,
        layout: meta.layout,
      } satisfies ApiTemplateOption
    })
    .filter((item): item is ApiTemplateOption => Boolean(item))
}

export const sortTemplateOptions = (
  templates: ApiTemplateOption[]
): ApiTemplateOption[] => {
  const orderByLayout = new Map(
    TEMPLATES.map((template, index) => [template.layout, index])
  )

  return [...templates].sort((left, right) => {
    const leftOrder = orderByLayout.get(left.layout) ?? Number.MAX_SAFE_INTEGER
    const rightOrder =
      orderByLayout.get(right.layout) ?? Number.MAX_SAFE_INTEGER
    return leftOrder - rightOrder
  })
}
