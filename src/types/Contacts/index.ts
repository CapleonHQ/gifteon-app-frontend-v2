import { PaginationParams } from '@/types/Common'

export interface Contact {
  id: string
  name: string
  phone?: string
  email?: string
  giftseonTag?: string
  notes?: string
  isFavorite?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface CreateContactRequestBody {
  name: string
  phone?: string
  email?: string
  giftseonTag?: string
  notes?: string
  isFavorite?: boolean
}

export interface UpdateContactRequestBody {
  name?: string
  phone?: string
  email?: string
  giftseonTag?: string
  notes?: string
  isFavorite?: boolean
}

export interface ContactsQueryParams extends PaginationParams {
  favoritesOnly?: boolean
}

export interface BulkCreateContactsRequestBody {
  contacts: CreateContactRequestBody[]
}

export interface BulkCreateContactsResult {
  created: number
  skipped: number
}

export interface GoogleContactsStatus {
  connected: boolean
  expiresAt?: string
  scope?: string
}

export interface GoogleContactsAuthUrlData {
  url: string
}

export interface GoogleContactItem {
  resourceName: string
  name?: string
  phone?: string
  email?: string
}

export interface GoogleContactsListQueryParams {
  search?: string
  pageSize?: number
  pageToken?: string
}

export interface GoogleContactsListData {
  contacts: GoogleContactItem[]
  nextPageToken?: string
}

export interface ImportGoogleContactsRequestBody {
  resourceNames: string[]
}

export interface ImportGoogleContactsResult {
  created: number
  skipped: number
}

