import { memo } from 'react'
import { renderPreviewTemplate } from '../../../lib/config/templates/registry'
import { GiftPageData } from '../../../types/gifts'

const TemplatePreview = ({
  data,
  templateId,
}: {
  data: GiftPageData
  templateId: string | null
}) => {
  return (
    <div className='w-full max-w-2xl mx-auto'>
      {renderPreviewTemplate(templateId, { data })}
    </div>
  )
}

export default memo(TemplatePreview)
