import InputField from './Components/InputField'
import { useCreateGift } from './CreateGiftContext'

const SettingsSocialLinks = () => {
  const { giftPageData, updateSocialLink } = useCreateGift()

  return (
    <div className='mb-6'>
      <h4 className='font-medium text-grey-700 mb-2 text-sm'>
        SOCIAL MEDIA LINKS
      </h4>
      <div className='space-y-3'>
        <InputField
          label='Instagram'
          value={giftPageData.socialLinks.instagram || ''}
          onChange={(value) => updateSocialLink('instagram', value)}
          placeholder='Enter your Instagram url'
        />
        <InputField
          label='X'
          value={giftPageData.socialLinks.twitter || ''}
          onChange={(value) => updateSocialLink('twitter', value)}
          placeholder='Enter your X url'
        />
        <InputField
          label='LinkedIn'
          value={giftPageData.socialLinks.linkedin || ''}
          onChange={(value) => updateSocialLink('linkedin', value)}
          placeholder='Enter your Linkedin url'
        />
      </div>
    </div>
  )
}

export default SettingsSocialLinks
