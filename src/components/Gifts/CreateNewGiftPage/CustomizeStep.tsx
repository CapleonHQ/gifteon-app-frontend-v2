import type { ChangeEvent } from 'react'
import MediaUpload from './Components/MediaUpload'
import TextStyleEditor from './Components/TextStyleEditor'
import ButtonSettings from './Components/ButtonSettings'
import { GiftPageData } from '@/types/gifts'

type CustomizeStepProps = {
  data: GiftPageData
  onDataChange: (data: GiftPageData) => void
  onMediaUpload: (event: ChangeEvent<HTMLInputElement>) => void
  onMediaRemove: () => void
}

const CustomizeStep = ({
  data,
  onDataChange,
  onMediaUpload,
  onMediaRemove,
}: CustomizeStepProps) => {
  return (
    <>
      <MediaUpload
        media={data.media}
        onUpload={onMediaUpload}
        onRemove={onMediaRemove}
      />

      <TextStyleEditor
        label='Title Settings'
        value={data.title}
        onChange={(newTitle) => onDataChange({ ...data, title: newTitle })}
      />

      <ButtonSettings
        button={data.button}
        onChange={(newButton) => onDataChange({ ...data, button: newButton })}
      />

      <TextStyleEditor
        label='Celebratory Message'
        value={data.description}
        onChange={(newDescription) =>
          onDataChange({ ...data, description: newDescription })
        }
      />
    </>
  )
}

export default CustomizeStep
