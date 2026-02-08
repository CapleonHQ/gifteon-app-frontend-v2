import SectionCard from '@/components/Profile/components/SectionCard'
import { notificationGroups } from '../profileData'
import NotificationHeaderRow from '@/components/Profile/sections/notifications/NotificationHeaderRow'
import NotificationGroupDesktop from '@/components/Profile/sections/notifications/NotificationGroupDesktop'
import NotificationGroupMobile from '@/components/Profile/sections/notifications/NotificationGroupMobile'
import type { NotificationPrefs } from '@/types/Profile/notification'

type NotificationsSectionProps = {
  notifications: NotificationPrefs
  onChange: (value: NotificationPrefs) => void
}

const NotificationsSection = ({
  notifications,
  onChange,
}: NotificationsSectionProps) => {
  const updatePref = (
    id: string,
    field: 'email' | 'inApp' | 'sms',
    value: boolean
  ) => {
    onChange({
      ...notifications,
      [id]: {
        ...notifications[id],
        [field]: value,
      },
    })
  }

  return (
    <SectionCard
      title='Notifications'
      description='Choose how and where you would like to be notified about activities on your account.'
    >
      <div className='hidden lg:block'>
        <NotificationHeaderRow />
        <div className='mt-2 px-6 space-y-5 divide-y divide-grey-50'>
          {notificationGroups.map((group) => (
            <NotificationGroupDesktop
              key={group.title}
              group={group}
              notifications={notifications}
              onUpdate={updatePref}
            />
          ))}
        </div>
      </div>

      <div className='lg:hidden space-y-5 divide-y divide-grey-50 px-3'>
        {notificationGroups.map((group) => (
          <NotificationGroupMobile
            key={group.title}
            group={group}
            notifications={notifications}
            onUpdate={updatePref}
          />
        ))}
      </div>
    </SectionCard>
  )
}

export default NotificationsSection
