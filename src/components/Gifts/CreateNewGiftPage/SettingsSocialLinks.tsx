import InputField from './Components/InputField'
import { GiftPageData } from '@/types/gifts'

type SettingsSocialLinksProps = {
  socialLinks: GiftPageData['socialLinks']
  onSocialLinkChange: (
    key: keyof GiftPageData['socialLinks'],
    value: string
  ) => void
}

const SettingsSocialLinks = ({
  socialLinks,
  onSocialLinkChange,
}: SettingsSocialLinksProps) => {
  return (
    <div className='mb-6'>
      <h4 className='font-medium text-grey-700 mb-2 text-sm'>
        SOCIAL MEDIA LINKS
      </h4>
      <div className='space-y-3'>
        <InputField
          label='Instagram'
          value={socialLinks.instagram || ''}
          onChange={(value) => onSocialLinkChange('instagram', value)}
          placeholder='Enter your Instagram url'
        />
        <InputField
          label='X'
          value={socialLinks.twitter || ''}
          onChange={(value) => onSocialLinkChange('twitter', value)}
          placeholder='Enter your X url'
        />
        <InputField
          label='LinkedIn'
          value={socialLinks.linkedin || ''}
          onChange={(value) => onSocialLinkChange('linkedin', value)}
          placeholder='Enter your Linkedin url'
        />
      </div>
    </div>
  )
}

export default SettingsSocialLinks
