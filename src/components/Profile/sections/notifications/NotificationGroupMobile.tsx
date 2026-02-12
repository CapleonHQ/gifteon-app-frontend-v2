import { Checkbox } from '@/components/ui/checkbox'
import type {
  NotificationGroup,
  NotificationPrefs,
} from '@/types/Profile/notification'

type NotificationGroupMobileProps = {
  group: NotificationGroup
  notifications: NotificationPrefs
  onUpdate: (
    id: string,
    field: 'email' | 'inApp' | 'sms',
    value: boolean
  ) => void
}

const NotificationGroupMobile = ({
  group,
  notifications,
  onUpdate,
}: NotificationGroupMobileProps) => {
  return (
    <div className='space-y-2 pb-4'>
      <p className='text-sm text-grey-500 uppercase'>{group.title}</p>
      <div className='space-y-5'>
        {group.items.map((item) => (
          <div key={item.id} className='space-y-4'>
            <p className='text-grey-800'>{item.label}</p>
            <div className='flex items-center text-sm text-grey-500 font-medium'>
              <label className='flex flex-col items-center gap-4 flex-1'>
                Email
                <Checkbox
                  checked={notifications[item.id]?.email}
                  className='w-5 h-5'
                  onCheckedChange={(checked) =>
                    onUpdate(item.id, 'email', Boolean(checked))
                  }
                />
              </label>
              <label className='flex flex-col items-center gap-4 flex-1'>
                In-App
                <Checkbox
                  checked={notifications[item.id]?.inApp}
                  className='w-5 h-5'
                  onCheckedChange={(checked) =>
                    onUpdate(item.id, 'inApp', Boolean(checked))
                  }
                />
              </label>
              <label className='flex flex-col items-center gap-4 flex-1'>
                SMS
                <Checkbox
                  checked={notifications[item.id]?.sms}
                  className='w-5 h-5'
                  onCheckedChange={(checked) =>
                    onUpdate(item.id, 'sms', Boolean(checked))
                  }
                />
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NotificationGroupMobile
