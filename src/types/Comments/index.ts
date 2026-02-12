export interface CreateCommentRequestBody {
  comment: string
}

export interface PageCommentUser {
  id: string
  firstName: string
  lastName: string
}

export interface PageComment {
  id: string
  fullName: string | null
  anonymous: boolean
  comment: string
  giftPageId: string
  userId: string | null
  createdAt: string
  updatedAt: string
  user: PageCommentUser | null
}

export interface PageCommentsData {
  comments: PageComment[]
  total: number
  limit: number
  offset: number
  hasMore: boolean
}
