import { Checkbox } from '@/components/ui/checkbox'

type IdentityNoticeProps = {
  isAuthenticated: boolean
  profileName: string
  hideIdentity: boolean
  useDifferentDisplayName: boolean
  onUseDifferentDisplayNameChange: (value: boolean) => void
}

export default function IdentityNotice({
  isAuthenticated,
  profileName,
  hideIdentity,
  useDifferentDisplayName,
  onUseDifferentDisplayNameChange,
}: IdentityNoticeProps) {
  if (hideIdentity) return null

  if (!isAuthenticated) {
    return (
      <p className='mt-3 text-sm text-grey-700'>
        You&apos;re commenting as a guest. If identity is visible, enter your full name below.
      </p>
    )
  }

  return (
    <div className='mt-3 rounded-[12px] border border-grey-100 bg-grey-50/50 px-3 py-2.5'>
      <p className='text-sm text-grey-700'>
        You&apos;re sending this wish as{' '}
        <span className='font-medium text-blackish'>{profileName}</span>.
      </p>

      <label className='mt-2 inline-flex items-center gap-2 text-xs text-grey-700'>
        <Checkbox
          checked={useDifferentDisplayName}
          onCheckedChange={(checked) =>
            onUseDifferentDisplayNameChange(Boolean(checked))
          }
          className='size-4 rounded-sm'
        />
        Use a different display name
      </label>
    </div>
  )
}
