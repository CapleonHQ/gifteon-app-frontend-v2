import MediaUpload from './Components/MediaUpload'
import TextStyleEditor from './Components/TextStyleEditor'
import ButtonSettings from './Components/ButtonSettings'
import { useGiftPageData } from './CreateGiftContext'

const CustomizeStep = ({
  errors,
  onTitleCommit,
  onDescriptionCommit,
  onButtonLabelCommit,
  onTitleDraftChange,
  onDescriptionDraftChange,
  onButtonLabelDraftChange,
  onMediaChange,
}: {
  errors?: {
    title?: string
    description?: string
    media?: string
    buttonLabel?: string
  }
  onTitleCommit: (value: string) => void
  onDescriptionCommit: (value: string) => void
  onButtonLabelCommit: (value: string) => void
  onTitleDraftChange: (value: string) => void
  onDescriptionDraftChange: (value: string) => void
  onButtonLabelDraftChange: (value: string) => void
  onMediaChange: () => void
}) => {
  const {
    giftPageData,
    handleMediaUpload,
    handleMediaRemove,
    updateTitle,
    updateDescription,
    updateButton,
  } = useGiftPageData()
  return (
    <>
      <MediaUpload
        media={giftPageData.media}
        onUpload={(file) => {
          handleMediaUpload(file)
          onMediaChange()
        }}
        onRemove={() => {
          handleMediaRemove()
          onMediaChange()
        }}
        error={errors?.media}
      />

      <TextStyleEditor
        label='Title Settings'
        value={giftPageData.title}
        onChange={updateTitle}
        onCommitText={onTitleCommit}
        onDraftTextChange={onTitleDraftChange}
        error={errors?.title}
      />

      <ButtonSettings
        button={giftPageData.button}
        onChange={updateButton}
        onCommitLabel={onButtonLabelCommit}
        onDraftLabelChange={onButtonLabelDraftChange}
        error={errors?.buttonLabel}
      />

      <TextStyleEditor
        label='Celebratory Message'
        value={giftPageData.description}
        onChange={updateDescription}
        onCommitText={onDescriptionCommit}
        onDraftTextChange={onDescriptionDraftChange}
        error={errors?.description}
      />
    </>
  )
}

export default CustomizeStep
