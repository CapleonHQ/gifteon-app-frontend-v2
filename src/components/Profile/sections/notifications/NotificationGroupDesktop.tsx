import { Checkbox } from '@/components/ui/checkbox'
import type {
  NotificationGroup,
  NotificationPrefs,
} from '@/types/Profile/notification'

type NotificationGroupDesktopProps = {
  group: NotificationGroup
  notifications: NotificationPrefs
  onUpdate: (
    id: string,
    field: 'email' | 'inApp' | 'sms',
    value: boolean
  ) => void
}

const NotificationGroupDesktop = ({
  group,
  notifications,
  onUpdate,
}: NotificationGroupDesktopProps) => {
  return (
    <div className='space-y-2 pb-4'>
      <p className='text-sm text-grey-500 uppercase'>{group.title}</p>
      <div className='space-y-3'>
        {group.items.map((item) => (
          <div
            key={item.id}
            className='grid grid-cols-[minmax(0,1fr)_96px_96px_96px] xl:grid-cols-[minmax(0,1fr)_160px_160px_160px] items-center text-grey-800'
          >
            <span>{item.label}</span>
            <div className='flex items-center justify-center'>
              <Checkbox
                checked={notifications[item.id]?.email}
                className='w-5 h-5'
                onCheckedChange={(checked) =>
                  onUpdate(item.id, 'email', Boolean(checked))
                }
              />
            </div>
            <div className='flex items-center justify-center'>
              <Checkbox
                checked={notifications[item.id]?.inApp}
                className='w-5 h-5'
                onCheckedChange={(checked) =>
                  onUpdate(item.id, 'inApp', Boolean(checked))
                }
              />
            </div>
            <div className='flex items-center justify-center'>
              <Checkbox
                checked={notifications[item.id]?.sms}
                className='w-5 h-5'
                onCheckedChange={(checked) =>
                  onUpdate(item.id, 'sms', Boolean(checked))
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NotificationGroupDesktop
