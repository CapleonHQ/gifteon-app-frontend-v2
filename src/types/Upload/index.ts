export interface UploadFileData {
  url: string
  publicId: string
}

export interface UploadSingleFileResponse {
  success: boolean
  data: UploadFileData
}

export interface UploadMultipleFilesResponse {
  success: boolean
  data: UploadFileData[] | { files: UploadFileData[] }
}

export interface UploadSingleFileRequestBody {
  file: File
  folder: string
}

export interface UploadMultipleFilesRequestBody {
  files: File[]
  folder: string
}
