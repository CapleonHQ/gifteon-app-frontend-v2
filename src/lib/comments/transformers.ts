import { formatDistanceToNow } from 'date-fns'
import type { PageComment, PageCommentsData } from '@/types/Comments'
import type { WishItem } from '@/types/Gifts/giftDetails'

const toDisplayName = (comment: PageComment): string => {
  if (comment.anonymous) return 'Anonymous'
  if (comment.fullName && comment.fullName.trim().length > 0) {
    return comment.fullName.trim()
  }
  if (comment.user) {
    return `${comment.user.firstName} ${comment.user.lastName}`.trim()
  }
  return 'Anonymous'
}

const toRelativeTime = (value: string): string => {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return 'Recently'
  return formatDistanceToNow(parsed, { addSuffix: true }).replace('about ', '')
}

const toWishItem = (comment: PageComment): WishItem => {
  return {
    id: comment.id,
    name: toDisplayName(comment),
    time: toRelativeTime(comment.createdAt),
    message: comment.comment,
  }
}

export const mapCommentsToWishes = (
  data: PageCommentsData | undefined
): WishItem[] => {
  if (!data) return []
  return data.comments.map(toWishItem)
}
