import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  bulkCreateContacts,
  createContact,
  deleteContact,
  disconnectGoogleContacts,
  getContactById,
  getContacts,
  getGoogleContactsAuthUrl,
  getGoogleContactsList,
  getGoogleContactsStatus,
  importGoogleContacts,
  updateContact,
} from '@/api/services/contacts'
import type {
  BulkCreateContactsRequestBody,
  ContactsQueryParams,
  CreateContactRequestBody,
  GoogleContactsListQueryParams,
  ImportGoogleContactsRequestBody,
  UpdateContactRequestBody,
} from '@/types/Contacts'

export const useContacts = (params?: ContactsQueryParams) => {
  return useQuery({
    queryKey: ['contacts', params],
    queryFn: () => getContacts(params),
  })
}

export const useContactById = (id: string) => {
  return useQuery({
    queryKey: ['contacts', id],
    queryFn: () => getContactById(id),
    enabled: id.length > 0,
  })
}

export const useCreateContact = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateContactRequestBody) => createContact(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
  })
}

export const useUpdateContact = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateContactRequestBody }) =>
      updateContact(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
      queryClient.invalidateQueries({ queryKey: ['contacts', variables.id] })
    },
  })
}

export const useDeleteContact = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
  })
}

export const useBulkCreateContacts = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: BulkCreateContactsRequestBody) => bulkCreateContacts(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
  })
}

export const useGoogleContactsAuthUrl = () => {
  return useQuery({
    queryKey: ['contacts', 'google', 'auth-url'],
    queryFn: getGoogleContactsAuthUrl,
  })
}

export const useGoogleContactsStatus = () => {
  return useQuery({
    queryKey: ['contacts', 'google', 'status'],
    queryFn: getGoogleContactsStatus,
  })
}

export const useGoogleContactsList = (params?: GoogleContactsListQueryParams) => {
  return useQuery({
    queryKey: ['contacts', 'google', 'list', params],
    queryFn: () => getGoogleContactsList(params),
  })
}

export const useImportGoogleContacts = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: ImportGoogleContactsRequestBody) =>
      importGoogleContacts(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
      queryClient.invalidateQueries({ queryKey: ['contacts', 'google', 'list'] })
    },
  })
}

export const useDisconnectGoogleContacts = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: disconnectGoogleContacts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts', 'google', 'status'] })
      queryClient.invalidateQueries({ queryKey: ['contacts', 'google', 'list'] })
    },
  })
}

