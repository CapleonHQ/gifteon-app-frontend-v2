import SettingsGiftDetails from './SettingsGiftDetails'
import SettingsRecipients from './SettingsRecipients'
import SettingsSocialLinks from './SettingsSocialLinks'

const SettingsStep = () => {
  return (
    <div className='space-y-6'>
      <SettingsGiftDetails />
      <SettingsRecipients />
      <SettingsSocialLinks />
    </div>
  )
}

export default SettingsStep
