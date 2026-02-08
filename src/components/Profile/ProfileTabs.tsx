import type { ProfileTabId } from './profileData'
import { tabs } from './profileData'

const ProfileTabs = ({
  activeTab,
  onChange,
}: {
  activeTab: ProfileTabId
  onChange: (tab: ProfileTabId) => void
}) => {
  return (
    <div className='flex items-stretch gap-2 lg:gap-4 rounded-[10px] bg-primary-50/20 border border-primary-50 py-1.5 lg:py-1 px-1.5 lg:px-3'>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type='button'
          onClick={() => onChange(tab.id)}
          className={`flex-1 h-auto flex items-center justify-center text-center text-sm lg:text-base leading-5 lg:leading-6 px-2 lg:px-3 py-1 rounded-[8px] transition-colors ${
            activeTab === tab.id
              ? 'bg-primary-50 text-primary-900 font-medium'
              : 'text-grey-600 hover:text-primary-800'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default ProfileTabs
