export interface ApiResponse<T = any> {
  status: string
  message: string
  data?: T
  meta?: {
    access_token?: string
    refresh_token?: string
  }
}

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  search?: string
}
