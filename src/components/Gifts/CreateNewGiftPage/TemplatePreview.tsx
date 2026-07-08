import { memo } from 'react'
import { renderPreviewTemplate } from '../../../lib/config/templates/registry'
import { GiftPageData } from '../../../types/gifts'
import type { TemplateLayout } from '@/lib/config/templates/types'

const TemplatePreview = ({
  data,
  templateLayout,
}: {
  data: GiftPageData
  templateLayout: TemplateLayout | null
}) => {
  return (
    <div className='w-full max-w-2xl mx-auto'>
      {renderPreviewTemplate(templateLayout, { data })}
    </div>
  )
}

export default memo(TemplatePreview)
