import { memo } from 'react'
import {
  PreviewTemplate1,
  PreviewTemplate2,
  PreviewTemplate3,
  PreviewTemplate4,
} from '../../../lib/config/templates/preview'
import { TEMPLATES } from '../../../lib/config/templates/selection'
import { GiftPageData } from '../../../types/gifts'

const TemplatePreview = ({
  data,
  templateId,
}: {
  data: GiftPageData
  templateId: string | null
}) => {
  const renderTemplate = () => {
    const template =
      TEMPLATES.find((item) => item.id === templateId) ?? TEMPLATES[0]

    switch (template?.layout) {
      case 'template2':
        return <PreviewTemplate2 data={data} />
      case 'template3':
        return <PreviewTemplate3 data={data} />
      case 'template4':
        return <PreviewTemplate4 data={data} />
      case 'template1':
      default:
        return <PreviewTemplate1 data={data} />
    }
  }

  return <div className='w-full max-w-2xl mx-auto'>{renderTemplate()}</div>
}

export default memo(TemplatePreview)
