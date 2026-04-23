import { AxiosResponse } from 'axios'
import apiService from '../'
import { ApiResponse } from '@/types/Common'
import {
  BulkCreateContactsRequestBody,
  BulkCreateContactsResult,
  ContactsQueryParams,
  Contact,
  CreateContactRequestBody,
  GoogleContactsAuthUrlData,
  GoogleContactsListData,
  GoogleContactsListQueryParams,
  GoogleContactsStatus,
  ImportGoogleContactsRequestBody,
  ImportGoogleContactsResult,
  UpdateContactRequestBody,
} from '@/types/Contacts'

export const createContact = async (
  data: CreateContactRequestBody
): Promise<ApiResponse<Contact>> => {
  const resp: AxiosResponse<ApiResponse<Contact>> = await apiService.appPrivate.post(
    '/contacts',
    data
  )
  return resp.data
}

export const getContacts = async (
  params?: ContactsQueryParams
): Promise<ApiResponse<Record<string, unknown>>> => {
  const resp: AxiosResponse<ApiResponse<Record<string, unknown>>> =
    await apiService.appPrivate.get('/contacts', { params })
  return resp.data
}

export const getContactById = async (id: string): Promise<ApiResponse<Contact>> => {
  const resp: AxiosResponse<ApiResponse<Contact>> = await apiService.appPrivate.get(
    `/contacts/${id}`
  )
  return resp.data
}

export const updateContact = async (
  id: string,
  data: UpdateContactRequestBody
): Promise<ApiResponse<Contact>> => {
  const resp: AxiosResponse<ApiResponse<Contact>> = await apiService.appPrivate.put(
    `/contacts/${id}`,
    data
  )
  return resp.data
}

export const deleteContact = async (
  id: string
): Promise<ApiResponse<Record<string, unknown>>> => {
  const resp: AxiosResponse<ApiResponse<Record<string, unknown>>> =
    await apiService.appPrivate.delete(`/contacts/${id}`)
  return resp.data
}

export const bulkCreateContacts = async (
  data: BulkCreateContactsRequestBody
): Promise<ApiResponse<BulkCreateContactsResult>> => {
  const resp: AxiosResponse<ApiResponse<BulkCreateContactsResult>> =
    await apiService.appPrivate.post('/contacts/bulk', data)
  return resp.data
}

export const getGoogleContactsAuthUrl = async (): Promise<
  ApiResponse<GoogleContactsAuthUrlData>
> => {
  const resp: AxiosResponse<ApiResponse<GoogleContactsAuthUrlData>> =
    await apiService.appPrivate.get('/contacts/google/auth-url')
  return resp.data
}

export const getGoogleContactsStatus = async (): Promise<
  ApiResponse<GoogleContactsStatus>
> => {
  const resp: AxiosResponse<ApiResponse<GoogleContactsStatus>> =
    await apiService.appPrivate.get('/contacts/google/status')
  return resp.data
}

export const getGoogleContactsList = async (
  params?: GoogleContactsListQueryParams
): Promise<ApiResponse<GoogleContactsListData>> => {
  const resp: AxiosResponse<ApiResponse<GoogleContactsListData>> =
    await apiService.appPrivate.get('/contacts/google/list', { params })
  return resp.data
}

export const importGoogleContacts = async (
  data: ImportGoogleContactsRequestBody
): Promise<ApiResponse<ImportGoogleContactsResult>> => {
  const resp: AxiosResponse<ApiResponse<ImportGoogleContactsResult>> =
    await apiService.appPrivate.post('/contacts/google/import', data)
  return resp.data
}

export const disconnectGoogleContacts = async (): Promise<
  ApiResponse<Record<string, unknown>>
> => {
  const resp: AxiosResponse<ApiResponse<Record<string, unknown>>> =
    await apiService.appPrivate.delete('/contacts/google/disconnect')
  return resp.data
}

