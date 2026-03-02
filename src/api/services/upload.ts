import { AxiosResponse } from 'axios'
import apiService from '../'
import type {
  UploadMultipleFilesRequestBody,
  UploadMultipleFilesResponse,
  UploadSingleFileRequestBody,
  UploadSingleFileResponse,
} from '@/types/Upload'

const buildSingleUploadFormData = ({ file, folder }: UploadSingleFileRequestBody) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', folder)
  return formData
}

const buildMultipleUploadFormData = ({
  files,
  folder,
}: UploadMultipleFilesRequestBody) => {
  const formData = new FormData()
  files.forEach((file, index) => {
    formData.append(`files[${index}]`, file)
  })
  formData.append('folder', folder)
  return formData
}

export const uploadImage = async (
  data: UploadSingleFileRequestBody
): Promise<UploadSingleFileResponse> => {
  const formData = buildSingleUploadFormData(data)
  const resp: AxiosResponse<UploadSingleFileResponse> =
    await apiService.appPrivate.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  return resp.data
}

export const uploadVideo = async (
  data: UploadSingleFileRequestBody
): Promise<UploadSingleFileResponse> => {
  const formData = buildSingleUploadFormData(data)
  const resp: AxiosResponse<UploadSingleFileResponse> =
    await apiService.appPrivate.post('/upload/video', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  return resp.data
}

export const uploadMultipleFiles = async (
  data: UploadMultipleFilesRequestBody
): Promise<UploadMultipleFilesResponse> => {
  const formData = buildMultipleUploadFormData(data)
  const resp: AxiosResponse<UploadMultipleFilesResponse> =
    await apiService.appPrivate.post('/upload/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  return resp.data
}

export const uploadFile = async (
  data: UploadSingleFileRequestBody
): Promise<UploadSingleFileResponse> => {
  const uploadResponse = await uploadMultipleFiles({
    files: [data.file],
    folder: data.folder,
  })

  const firstUploaded = Array.isArray(uploadResponse.data)
    ? uploadResponse.data[0]
    : uploadResponse.data.files?.[0]

  if (!firstUploaded) {
    throw new Error('Unable to upload file. Please try again.')
  }

  return {
    success: uploadResponse.success,
    data: firstUploaded,
  }
}

export const uploadDocument = async (
  data: UploadSingleFileRequestBody
): Promise<UploadSingleFileResponse> => {
  if (data.file.type.startsWith('image/')) {
    return uploadImage(data)
  }

  return uploadFile(data)
}
