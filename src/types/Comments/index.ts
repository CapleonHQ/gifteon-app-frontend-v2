export interface CreateCommentRequestBody {
  comment: string
}

export interface PageCommentsQueryParams {
  limit?: number
  offset?: number
  sort?: 'asc' | 'desc'
}

export interface PageCommentUser {
  id: string
  fullName?: string | null
  profilePictureUrl?: string | null
  firstName?: string
  lastName?: string
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
