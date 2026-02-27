import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { PageComment } from '@/types/Comments'
import { getDisplayName, toInitials, toRelativeTime } from '../utils'

type CommentsListProps = {
  comments: PageComment[]
}

export default function CommentsList({ comments }: CommentsListProps) {
  return (
    <div className='flex flex-col gap-3'>
      {comments.map((item) => {
        const name = getDisplayName(
          item.fullName,
          item.anonymous,
          item.user
            ? `${item.user.firstName || ''} ${item.user.lastName || ''}`.trim()
            : null
        )

        return (
          <div
            key={item.id}
            className='flex gap-2 border-b border-grey-50 pb-3 last:border-b-0'
          >
            <Avatar className='h-10 w-10'>
              {item.user?.profilePictureUrl ? (
                <AvatarImage src={item.user.profilePictureUrl} alt={name} />
              ) : null}
              <AvatarFallback className='bg-grey-50 text-xs font-medium text-grey-700'>
                {toInitials(name)}
              </AvatarFallback>
            </Avatar>

            <div className='min-w-0 flex-1'>
              <div className='flex items-center justify-between gap-4'>
                <p className='leading-5 font-medium text-blackish'>{name}</p>
                <span className='shrink-0 text-sm text-grey-400'>
                  {toRelativeTime(item.createdAt)}
                </span>
              </div>
              <p className='mt-1 line-clamp-2 max-w-[651px] text-xs md:text-sm text-grey-500'>
                {item.comment}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
