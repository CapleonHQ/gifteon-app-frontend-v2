import MediaUpload from './Components/MediaUpload'
import TextStyleEditor from './Components/TextStyleEditor'
import ButtonSettings from './Components/ButtonSettings'
import { useCreateGift } from './CreateGiftContext'

const CustomizeStep = () => {
  const {
    giftPageData,
    updateTitle,
    updateDescription,
    updateButton,
    handleMediaUpload,
    handleMediaRemove,
  } = useCreateGift()
  return (
    <>
      <MediaUpload
        media={giftPageData.media}
        onUpload={handleMediaUpload}
        onRemove={handleMediaRemove}
      />

      <TextStyleEditor
        label='Title Settings'
        value={giftPageData.title}
        onChange={updateTitle}
      />

      <ButtonSettings button={giftPageData.button} onChange={updateButton} />

      <TextStyleEditor
        label='Celebratory Message'
        value={giftPageData.description}
        onChange={updateDescription}
      />
    </>
  )
}

export default CustomizeStep
