import {
  PreviewTemplate1,
  PreviewTemplate2,
  PreviewTemplate3,
  PreviewTemplate4,
} from '../../../lib/config/templates/preview'
import { GiftPageData } from '../../../types/gifts'

const TemplatePreview = ({
  data,
  templateId,
}: {
  data: GiftPageData
  templateId: number | null
}) => {
  const renderTemplate = () => {
    switch (templateId) {
      case 1:
        return <PreviewTemplate1 data={data} />
      case 2:
        return <PreviewTemplate2 data={data} />
      case 3:
        return <PreviewTemplate3 data={data} />
      case 4:
        return <PreviewTemplate4 data={data} />
      default:
        return <PreviewTemplate1 data={data} />
    }
  }

  return <div className='w-full max-w-2xl mx-auto'>{renderTemplate()}</div>
}

export default TemplatePreview
